<template>
  <component
    is="a-modal"
    :width="tool.getDevice() === 'mobile' ? '100%' : '600px'"
    v-model:visible="visible"
    :title="title"
    :mask-closable="false"
    :ok-loading="loading"
    @cancel="close"
    @before-ok="submit">
    <!-- 表单信息 start -->
    <a-form ref="formRef" :model="formData" :rules="rules" :auto-label-width="true">
      <a-form-item label="机器人名称" field="name">
        <a-input v-model="formData.name" placeholder="请输入机器人名称" />
      </a-form-item>
      <a-form-item label="交易所账户" field="exchange_account_id">
        <a-select v-model="formData.exchange_account_id" :options="[]" placeholder="请选择交易所账户" allow-clear />
      </a-form-item>
      <a-form-item label="交易对" field="symbol">
        <a-select v-model="formData.symbol" :options="[]" placeholder="请选择交易对" allow-clear />
      </a-form-item>
      <a-form-item label="启用/暂停" field="active">
        <sa-switch v-model="formData.active" />
      </a-form-item>
      <a-form-item label="本金" field="principal">
        <a-input v-model="formData.principal" placeholder="请输入本金" />
      </a-form-item>
      <a-form-item label="最近最高价格" field="recent_high_price">
        <a-input v-model="formData.recent_high_price" placeholder="请输入最近最高价格" />
      </a-form-item>
      <a-form-item label="回调比例" field="drawdown_ratio">
        <a-select v-model="formData.drawdown_ratio" :options="[]" placeholder="请选择回调比例" allow-clear />
      </a-form-item>
      <a-form-item label="平空价格间隔" field="close_short_interval">
        <a-input v-model="formData.close_short_interval" placeholder="请输入平空价格间隔" />
      </a-form-item>
      <a-form-item label="平仓比例" field="close_short_ratio">
        <a-select v-model="formData.close_short_ratio" :options="[]" placeholder="请选择平仓比例" allow-clear />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import tool from '@/utils/tool'
import { Message, Modal } from '@arco-design/web-vue'
import api from '../api/coinbot'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')

let title = computed(() => {
  return '币本位套利机器人' + (mode.value == 'add' ? '-新增' : '-编辑')
})

// 表单初始值
const initialFormData = {
  id: null,
  name: '',
  exchange_account_id: null,
  symbol: '',
  active: 1,
  principal: '',
  recent_high_price: '',
  drawdown_ratio: '',
  close_short_interval: '',
  close_short_ratio: '',
}

// 表单信息
const formData = reactive({ ...initialFormData })

// 验证规则
const rules = {
  name: [{ required: true, message: '机器人名称必需填写' }],
  symbol: [{ required: true, message: '交易对必需填写' }],
  principal: [{ required: true, message: '本金必需填写' }],
  recent_high_price: [{ required: true, message: '最近最高价格必需填写' }],
  drawdown_ratio: [{ required: true, message: '回调比例必需填写' }],
  close_short_interval: [{ required: true, message: '平空价格间隔必需填写' }],
  close_short_ratio: [{ required: true, message: '平仓比例必需填写' }],
}

// 打开弹框
const open = async (type = 'add') => {
  mode.value = type
  // 重置表单数据
  Object.assign(formData, initialFormData)
  formRef.value.clearValidate()
  visible.value = true
  await initPage()
}

// 初始化页面数据
const initPage = async () => {}

// 设置数据
const setFormData = async (data) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      formData[key] = data[key]
    }
  }
}

// 数据保存
const submit = async (done) => {
  const validate = await formRef.value?.validate()
  if (!validate) {
    loading.value = true
    let data = { ...formData }
    let result = {}
    if (mode.value === 'add') {
      // 添加数据
      data.id = undefined
      result = await api.save(data)
    } else {
      // 修改数据
      result = await api.update(data.id, data)
    }
    if (result.code === 200) {
      Message.success('操作成功')
      emit('success')
      done(true)
    }
    // 防止连续点击提交
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
  done(false)
}

// 关闭弹窗
const close = () => (visible.value = false)

defineExpose({ open, setFormData })
</script>
