<template>
  <st-welcome />
  <trade-count />

  <spot-echart />
  <coin-echart />
  <trade-echart />
</template>

<script setup>
import TradeCount from './components/trade-count.vue'
import spotEchart from './components/spot-echart.vue'
import coinEchart from './components/coin-echart.vue'
import tradeEchart from './components/trade-echart.vue'
import StWelcome from './components/st-welcome.vue'
</script>
