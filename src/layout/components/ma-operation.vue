<template>
  <div class="mr-2 flex justify-end lg:justify-between w-full lg:w-auto">
    <a-space class="mr-0 lg:mr-5" size="medium">
      <a-tooltip :content="isFullScreen ? $t('sys.closeFullScreen') : $t('sys.fullScreen')">
        <a-button :shape="'circle'" class="hidden lg:inline" @click="screen">
          <template #icon>
            <icon-fullscreen-exit v-if="isFullScreen" />
            <icon-fullscreen v-else />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip :content="$t('sys.language')">
        <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setDropDownVisible">
          <template #icon>
            <icon-language />
          </template>
        </a-button>
      </a-tooltip>
      <a-dropdown trigger="click" @select="handleLanguage">
        <div ref="triggerBtn" class="trigger-btn"></div>
        <template #content>
          <!-- <a-doption v-for="item in locales" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-doption> -->
          <a-doption value="zh_CN">{{ $t('sys.chinese') }}</a-doption>
          <a-doption value="zh_Hant">{{ $t('sys.hant') }}</a-doption>
          <a-doption value="en">{{ $t('sys.english') }}</a-doption>
        </template>
      </a-dropdown>

      <!-- <a-tooltip :content="$t('sys.pageSetting')">
        <a-button :shape="'circle'" @click="() => (appStore.settingOpen = true)" class="hidden lg:inline">
          <template #icon>
            <icon-settings />
          </template>
        </a-button>
      </a-tooltip> -->
    </a-space>
    <a-dropdown @select="handleSelect" trigger="hover">
      <a-avatar class="bg-blue-500 text-3xl avatar" style="top: -1px">
        <img :src="userStore.user && userStore.user.avatar ? userStore.user.avatar : avatar" />
      </a-avatar>

      <template #content>
        <a-doption value="userCenter"><icon-user /> {{ $t('sys.userCenter') }}</a-doption>
        <a-doption value="clearCache"><icon-delete /> {{ $t('sys.clearCache') }}</a-doption>
        <a-divider style="margin: 5px 0" />
        <a-doption value="logout"><icon-poweroff /> {{ $t('sys.logout') }}</a-doption>
      </template>
    </a-dropdown>

    <a-modal v-model:visible="showLogoutModal" @ok="handleLogout" @cancel="handleLogoutCancel">
      <template #title>{{ $t('sys.logoutAlert') }}</template>
      <div>{{ $t('sys.logoutMessage') }}</div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAppStore, useUserStore, useMessageStore } from '@/store'
import tool from '@/utils/tool'
// import MessageNotification from './components/message-notification.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Message } from '@arco-design/web-vue'
import { Push } from '@/utils/push-vue'
import { info } from '@/utils/common'
import commonApi from '@/api/common'
import avatar from '@/assets/avatar.svg'

const messageStore = useMessageStore()
const userStore = useUserStore()
const appStore = useAppStore()
const setting = ref(null)
const router = useRouter()
const isFullScreen = ref(false)
const showLogoutModal = ref(false)
const isDev = ref(import.meta.env.DEV)
const triggerBtn = ref()
const handleSelect = async (name) => {
  if (name === 'userCenter') {
    router.push({ name: 'userCenter' })
  }
  if (name === 'clearCache') {
    const res = await commonApi.clearAllCache()
    tool.local.remove('dictData')
    res.code === 200 && Message.success(res.message)
  }
  if (name === 'logout') {
    showLogoutModal.value = true
    document.querySelector('#app').style.filter = 'grayscale(1)'
  }
}

const setDropDownVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  })
  triggerBtn.value.dispatchEvent(event)
}

const handleLanguage = (val) => appStore.changeLanguage(val)
const handleLogout = async () => {
  await userStore.logout()
  document.querySelector('#app').style.filter = 'grayscale(0)'
  router.push({ name: 'login' })
}

const handleLogoutCancel = () => {
  document.querySelector('#app').style.filter = 'grayscale(0)'
}

const screen = () => {
  tool.screen(document.documentElement)
  isFullScreen.value = !isFullScreen.value
}

// if (appStore.ws) {
//   const env = import.meta.env
//   const baseURL = env.VITE_APP_OPEN_PROXY === 'true' ? env.VITE_APP_PROXY_PREFIX : env.VITE_APP_BASE_URL
//   const wsURL = env.VITE_APP_WS_URL ? env.VITE_APP_WS_URL : ''
//   const appKey = env.VITE_APP_WS_APPKEY ? env.VITE_APP_WS_APPKEY : ''
//   // 建立连接
//   var connection = new Push({
//     url: wsURL, // websocket地址
//     app_key: appKey, // appkey
//     auth: baseURL + '/plugin/webman/push/auth',
//   })
//   // 创建监听频道
//   var user_channel = connection.subscribe('saiadmin')
//   // 当saiadmin频道有message事件的消息时
//   user_channel.on('message', function (message) {
//     // message是消息内容
//     info('新消息提示', '您有新的消息，请注意查收！')
//     messageStore.messageList = message.data
//   })
// }
</script>
<style scoped>
:deep(.arco-avatar-text) {
  top: 1px;
}
:deep(.arco-divider-horizontal) {
  margin: 5px 0;
}
.avatar {
  cursor: pointer;
  margin-top: 6px;
}
</style>
