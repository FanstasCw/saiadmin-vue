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
            <a-input v-model="searchForm.symbol" placeholder="请输入交易对" allow-clear />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { Message } from '@arco-design/web-vue'
import EditForm from './edit.vue'
import api from '../api/coinbot'

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
    auth: ['/app/botadmin/CoinBot/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/app/botadmin/CoinBot/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/app/botadmin/CoinBot/destroy'],
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
  { title: '机器人名称', dataIndex: 'name', width: 180, sortable: { sortDirections: ['ascend', 'descend'] } },
  { title: '交易所账户', dataIndex: 'exchange_account_id', width: 180 },
  { title: '交易对', dataIndex: 'symbol', width: 180, sortable: { sortDirections: ['ascend', 'descend'] } },
  { title: '机器人状态', dataIndex: 'status', type: 'dict', dict: 'bot_status', width: 120 },
  { title: '启用/暂停', dataIndex: 'active', width: 180 },
  { title: '开仓合约张数', dataIndex: 'open_position_cont', width: 180 },
  { title: '持仓合约张数', dataIndex: 'position_cont', width: 180 },
  { title: '可用合约张数', dataIndex: 'available_cont', width: 180 },
  { title: '浮动盈亏', dataIndex: 'unrealized_pnl', width: 180 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '更新时间', dataIndex: 'update_time', width: 180 },
])

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
