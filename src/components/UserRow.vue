<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { User } from '../types';
import { getAge } from '../helpers/date';

export interface Props {
  user: User;
}

const props = defineProps<Props>();
const { user } = toRefs(props);

const now = new Date();

const age = computed(() => getAge(new Date(user.value.date_of_birth), now));
</script>

<template>
  <tr>
    <td>{{ user.username }}</td>
    <td>{{ age }}</td>
    <td>{{ user.gender }}</td>
    <td>{{ user.subscription.status }}</td>
    <td>{{ user.subscription.plan }}</td>
  </tr>
</template>

<style scoped lang="scss"></style>
