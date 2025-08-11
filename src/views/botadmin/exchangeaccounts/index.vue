<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <!-- <a-col :sm="8" :xs="24">
          <a-form-item label="账户名称" field="name">
            <a-input v-model="searchForm.name" placeholder="请输入账户名称" allow-clear />
          </a-form-item>
        </a-col> -->
        <!-- <a-col :sm="8" :xs="24">
          <a-form-item label="交易所" field="exchange_id">
            <a-select v-model="searchForm.exchange_id" :options="postData" placeholder="请选择交易所" allow-clear />
          </a-form-item>
        </a-col> -->
      </template>

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
          checked-text="启用"
          unchecked-text="停用">
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

// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()
const postData = ref([])

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
  add: {
    show: true,
    auth: ['/app/botadmin/ExchangeAccounts/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/app/botadmin/ExchangeAccounts/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/app/botadmin/ExchangeAccounts/destroy'],
    func: async (params) => {
      const resp = await api.destroy(params)
      if (resp.code === 200) {
        Message.success(`删除成功！`)
        crudRef.value?.refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: '账户名称', dataIndex: 'name', width: 180 },
  { title: '交易所', dataIndex: 'exchange_id', width: 180 },
  { title: '公钥', dataIndex: 'api_key', width: 180 },
  { title: '密钥', dataIndex: 'secret_key', width: 180 },
  { title: '启用/停用', dataIndex: 'is_active', width: 180 },
  { title: '状态', dataIndex: 'status', type: 'dict', dict: 'exchange_account_status', width: 80 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '更新时间', dataIndex: 'update_time', width: 180 },
])

// 页面数据初始化
const initPage = async () => {
  const postResp = await commonApi.commonGet('/app/botadmin/Exchanges/accessExchange')
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
