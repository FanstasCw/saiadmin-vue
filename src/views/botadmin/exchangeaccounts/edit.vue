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
      <a-form-item :label="t('bot.name')" field="name">
        <a-input v-model="formData.name" :placeholder="t('bot.inputName')" />
      </a-form-item>
      <a-form-item :label="t('bot.exchange')" field="exchange_id">
        <a-select
          v-model="formData.exchange_id"
          :options="postData"
          :placeholder="t('bot.selectExchange')"
          allow-clear />
      </a-form-item>
      <a-form-item :label="t('bot.apiKey')" field="api_key">
        <a-input v-model="formData.api_key" :placeholder="t('bot.inputApiKey')" />
      </a-form-item>
      <a-form-item :label="t('bot.secretKey')" field="secret_key">
        <a-input v-model="formData.secret_key" :placeholder="t('bot.inputSecretKey')" />
      </a-form-item>
      <!-- 添加条件渲染的密码短语输入框 -->
      <a-form-item v-if="isOkxExchange" :label="t('bot.passPhrase')" field="pass_phrase">
        <a-input v-model="formData.pass_phrase" :placeholder="t('bot.inputPhrase')" />
      </a-form-item>
      <a-form-item label="测试环境" field="sandbox" v-role="['superAdmin']">
        <sa-switch
          v-model="formData.sandbox"
          checked-value="0"
          unchecked-value="1"
          :checked-text="启用"
          :unchecked-text="禁用" />
      </a-form-item>
      <a-form-item :label="t('bot.enables')" field="is_active">
        <sa-switch
          v-model="formData.is_active"
          checked-value="2"
          unchecked-value="3"
          :checked-text="t('bot.enable')"
          :unchecked-text="t('bot.disable')" />
      </a-form-item>
    </a-form>
    <!-- 表单信息 end -->
  </component>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import tool from '@/utils/tool'
import { Message, Modal } from '@arco-design/web-vue'
import api from '../api/exchangeaccounts'
import commonApi from '@/api/common'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')
const postData = ref([])
const { t } = useI18n()

let title = computed(() => {
  return t('menus.account') + (mode.value == 'add' ? ' - ' + t('bot.add') : ' - ' + t('bot.edit'))
})

// 表单初始值
const initialFormData = {
  id: null,
  name: '',
  exchange_id: null,
  api_key: '',
  secret_key: '',
  pass_phrase: '',
  sandbox: 1,
  is_active: 1,
}

// 表单信息
const formData = reactive({ ...initialFormData })

// 验证规则
const rules = {
  name: [{ required: true, message: '账户名称必需填写' }],
  exchange_id: [{ required: true, message: '交易所必需填写' }],
  api_key: [{ required: true, message: '公钥必需填写' }],
  secret_key: [{ required: true, message: '密钥必需填写' }],
}

// 判断是否为欧易交易所
const isOkxExchange = computed(() => {
  // 假设欧易交易所的ID为某个特定值，比如 "okx" 或者名称包含 "欧易"
  // 这里需要根据实际的exchange数据结构调整判断条件
  return (
    formData.exchange_id &&
    (formData.exchange_id === '2' ||
      postData.value.find((item) => item.value === formData.exchange_id)?.label?.includes('欧易交易所'))
  )
})

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
const initPage = async () => {
  const postResp = await commonApi.commonGet('/bot/exchange/accessExchange')
  postData.value = postResp.data
}

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
