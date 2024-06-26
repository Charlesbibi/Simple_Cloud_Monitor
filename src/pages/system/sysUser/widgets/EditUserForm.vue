<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { UserData } from '@/api/system/sysUser/types'
import RoleApi from '@/api/system/sysRole'
import { useToast } from 'vuestic-ui'
import UserAvatar from './UserAvatar.vue'
import { validators } from '@/services/utils'

const props = defineProps({
  user: {
    type: Object as PropType<UserData | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const { init: notify } = useToast()

const defaultNewUser: UserData = {
  id: -1,
  username: '',
  name: '',
  password: '123456',
  phone: '',
  headUrl: '',
  email: '',
  status: 1,
  roleList: [],
}

const newUser = ref<UserData>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'avatar') {
      return false
    }

    return newUser.value[key as keyof UserData] !== (props.user ?? defaultNewUser)?.[key as keyof UserData]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.user,
  () => {
    if (!props.user) {
      return
    }

    newUser.value = {
      ...props.user,
      headUrl: props.user.headUrl || '',
    }
  },
  { immediate: true },
)

const avatar = ref<File>()

const makeAvatarBlobUrl = (avatar: File) => {
  return URL.createObjectURL(avatar)
}

watch(avatar, (newAvatar) => {
  newUser.value.headUrl = newAvatar ? makeAvatarBlobUrl(newAvatar) : ''
})

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newUser.value)
  }
}

// const allRoleList = RoleApi.listAll()

const roleSelectOptions: { text: number; value: string }[] = []

window.addEventListener('load', () => {
  console.log('loading')
  try {
    console.log('here')
    RoleApi.listAll().then((data) =>
      data.forEach((roles) => {
        roleSelectOptions.push({
          text: roles.id,
          value: roles.roleCode,
        })
      }),
    )
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <VaFileUpload
      v-model="avatar"
      type="single"
      hide-file-list
      class="self-stretch justify-start items-center gap-4 inline-flex"
    >
      <UserAvatar :user="newUser" size="large" />
      <VaButton preset="primary" size="small">Add image</VaButton>
      <VaButton
        v-if="avatar"
        preset="primary"
        color="danger"
        size="small"
        icon="delete"
        class="z-10"
        @click.stop="avatar = undefined"
      />
    </VaFileUpload>
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
        <VaInput
          v-model="newUser.username"
          label="Username"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="username"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.email"
          label="Email"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.email]"
          name="email"
        />

        <VaInput
          v-model="newUser.phone"
          label="Phone"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="phone"
        />
      </div>

      <div class="flex gap-4 w-full">
        <div class="w-1/2">
          <VaOptionList
            v-model="newUser.roleList"
            :options="roleSelectOptions"
            label="Role"
            class="w-full"
            :rules="[validators.required]"
            name="role"
            value-by="value"
          />
        </div>

        <div class="flex items-center w-1/2 mt-4">
          <VaCheckbox v-model.number="newUser.status" label="Active" class="w-full" name="status" />
        </div>
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
