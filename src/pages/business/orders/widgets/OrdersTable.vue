<script setup lang="ts">
import { defineVaDataTableColumns } from 'vuestic-ui'
import { OrderData, Pagination } from '@/api/business/order/types'
import { PropType, computed, toRef } from 'vue'

const columns = defineVaDataTableColumns([
  { label: 'User Id', key: 'userId' },
  { label: 'Product Id', key: 'productId' },
  { label: 'Buy Count', key: 'count' },
  { label: 'Money', key: 'money' },
])

const props = defineProps({
  orders: {
    type: Array as PropType<OrderData[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
})

const orders = toRef(props, 'orders')

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
</script>

<template>
  <VaDataTable :columns="columns" :items="orders" :loading="$props.loading">
    <template #cell(userId)="{ rowData }">
      <div class="max-w-[120px] ellipsis">
        {{ rowData.userId }}
      </div>
    </template>

    <template #cell(productId)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.productId }}
      </div>
    </template>

    <template #cell(count)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.count }}
      </div>
    </template>

    <template #cell(money)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.money }}
      </div>
    </template>
  </VaDataTable>

  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
    </div>

    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
