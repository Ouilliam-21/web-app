<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import { Forward, Pause, Play, Rewind, Volume2, VolumeX } from "lucide-vue-next";

type Props = {
  src: string;
  duration?: number; // seconds, optional
  loop?: boolean;
  preload?: "none" | "metadata" | "auto";
  initialVolume?: number; // 0..1
};

const props = withDefaults(defineProps<Props>(), {
  duration: undefined,
  loop: false,
  preload: "metadata",
  initialVolume: 0.8,
});

const emit = defineEmits<{
  (e: "play"): void;
  (e: "pause"): void;
  (e: "ended"): void;
  (e: "error", error: unknown): void;
}>();

const audioEl = ref<HTMLAudioElement | null>(null);

const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref<number | undefined>(props.duration);

const volume = ref(props.initialVolume); // 0..1
const isMuted = ref(false);

const canSeek = computed(() => duration.value !== undefined && duration.value > 0);

const formatTime = (seconds?: number) => {
  if (seconds === undefined || !Number.isFinite(seconds)) return "--:--";
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
};


const syncFromAudio = () => {
  const el = audioEl.value;
  if (!el) return;

  currentTime.value = el.currentTime || 0;

  // Only trust duration once we actually know it
  if (
    (duration.value === undefined || duration.value === 0) &&
    Number.isFinite(el.duration) &&
    el.duration > 0
  ) {
    duration.value = el.duration;
  }
};

const tryPlay = async () => {
  const el = audioEl.value;
  if (!el) return;

  try {
    await el.play();
  } catch (err) {
    emit("error", err);
  }
};

const togglePlay = async () => {
  const el = audioEl.value;
  if (!el) return;

  if (el.paused) await tryPlay();
  else el.pause();
};

const seekTo = (timeSeconds: number) => {
  const el = audioEl.value;
  if (!el) return;

  const max = duration.value ?? timeSeconds;
  const target = Math.max(0, Math.min(timeSeconds, max));

  el.currentTime = target;
  currentTime.value = el.currentTime;
};

const onSeekInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const v = input.valueAsNumber;
  if (!Number.isFinite(v)) return;
  seekTo(v);
};

const onLoadedMetadata = () => {
  const el = audioEl.value;
  if (!el) return;
  duration.value =
    props.duration ?? (Number.isFinite(el.duration) ? el.duration : undefined);
  syncFromAudio();
};

const onTimeUpdate = () => syncFromAudio();
const onPlay = () => {
  isPlaying.value = true;
  emit("play");
};
const onPause = () => {
  isPlaying.value = false;
  emit("pause");
};
const onEnded = () => {
  isPlaying.value = false;
  emit("ended");
};

watch(
  () => props.src,
  () => {
    // Reset state when switching audio sources
    isPlaying.value = false;
    currentTime.value = 0;
    duration.value = props.duration;

    const el = audioEl.value;
    if (el) el.load();
  }
);

onMounted(() => {
  syncFromAudio();
});
</script>

<template>
  <div class="w-full space-y-3">
    <div class="flex items-center gap-3">

      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          @click="seekTo(currentTime - 10)"
          :disabled="currentTime <= 0"
        >
          <Rewind class="size-4" />
        </Button>

        <Button variant="default" size="icon" @click="togglePlay">
          <Pause v-if="isPlaying" class="size-4" />
          <Play v-else class="size-4" />
        </Button>
      </div>

    <div class="space-y-2 w-full">
      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>

      <input
        type="range"
        class="w-full"
        min="0"
        :max="duration ?? 0"
        step="0.01"
        :value="currentTime"
        @input="onSeekInput"
        :disabled="!canSeek"
      />
    </div>
    </div>


    <audio
      ref="audioEl"
      :src="src"
      :loop="loop"
      :preload="preload"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"
      @error="(e) => emit('error', e)"
    />
  </div>
</template>