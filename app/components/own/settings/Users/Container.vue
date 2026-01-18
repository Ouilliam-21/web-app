<script lang="ts" setup>
  import {computed} from "vue"

  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import { Badge } from "@/components/ui/badge";
  import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
  } from "@/components/ui/card";
  import { ScrollArea } from "@/components/ui/scroll-area";
  import { useFetch } from "#imports";
  import { UserRole } from "~~/shared/db/user";
  
  const { data: users, error: fetchError, pending } = useFetch("/api/user");
  
  const hasError = computed(() => {
    return !!fetchError.value || (users.value && users.value.type === 'error');
  });
  
  const errorMessage = computed(() => {
    if (fetchError.value) {
      return 'Failed to load users. Please try again later.';
    }
    if (users.value && users.value.type === 'error') {
      return users.value.detail || 'An error occurred while fetching users.';
    }
    return null;
  });
  </script>
  
  <template>
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>View all users register to the website</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="pending" class="flex items-center justify-center p-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
  
        <Alert v-else-if="hasError" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>
  
        <ScrollArea v-else-if="users && users.type === 'success'" class="h-[350px]">
          <div class="space-y-3 pr-4">
            <div
              v-for="user in users.data"
              :key="user.discordId"
              class="flex items-center justify-between p-3 rounded-lg border"
            >
              <div class="flex items-center gap-3">
                <div
                  class="h-3 w-3 rounded-full animate-pulse"
                  :class="
                    new Date().getTime() < user.expireAt
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  "
                />
                <div class="flex flex-col">
                  <span class="font-medium">{{ user.name }}</span>
                </div>
              </div>
              <Badge
                :variant="user.role === UserRole.ADMIN ? 'default' : 'secondary'"
              >
                {{ user.role }}
              </Badge>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  </template>