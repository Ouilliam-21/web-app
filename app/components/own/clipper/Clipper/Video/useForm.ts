import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, {
  type Region,
} from "wavesurfer.js/dist/plugins/regions.esm.js";

import { useClipperService } from "~/services/clipper";

export const useForm = () => {
  const { uploadAudio, doingUploadAudio, audioRequest } = useClipperService();

  const videoElement = useTemplateRef<HTMLVideoElement>("videoElement");
  const containerElement = useTemplateRef<HTMLElement>("containerElement");

  const directories = ref(["fr", "uk"]);
  const selectedDirectory = ref<string>("fr");

  const region = shallowRef<Maybe<RegionsPlugin>>(null);
  const activeRegion = ref<Maybe<Region>>(null);
  const wavesurfer = shallowRef<Maybe<WaveSurfer>>(null);

  const isOpen = ref(false);

  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const dataLength = buffer.length * blockAlign;
    const bufferLength = 44 + dataLength;

    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, "data");
    view.setUint32(40, dataLength, true);

    // Interleave channels and write audio data
    let offset = 44;
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < numChannels; channel++) {
        const sample = Math.max(
          -1,
          Math.min(1, buffer.getChannelData(channel)[i] ?? 0),
        );
        view.setInt16(
          offset,
          sample < 0 ? sample * 0x8000 : sample * 0x7fff,
          true,
        );
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  const clipAudio = async (directory: string) => {
    if (isAbsent(activeRegion.value) || isAbsent(toValue(videoElement))) return;

    const start = activeRegion.value.start;
    const end = activeRegion.value.end;
    const video = toValue(videoElement);

    if (isAbsent(video)) return;

    // Create an AudioContext to process the audio
    const audioContext = new AudioContext();

    // Fetch the video file and decode the audio
    const response = await fetch(video.src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Calculate sample positions
    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(start * sampleRate);
    const endSample = Math.floor(end * sampleRate);
    const duration = endSample - startSample;

    // Create a new buffer for the clipped audio
    const clippedBuffer = audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      duration,
      sampleRate,
    );

    // Copy the audio data for each channel
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const sourceData = audioBuffer.getChannelData(channel);
      const targetData = clippedBuffer.getChannelData(channel);
      for (let i = 0; i < duration; i++) {
        targetData[i] = sourceData[startSample + i] ?? 0;
      }
    }

    // Convert to WAV and download
    const wavBlob = audioBufferToWav(clippedBuffer);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const fileName = `clip_${timestamp}.wav`;

    const formData = new FormData();
    formData.append("directory", directory);
    formData.append("name", fileName);
    formData.append("wav", wavBlob, fileName);

    return formData;
  };

  const init = (container: HTMLElement, video: HTMLVideoElement) => {
    region.value = RegionsPlugin.create();

    wavesurfer.value = WaveSurfer.create({
      container: container,
      waveColor: "rgb(200, 0, 200)",
      progressColor: "rgb(100, 0, 100)",
      media: video,
      barWidth: 5,
      barHeight: 8,
      barGap: 1,
      barRadius: 8,
      minPxPerSec: 4,
      plugins: [region.value],
    });
  };

  onMounted(() => {
    const container = toValue(containerElement);
    const video = toValue(videoElement);

    if (isAbsent(container) || isAbsent(video)) return;
    init(container, video);
  });

  const onClickRegion = () => {
    if (isAbsent(region.value) || isAbsent(wavesurfer.value)) return;

    // Clear previous region
    onClickCancel();

    activeRegion.value = region.value.addRegion({
      start: wavesurfer.value.getCurrentTime(),
      end: wavesurfer.value.getCurrentTime() + 5,
      color: "rgba(0, 255, 0, 0.3)",
      drag: false,
      resize: true,
    });
  };

  const onUpdateZoom = (values: Maybe<number[]>) => {
    if (isAbsent(values)) return;
    const value = values.at(0);
    if (isAbsent(value) || isAbsent(wavesurfer.value)) return;
    wavesurfer.value.zoom(value);
  };

  const onUpdateBarSize = (values: Maybe<number[]>) => {
    if (isAbsent(values)) return;
    const value = values.at(0);
    if (isAbsent(value) || isAbsent(wavesurfer.value)) return;
    const options = wavesurfer.value.options;
    wavesurfer.value.setOptions({ ...options, barHeight: value });
  };

  const onForward = (time: number) => {
    if (isAbsent(wavesurfer.value)) return;
    wavesurfer.value.setTime(wavesurfer.value.getCurrentTime() + time);
  };

  const onBackward = (time: number) => {
    if (isAbsent(wavesurfer.value)) return;
    wavesurfer.value.setTime(wavesurfer.value.getCurrentTime() - time);
  };

  const onClickCancel = () => {
    if (isAbsent(activeRegion.value)) return;
    activeRegion.value.remove();
  };

  const onClickCreateAudio = async () => {
    isOpen.value = true;
    audioRequest.value = undefined;
    const formData = await clipAudio(selectedDirectory.value);
    if (isAbsent(formData)) return;
    const res = await doingUploadAudio(async () => await uploadAudio(formData));
    if (isAbsent(res)) return;
    audioRequest.value = { ...res, createdAt: new Date(res.createdAt) };
  };

  return {
    onForward,
    onBackward,
    wavesurfer,
    activeRegion,
    isOpen,
    directories,
    selectedDirectory,
    onClickRegion,
    onUpdateZoom,
    onClickCancel,
    onClickCreateAudio,
    onUpdateBarSize,
  };
};
