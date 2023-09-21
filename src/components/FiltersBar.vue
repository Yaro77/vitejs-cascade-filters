<script setup lang="ts">
import { ShallowRef, toRefs } from 'vue';
import { CascadeFiltersHook } from '../composables/useCascadeFilters';

export interface UIFilter {
  component: ShallowRef<object> | string;
  options: any;
}

export interface Props {
  filters: UIFilter[];
  items: any[];
  filtersHook: CascadeFiltersHook;
}

export interface FilterProps {
  options: any;
  filtersHook: CascadeFiltersHook;
}

const props = defineProps<Props>();
const { items } = toRefs(props);
</script>

<template>
  <div class="filters-bar">
    <div v-for="filter in filters">
      <component
        :is="filter.component"
        :options="filter.options"
        :filters-hook="filtersHook"
      />
    </div>
  </div>
</template>

<style scoped>
.filters-bar {
  text-align: start;
}
</style>
