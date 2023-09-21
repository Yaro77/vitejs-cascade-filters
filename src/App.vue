<script setup lang="ts">
import { ref, watch, shallowRef, toRaw, toRefs, markRaw } from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import FiltersBar, { UIFilter } from './components/FiltersBar.vue';
import UserRow from './components/UserRow.vue';
import * as Filters from './components/filters';
import users from './assets/users.json';
import uniq from 'lodash-es/uniq';
import { getAge } from './helpers/date';
import { useCascadeFilters } from './composables/useCascadeFilters';
import {
  GENDER_FILTER,
  SUBSCRIPTION_STATUS_FILTER,
  SUBSCRIPTION_PLAN_FILTER,
} from './types';

const genders = uniq(users.map((u) => u.gender));
const subscriptionStatuses = uniq(users.map((u) => u.subscription.status));
const subscriptionPlans = uniq(users.map((u) => u.subscription.plan));
const now = new Date();
const ages = uniq(users.map((u) => getAge(new Date(u.date_of_birth), now)));
ages.sort();

const filters = ref([
  {
    type: GENDER_FILTER,
    component: markRaw(Filters.GenderFilter),
    options: genders,
  },
  {
    type: SUBSCRIPTION_STATUS_FILTER,
    component: markRaw(Filters.SubscriptionStatusFilter),
    options: subscriptionStatuses,
  },
  {
    type: SUBSCRIPTION_PLAN_FILTER,
    component: markRaw(Filters.SubscriptionPlanFilter),
    options: subscriptionPlans,
  },
  // {
  //   component: markRaw(Filters.AgeFilter),
  //   options: ages,
  // },
] as UIFilter[]);

function toggleGender() {
  const index = filters.value.findIndex(
    (filter) => filter.type === GENDER_FILTER
  );
  if (index < 0) {
    filters.value.unshift({
      type: GENDER_FILTER,
      component: markRaw(Filters.GenderFilter),
      options: genders,
    });
  } else {
    filters.value.splice(index, 1);
  }
}

const filtersHook = useCascadeFilters(
  users.filter((user) => user.gender !== 'Agender')
);
const { filteredItems } = filtersHook;
</script>

<template>
  <div hidden class="logo-container">
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <div>
    <button @click="toggleGender">Toggle gender</button>
  </div>
  <div class="page-layout">
    <FiltersBar :filters-hook="filtersHook" :items="users" :filters="filters" />
    <table class="users-table">
      <thead>
        <tr>
          <th colspan="3">Person</th>
          <th colspan="2">Subscription</th>
        </tr>
        <tr>
          <th>Username</th>
          <th>Age</th>
          <th>Gender</th>
          <th>Status</th>
          <th>Plan</th>
        </tr>
      </thead>
      <tbody>
        <UserRow v-for="user in filteredItems" :user="user" />
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.logo-container {
  text-align: center;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.page-layout {
  display: flex;
  flex-flow: row nowrap;
  align-items: start;
  gap: 16px;

  > :nth-child(1) {
    flex: 0 0 auto;
    width: 160px;
  }

  > :nth-child(2) {
    flex: 1;
  }
}

.users-table {
  border-spacing: 1px;
  > thead {
    background-color: #404040;
    color: #fff;
  }

  th {
    font-weight: 400;
    text-align: start;
  }
}
</style>
