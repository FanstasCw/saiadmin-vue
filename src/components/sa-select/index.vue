<template>
  <a-select
    v-model="value"
    :size="props.size"
    :options="translatedOptions"
    :placeholder="props.placeholder"
    :style="props.style"
    :disabled="props.disabled"
    :allow-clear="props.allowClear"
    @change="handleChangeEvent($event)">
  </a-select>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useDictStore } from '@/store'
import { useI18n } from 'vue-i18n'

const dictList = useDictStore().data
const emit = defineEmits(['update:modelValue', 'change'])
const value = ref()
const { t } = useI18n()
const props = defineProps({
  modelValue: { type: [String, Number] },
  fieldNames: { type: Object, default: { value: 'value', label: 'label' } },
  size: { type: String, default: 'medium' },
  style: { type: Object, default: {} },
  dict: { type: String, default: '' },
  placeholder: { type: String, default: '请选择' },
  disabled: { type: Boolean, default: false },
  allowClear: { type: Boolean, default: true },
})

const translatedOptions = computed(() => {
  const options = dictList[props.dict] ?? []
  return options.map((option) => ({
    ...option,
    label: t(option.label),
  }))
})
watch(
  () => props.modelValue,
  (vl) => {
    if (props.dict !== '') {
      value.value = vl + ''
    } else {
      value.value = vl
    }
  },
  { immediate: true }
)
watch(
  () => value.value,
  (v) => {
    emit('update:modelValue', value.value)
  }
)

const handleChangeEvent = async (val) => {
  emit('update:modelValue', val)
  emit('change', val)
}
</script>
