<template>
  <st-welcome />
  <trade-count />
  <trade-table />

  <div class="block lg:flex">
    <!-- <st-announced /> -->
    <!-- <st-saiadmin /> -->
  </div>
</template>

<script setup>
import TradeCount from './components/trade-count.vue'
import TradeTable from './components/trade-table.vue'
import StWelcome from './components/st-welcome.vue'
import StLoginChart from './components/st-loginChart.vue'
// import StSaiadmin from './components/st-saiadmin.vue'
import StAnnounced from './components/st-announced.vue'
</script>
