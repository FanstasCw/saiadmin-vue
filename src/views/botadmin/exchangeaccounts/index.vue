<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- Table 自定义渲染 -->
      <!-- 交易所列 -->
      <template #exchange_id="{ record }">
        {{ postData.find((option) => option.value == record.exchange_id)?.label || record.exchange_id }}
      </template>
      <!-- 启用列 -->
      <template #is_active="{ record }">
        <sa-switch
          v-model="record.is_active"
          @change="changeActive($event, record.id)"
          checked-value="2"
          unchecked-value="3"
          :checked-text="t('bot.enable')"
          :unchecked-text="t('bot.disable')">
        </sa-switch>
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import EditForm from './edit.vue'
import api from '../api/exchangeaccounts'
import { role } from '@/utils/common.js'
import commonApi from '@/api/common'
import { useI18n } from 'vue-i18n'
// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()
const postData = ref([])
const { t } = useI18n()
// 搜索表单
const searchForm = ref({
  name: '',
  exchange_id: '',
})

// 修改状态
const changeActive = async (is_active, id) => {
  const response = await api.changeActive({ id, is_active })
  if (response.code === 200) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: undefined,
  showSearch: false,
  showSort: false,
  operationColumnText: t('bot.operations'),
  add: {
    show: true,
    text: t('bot.add'),
    auth: ['/bot/account/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    text: t('bot.edit'),
    auth: ['/bot/account/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    text: t('bot.delete'),
    auth: ['/bot/account/destroy'],
    confirmText: t('bot.deleteConfirm'),
    func: async (params) => {
      const resp = await api.destroy(params)
      if (resp.code === 200) {
        Message.success(t('bot.deleteSuccess'))
        crudRef.value?.refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: t('bot.name'), dataIndex: 'name', width: 180 },
  { title: t('bot.exchange'), dataIndex: 'exchange_id', width: 180 },
  { title: t('bot.apiKey'), dataIndex: 'api_key', width: 180 },
  { title: t('bot.secretKey'), dataIndex: 'secret_key', width: 180 },
  { title: t('bot.enables'), dataIndex: 'is_active', width: 180 },
  { title: t('bot.status'), dataIndex: 'status', type: 'dict', dict: 'exchange_account_status', width: 80 },
  { title: t('bot.create_time'), dataIndex: 'create_time', width: 180 },
  { title: t('bot.update_time'), dataIndex: 'update_time', width: 180 },
])

// 页面数据初始化
const initPage = async () => {
  const postResp = await commonApi.commonGet('/bot/exchange/accessExchange')
  postData.value = postResp.data
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
