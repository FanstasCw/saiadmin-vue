<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item label="机器人" field="bot_id">
            <a-select v-model="searchForm.bot_id" :options="botName" placeholder="请选择机器人ID" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="创建时间" field="create_time">
            <a-range-picker v-model="searchForm.create_time" :show-time="true" mode="date" />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <template #bot_id="{ record }">
        {{ botName.find((option) => option.value == record.bot_id)?.label || record.bot_id }}
      </template>
    </sa-table>

    <!-- 查看表单 -->
    <view-form ref="viewRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import ViewForm from './view.vue'
import api from '../api/spotbotlogs'
import commonApi from '@/api/common'

// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()
const botName = ref([])

// 搜索表单
const searchForm = ref({
  // bot_id: '',
  // create_time: [],
  orderBy: 'create_time',
  orderType: 'desc',
})

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: undefined,
  view: {
    show: true,
    auth: ['/app/botadmin/SpotbotLogs/read'],
    func: async (record) => {
      viewRef.value?.open(record)
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: '机器人', dataIndex: 'bot_id', width: 120 },
  { title: '日志级别', dataIndex: 'log_level', width: 120 },
  { title: '日志内容', dataIndex: 'log_content', width: 400 },
  { title: '创建时间', dataIndex: 'create_time', width: 100 },
])

// 页面数据初始化
const initPage = async () => {
  const postResp = await commonApi.commonGet('/app/botadmin/SpotBot/getBotName')
  botName.value = postResp.data
}

// SaTable 数据请求
const refresh = async () => {
  crudRef.value?.refresh()
}

// 页面加载完成执行
onMounted(async () => {
  initPage()
  refresh()
})
</script>
