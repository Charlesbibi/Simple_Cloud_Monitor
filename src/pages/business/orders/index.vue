<script setup lang="ts">
import { ref } from 'vue'
import OrdersTable from './widgets/OrdersTable.vue'
import EditOrderForm from './widgets/EditOrderForm.vue'
import { OrderData } from '@/api/business/order/types'
import { useOrders } from './composables/useOrders'
import { useModal, useToast } from 'vuestic-ui'
import { onPageRender } from '@/utils/tokenMonitor'

const doShowEditUserModal = ref(false)

const { orders, isLoading, pagination, ...api } = useOrders()

const orderToEdit = ref<OrderData | null>(null)

const vMonitorDirective = {
  beforeMount: () => {
    // do something with the element
    onPageRender()
  },
}

const showAddUserModal = () => {
  orderToEdit.value = null
  doShowEditUserModal.value = true
}

const { init: notify } = useToast()

const onOrderSaved = async (order: OrderData) => {
  api
    .add(order)
    .then((data) =>
      notify({
        message: `order has been create`,
        color: 'success',
      }),
    )
    .catch(() =>
      notify({
        message: `create order fail`,
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
  <h1 v-Monitor-directive class="page-title">Orders</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <VaButton @click="showAddUserModal">BUY PRODUCT</VaButton>
      </div>

      <OrdersTable :orders="orders" :loading="isLoading" :pagination="pagination" />
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
    <h1 class="va-h5">{{ 'Add order' }}</h1>
    <EditOrderForm
      ref="editFormRef"
      :order="orderToEdit"
      @close="cancel"
      @save="
        (order: OrderData) => {
          onOrderSaved(order)
          ok()
        }
      "
    />
  </VaModal>
</template>
