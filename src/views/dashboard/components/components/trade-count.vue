<template>
  <div class="w-full mx-auto">
    <a-grid :cols="{ xs: 1, sm: 12, md: 24 }" :row-gap="16" class="panel ma-content-block mt-3 p-4">
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/bot.svg" />
          </a-avatar>
          <a-statistic
            :title="t('bot.spotBot.spotBot')"
            :value="data.spot_bot_count"
            :value-from="0"
            animation
            show-group-separator>
            <template #suffix
              ><span class="unit">{{ t('bot.qty') }}</span>
            </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/bot.svg" />
          </a-avatar>
          <a-statistic
            :title="t('bot.coinBot.coinBot')"
            :value="data.coin_bot_count"
            :value-from="0"
            animation
            show-group-separator>
            <template #suffix
              ><span class="unit">{{ t('bot.qty') }}</span>
            </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/trade.svg" />
          </a-avatar>
          <a-statistic
            :title="t('bot.todayTradeCount')"
            :value="data.today_trade_count"
            :value-from="0"
            animation
            show-group-separator>
            <template #suffix
              ><span class="unit">{{ t('bot.cnt') }}</span>
            </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/trade.svg" />
          </a-avatar>
          <a-statistic
            :title="t('bot.day7TradeCount')"
            :value="data.day7_trade_count"
            :value-from="0"
            animation
            show-group-separator>
            <template #suffix
              ><span class="unit">{{ t('bot.cnt') }}</span>
            </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import api from '@/views/botadmin/api/statistics'
import { useI18n } from 'vue-i18n'
const data = ref({
  spot_bot_count: 0,
  coin_bot_count: 0,
  today_trade_count: 0,
  day7_trade_count: 0,
})
const { t } = useI18n()

const getData = async () => {
  const res = await api.getBotCount()
  data.value = res.data
}

getData()

// 添加定时刷新功能
const intervalId = setInterval(() => {
  getData()
}, 10000)

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped lang="less">
.arco-grid.panel {
  margin-bottom: 0;
}
.panel-col {
  padding-left: 43px;
  border-right: 1px solid rgb(var(--gray-2));
}
.col-avatar {
  margin-right: 12px;
  background-color: var(--color-fill-2);
}
.up-icon {
  color: rgb(var(--red-6));
}
.unit {
  margin-left: 8px;
  color: rgb(var(--gray-8));
  font-size: 12px;
}
:deep(.panel-border) {
  margin: 4px 0 0 0;
}
</style>
