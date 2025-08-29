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
import { reactive, ref, onUnmounted } from 'vue'
import api from '@/views/botadmin/api/statistics'
import { useDictStore } from '@/store'
// import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import tool from '@/utils/tool'

/* ——— 原来的逻辑不变 ——— */
const colorData = useDictStore().data.price_change_color
const data = ref({ spot_data: [], coin_data: [] })
const { t } = useI18n()

// 获取字典数组
const dictList = useDictStore().data

// 获取字典price_change_color中值为up的color
const up_color = tool.getColor('up', dictList['price_change_color'])
const down_color = tool.getColor('down', dictList['price_change_color'])

const getTextColors = (val) => {
  if (val > 0) return up_color
  if (val < 0) return down_color
  return 'black'
}
const getData = async () => {
  data.value = (await api.getBotData()).data
}
getData()

// 添加定时刷新功能
const intervalId = setInterval(() => {
  getData()
}, 10000)

onUnmounted(() => {
  clearInterval(intervalId)
})

const summarySpot = ({ data }) => {
  const total = data.reduce((sum, r) => sum + Number(r.unrealized_pnl || 0), 0)
  return [
    {
      name: t('bot.totalUnrealizedPnl'),
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
      name: t('bot.totalUnrealizedPnl'),
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
  { title: t('bot.botName'), dataIndex: 'name', align: 'center', width: 120 },
  { title: t('bot.symbol'), dataIndex: 'symbol', align: 'center', width: 100 },
  {
    title: t('bot.orderType.limit'),
    children: [
      { title: t('bot.buyLimit'), dataIndex: 'buy', align: 'center', width: 100 },
      { title: t('bot.sellLimit'), dataIndex: 'sell', align: 'center', width: 100 },
    ],
  },
  {
    title: t('bot.unrealizedPnl'),
    dataIndex: 'unrealized_pnl',
    align: 'center',
    slotName: 'unrealized_pnl',
    width: 100,
  },
])
const coin_columns = reactive([
  { title: t('bot.botName'), dataIndex: 'name', align: 'center', width: 120 },
  { title: t('bot.symbol'), dataIndex: 'symbol', align: 'center', width: 100 },
  {
    title: t('bot.orderType.limit'),
    children: [
      { title: t('bot.closeShortLimit'), dataIndex: 'closeShort', align: 'center', width: 100 },
      { title: t('bot.openShortLimit'), dataIndex: 'openShort', align: 'center', width: 100 },
    ],
  },
  {
    title: t('bot.unrealizedPnl'),
    dataIndex: 'unrealized_pnl',
    align: 'center',
    slotName: 'unrealized_pnl',
    width: 100,
  },
])
</script>

<style scoped>
/* 让移动端出现独立的横向滚动条 */
.table-wrapper {
  overflow-x: auto;
}
</style>
