<script setup lang="ts">
import {
  ref,
  toRefs,
  toRaw,
  watch,
  onUnmounted,
  onMounted,
  computed,
} from 'vue';
import { FilterProps } from '../FiltersBar.vue';
import uniqueId from 'lodash-es/uniqueId';
import { User, SUBSCRIPTION_PLAN_FILTER } from '../../types';
import { Filter } from '../../composables/useCascadeFilters';

const props = defineProps<FilterProps>();
const { options, filtersHook } = toRefs(props);

const filter = ref<Filter>();

onMounted(() => {
  filter.value = filtersHook.value.addFilter(
    SUBSCRIPTION_PLAN_FILTER,
    filterItems,
    filterOptions,
    options
  );
});

onUnmounted(() => {
  filtersHook.value.removeFilter(SUBSCRIPTION_PLAN_FILTER);
});

function filterOptions(allOptions: any, items: any[]): any {
  console.log('SubscriptionPlan: filterOptions');
  const filteredOptions = allOptions.filter((option) =>
    items.some((item) => item.subscription.plan === option)
  );
  if (filter.value.selectedOptions.some((v) => !filteredOptions.includes(v))) {
    filter.value.selectedOptions = filter.value.selectedOptions.filter((v) =>
      filteredOptions.includes(v)
    );
  }
  return filteredOptions;
}

function filterItems(items: any[], selectedOptions: any): any[] {
  console.log('SubscriptionPlan: filterItems');
  if (selectedOptions.length === 0) {
    return items;
  }
  // const effectiveOptions = selectedOptions.filter((v) =>
  //   filter.value.availableOptions.includes(v)
  // );
  const filteredItems = items.filter((item) =>
    selectedOptions.includes(item.subscription.plan)
  );
  return filteredItems;
}

const optionModels = computed(() => {
  if (!filter.value) {
    return [];
  }
  return filter.value.availableOptions.map((o) => ({
    id: uniqueId('opt-subplan-'),
    value: o,
    displayText: o,
    disabled: false,
  }));
});
</script>

<template>
  <section class="subplan-filter">
    <header class="subplan-filter__title">Subscription Plan</header>
    <ul class="subplan-list">
      <li
        v-for="option in optionModels"
        class="subplan-list__item"
        :class="{ 'subplan-list__item_disabled': option.disabled }"
      >
        <input
          type="checkbox"
          :id="option.id"
          :value="option.value"
          v-model="filter.selectedOptions"
          name="gender"
          :disabled="option.disabled"
        />
        <label :for="option.id">{{ option.displayText }}</label>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.subplan-filter {
}

.subplan-filter__title {
  font-weight: 600;
}

.subplan-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.subplan-list__item {
  user-select: none;

  * {
    cursor: pointer;
  }

  &.subplan-list__item_disabled {
    * {
      cursor: default;
    }
    color: #d1d1d1;
  }
}
</style>
