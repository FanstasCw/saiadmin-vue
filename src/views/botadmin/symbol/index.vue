<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch> </template>

      <!-- Table 自定义渲染 -->
      <!-- 交易所列 -->
      <template #exchange_id="{ record }">
        {{ postData.find((option) => option.value == record.exchange_id)?.label || record.exchange_id }}
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
import api from '../api/symbol'
import commonApi from '@/api/common'

// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()
const postData = ref([])

// 搜索表单
const searchForm = ref({})

// SaTable 基础配置
const options = reactive({
  api: api.getPageList,
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/bot/symbol/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/bot/symbol/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/bot/symbol/destroy'],
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
  { title: '交易所', dataIndex: 'exchange_id', width: 180 },
  { title: '类型', dataIndex: 'type', type: 'dict', dict: 'symbol_type', width: 120 },
  { title: '交易对', dataIndex: 'symbol', width: 180 },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '更新时间', dataIndex: 'update_time', width: 180 },
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
