<script setup lang="ts">
import {
  ref,
  toRefs,
  toRaw,
  watch,
  onMounted,
  onUnmounted,
  computed,
} from 'vue';
import { FilterProps } from '../FiltersBar.vue';
import uniqueId from 'lodash-es/uniqueId';
import { User, SUBSCRIPTION_STATUS_FILTER } from '../../types';
import { Filter } from '../../composables/useCascadeFilters';

const props = defineProps<FilterProps>();
const { options, filtersHook } = toRefs(props);

const filter = ref<Filter>();

onMounted(() => {
  filter.value = filtersHook.value.addFilter(
    SUBSCRIPTION_STATUS_FILTER,
    filterItems,
    filterOptions,
    options
  );
});

onUnmounted(() => {
  filtersHook.value.removeFilter(SUBSCRIPTION_STATUS_FILTER);
});

function filterOptions(allOptions: any, items: any[]): any {
  console.log('SubscriptionStatus: filterOptions');
  const filteredOptions = allOptions.filter((option) =>
    items.some((item) => item.subscription.status === option)
  );
  if (filter.value.selectedOptions.some((v) => !filteredOptions.includes(v))) {
    filter.value.selectedOptions = filter.value.selectedOptions.filter((v) =>
      filteredOptions.includes(v)
    );
  }
  return filteredOptions;
}

function filterItems(items: any[], selectedOptions: any): any[] {
  console.log('SubscriptionStatus: filterItems');
  if (selectedOptions.length === 0) {
    return items;
  }
  // const effectiveOptions = filter.value.selectedOptions.filter((v) =>
  //   filter.value.availableOptions.includes(v)
  // );

  const filteredItems = items.filter((item) =>
    selectedOptions.includes(item.subscription.status)
  );
  return filteredItems;
}

const optionModels = computed(() => {
  if (!filter.value) {
    return [];
  }
  return filter.value.availableOptions.map((o) => ({
    id: uniqueId('opt-substatus-'),
    value: o,
    displayText: o,
    disabled: false,
  }));
});
</script>

<template>
  <section class="substatus-filter">
    <header class="substatus-filter__title">Subscription status</header>
    <ul class="substatus-list">
      <li
        v-for="option in optionModels"
        class="substatus-list__item"
        :class="{ 'substatus-list__item_disabled': option.disabled }"
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
.substatus-filter {
}

.substatus-filter__title {
  font-weight: 600;
}

.substatus-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.substatus-list__item {
  user-select: none;

  * {
    cursor: pointer;
  }

  &.substatus-list__item_disabled {
    * {
      cursor: default;
    }
    color: #d1d1d1;
  }
}
</style>
