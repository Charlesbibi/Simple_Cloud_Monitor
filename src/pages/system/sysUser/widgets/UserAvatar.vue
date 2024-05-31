<script setup lang="ts">
import { PropType } from 'vue'
import { UserData } from '@/api/system/sysUser/types'

const avatarColor = (userName: string) => {
  const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
  const index = userName.charCodeAt(0) % colors.length
  return colors[index]
}

defineProps({
  user: {
    type: Object as PropType<UserData>,
    required: true,
  },
  size: {
    type: String,
    default: 'medium',
  },
})

const isUrl = (avatar: string) => {
  return avatar.startsWith('http') || avatar.startsWith('blob:')
}
</script>

<template>
  <VaAvatar
    :size="size"
    :src="isUrl(user.headUrl) ? user.headUrl : ''"
    :fallback-text="user.headUrl || user.name[0]"
    :color="avatarColor(user.headUrl)"
  />
</template>
