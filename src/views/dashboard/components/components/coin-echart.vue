<template>
  <div class="w-full mx-auto">
    <!-- 桌面端左右分栏，移动端上下堆叠 -->
    <a-grid :cols="{ xs: 1, sm: 1, md: 2 }" :row-gap="16" :col-gap="16" class="panel ma-content-block mt-3 p-4">
      <!-- 使用 v-for 循环渲染图表，提高可扩展性 -->
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
// 使用一个数组来管理所有图表的状态，更清晰、更具扩展性
const chartList = ref([
  { id: 'coin', options: {} },
  { id: 'close_coin', options: {} },
])

// --- 辅助函数 ---
// 获取字典颜色
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
    title: isEmpty
      ? {
          text: t(titleKey),
          left: 'center',
          top: 10,
        }
      : {},
    dataset: { source: data },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { bottom: 30, left: '2%', containLabel: true }, // containLabel 防止标签溢出
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
        show: !isEmpty, // 无数据时隐藏缩放条
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
    const res = await api.coinPnl()
    const { coin_data, close_coin_data } = res.data

    // 计算总盈亏
    const totalPnlCoin = coin_data?.slice(1).reduce((sum, row) => sum + Number(row[0]), 0) ?? 0
    const totalPnlCloseCoin = close_coin_data?.slice(1).reduce((sum, row) => sum + Number(row[0]), 0) ?? 0

    // 使用抽象的函数生成配置，并更新到 chartList 中
    chartList.value[0].options = createChartOptions(
      coin_data,
      'bot.coinTotalUnrealizedPnl',
      'bot.unRealizedPnl',
      totalPnlCoin
    )
    chartList.value[1].options = createChartOptions(
      close_coin_data,
      'bot.coinTotalRealizedPnl',
      'bot.realizedPnl',
      totalPnlCloseCoin
    )
  } catch (error) {
    console.error('Failed to fetch chart data:', error)
    // 可选：在界面上显示错误提示
    // Message.error('数据加载失败，请稍后重试');
  }
}

// --- 生命周期与副作用 ---
// 初始化加载数据
fetchDataAndUpdateCharts()

// 添加定时刷新功能
const intervalId = setInterval(fetchDataAndUpdateCharts, REFRESH_INTERVAL)

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<style scoped></style>
