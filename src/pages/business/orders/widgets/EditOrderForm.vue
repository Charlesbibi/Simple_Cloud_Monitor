<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { OrderData } from '@/api/business/order/types'
import { useToast } from 'vuestic-ui'
import { validators } from '@/services/utils'

const props = defineProps({
  order: {
    type: Object as PropType<OrderData | null>,
    default: null,
  },
})

const { init: notify } = useToast()

const defaultnewOrder: OrderData = {
  id: -1,
  userId: 1,
  productId: 1,
  count: 10,
  money: 10,
}

const newOrder = ref<OrderData>({ ...defaultnewOrder })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newOrder.value).some((key) => {
    return newOrder.value[key as keyof OrderData] !== (props.order ?? defaultnewOrder)?.[key as keyof OrderData]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.order,
  () => {
    if (!props.order) {
      return
    }

    newOrder.value = {
      ...props.order,
    }
  },
  { immediate: true },
)

const form = useForm('add-order-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newOrder.value)
  }
}
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-order-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newOrder.userId"
          label="User Id"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="userId"
        />

        <VaInput
          v-model="newOrder.productId"
          label="Product Id"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="productId"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newOrder.count"
          label="Buy Count"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="count"
        />

        <VaInput
          v-model="newOrder.money"
          label="Money"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="money"
        />
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave"> BUY😍 </VaButton>
      </div>
    </div>
  </VaForm>
</template>
