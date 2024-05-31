<script setup lang="ts">
import { ref } from 'vue'
import UsersTable from './widgets/UsersTable.vue'
import EditUserForm from './widgets/EditUserForm.vue'
import { UserData } from '@/api/system/sysUser/types'
import { useUsers } from '../sysUser/composables/useUsers'
import { useModal, useToast } from 'vuestic-ui'
import { onPageRender } from '@/utils/tokenMonitor'

const doShowEditUserModal = ref(false)

const { users, isLoading, filters, sorting, pagination, ...api } = useUsers()

const userToEdit = ref<UserData | null>(null)

window.addEventListener('load', () => {
  onPageRender()
})

const showEditUserModal = (user: UserData) => {
  userToEdit.value = user
  doShowEditUserModal.value = true
}

const showAddUserModal = () => {
  userToEdit.value = null
  doShowEditUserModal.value = true
}

const { init: notify } = useToast()

const onUserSaved = async (user: UserData) => {
  console.log(userToEdit.value)
  if (userToEdit.value) {
    console.log('edit')
    api
      .update(user)
      .then((data) =>
        notify({
          message: `${user.name} has been update`,
          color: 'success',
        }),
      )
      .catch(() =>
        notify({
          message: `${user.name} updated fail`,
          color: 'danger',
        }),
      )
  } else {
    api
      .add(user)
      .then((data) =>
        notify({
          message: `${user.name} has been add`,
          color: 'success',
        }),
      )
      .catch(() =>
        notify({
          message: `${user.name} add fail`,
          color: 'danger',
        }),
      )
  }
}

const onUserDelete = async (user: UserData) => {
  api
    .remove(user.id)
    .then((data) =>
      notify({
        message: `${user.name} has been delete`,
        color: 'success',
      }),
    )
    .catch(() =>
      notify({
        message: `${user.name} deleted fail`,
        color: 'danger',
      }),
    )
}

const editFormRef = ref()

const { confirm } = useModal()

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}
</script>

<template>
  <h1 class="page-title">Users</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="filters.isActive"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Active', value: 1 },
              { label: 'Inactive', value: 0 },
            ]"
          />
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>

        <VaButton @click="showAddUserModal">Add User</VaButton>
      </div>

      <UsersTable
        v-model:sorting-order="sorting.sortingOrder"
        v-model:sort-by="sorting.sortBy"
        :users="users"
        :loading="isLoading"
        :pagination="pagination"
        @editUser="showEditUserModal"
        @deleteUser="onUserDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditUserModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :before-cancel="beforeEditFormModalClose"
  >
    <h1 class="va-h5">{{ userToEdit ? 'Edit user' : 'Add user' }}</h1>
    <EditUserForm
      ref="editFormRef"
      :user="userToEdit"
      :save-button-label="userToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (user) => {
          onUserSaved(user)
          ok()
        }
      "
    />
  </VaModal>
</template>
