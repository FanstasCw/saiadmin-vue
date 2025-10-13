<template>
  <div class="w-full mx-auto">
    <!-- 桌面端左右分栏，移动端上下堆叠 -->
    <a-grid :cols="{ xs: 1, sm: 1, md: 2 }" :row-gap="16" :col-gap="16" class="panel ma-content-block mt-3 p-4">
      <a-grid-item v-for="chart in chartList" :key="chart.id">
        <div class="table-wrapper">
          <sa-chart height="400px" :options="chart.options" />
        </div>
      </a-grid-item>
    </a-grid>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import api from '@/views/botadmin/api/statistics'
import { useDictStore } from '@/store'
import { useI18n } from 'vue-i18n'
import tool from '@/utils/tool'
import { use } from 'echarts/core'
import { BarChart } from 'echarts/charts'
import { DatasetComponent, TitleComponent, TooltipComponent, GridComponent, GraphicComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([DatasetComponent, TitleComponent, TooltipComponent, GridComponent, GraphicComponent, BarChart, CanvasRenderer])

const { t } = useI18n()

// --- 常量定义 ---
const REFRESH_INTERVAL = 10000 // 10秒
const CURRENCY_UNIT = 'U'

// --- 状态管理 ---
const chartList = ref([
  { id: 'spot', options: {} },
  { id: 'close_spot', options: {} },
])

// --- 辅助函数 ---
const dictList = useDictStore().data
const up_color = tool.getColor('up', dictList['price_change_color'])
const down_color = tool.getColor('down', dictList['price_change_color'])

/**
 * 根据数据和配置生成 ECharts 的 options 对象
 * @param {Array} data - 图表数据源
 * @param {string} titleKey - 标题的国际化 key
 * @param {string} seriesNameKey - 系列名称的国际化 key
 * @param {number} totalPnl - 总盈亏
 * @returns {object} ECharts options
 */
function createChartOptions(data, titleKey, seriesNameKey, totalPnl) {
  const isEmpty = !data || !Array.isArray(data) || data.length <= 1

  return {
    //根据 isEmpty 状态决定是否显示 title
    title: isEmpty
      ? {
          text: t(titleKey),
          left: 'center',
          top: 10,
        }
      : {},
    dataset: { source: data },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { bottom: 30, left: '2%', containLabel: true },
    toolbox: { feature: { restore: {}, saveAsImage: {} } },
    xAxis: { type: 'value', position: 'top', splitLine: { lineStyle: { type: 'dashed' } } },
    yAxis: { type: 'category', show: !isEmpty },
    series: [
      {
        name: t(seriesNameKey),
        type: 'bar',
        label: { show: true, formatter: `{@[0]} ${CURRENCY_UNIT}` },
        itemStyle: { color: (params) => (params.value[0] >= 0 ? up_color : down_color) },
        encode: { x: 'PNL', y: 'name' },
      },
    ],
    dataZoom: [
      {
        type: 'slider',
        yAxisIndex: 0,
        filterMode: 'empty',
        show: !isEmpty,
        height: '80%',
        bottom: 20,
        handleSize: '80%',
        borderColor: '#d9d9d9',
        showDataShadow: false,
      },
      { type: 'inside', yAxisIndex: 0, zoomLock: false },
    ],
    graphic: isEmpty
      ? [{ type: 'text', left: 'center', top: 'middle', style: { text: t('bot.noData'), fontSize: 16, fill: '#999' } }]
      : {
          elements: [
            {
              type: 'text',
              left: 'center',
              style: {
                text: `{label|${t(titleKey)}}{pnl|${totalPnl.toFixed(2)}}{unit| ${CURRENCY_UNIT}}`,
                fontSize: 20,
                fontWeight: 'bold',
                rich: {
                  label: { fill: '#333' },
                  pnl: { fill: totalPnl >= 0 ? up_color : down_color },
                  unit: { fill: '#333' },
                },
              },
            },
          ],
        },
  }
}

/**
 * 获取数据并更新图表配置
 */
const fetchDataAndUpdateCharts = async () => {
  try {
    const res = await api.spotPnl()
    const { spot_data, close_spot_data } = res.data

    const totalPnlSpot = spot_data?.slice(1).reduce((sum, row) => sum + Number(row[0]), 0) ?? 0
    const totalPnlCloseSpot = close_spot_data?.slice(1).reduce((sum, row) => sum + Number(row[0]), 0) ?? 0

    chartList.value[0].options = createChartOptions(
      spot_data,
      'bot.spotTotalUnrealizedPnl',
      'bot.unRealizedPnl',
      totalPnlSpot
    )
    chartList.value[1].options = createChartOptions(
      close_spot_data,
      'bot.spotTotalRealizedPnl',
      'bot.realizedPnl',
      totalPnlCloseSpot
    )
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
  }
}

// --- 生命周期与副作用 ---
fetchDataAndUpdateCharts()
const intervalId = setInterval(fetchDataAndUpdateCharts, REFRESH_INTERVAL)
onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped></style>
