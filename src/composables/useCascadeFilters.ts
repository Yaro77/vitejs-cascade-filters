import { MaybeRefOrGetter } from '@vue/reactivity';
import {
  ComputedRef,
  toValue,
  computed,
  ref,
  Ref,
  reactive,
  shallowRef,
  shallowReactive,
  watch,
} from 'vue';

export type FilterOptionsCallback = (allOptions: any, items: any[]) => any;

export type FilterItemsCallback = (items: any[], selectedOptions: any) => any[];

export interface CascadeFiltersHook {
  filteredItems: ComputedRef<any[]>;
  addFilter: (
    type: symbol,
    filterItems: FilterItemsCallback,
    filterOptions: FilterOptionsCallback,
    allOptions: MaybeRefOrGetter<any>,
    selectedOptions: MaybeRefOrGetter<any>
  ) => Filter;
  removeFilter: (type: symbol) => void;
}

export interface FilterData {
  type: symbol;
  allOptions: any;
  availableOptions: any;
  selectedOptions: any;
  items: any[];
}

export interface Filter {
  type: symbol;
  filterOptions: FilterOptionsCallback;
  filterItems: FilterItemsCallback;
  allOptions: any;
  availableOptions: any;
  selectedOptions: any;
  items: any;
  filteredItems: any;
}

export function useCascadeFilters(items: MaybeRefOrGetter) {
  const filters = ref([] as any[]);

  const filteredItems = computed(() => {
    if (filters.value.length > 0) {
      return toValue(filters.value[filters.value.length - 1].filteredItems);
    } else {
      return toValue(items);
    }
  });

  function addFilter(
    type: symbol,
    filterItems: FilterItemsCallback,
    filterOptions: FilterOptionsCallback,
    allOptions: MaybeRefOrGetter<any>,
    selectedOptions: MaybeRefOrGetter<any>
  ) {
    const filter = reactive({
      type: type,
      filterItems: filterItems,
      filterOptions: filterOptions,
      allOptions: toValue(allOptions),
      availableOptions: null,
      selectedOptions: toValue(selectedOptions) ?? [],
      filteredItems: null,
      items: null,
    });

    filter.availableOptions = computed(() => {
      // console.log('filter.availalbleOptions computed', filter.type);
      return filterOptions(filter.allOptions, toValue(filter.items) as any);
    }) as any;

    const lastFilter = filters.value[filters.value.length - 1];
    if (lastFilter) {
      filter.items = computed(() => {
        // console.log(
        //   'filter.items computed (for lastFilter)',
        //   filter.type,
        //   lastFilter.type
        // );
        return toValue(lastFilter.filteredItems);
      }) as any;
    } else {
      filter.items = computed(() => {
        // console.log('filter.items computed', filter.type);
        return items;
      }) as any;
    }

    filter.filteredItems = computed(() => {
      return filterItems(toValue(filter.items) as any, filter.selectedOptions);
    }) as any;

    filters.value.push(filter);

    console.log(
      'addFilter:',
      filters.value.map((f) => f.type)
    );
    return filter;
  }

  function removeFilter(type: symbol) {
    const index = filters.value.findIndex((filter) => filter.type === type);
    if (index < 0) {
      return;
    }
    filters.value[index].selectedOptions.value = null; // idk
    const removedFilter = filters.value.splice(index, 1)[0]!;
    console.log(
      'removeFilter:',
      filters.value.map((f) => f.type)
    );
  }

  return {
    filteredItems,
    addFilter,
    removeFilter,
  } as CascadeFiltersHook;
}
