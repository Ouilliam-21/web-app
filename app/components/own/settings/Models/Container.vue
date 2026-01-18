<script setup lang="ts">
  import {Ellipsis} from "lucide-vue-next"

  import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Spinner } from '@/components/ui/spinner'

  import { useForm } from "./useForm";
  
  const { title, description, endpointActive, endpointList, endpointSet, placeholder } = defineProps<{
    title: string;
    description: string;
    endpointList: string;
    endpointActive: string;
    endpointSet?: string
    placeholder: string
  }>();
  
  const { active, items, isPending, hasError, errorMessage } = useForm({
    endpointActive, endpointList, endpointSet
  })
  </script>
  
  <template>
    <Card>
      <CardHeader>
        <CardTitle>{{ title }}</CardTitle>
        <CardDescription> {{ description }} </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert v-if="hasError" variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{{ errorMessage }}</AlertDescription>
        </Alert>
  
        <div v-else-if="isPending" class="flex items-center justify-center p-4">
          <Spinner class="mr-2" />
          <span class="text-sm text-muted-foreground">Loading models...</span>
        </div>
  
        <Select v-else v-model="active" :disabled="isPending">
          <SelectTrigger class="w-full">
            <SelectValue :placeholder="placeholder" />
            <template #icon>
              <Spinner v-if="isPending"/>
              <Ellipsis v-else/>
            </template>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="item in items"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </SelectItem>
          </SelectContent>
        </Select> 
      </CardContent>
    </Card>
  </template>