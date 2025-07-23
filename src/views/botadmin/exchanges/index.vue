<template>
  <div class="ma-content-block">
    <sa-table ref="crudRef" :options="options" :columns="columns" :searchForm="searchForm">
      <!-- 搜索区 tableSearch -->
      <template #tableSearch>
        <a-col :sm="8" :xs="24">
          <a-form-item label="交易所名称" field="exchange_name">
            <a-input v-model="searchForm.exchange_name" placeholder="请输入交易所名称" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="交易所代码" field="exchange_code">
            <a-input v-model="searchForm.exchange_code" placeholder="请输入交易所代码" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="是否启用" field="is_active">
            <a-input v-model="searchForm.is_active" placeholder="请输入是否启用" allow-clear />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="创建时间" field="create_time">
            <a-range-picker v-model="searchForm.create_time" :show-time="true" mode="date" />
          </a-form-item>
        </a-col>
        <a-col :sm="8" :xs="24">
          <a-form-item label="更新时间" field="update_time">
            <a-range-picker v-model="searchForm.update_time" :show-time="true" mode="date" />
          </a-form-item>
        </a-col>
      </template>

      <!-- Table 自定义渲染 -->
      <!-- 启用列 -->
      <template #is_active="{ record }">
        <sa-switch v-model="record.is_active" @change="changeActive($event, record.id)"></sa-switch>
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
import api from '../api/exchanges'

// 引用定义
const crudRef = ref()
const editRef = ref()
const viewRef = ref()

// 搜索表单
const searchForm = ref({
  exchange_name: '',
  exchange_code: '',
  is_active: '',
  create_time: [],
  update_time: [],
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
  rowSelection: { showCheckedAll: true },
  add: {
    show: true,
    auth: ['/app/botadmin/Exchanges/save'],
    func: async () => {
      editRef.value?.open()
    },
  },
  edit: {
    show: true,
    auth: ['/app/botadmin/Exchanges/update'],
    func: async (record) => {
      editRef.value?.open('edit')
      editRef.value?.setFormData(record)
    },
  },
  delete: {
    show: true,
    auth: ['/app/botadmin/Exchanges/destroy'],
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
  { title: '交易所名称', dataIndex: 'exchange_name', width: 180, sortable: { sortDirections: ['ascend', 'descend'] } },
  { title: '交易所代码', dataIndex: 'exchange_code', width: 180, sortable: { sortDirections: ['ascend', 'descend'] } },
  { title: '是否启用', dataIndex: 'is_active', width: 180, sortable: { sortDirections: ['ascend', 'descend'] } },
  { title: '创建时间', dataIndex: 'create_time', width: 180, sortable: { sortDirections: ['ascend', 'descend'] } },
  { title: '更新时间', dataIndex: 'update_time', width: 180, sortable: { sortDirections: ['ascend', 'descend'] } },
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
