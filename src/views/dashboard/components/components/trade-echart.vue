<template>
  <div class="ma-content-block p-3 mt-3">
    <a-card
      :bordered="false"
      class="general-card"
      :header-style="{ paddingTop: '10px', paddingBottom: 0 }"
      :body-style="{ paddingTop: '20px' }"
      :title="t('bot.netValueStatistics')">
      <!-- 使用 flex 布局对齐标题和选择器 -->
      <template #extra>
        <a-select
          v-model="selectedBotId"
          :style="{ width: '180px' }"
          :options="botName"
          :placeholder="t('bot.selectBot')"
          allow-clear />
      </template>

      <!-- 图表区域 -->
      <sa-chart height="400px" :options="options" />
    </a-card>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import commonApi from '@/api/common'
import api from '@/views/botadmin/api/statistics'

const net_value_series = ref([])
const principal = ref([])
const options = ref({})
const botName = ref([])
const { t } = useI18n()
const selectedBotId = ref() // 添加选中值的响应式变量

const getData = async (botId) => {
  try {
    const res = await api.getProfit(botId)
    net_value_series.value = res.data.net_value_series
    principal.value = Number(res.data.principal) //必须将字符串转换为数字，不然visualMap.pieces中的lt不能正常使用

    const startPercent = 0 // 从80%开始
    const endPercent = 100 // 到100%结束
    options.value = {
      grid: {
        left: '2.6%',
        right: '2%',
        // top: '10',
        // bottom: '30',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const param = params[0]
          // 从数据中获取日期和值
          const dateStr = param.data[0] // '2025-08-01' 格式
          const value = param.data[1]
          return `${dateStr}<br/> ${value}`
        },
      },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: '{yyyy}-{MM}-{dd}', // 格式化日期显示
        },
      },
      yAxis: {
        type: 'value',
        name: t('bot.netValue'),
        scale: true,
        axisLabel: {
          formatter: function (value) {
            return value.toFixed(0)
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: startPercent, // 显示后20%的数据
          end: endPercent,
        },
        {
          start: startPercent, // 显示后20%的数据
          end: endPercent,
        },
      ],
      visualMap: {
        show: false,
        dimension: 1,
        pieces: [
          {
            gte: 0,
            lt: principal.value,
            color: '#F6465D',
          },
          {
            gte: principal.value,
            color: '#2EBD85',
          },
        ],
      },
      series: [
        {
          data: net_value_series.value,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            // color: '#1890ff',
          },
          itemStyle: {
            color: '#1890ff',
            borderWidth: 2,
            borderColor: '#ffffff',
          },
          markPoint: {
            data: [
              {
                type: 'max',
              },
              {
                type: 'min',
              },
            ],
            symbol: 'pin',
            animation: true,
            symbolSize: 30,
            label: {
              show: true,
              position: 'top',
              formatter: '{c}', // 显示数值
            },
          },
          markLine: {
            data: [{ yAxis: principal.value }],
            silent: true,
            animation: true,
            label: {
              position: 'insideMiddleBottom',
              formatter: t('bot.principal') + ': ' + principal.value,
            },
          },
        },
      ],
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

watch(selectedBotId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    getData(newVal)
  }
})

// 页面数据初始化
const initPage = async () => {
  const postResp = await commonApi.commonGet('/bot/spotBot/getBotName')
  botName.value = postResp.data
  // 设置默认值
  if (botName.value && botName.value.length > 0) {
    selectedBotId.value = botName.value[0].value
  } else {
    selectedBotId.value = ''
  }
}

onMounted(() => {
  initPage()
})
</script>
<style lang="less" scoped>
.general-card {
  border-radius: 4px;
  border: none;

  :deep(.arco-card-header) {
    height: auto;
    padding: 20px;
    border: none;
  }
}
</style>
