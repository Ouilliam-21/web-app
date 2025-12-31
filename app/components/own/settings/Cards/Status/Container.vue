<script lang="ts" setup>
import { useFetch } from "#app";

import Card from "../Card.vue";
import Database from "./Database.vue";
import Space from "./Space.vue";
import Webapp from "./Webapp.vue";

const { data: webapp } = useFetch("/api/digitalocean/webapp");
const { data: database } = useFetch("/api/digitalocean/database");
const { data: space } = useFetch("/api/digitalocean/space");
</script>
<template>
  <Card
    title="Service Status"
    description="Manage and monitor application services"
  >
    <div class="space-y-4">
      <Database v-if="database?.type === 'success'" :database="database.data" />
      <Webapp v-if="webapp?.type === 'success'" :webapp="webapp.data" />
      <Space v-if="space?.type === 'success'" :space="space.data" />
    </div>
  </Card>
</template>
