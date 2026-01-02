import { Howl } from "howler";

import type { ProcessingRiotEventJob } from "~~/shared/sse/inference/type";

export const useAudioQueue = () => {
  const audioQueue = ref<ProcessingRiotEventJob[]>([]);
  const currentAudio = ref<Maybe<HTMLAudioElement>>(undefined);
  const isPlaying = ref(false);
  const currentMessage = ref<Maybe<ProcessingRiotEventJob>>(undefined);
  const minDelayBetweenMessages = 2000;

  const addToQueue = (job: ProcessingRiotEventJob) => {
    audioQueue.value.push(job);
    processQueue();
  };

  const processQueue = async () => {
    if (audioQueue.value.length === 0) return;

    const nextMessage = audioQueue.value.shift();
    currentMessage.value = nextMessage;
    isPlaying.value = true;

    const sound = new Howl({
      src: [nextMessage?.audio_url],
      html5: true,
      onend: function () {
        setTimeout(() => {
          isPlaying.value = false;
          currentMessage.value = null;
          currentAudio.value = null;

          processQueue();
        }, minDelayBetweenMessages);
      },
    });

    try {
      await sound.play();
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
