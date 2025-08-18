<template>
  <div class="w-full mx-auto">
    <a-grid :cols="{ xs: 1, sm: 12, md: 24 }" :row-gap="16" class="panel ma-content-block mt-3 p-4">
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/bot.svg" />
          </a-avatar>
          <a-statistic
            title="现货机器人统计"
            :value="data.spot_bot_count"
            :value-from="0"
            animation
            show-group-separator>
            <template #suffix><span class="unit">个</span> </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/bot.svg" />
          </a-avatar>
          <a-statistic
            title="币本位机器人统计"
            :value="data.coin_bot_count"
            :value-from="0"
            animation
            show-group-separator>
            <template #suffix><span class="unit">个</span> </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/trade.svg" />
          </a-avatar>
          <a-statistic
            title="今日交易次数"
            :value="data.today_trade_count"
            :value-from="0"
            animation
            show-group-separator>
            <template #suffix><span class="unit">次</span> </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
      <a-grid-item class="panel-col" :span="6">
        <a-space>
          <a-avatar :size="54" class="col-avatar" style="padding: 10px">
            <img alt="avatar" src="@/assets/image/trade.svg" />
          </a-avatar>
          <a-statistic
            title="7日内交易次数"
            :value="data.day7_trade_count"
            :value-from="0"
            animation
            show-group-separator>
            <template #suffix><span class="unit">次</span> </template>
          </a-statistic>
        </a-space>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/views/botadmin/api/statistics'

const data = ref({
  spot_bot_count: 0,
  coin_bot_count: 0,
  today_trade_count: 0,
  day7_trade_count: 0,
})

const getData = async () => {
  const res = await api.getBotCount()
  data.value = res.data
}

getData()
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
