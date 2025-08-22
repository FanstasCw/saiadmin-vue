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
      <a-form-item :label="t('bot.botName')" field="name">
        <a-input v-model="formData.name" :placeholder="t('bot.spotBot.inputBotName')" />
      </a-form-item>
      <a-form-item label="交易所账号" field="exchange_account_id" v-role="['superAdmin']">
        <a-select
          v-model="formData.exchange_account_id"
          :options="accountData"
          placeholder="请选择交易所账号"
          allow-clear
          :disabled="isEditDisabled" />
      </a-form-item>
      <a-form-item :label="t('bot.symbol')" field="symbol">
        <a-select
          v-model="formData.symbol"
          :options="symbolData"
          :placeholder="t('bot.selectSymbol')"
          allow-clear
          allow-search
          :disabled="isEditDisabled" />
      </a-form-item>
      <a-form-item :label="t('bot.principal')" field="principal" tooltip="投资本金">
        <a-input
          v-model="formData.principal"
          :placeholder="t('bot.spotBot.inputPrincipal')"
          :disabled="isEditDisabled"
          append="U" />
      </a-form-item>
      <a-form-item :label="t('bot.spotBot.buyThreshold')" field="buy_threshold">
        <a-select v-model="formData.buy_threshold" placeholder="请选择买入跌幅" :disabled="isEditDisabled">
          <a-option :value="0.01">1%</a-option>
          <a-option :value="0.02">2%</a-option>
          <a-option :value="0.03">3%</a-option>
          <a-option :value="0.04">4%</a-option>
          <a-option :value="0.05">5%</a-option>
          <a-option :value="0.06">6%</a-option>
          <a-option :value="0.07">7%</a-option>
          <a-option :value="0.08">8%</a-option>
          <a-option :value="0.09">9%</a-option>
          <a-option :value="0.1">10%</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('bot.spotBot.sellThreshold')" field="sell_threshold">
        <a-select v-model="formData.sell_threshold" placeholder="请选择卖出涨幅" :disabled="isEditDisabled">
          <a-option :value="0.01">1%</a-option>
          <a-option :value="0.02">2%</a-option>
          <a-option :value="0.03">3%</a-option>
          <a-option :value="0.04">4%</a-option>
          <a-option :value="0.05">5%</a-option>
          <a-option :value="0.06">6%</a-option>
          <a-option :value="0.07">7%</a-option>
          <a-option :value="0.08">8%</a-option>
          <a-option :value="0.09">9%</a-option>
          <a-option :value="0.1">10%</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('bot.spotBot.investRatio')" field="invest_ratio" tooltip="现货购买比例">
        <a-select v-model="formData.invest_ratio" disabled>
          <a-option :value="0.5">50%</a-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('bot.enables')" field="active">
        <sa-switch
          v-model="formData.active"
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
import api from '../api/spotbot'
import commonApi from '@/api/common'
import { useI18n } from 'vue-i18n'

const emit = defineEmits(['success'])
// 引用定义
const visible = ref(false)
const loading = ref(false)
const formRef = ref()
const mode = ref('')
const accountData = ref([])
const symbolData = ref([])

let title = computed(() => {
  return t('bot.spotBot.spotBot') + (mode.value == 'add' ? ' - ' + t('bot.add') : ' - ' + t('bot.edit'))
})
const { t } = useI18n()

// 表单初始值
const initialFormData = {
  id: null,
  name: '',
  exchange_account_id: 1,
  symbol: '',
  active: 2,
  principal: '',
  buy_threshold: 0.02,
  sell_threshold: 0.02,
  invest_ratio: 0.5,
}

// 表单信息
const formData = reactive({ ...initialFormData })

// 验证规则
const rules = {
  name: [{ required: true, message: '机器人名称必需填写' }],
  symbol: [{ required: true, message: '交易对必需填写' }],
  principal: [{ required: true, message: '本金必需填写' }],
  buy_threshold: [{ required: true, message: '买入阈值必需选择' }],
  sell_threshold: [{ required: true, message: '卖出阈值必需选择' }],
}

// 判断是否为编辑模式且需要禁用部分输入框
const isEditDisabled = computed(() => {
  return mode.value === 'edit'
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
  const accountResp = await commonApi.commonGet('/bot/account/accessAccount')
  accountData.value = accountResp.data
  const symbolResp = await commonApi.commonGet('/bot/symbol/accessSymbol?type=1')
  symbolData.value = symbolResp.data
}

// 设置数据
const setFormData = async (data) => {
  for (const key in formData) {
    if (data[key] != null && data[key] != undefined) {
      // 针特定字段进行类型转换
      if (key === 'sell_threshold' || key === 'invest_ratio' || key === 'buy_threshold') {
        formData[key] = Number(data[key])
      } else {
        formData[key] = data[key]
      }
    }
  }
}

// 数据保存
const submit = async (done) => {
  const validate = await formRef.value?.validate()
  if (!validate) {
    loading.value = true
    let data = { ...formData }
    // console.log(data)
    let result = {}
    if (mode.value === 'add') {
      // 添加数据
      data.id = undefined
      data.cash_balance = data.principal
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
