<template>
  <div class="app-navbar-actions">
    <GithubButton v-if="!isMobile" class="app-navbar-actions__item" />
    <VaButton
      v-if="!isMobile"
      preset="secondary"
      target="_blank"
      color="textPrimary"
      class="app-navbar-actions__item flex-shrink-0 mx-0"
      @click="logoutOper"
    >
      {{ t('Logout') }}
    </VaButton>
    <NotificationDropdown class="app-navbar-actions__item" />
    <ProfileDropdown class="app-navbar-actions__item app-navbar-actions__item--profile mr-1" />
  </div>
</template>

<script lang="ts" setup>
import ProfileDropdown from './dropdowns/ProfileDropdown.vue'
import NotificationDropdown from './dropdowns/NotificationDropdown.vue'
import GithubButton from './GitHubButton.vue'
import { logout } from '@/api/system/auth/index'
import { useAuthStore } from '@/stores'

import { useToast } from 'vuestic-ui'
import { useRouter } from 'vue-router'
const { init } = useToast()

defineProps({
  isMobile: { type: Boolean, default: false },
})

const logoutOper = () => {
  logout()
    .then(() => {
      const store = useAuthStore() // 获取store实例
      store.reset() // 重置store

      //去除浏览器缓存
      window.sessionStorage.removeItem('isAuthenticated')
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('refreshToken')

      //跳转路由
      init({ message: 'logout success', color: 'success' })
      // 跳转到登录页
      window.location.href = '/auth/login'
    })
    .catch(() => {
      init({ message: 'logged out fail , please contact administration', color: '#FF0000' })
    })
}

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;

  .va-dropdown__anchor {
    color: var(--va-primary);
    fill: var(--va-primary);
  }

  &__item {
    padding: 0;
    margin-left: 0.25rem;
    margin-right: 0.25rem;

    svg {
      height: 20px;
    }

    &--profile {
      display: flex;
      justify-content: center;
    }

    .va-dropdown-content {
      background-color: var(--va-white);
    }

    @media screen and (max-width: 640px) {
      margin-left: 0;
      margin-right: 0;

      &:first-of-type {
        margin-left: 0;
      }
    }
  }

  .fa-github {
    color: var(--va-on-background-primary);
  }
}
</style>
