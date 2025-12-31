import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export const useAudioQueue = (
  onRemove: (evt: ProcessingRiotEventJob) => void
) => {
  const audioQueue = ref<ProcessingRiotEventJob[]>([]);
  const currentAudio = ref<HTMLAudioElement | null>(null);
  const isPlaying = ref(false);
  const currentMessage = ref<Maybe<ProcessingRiotEventJob>>(undefined);
  const minDelayBetweenMessages = 2000; // 2 secondes

  const addToQueue = (job: ProcessingRiotEventJob) => {
    audioQueue.value.push(job);
    processQueue();
  };

  const processQueue = async () => {
    if (audioQueue.value.length === 0) return;

    const nextMessage = audioQueue.value.shift();
    onRemove(nextMessage!);

    currentMessage.value = nextMessage;
    isPlaying.value = true;

    const audio = new Audio(nextMessage!.audio_url!);
    currentAudio.value = audio;

    audio.onended = () => {
      // Attendre minimum 2 secondes avant le prochain message
      setTimeout(() => {
        isPlaying.value = false;
        currentMessage.value = null;
        currentAudio.value = null;

        processQueue();
      }, minDelayBetweenMessages);
    };

    audio.onerror = (error) => {
      console.error("Error playing audio:", error);
      isPlaying.value = false;
      currentMessage.value = null;
      currentAudio.value = null;
      processQueue();
    };

    try {
      await audio.play();
    } catch (error) {
      console.error("Error starting audio playback:", error);
      isPlaying.value = false;
      currentMessage.value = null;
      currentAudio.value = null;
      processQueue();
    }
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
