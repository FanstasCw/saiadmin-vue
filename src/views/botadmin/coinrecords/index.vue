<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item :label="t('bot.botName')" field="coin_bot_id">
            <a-select
              v-model="searchForm.coin_bot_id"
              :options="botName"
              :placeholder="t('bot.selectBot')"
              allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item :label="t('bot.orderId')" field="exchange_order_id">
            <a-input v-model="searchForm.exchange_order_id" :placeholder="t('bot.inputOrderId')" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item :label="t('bot.symbol')" field="symbol">
            <a-select
              v-model="searchForm.symbol"
              :options="symbolData"
              :placeholder="t('bot.selectSymbol')"
              allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item :label="t('bot.side')" field="side">
            <sa-select v-model="searchForm.side" dict="coin_side" :placeholder="t('bot.selectSide')" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item :label="t('bot.type')" field="type">
            <sa-select v-model="searchForm.type" dict="order_type" :placeholder="t('bot.selectType')" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item :label="t('bot.createTime')" field="create_time">
            <a-range-picker v-model="searchForm.create_time" :show-time="true" mode="date" />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <template #coin_bot_id="{ record }">
        {{ botName.find((option) => option.value == record.coin_bot_id)?.label || record.coin_bot_id }}
      </template>
      <template #amount="{ record }">
        {{ parseFloat(record.amount) }}
      </template>
      <template #price="{ record }">
        {{ parseFloat(record.price) }}
      </template>
      <template #fee="{ record }">
        {{ parseFloat(record.fee) }}
      </template>
    </sa-table>

    <!-- 编辑表单 -->
    <edit-form ref="editRef" @success="refresh" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import api from '../api/coinrecords'
import commonApi from '@/api/common'
import { useI18n } from 'vue-i18n'

// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()
const botName = ref([])
const symbolData = ref([])

const { t } = useI18n()
// 搜索表单
const searchForm = ref({
  coin_bot_id: '',
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
  rowSelection: undefined,
  showTools: true,
  showSort: false,
  operationColumn: false,
  searchText: t('bot.search'),
  resetText: t('bot.reset'),
})

// SaTable 列配置
const columns = reactive([
  { title: t('bot.botName'), dataIndex: 'coin_bot_id', sortable: { sortDirections: ['ascend', 'descend'] } },
  { title: t('bot.orderId'), dataIndex: 'exchange_order_id' },
  { title: t('bot.symbol'), dataIndex: 'symbol', sortable: { sortDirections: ['ascend', 'descend'] } },
  { title: t('bot.side'), dataIndex: 'side', type: 'dict', dict: 'coin_side' },
  { title: t('bot.type'), dataIndex: 'type', type: 'dict', dict: 'order_type' },
  { title: t('bot.amount'), dataIndex: 'amount' },
  { title: t('bot.price'), dataIndex: 'price' },
  { title: t('bot.fee'), dataIndex: 'fee' },
  { title: t('bot.createTime'), dataIndex: 'create_time', sortable: { sortDirections: ['ascend', 'descend'] } },
])

// 页面数据初始化
const initPage = async () => {
  const postResp = await commonApi.commonGet('/bot/coinBot/getBotName')
  botName.value = postResp.data
  const symbolResp = await commonApi.commonGet('/bot/symbol/accessSymbol?type=2')
  symbolData.value = symbolResp.data
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
