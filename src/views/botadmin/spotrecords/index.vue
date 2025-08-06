<template>
  <div class="ma-content-block">
    <sa-table
      ref="crudRef"
      :options="options"
      :columns="columns"
      :searchForm="searchForm"
      :scroll="{ x: '100%', y: '100%' }">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item label="机器人" field="spot_bot_id">
            <a-select v-model="searchForm.spot_bot_id" :options="botName" placeholder="请选择机器人" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="订单ID" field="exchange_order_id">
            <a-input v-model="searchForm.exchange_order_id" placeholder="请输入订单ID" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="交易对" field="symbol">
            <a-select v-model="searchForm.symbol" :options="[]" placeholder="请选择交易对" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="买卖方向" field="side">
            <sa-select v-model="searchForm.side" dict="spot_side" placeholder="请选择买卖方向" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="订单类型" field="type">
            <sa-select v-model="searchForm.type" dict="order_type" placeholder="请选择订单类型" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="成交时间" field="create_time">
            <a-range-picker v-model="searchForm.create_time" :show-time="true" mode="date" />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <template #spot_bot_id="{ record }">
        {{ botName.find((option) => option.value == record.spot_bot_id)?.label || record.spot_bot_id }}
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import api from '../api/spotrecords'
import commonApi from '@/api/common'

// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()
const botName = ref([])

// 搜索表单
const searchForm = ref({
  spot_bot_id: '',
  exchange_order_id: '',
  symbol: '',
  side: '',
  type: '',
  create_time: [],
  orderBy: 'create_time',
  orderType: 'desc',
})

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: false,
  showTools: true,
  showSort: false,
  operationColumn: false,
})

// SaTable 列配置
const columns = reactive([
  { title: '机器人', dataIndex: 'spot_bot_id', sortable: { sortDirections: ['ascend', 'descend'] }, width: 160 },
  { title: '订单ID', dataIndex: 'exchange_order_id', width: 160 },
  { title: '交易对', dataIndex: 'symbol', sortable: { sortDirections: ['ascend', 'descend'] }, width: 120 },
  { title: '买卖方向', dataIndex: 'side', type: 'dict', dict: 'spot_side', width: 120 },
  { title: '订单类型', dataIndex: 'type', type: 'dict', dict: 'order_type', width: 120 },
  { title: '订单数量', dataIndex: 'amount', width: 180 },
  { title: '订单价格', dataIndex: 'price', width: 180 },
  { title: '成交金额', dataIndex: 'cost', width: 180 },
  //{ title: '手续费', dataIndex: 'fee' },
  { title: '成交时间', dataIndex: 'create_time', sortable: { sortDirections: ['ascend', 'descend'] }, width: 180 },
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
