<script setup lang="ts" generic="T extends string | number">
defineProps<{
  modelValue: T;
  options: T[];
}>();

defineEmits<{
  'update:modelValue': [value: T];
}>();
</script>

<template>
  <select 
    :value="modelValue" 
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value as T)"
  >
    <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
  </select>
</template>

<style scoped>
select {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

select:focus {
  border-color: var(--secondary);
}
</style>
