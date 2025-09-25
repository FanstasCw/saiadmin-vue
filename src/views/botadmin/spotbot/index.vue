<template>
  <div class="robot-card-list">
    <!-- 搜索区域 -->
    <a-card :bordered="false" class="search-card">
      <a-form :model="searchForm" layout="inline">
        <a-form-item :label="t('bot.botName')" field="name">
          <a-input v-model="searchForm.name" :placeholder="t('bot.coinBot.inputBotName')" allow-clear />
        </a-form-item>
        <a-form-item :label="t('bot.symbol')" field="symbol">
          <a-select
            v-model="searchForm.symbol"
            :options="symbolData"
            :placeholder="t('bot.selectSymbol')"
            allow-clear
            allow-search />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><icon-search /></template>
              {{ t('bot.search') }}
            </a-button>
            <a-button @click="handleReset">
              <template #icon><icon-refresh /></template>
              {{ t('bot.reset') }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <!-- 操作按钮区域 -->
    <a-card :bordered="false" class="action-card">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div>
          <a-space size="medium">
            <a-button type="primary" @click="handleAdd">
              <template #icon><icon-plus /></template>
              {{ t('bot.add') }}
            </a-button>
          </a-space>
        </div>
        <div>
          <a-tooltip :content="t('bot.refresh')">
            <a-button shape="circle" @click="fetchRobots"><icon-refresh /></a-button>
          </a-tooltip>
        </div>
      </div>
    </a-card>

    <a-spin :loading="loading" style="width: 100%" class="robot-list-spin">
      <!-- 机器人卡片列表 -->
      <div v-if="robotList.length > 0" class="robot-grid">
        <sbot-card
          v-for="robot in robotList"
          :key="robot.id"
          :robot="robot"
          @edit="handleEdit"
          @close="handleClose"
          @delete="handleDelete"
          @toggle-active="handleToggleActive" />
      </div>

      <!-- 无数据提示 -->
      <div v-else class="no-data">
        <a-empty :description="t('bot.noData')" />
      </div>
    </a-spin>

    <!-- 分页 -->
    <a-card :bordered="false" class="pagination-card" v-if="robotList.length > 0">
      <a-pagination
        :total="total"
        show-total
        show-jumper
        show-page-size
        :page-size-options="[10, 20, 50]"
        :page-size="pageSize"
        :current="currentPage"
        @page-size-change="handlePageSizeChange"
        @change="handlePageChange" />
    </a-card>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="fetchRobots" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { useI18n } from 'vue-i18n'
import EditForm from './edit.vue'
import api from '../api/spotbot'
import commonApi from '@/api/common'

const { t } = useI18n()
const editRef = ref()
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  name: '',
  symbol: '',
})

// 分页数据
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const robotList = ref([])
const symbolData = ref([])

// 获取机器人列表
const fetchRobots = async () => {
  try {
    loading.value = true
    const params = {
      ...searchForm,
      page: currentPage.value,
      limit: pageSize.value,
    }

    const response = await api.getPageList(params)
    if (response.code === 200) {
      robotList.value = response.data.data || response.data
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取机器人列表失败:', error)
    Message.error(t('bot.fetchListFailed'))
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchRobots()
}

// 重置搜索
const handleReset = () => {
  searchForm.name = ''
  searchForm.symbol = ''
  handleSearch()
}

// 分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  fetchRobots()
}

// 每页数量变化
const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchRobots()
}

// 添加机器人
const handleAdd = () => {
  editRef.value?.open()
}

// 编辑机器人
const handleEdit = (robot) => {
  editRef.value?.open('edit')
  editRef.value?.setFormData(robot)
}

// 关闭机器人
const handleClose = async (robot) => {
  const params = { ids: robot.id, active: 5 }
  const activeResp = await api.getActive(params)
  if (activeResp.code === 200) {
    if (activeResp.data.active == 2 || activeResp.data.active == 1) {
      Message.error(t('bot.botActiveTips.1'))
      return
    } else if (activeResp.data.active == 5) {
      Message.warning(t('bot.botActiveTips.2'))
      fetchRobots()
      return
    } else if (activeResp.data.active == 6) {
      Message.warning(t('bot.botActiveTips.3'))
      fetchRobots()
      return
    }
  }
  const closeResp = await api.setActive(params)
  if (closeResp.code === 200) {
    Message.success(t('bot.botActiveTips.4'))
    fetchRobots()
  }
}

// 删除机器人
const handleDelete = async (robot) => {
  const params = { ids: robot.id }
  const closeResp = await api.getActive(params)
  if (closeResp.code === 200) {
    if (closeResp.data.status != 5) {
      Message.error(t('bot.botActiveTips.5'))
      return
    }
    if (closeResp.data.active != 6) {
      Message.error(t('bot.botActiveTips.6'))
      return
    }
  }
  const resp = await api.destroy(params)
  if (resp.code === 200) {
    Message.success(t('bot.deleteSuccess'))
    fetchRobots()
  }
}

// 切换启用状态 - 这是处理开关组件事件的方法
const handleToggleActive = async (active, id) => {
  const response = await api.setActive({ ids: id, active })
  if (response.code === 200) {
    Message.success(response.message)
    fetchRobots() // 刷新数据
  }
}

// 初始化页面
const initPage = async () => {
  const symbolResp = await commonApi.commonGet('/bot/symbol/accessSymbol?type=1')
  symbolData.value = symbolResp.data
  fetchRobots()
}

onMounted(() => {
  initPage()
})
</script>

<style scoped>
.robot-card-list {
  padding: 16px;
}

.search-card,
.action-card,
.pagination-card {
  margin-bottom: 16px;
}

.robot-list-spin {
  margin-top: 20px;
  margin-bottom: 20px;
}

.robot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  /* margin-bottom: 16px; */
}

@media (max-width: 768px) {
  .robot-grid {
    grid-template-columns: 1fr;
  }
}
</style>
