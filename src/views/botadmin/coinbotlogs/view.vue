<template>
  <component
    is="a-drawer"
    v-model:visible="visible"
    :width="tool.getDevice() === 'mobile' ? '100%' : '60%'"
    title="查看详情"
    :footer="false">
    <!-- 详情 start -->
    <a-spin :loading="loading" class="w-full">
      <a-descriptions :column="1" bordered>
        <a-descriptions-item label="机器人">
          {{ botName.find((option) => option.value == formData?.bot_id)?.label || formData?.bot_id }}
        </a-descriptions-item>
        <a-descriptions-item label="日志级别">
          <span v-text="formData?.log_level"></span>
        </a-descriptions-item>
        <a-descriptions-item label="日志内容">
          <span v-text="formData?.log_content"></span>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">
          <span v-text="formData?.create_time"></span>
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <!-- 详情 end -->
  </component>
</template>

<script setup>
import { ref, reactive } from 'vue'
import tool from '@/utils/tool'
import api from '../api/coinbotlogs'
import commonApi from '@/api/common'

const emit = defineEmits(['success'])

// 引用定义
const rowData = ref()
const formData = ref()
const visible = ref(false)
const loading = ref(false)
const botName = ref([])

// 打开弹框
const open = async (record) => {
  rowData.value = record
  formData.value = {}
  visible.value = true
  await initPage()
}

// 初始化页面数据
const initPage = async () => {
  const postResp = await commonApi.commonGet('/app/botadmin/CoinBot/getBotName')
  botName.value = postResp.data
  loading.value = true
  const resp = await api.read(rowData.value?.id)
  if (resp.code === 200) {
    formData.value = resp.data
  }
  loading.value = false
}

defineExpose({ open })
</script>
