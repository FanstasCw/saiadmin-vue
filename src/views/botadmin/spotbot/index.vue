<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item label="机器人名称" field="name">
            <a-input v-model="searchForm.name" placeholder="请输入机器人名称" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="交易对" field="symbol">
            <a-select v-model="searchForm.symbol" :options="[]" placeholder="请选择交易对" allow-clear />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <!-- 交易所列 -->
      <template #exchange_account_id="{ record }">
        {{ record.exchangeaccount.name }}
      </template>
      <template #active="{ record }">
        <sa-switch v-model="record.active" @change="changeActive($event, record.id)"></sa-switch>
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
import api from '../api/spotbot'
import { role } from '@/utils/common.js'

// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()

// 搜索表单
const searchForm = ref({
  name: '',
  symbol: '',
})

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/app/botadmin/SpotGridBot/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/app/botadmin/SpotGridBot/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/app/botadmin/SpotGridBot/destroy'],
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
  { title: '机器人名称', dataIndex: 'name' },
  { title: '交易对', dataIndex: 'symbol' },
  { title: '状态', dataIndex: 'status', type: 'dict', dict: 'bot_status' },
  { title: '启用/暂停', dataIndex: 'active' },
  { title: '本金', dataIndex: 'principal' },
  { title: '现金余额', dataIndex: 'cash_balance' },
  { title: '持仓数量', dataIndex: 'position_amount' },
  { title: '持仓价值', dataIndex: 'position_value' },
  { title: '账户净值', dataIndex: 'account_net_value' },
  { title: '浮动盈亏', dataIndex: 'unrealized_pl' },
])
if (role('superAdmin')) {
  const newColumn = { title: '交易所账号', dataIndex: 'exchange_account_id', width: 120 }
  const index = columns.findIndex((col) => col.dataIndex === 'name')
  columns.splice(index + 1, 0, newColumn)
}

// 页面数据初始化
const initPage = async () => {}

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
