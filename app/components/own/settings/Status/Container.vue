<script lang="ts" setup>
  import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
  } from "@/components/ui/card";
  import { useFetch } from "#app";

  import Database from "./Database.vue";
  import GPU from "./GPU/Container.vue";
  import Space from "./Space.vue";
  import Webapp from "./Webapp.vue";
  
  const { data: webapp, error: webappError, status: webappStatus } = useFetch("/api/digitalocean/webapp");
  const { data: database, error: databaseError, status: databaseStatus } = useFetch("/api/digitalocean/database");
  const { data: space, error: spaceError, status: spaceStatus } = useFetch("/api/digitalocean/space");
  const { data: gpu, error: gpuError, status: gpuStatus } = useFetch("/api/digitalocean/gpu");
  </script>
  <template>
    <Card>
      <CardHeader>
        <CardTitle>Service Status</CardTitle>
        <CardDescription>Manage and monitor application services</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <Database :response="database" :fetchError="databaseError" :status="databaseStatus" />
          <Webapp :response="webapp" :fetchError="webappError" :status="webappStatus" />
          <Space :response="space" :fetchError="spaceError" :status="spaceStatus" />
          <GPU :response="gpu" :fetchError="gpuError" :status="gpuStatus" />
        </div>
      </CardContent>
    </Card>
  </template>