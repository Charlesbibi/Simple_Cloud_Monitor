<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>

    <VaInput
      v-model="formData.email"
      :rules="[validators.required, validators.email]"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Forgot password?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" :disable="isLoading" @click="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { VaButton, useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import { UserInfoRes } from '@/api/system/auth/types'
import { login } from '@/api/system/auth/index'
import { useAuthStore } from '@/stores'
import { myFilterInstance } from '@/utils/tokenMonitor'

import { message as Message } from 'ant-design-vue'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const formData = reactive({
  email: '',
  password: '',
})

const isLoading = ref(false)

const submit = () => {
  if (validate() && !isLoading.value) {
    isLoading.value = true

    login(formData)
      .then((data: UserInfoRes) => {
        if (data) {
          // 在这里添加需要执行的操作
          const token = data.token

          // 将token存储到authStore中
          const authStore = useAuthStore()
          authStore.setToken(token)
          window.sessionStorage.setItem('token', token)
          window.sessionStorage.setItem('refreshToken', data.refreshToken)
          window.sessionStorage.setItem('tokenExpire', data.tokenExpire)
          authStore.setIsAuthenticated(true)
          window.sessionStorage.setItem('isAuthenticated', 'true')
          authStore.setName(data.name)
          authStore.setButtons(data.buttons)
          authStore.setRoles(data.roles)
          authStore.setRouters(data.routers)

          console.log(authStore.getName)
          console.log(authStore.getButtons)
          console.log(authStore.getRoles)
          console.log(authStore.getRouters)

          myFilterInstance.start()
          init({ message: 'logged in success', color: 'success' })
          push({ name: 'dashboard' })
        }
      })
      .catch(() => {
        isLoading.value = false
        init({ message: 'logged in fail , please check carefully!', color: '#FF0000' })
      })
  } else {
    Message.error('error submit!!')
    return false
  }
}
</script>
