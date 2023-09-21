<script setup lang="ts">
import { ref, toRefs, toRaw, computed, onMounted } from 'vue';
import { FilterProps } from '../FiltersBar.vue';
import uniqueId from 'lodash-es/uniqueId';

const props = defineProps<FilterProps>();
const { options } = toRefs(props);

const optionModels = ref([]);
const minValue = ref('');
const maxValue = ref('');

const min = computed(() => options.value[0]);

const max = computed(() => options.value[options.value.length - 1]);

const range = computed(
  () => `${minValue.value || min.value} – ${maxValue.value || max.value}`
);
</script>

<template>
  <section class="age-filter">
    <header class="age-filter__title">Age</header>
    <div>
      <div class="age-fork-input">
        <input type="text" v-model="minValue" :placeholder="min" />
        <span>&ndash;</span>
        <input type="text" v-model="maxValue" :placeholder="max" />
      </div>
      <div>{{ range }}</div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.age-filter {
}

.age-filter__title {
  font-weight: 600;
}

.genders-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.age-list__item {
  user-select: none;

  * {
    cursor: pointer;
  }

  &.age-list__item_disabled {
    * {
      cursor: default;
    }
    color: #d1d1d1;
  }
}

.age-fork-input {
  display: flex;
  flex-flow: row nowrap;

  > :nth-child(1),
  > :nth-child(3) {
    flex: 1 1 0;
    min-width: 1px;
  }

  > :nth-child(2) {
    padding-inline: 0.5rem;
  }
}
</style>
