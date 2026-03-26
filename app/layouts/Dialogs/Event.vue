<script lang="ts" setup>
  import {computed} from "vue"

  import { Badge } from "@/components/ui/badge";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  import { useDialogService } from "~/services/dialogs";
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    return `${seconds.toFixed(2)}s`;
  };
  
  const service = useDialogService()
  
  const isOpen = computed(()=> service.eventDialog.value.status === 'open')
  
  const event = computed(()=> {
    if (service.eventDialog.value.status === 'close') return undefined
    return service.eventDialog.value.event
  })

  const onOpenChange = (open: boolean) => {
    if (!open) service.closeEventDialog()
  }
  </script>
  
  <template>
    <Dialog :open="isOpen" v-if="isPresent(event)" @update:open="onOpenChange">
      <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Event Job Details</DialogTitle>
          <DialogDescription>
            Complete information about the job event
          </DialogDescription>
        </DialogHeader>
  
        <div class="space-y-6">
          <!-- Basic Information -->
          <div class="space-y-3">
            <h3 class="text-sm font-semibold">Basic Information</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-muted-foreground">ID:</span>
                <p class="font-mono text-xs break-all">{{ event.id }}</p>
              </div>
              <div>
                <span class="text-muted-foreground">Riot Event ID:</span>
                <p class="font-mono text-xs break-all">
                  {{ event.riot_event_id }}
                </p>
              </div>
              <div>
                <span class="text-muted-foreground">Status:</span>
                <div class="mt-1">
                  <Badge
                    :variant="
                      event.status === 'COMPLETED'
                        ? 'default'
                        : event.status === 'FAILED'
                        ? 'destructive'
                        : 'secondary'
                    "
                  >
                    {{ event.status }}
                  </Badge>
                </div>
              </div>
              <div>
                <span class="text-muted-foreground">Created At:</span>
                <p>{{ formatDate(event.created_at) }}</p>
              </div>
              <div v-if="event.updated_at">
                <span class="text-muted-foreground">Updated At:</span>
                <p>{{ formatDate(event.updated_at) }}</p>
              </div>
            </div>
          </div>
  
          <!-- Input Text -->
          <div class="space-y-2">
            <h3 class="text-sm font-semibold">Input Text</h3>
            <div class="p-3 bg-muted rounded-md">
              <p class="text-sm whitespace-pre-wrap break-words">
                {{ event.input_text }}
              </p>
            </div>
          </div>
  
          <!-- Tabs for LLM, TTS, and Error -->
          <Tabs default-value="llm" class="w-full">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="llm">LLM</TabsTrigger>
              <TabsTrigger value="tts">TTS</TabsTrigger>
              <TabsTrigger value="error" :disabled="!event.error_message">
                Error
              </TabsTrigger>
            </TabsList>
  
            <!-- LLM Tab -->
            <TabsContent value="llm" class="space-y-3 mt-4 h-[200px] overflow-y-auto">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-muted-foreground">Model Name:</span>
                  <p>{{ event.llm_model_name || "N/A" }}</p>
                </div>
                <div>
                  <span class="text-muted-foreground">Started At:</span>
                  <p>{{ formatDate(event.llm_started_at) }}</p>
                </div>
                <div>
                  <span class="text-muted-foreground">Completed At:</span>
                  <p>{{ formatDate(event.llm_completed_at) }}</p>
                </div>
              </div>
              <div v-if="event.llm_text" class="space-y-2">
                <span class="text-sm text-muted-foreground">LLM Output:</span>
                <div class="p-3 bg-muted rounded-md">
                  <p class="text-sm whitespace-pre-wrap break-words">
                    {{ event.llm_text }}
                  </p>
                </div>
              </div>
              <div v-else class="text-sm text-muted-foreground">
                No LLM output available
              </div>
            </TabsContent>
  
            <!-- TTS Tab -->
            <TabsContent value="tts" class="space-y-3 mt-4 h-[200px] overflow-y-auto">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-muted-foreground">Model Name:</span>
                  <p>{{ event.tts_model_name || "N/A" }}</p>
                </div>
                <div>
                  <span class="text-muted-foreground">Started At:</span>
                  <p>{{ formatDate(event.tts_started_at) }}</p>
                </div>
                <div>
                  <span class="text-muted-foreground">Completed At:</span>
                  <p>{{ formatDate(event.tts_completed_at) }}</p>
                </div>
                <div>
                  <span class="text-muted-foreground">Audio Duration:</span>
                  <p>{{ formatDuration(event.audio_duration) }}</p>
                </div>
              </div>
              <div v-if="event.audio_url" class="space-y-2">
                <span class="text-sm text-muted-foreground">Audio:</span>
                <div class="w-full">
                  <audio controls class="w-full">
                    <source :src="event.audio_url" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
              <div v-else class="text-sm text-muted-foreground">
                No audio available
              </div>
            </TabsContent>
  
            <!-- Error Tab -->
            <TabsContent value="error" class="space-y-3 mt-4 h-[200px] overflow-y-auto">
              <div v-if="event.error_message" class="space-y-2">
                <h3 class="text-sm font-semibold text-destructive">Error Message</h3>
                <div
                  class="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                >
                  <p class="text-sm text-destructive whitespace-pre-wrap break-words">
                    {{ event.error_message }}
                  </p>
                </div>
              </div>
              <div v-else class="text-sm text-muted-foreground">
                No errors occurred
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  </template>