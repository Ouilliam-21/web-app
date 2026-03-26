<script setup lang="ts">
import { Mouse, MouseOff, VolumeOff, Volume2 } from "lucide-vue-next";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const autoScroll = defineModel<boolean>("autoScroll", { required: true });

const autoPlayAudio = defineModel<boolean>("autoPlayAudio", { required: true });

const toggleAutoScroll = () => {
  autoScroll.value = !autoScroll.value;
};

const toggleAutoPlayAudio = () => {
  autoPlayAudio.value = !autoPlayAudio.value;
};
</script>

<template>
  <div class="flex items-center gap-2">
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon" @click="toggleAutoPlayAudio">
            <VolumeOff v-if="!autoPlayAudio" />
            <Volume2 v-else />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {{
              autoPlayAudio
                ? "Disable auto play audio"
                : "Enable auto play audio"
            }}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button variant="outline" size="icon" @click="toggleAutoScroll">
            <MouseOff v-if="!autoScroll" />
            <Mouse v-else />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{{ autoScroll ? "Disable auto scroll" : "Enable auto scroll" }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
