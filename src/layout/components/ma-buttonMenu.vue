<template>
  <div class="block lg:hidden button-menu">
    <a-trigger
      :trigger="['click']"
      clickToClose
      position="top"
      v-model:popupVisible="popupVisible"
    >
      <div :class="`button-trigger ${popupVisible ? 'button-trigger-active' : ''}`">
        <icon-close v-if="popupVisible" />
        <icon-menu v-else />
      </div>
      <template #content>
        <a-menu mode="popButton" showCollapseButton :popup-max-height="360">
          <children-menu v-model="mobileRouters" />
        </a-menu>
      </template>
    </a-trigger>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore, useUserStore } from '@/store'

import ChildrenMenu from './components/children-menu.vue'

const userStore = useUserStore()
let mobileRouters = userStore.routers

let exchangeTtem = mobileRouters.find((item) => item.name === 'exchange')
let accountItem = mobileRouters.find((item) => item.name === 'account')
let symbolItem = mobileRouters.find((item) => item.name === 'symbol')
let spotBotItem = mobileRouters.find((item) => item.name === 'spotBot')
let coinBotItem = mobileRouters.find((item) => item.name === 'coinBot')
let spotBotTradeItem = mobileRouters.find((item) => item.name === 'spotBotTrade')
let coinBotTradeItem = mobileRouters.find((item) => item.name === 'coinBotTrade')
let spotBotLogItem = mobileRouters.find((item) => item.name === 'spotBotLog')
let coinBotLogItem = mobileRouters.find((item) => item.name === 'coinBotLog')
let botItem = {
  name: 'bot',
  meta: {
    title: '量化管理',
    icon: 'icon-robot',
  },
  path: '/bot',
  children: [],
}
if (exchangeTtem) {
  botItem.children.push(exchangeTtem)
  mobileRouters = mobileRouters.filter((r) => r !== exchangeTtem) // 移除 exchangeTtem
}
if (accountItem) {
  botItem.children.push(accountItem)
  mobileRouters = mobileRouters.filter((r) => r !== accountItem) // 移除 accountItem
}
if (symbolItem) {
  botItem.children.push(symbolItem)
  mobileRouters = mobileRouters.filter((r) => r !== symbolItem) // 移除 symbolItem
}
if (spotBotItem) {
  botItem.children.push(spotBotItem)
  mobileRouters = mobileRouters.filter((r) => r !== spotBotItem) // 移除 spotBotItem
}
if (coinBotItem) {
  botItem.children.push(coinBotItem)
  mobileRouters = mobileRouters.filter((r) => r !== coinBotItem) // 移除 coinBotItem
}
if (spotBotTradeItem) {
  botItem.children.push(spotBotTradeItem)
  mobileRouters = mobileRouters.filter((r) => r !== spotBotTradeItem) // 移除 spotBotTradeItem
}
if (coinBotTradeItem) {
  botItem.children.push(coinBotTradeItem)
  mobileRouters = mobileRouters.filter((r) => r !== coinBotTradeItem) // 移除 coinBotTradeItem
}
if (spotBotLogItem) {
  botItem.children.push(spotBotLogItem)
  mobileRouters = mobileRouters.filter((r) => r !== spotBotLogItem) // 移除 spotBotLogItem
}
if (coinBotLogItem) {
  botItem.children.push(coinBotLogItem)
  mobileRouters = mobileRouters.filter((r) => r !== coinBotLogItem) // 移除 coinBotLogItem
}
mobileRouters.push(botItem)

const popupVisible = ref(false)

</script>

<style scoped>

</style>
