<script setup lang="ts" generic="T extends string | number">
import { useId } from "vue";

defineProps<{
  modelValue: T;
  options: T[];
  label?: string;
  name?: string;
}>();

defineEmits<{
  "update:modelValue": [value: T];
}>();

const generatedName = useId();
</script>

<template>
  <div class="select-wrapper">
    <div v-if="label" class="label">{{ label }}</div>
    <select
      :value="modelValue"
      :name="name || generatedName"
      :title="String(modelValue)"
      @change="
        $emit(
          'update:modelValue',
          ($event.target as HTMLSelectElement).value as T,
        )
      "
    >
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.select-wrapper {
  width: 100%;
}

.label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 8px;
}

select {
  width: 100%;
  padding: 12px 32px 12px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236c7378' d='M1.41 0L6 4.58 10.59 0 12 1.41l-6 6-6-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}

select:focus {
  border-color: var(--secondary);
}

option {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 400px) {
  select {
    font-size: 14px;
    padding: 10px 28px 10px 10px;
    background-position: right 8px center;
  }
}
</style>
