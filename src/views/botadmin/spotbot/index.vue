<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item :label="t('bot.botName')" field="name">
            <a-input v-model="searchForm.name" :placeholder="t('bot.spotBot.inputBotName')" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item :label="t('bot.symbol')" field="symbol">
            <a-select
              v-model="searchForm.symbol"
              :options="symbolData"
              :placeholder="t('bot.selectSymbol')"
              allow-clear
              allow-search />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <!-- 交易所列 -->
      <template #exchange_account_id="{ record }">
        {{ record.exchangeaccount.name }}
      </template>
      <template #active="{ record }">
        <sa-switch
          v-model="record.active"
          @change="setActive($event, record.id)"
          checked-value="2"
          unchecked-value="3"
          :checked-text="t('bot.enable')"
          :unchecked-text="t('bot.disable')">
        </sa-switch>
      </template>
      <template #principal="{ record }">
        {{ record.principal }}
      </template>
      <template #position_amount="{ record }">
        {{ parseFloat(record.position_amount) }}
      </template>
      <template #cash_balance="{ record }">
        {{ record.cash_balance }}
      </template>
      <template #position_value="{ record }">
        {{ record.position_value }}
      </template>
      <template #account_net_value="{ record }">
        {{ record.account_net_value }}
      </template>
      <template #unrealized_pnl="{ record }">
        <span :style="{ color: getTextColors(record.unrealized_pnl) }">{{ record.unrealized_pnl }}</span>
      </template>
      <!-- 操作 -->
      <template #operationCell="{ record }">
        <!-- 默认编辑按钮 -->
        <a-link v-if="options.edit.show" v-auth="options.edit.auth || []" type="primary" @click="handleEdit(record)">
          <icon-edit /> {{ options.edit.text || t('bot.edit') }}
        </a-link>
        <!-- 自定义关闭按钮 -->
        <a-popconfirm :content="t('bot.closeConfirm')" position="bottom" @ok="closeRobot(record)">
          <a-link type="primary"> <icon-close /> {{ t('bot.close') }} </a-link>
        </a-popconfirm>
        <!-- 默认删除按钮 -->
        <a-popconfirm
          v-if="options.delete.show"
          :content="t('bot.deleteConfirm')"
          position="bottom"
          @ok="handleDelete(record)">
          <a-link type="primary" v-auth="options.delete.auth || []">
            <icon-delete /> {{ options.delete.text || t('bot.delete') }}
          </a-link>
        </a-popconfirm>
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
import commonApi from '@/api/common'
import { useDictStore } from '@/store'
import { useI18n } from 'vue-i18n'

// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()
const symbolData = ref([])
const colorData = useDictStore().data.price_change_color
// 搜索表单
const searchForm = ref({
  name: '',
  symbol: '',
})
const { t } = useI18n()

// 修改状态
const setActive = async (active, id) => {
  const response = await api.setActive({ ids: id, active })
  if (response.code === 200) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

const getTextColors = (value) => {
  if (value > 0) {
    return colorData.find((item) => item.label === 'up').value
  } else if (value < 0) {
    return colorData.find((item) => item.label === 'down').value
  } else {
    return 'black'
  }
}

const handleEdit = (record) => {
  options.edit.func?.(record) // 直接调用你传进来的回调
}

const closeRobot = async (record) => {
  const params = { ids: record.id, active: 5 }
  const activeResp = await api.getActive(params)
  if (activeResp.code === 200) {
    if (activeResp.data.active == 2 || activeResp.data.active == 1) {
      Message.error(t('bot.botActiveTips.1'))
      return
    } else if (activeResp.data.active == 5) {
      Message.warning(t('bot.botActiveTips.2'))
      crudRef.value?.refresh()
      return
    } else if (activeResp.data.active == 6) {
      Message.warning(t('bot.botActiveTips.3'))
      crudRef.value?.refresh()
      return
    }
  }
  const closeResp = await api.setActive(params)
  if (closeResp.code === 200) {
    Message.success(t('bot.botActiveTips.4'))
    crudRef.value?.refresh()
  }
}

const handleDelete = (record) => {
  const params = { ids: record.id }
  options.delete.func?.(params)
}

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: undefined,
  showSort: false,
  operationColumnText: t('bot.operations'),
  searchText: t('bot.search'),
  resetText: t('bot.reset'),
  add: {
    show: true,
    text: t('bot.add'),
    auth: ['/bot/spotBot/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/bot/spotBot/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/bot/spotBot/destroy'],
    func: async (params) => {
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
        crudRef.value?.refresh()
      }
    },
  },
})

// SaTable 列配置
const columns = reactive([
  { title: t('bot.botName'), dataIndex: 'name', width: 160 },
  { title: t('bot.symbol'), dataIndex: 'symbol', width: 120 },
  { title: t('bot.status'), dataIndex: 'status', type: 'dict', dict: 'bot_status', width: 120 },
  { title: t('bot.enables'), dataIndex: 'active', width: 120 },
  { title: t('bot.principal'), dataIndex: 'principal', width: 140 },
  { title: t('bot.cashBalance'), dataIndex: 'cash_balance', width: 140 },
  { title: t('bot.positionAmount'), dataIndex: 'position_amount', width: 140 },
  { title: t('bot.positionValue'), dataIndex: 'position_value', width: 140 },
  { title: t('bot.accountNetValue'), dataIndex: 'account_net_value', width: 140 },
  { title: t('bot.unrealizedPnl'), dataIndex: 'unrealized_pnl', width: 140 },
  { title: t('bot.createTime'), dataIndex: 'create_time', width: 160 },
])
if (role('superAdmin')) {
  const newColumn = { title: '交易所账号', dataIndex: 'exchange_account_id', width: 140 }
  const index = columns.findIndex((col) => col.dataIndex === 'name')
  columns.splice(index + 1, 0, newColumn)
}

// 页面数据初始化
const initPage = async () => {
  const symbolResp = await commonApi.commonGet('/bot/symbol/accessSymbol?type=1')
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
