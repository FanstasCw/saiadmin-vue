<template>
  <a-card class="sbot-card card-hover overflow-hidden" :class="{ 'sbot-card--active': isActive }">
    <template #actions>
      <a-button type="text" size="small" class="btn-action hover:bg-blue-50 text-blue-600" @click="handleEdit">
        <template #icon><icon-edit /></template>
        {{ t('bot.edit') }}
      </a-button>
      <a-popconfirm :content="t('bot.closeConfirm')" position="bottom" @ok="handleClose">
        <a-button type="text" size="small" class="btn-action hover:bg-orange-50 text-orange-600">
          <template #icon><icon-pause /></template>
          {{ t('bot.close') }}
        </a-button>
      </a-popconfirm>

      <a-popconfirm :content="t('bot.deleteConfirm')" position="bottom" @ok="handleDelete">
        <a-button type="text" size="small" class="btn-action hover:bg-red-50 text-red-600">
          <template #icon><icon-delete /></template>
          {{ t('bot.delete') }}
        </a-button>
      </a-popconfirm>
    </template>
    <div class="p-5">
      <!-- 顶部信息 -->
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-bold">{{ robot.name }}</h3>
        <a-tag :color="statusColor">{{ statusText }}</a-tag>
      </div>

      <div class="text-sm text-gray-500 mb-6">
        <p class="mb-1">{{ t('bot.symbol') }}: {{ robot.symbol }}</p>
        <p v-if="showExchangeAccount">交易所账号: {{ robot.exchangeaccount.name }}</p>
      </div>

      <!-- 核心数据 -->
      <div class="mb-6">
        <p class="mb-2">
          <span class="text-gray-500">{{ t('bot.accountNetValue') }}: </span>
          <span class="font-medium">{{ robot.account_net_value }}</span>
        </p>
        <p>
          <span class="text-gray-500">{{ t('bot.unrealizedPnl') }}: </span>
          <span class="font-medium" :style="{ color: getTextColors(robot.unrealized_pnl) }">
            {{ robot.unrealized_pnl }}
          </span>
        </p>
      </div>

      <!-- 辅助数据 -->
      <div class="grid grid-cols-2 gap-2 text-sm mb-4">
        <p>
          <span class="text-gray-500">{{ t('bot.principal') }}: </span>{{ robot.principal }}
        </p>
        <p>
          <span class="text-gray-500">{{ t('bot.positionAmount') }}: </span>{{ parseFloat(robot.position_amount) }}
        </p>
        <p>
          <span class="text-gray-500">{{ t('bot.cashBalance') }}: </span>{{ robot.cash_balance }}
        </p>
        <p>
          <span class="text-gray-500">{{ t('bot.positionValue') }}: </span>{{ robot.position_value }}
        </p>
      </div>

      <!-- 底部信息和操作 -->
      <div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-gray-400">{{ robot.create_time }}</span>
          <!-- 开关组件 - 发出事件而不是直接处理逻辑 -->
          <sa-switch
            :model-value="robot.active"
            @update:model-value="handleToggleActive($event)"
            checked-value="2"
            unchecked-value="3"
            :checked-text="t('bot.enable')"
            :unchecked-text="t('bot.disable')">
          </sa-switch>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDictStore } from '@/store'
import tool from '@/utils/tool'
import { role } from '@/utils/common.js'

const { t } = useI18n()
const dictList = useDictStore().data

const props = defineProps({
  robot: {
    type: Object,
    required: true,
  },
})

// 定义所有可能的事件
const emit = defineEmits(['edit', 'close', 'delete', 'toggle-active'])

// 计算属性
const isActive = computed(() => props.robot.active === '2')
const showExchangeAccount = computed(() => role('superAdmin'))

const statusText = computed(() => {
  const statusDict = dictList['bot_status']
  const status = statusDict.find((item) => item.value == props.robot.status)
  return status ? t(status.label) : props.robot.status
})

const statusColor = computed(() => {
  const status = props.robot.status
  if (status === '2' || status === 2) return 'green'
  if (status === '3' || status === 3) return 'orange'
  if (status === '5' || status === 5) return 'red'
})

// 方法 - 只发出事件，不处理业务逻辑
const getTextColors = (value) => {
  const colorData = dictList['price_change_color']
  const up_color = tool.getColor('up', colorData)
  const down_color = tool.getColor('down', colorData)
  if (value > 0) return up_color
  if (value < 0) return down_color
  return 'black'
}

const handleEdit = () => {
  emit('edit', props.robot)
}

const handleClose = () => {
  emit('close', props.robot)
}

const handleDelete = () => {
  emit('delete', props.robot)
}

const handleToggleActive = (active) => {
  emit('toggle-active', active, props.robot.id)
}
</script>

<style scoped>
.sbot-card {
  transition: all 0.3s ease;
  border-radius: 8px;
}

.sbot-card--active {
  border-color: var(--color-primary-light-2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
}

.card-hover {
  transition: all 0.3s;
}

.card-hover:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.btn-action {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  transition: background-color 0.2s;
}
</style>
