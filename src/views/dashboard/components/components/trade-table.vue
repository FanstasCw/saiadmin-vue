<template>
  <div class="w-full mx-auto">
    <!-- 桌面端左右分栏，移动端上下堆叠 -->
    <a-grid :cols="{ xs: 1, sm: 1, md: 2 }" :row-gap="16" :col-gap="16" class="panel ma-content-block mt-3 p-4">
      <!-- 左侧表格 -->
      <a-grid-item>
        <div class="table-wrapper">
          <a-table
            :columns="spot_columns"
            :data="data.spot_data"
            :virtual-list-props="virtualProps"
            :scroll="scroll"
            :pagination="false"
            :summary="summarySpot">
            <template #unrealized_pnl="{ record }">
              <span :style="{ color: getTextColors(record.unrealized_pnl) }">
                {{ parseFloat(record.unrealized_pnl) }}
              </span>
            </template>
          </a-table>
        </div>
      </a-grid-item>

      <!-- 右侧表格 -->
      <a-grid-item>
        <div class="table-wrapper">
          <a-table
            :columns="coin_columns"
            :data="data.coin_data"
            :virtual-list-props="virtualProps"
            :scroll="scroll"
            :pagination="false"
            :summary="summaryCoin">
            <template #unrealized_pnl="{ record }">
              <span :style="{ color: getTextColors(record.unrealized_pnl) }">
                {{ parseFloat(record.unrealized_pnl) }}
              </span>
            </template>
          </a-table>
        </div>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import api from '@/views/botadmin/api/statistics'
import { useDictStore } from '@/store'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
/* ——— 原来的逻辑不变 ——— */
const colorData = useDictStore().data.price_change_color
const data = ref({ spot_data: [], coin_data: [] })
const { t } = useI18n()
const getTextColors = (val) => {
  if (val > 0) return colorData.find((i) => i.label === 'up').value
  if (val < 0) return colorData.find((i) => i.label === 'down').value
  return 'black'
}
const getData = async () => {
  data.value = (await api.getBotData()).data
}
getData()

const summarySpot = ({ data }) => {
  const total = data.reduce((sum, r) => sum + Number(r.unrealized_pnl || 0), 0)
  return [
    {
      name: t('bot.unrealizedPnl'),
      symbol: '',
      buy: '',
      sell: '',
      unrealized_pnl: total.toFixed(2),
    },
  ]
}

const summaryCoin = ({ data }) => {
  const total = data.reduce((sum, r) => sum + Number(r.unrealized_pnl || 0), 0)
  return [
    {
      name: t('bot.unrealizedPnl'),
      symbol: '',
      closeShort: '',
      openShort: '',
      unrealized_pnl: total.toFixed(2),
    },
  ]
}

/* ——— 虚拟滚动 & 横向滚动配置 ——— */
const virtualProps = { height: 120 /* 自行调整 */ } // Arco 的虚拟列表只需要这一个字段
const scroll = { x: 600 } // 横向滚动阈值（px）

/* ——— 列配置照搬 ——— */
const spot_columns = reactive([
  { title: t('bot.botName'), dataIndex: 'name', width: 120 },
  { title: t('bot.symbol'), dataIndex: 'symbol', width: 100 },
  {
    title: t('bot.orderType.limit'),
    children: [
      { title: t('bot.buyLimit'), dataIndex: 'buy', width: 100 },
      { title: t('bot.sellLimit'), dataIndex: 'sell', width: 100 },
    ],
  },
  { title: t('bot.unrealizedPnl'), dataIndex: 'unrealized_pnl', slotName: 'unrealized_pnl', width: 100 },
])
const coin_columns = reactive([
  { title: t('bot.botName'), dataIndex: 'name', width: 120 },
  { title: t('bot.symbol'), dataIndex: 'symbol', width: 100 },
  {
    title: t('bot.orderType.limit'),
    children: [
      { title: t('bot.closeShortLimit'), dataIndex: 'closeShort', width: 100 },
      { title: t('bot.openShortLimit'), dataIndex: 'openShort', width: 100 },
    ],
  },
  { title: t('bot.unrealizedPnl'), dataIndex: 'unrealized_pnl', slotName: 'unrealized_pnl', width: 100 },
])
</script>

<style scoped>
/* 让移动端出现独立的横向滚动条 */
.table-wrapper {
  overflow-x: auto;
}
</style>
