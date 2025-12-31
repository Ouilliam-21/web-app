<script setup lang="ts">
import { SkipBack, SkipForward } from "lucide-vue-next";
import { watch } from "vue";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { Video } from "~/types/clipper";
import { isAbsent } from "~~/shared/utils/optional";

import Dialog from "./Dialog.vue";
import { useForm } from "./useForm";

const { video } = defineProps<{ video: Video }>();

const {
  isOpen,
  onUpdateZoom,
  onUpdateBarSize,
  onClickCancel,
  onClickRegion,
  onClickCreateAudio,
  selectedDirectory,
  directories,
  activeRegion,
  wavesurfer,
  onForward,
  onBackward,
} = useForm();

watch(
  () => video.url,
  () => wavesurfer.value!.load(video.url)
);
</script>
<template>
  <div class="h-full grid grid-cols-2 grid-rows-[1fr_0.2fr]">
    <Dialog v-model:is-open="isOpen" />
    <div
      class="col-span-full flex flex-col items-start justify-center p-0 size-full"
    >
      <video
        playsinline
        class="w-full"
        ref="videoElement"
        :src="video.url"
        controls
      />

      <div ref="containerElement" class="w-full" />
    </div>
    <div class="col-span-full grid grid-cols-[1fr_0.5fr] gap-2">
      <div class="flex flex-col gap-2 justify-between">
        <div>
          <Label for="slider">Zoom</Label>
          <Slider
            class="cursor-pointer"
            id="slider"
            ref="sliderElement"
            :default-value="[50]"
            :max="100"
            :step="1"
            @update:model-value="onUpdateZoom"
          />
        </div>
        <div>
          <Label for="slider">BarSize</Label>
          <Slider
            class="cursor-pointer"
            id="bar-size"
            ref="barSizeElement"
            :default-value="[8]"
            :max="100"
            :step="1"
            @update:model-value="onUpdateBarSize"
          />
        </div>
        <div class="flex gap-2">
          <Button variant="outline" size="icon" @click="onBackward(5)">
            <SkipBack />
          </Button>
          <Button variant="outline" size="icon" @click="onForward(5)">
            <SkipForward />
          </Button>
        </div>
      </div>

      <div class="size-full flex flex-col gap-2 justify-center">
        <Button
          class="cursor-pointer"
          v-if="isAbsent(activeRegion?.element)"
          @click="onClickRegion"
          >Create Region</Button
        >
        <Button
          class="cursor-pointer"
          v-else
          @click="onClickCancel"
          variant="destructive"
          >Cancel</Button
        >
        <Select v-model="selectedDirectory">
          <SelectTrigger class="w-full cursor-pointer">
            <SelectValue placeholder="Select a directory" />
          </SelectTrigger>
          <SelectContent>
            <SelectViewport>
              <SelectItem
                :value="directory"
                v-for="(directory, index) in directories"
                :key="index"
              >
                <SelectItemText>{{ directory }}</SelectItemText>
              </SelectItem>
            </SelectViewport>
          </SelectContent>
        </Select>
        <Button @click="onClickCreateAudio" variant="secondary">
          Clip Audio
        </Button>
      </div>
    </div>
  </div>
</template>
