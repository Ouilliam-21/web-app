import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export const useAudioQueue = () => {
  const audioQueue = ref<ProcessingRiotEventJob[]>([]);
  const currentAudio = ref<Maybe<HTMLAudioElement>>(undefined);
  const isPlaying = ref(false);
  const currentMessage = ref<Maybe<ProcessingRiotEventJob>>(undefined);

  const addToQueue = (job: ProcessingRiotEventJob) => {
    audioQueue.value.push(job);
    processQueue();
  };

  const processQueue = async () => {
    if (audioQueue.value.length === 0 || isPlaying.value) return;

    const nextMessage = audioQueue.value.shift();
    currentMessage.value = nextMessage;
    isPlaying.value = true;
  };

  const stop = () => {
    if (currentAudio.value) {
      currentAudio.value.pause();
      currentAudio.value = null;
    }
    audioQueue.value = [];
    isPlaying.value = false;
    currentMessage.value = null;
  };

  return {
    audioQueue,
    isPlaying,
    currentMessage,
    addToQueue,
    stop,
  };
};
