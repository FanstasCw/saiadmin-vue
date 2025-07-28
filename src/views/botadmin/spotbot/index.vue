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
            <a-select
              v-model="searchForm.symbol"
              :options="symbolData"
              placeholder="请选择交易对"
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
          checked-text="启用"
          unchecked-text="暂停">
        </sa-switch>
      </template>
      <!-- 操作 -->
      <template #operationCell="{ record }">
        <!-- 默认编辑按钮 -->
        <a-link v-if="options.edit.show" v-auth="options.edit.auth || []" type="primary" @click="handleEdit(record)">
          <icon-edit /> {{ options.edit.text || '编辑' }}
        </a-link>
        <!-- 自定义关闭按钮 -->
        <a-popconfirm content="确定要关闭机器人吗?" position="bottom" @ok="closeRobot(record)">
          <a-link type="primary"> <icon-close /> 关闭 </a-link>
        </a-popconfirm>
        <!-- 默认删除按钮 -->
        <a-popconfirm
          v-if="options.delete.show"
          content="确定要删除该数据吗?"
          position="bottom"
          @ok="handleDelete(record)">
          <a-link type="primary" v-auth="options.delete.auth || []">
            <icon-delete /> {{ options.delete.text || '删除' }}
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

// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()
const symbolData = ref([])
const accountData = ref([])
// 搜索表单
const searchForm = ref({
  name: '',
  symbol: '',
})

// 修改状态
const setActive = async (active, id) => {
  const response = await api.setActive({ ids: id, active })
  if (response.code === 200) {
    Message.success(response.message)
    crudRef.value.refresh()
  }
}

const handleEdit = (record) => {
  options.edit.func?.(record) // 直接调用你传进来的回调
}

const closeRobot = async (record) => {
  const params = { ids: record.id, active: 5 }
  const activeResp = await api.getActive(params)
  console.log(activeResp)
  if (activeResp.code === 200) {
    if (activeResp.data == 2 || activeResp.data == 1) {
      Message.error('请先暂停机器人才能关闭！')
      return
    } else if (activeResp.data == 5) {
      Message.warning('机器人已关闭！')
      return
    }
  }
  const closeResp = await api.setActive(params)
  if (closeResp.code === 200) {
    Message.success(`机器人关闭成功！`)
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
      const closeResp = await api.getActive(params)
      if (closeResp.code === 200) {
        if (closeResp.data != 5) {
          Message.error('请先关闭机器人才能删除！')
          return
        }
      }
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
  { title: '浮动盈亏', dataIndex: 'unrealized_pnl' },
])
if (role('superAdmin')) {
  const newColumn = { title: '交易所账号', dataIndex: 'exchange_account_id' }
  const index = columns.findIndex((col) => col.dataIndex === 'name')
  columns.splice(index + 1, 0, newColumn)
}

// 页面数据初始化
const initPage = async () => {
  const symbolResp = await commonApi.commonGet('/app/botadmin/ExchangeSymbol/accessSymbol?type=1')
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
