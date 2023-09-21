<script setup lang="ts">
import {
  ref,
  toRefs,
  toRaw,
  watch,
  onMounted,
  onUnmounted,
  computed,
  toValue,
} from 'vue';
import { FilterProps } from '../FiltersBar.vue';
import uniqueId from 'lodash-es/uniqueId';
import uniq from 'lodash-es/uniq';
import { User, GENDER_FILTER } from '../../types';
import { Filter } from '../../composables/useCascadeFilters';

const props = defineProps<FilterProps>();
const { options, filtersHook } = toRefs(props);

const filter = ref<Filter>();

onMounted(() => {
  filter.value = filtersHook.value.addFilter(
    GENDER_FILTER,
    filterItems,
    filterOptions,
    options
  );
});

onUnmounted(() => {
  filtersHook.value.removeFilter(GENDER_FILTER);
});

function filterOptions(allOptions: any, items: any[]): any {
  console.log('Gender: filterOptions');
  const filteredOptions = allOptions.filter((option) =>
    items.some((item) => item.gender === option)
  );
  if (filter.value.selectedOptions.some((v) => !filteredOptions.includes(v))) {
    filter.value.selectedOptions = filter.value.selectedOptions.filter((v) =>
      filteredOptions.includes(v)
    );
  }
  return filteredOptions;
}

function filterItems(items: any[], selectedOptions: any): any[] {
  console.log('Gender: filterItems');
  if (selectedOptions.length === 0) {
    return items;
  }
  // const effectiveOptions = selectedOptions.filter((v) =>
  //   filter.value.availableOptions.includes(v)
  // );
  const filteredItems = items.filter((item) =>
    selectedOptions.includes(item.gender)
  );
  return filteredItems;
}

const optionModels = computed(() => {
  if (!filter.value) {
    return [];
  }
  return filter.value!.availableOptions.map((o) => ({
    id: uniqueId('o_gender_'),
    value: o,
    displayText: o,
    disabled: false,
  }));
});
</script>

<template>
  <section class="gender-filter">
    <header class="gender-filter__title">Gender</header>
    <ul class="genders-list">
      <li
        v-for="option in optionModels"
        class="gender-list__item"
        :class="{ 'gender-list__item_disabled': option.disabled }"
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
.gender-filter {
}

.gender-filter__title {
  font-weight: 600;
}

.genders-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.gender-list__item {
  user-select: none;

  * {
    cursor: pointer;
  }

  &.gender-list__item_disabled {
    * {
      cursor: default;
    }
    color: #d1d1d1;
  }
}
</style>
