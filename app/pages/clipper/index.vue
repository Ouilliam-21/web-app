<script setup lang="ts">
import { CircleX, Film, Folder } from "lucide-vue-next";

import { useAsyncData } from "#app";
import { Clipper, Tree } from "~/components/own/clipper";
import { useClipperService } from "~/services/clipper";

const {
  selection,
  videos,
  audios,
  fetchAudios,
  fetchVideos,
  deleteAudio,
  deleteAudioDirectory,
} = useClipperService();

useAsyncData("video", () => fetchVideos());
useAsyncData("audios", () => fetchAudios());

</script>
<template>
  <div class="h-screen grid grid-cols-6 grid-rows-6 gap-6 p-6">
    <Tree
      class="col-span-1 row-span-full col-start-0 min-h-0"
      title="Episode"
      description="List of downloaded video"
      :parents="videos"
      :has-delete="false"
      :is-selected="(video) => video === selection"
      @on-select="(video) => (selection = video)"
    >
      <template #header="{ parent }">
        <span class="flex gap-2 items-center">
          <Folder :size="20" />
          /{{ parent }}
        </span>
      </template>
      <template #icon>
        <Film :size="15" class="shrink-0" />
      </template>
      <template #label="{ child }">
        <span class="truncate cursor-pointer">
          {{ child.name }}
        </span>
      </template>
      <template #tooltip="{ child }">
        {{ child.name }}
      </template>
    </Tree>
    <Clipper
      class="col-span-4 row-span-6 size-full"
      :active-selection="selection"
    />
    <Tree
      class="col-span-1 row-span-full col-start-6 min-h-0"
      title="Clips"
      description="List of clips"
      :parents="audios"
      :has-delete="true"
      :is-selected="(audio) => audio === selection"
      @on-select="(audio) => (selection = audio)"
      @on-delete="(audio) => deleteAudio(audio.id)"
    >
      <template #header="{ parent }">
        <span class="flex gap-2 items-center">
          <Folder :size="20" />
          /{{ parent }}
          <CircleX
            :size="15"
            color="red"
            class="cursor-pointer"
            @click="deleteAudioDirectory(parent)"
          />
        </span>
      </template>
      <template #icon>
        <Film :size="15" class="shrink-0" />
      </template>
      <template #label="{ child }">
        <span class="truncate cursor-pointer">
          {{ child.filename }}
        </span>
      </template>
      <template #tooltip="{ child }">
        {{ child.filename }}
      </template>
    </Tree>
  </div>
</template>
