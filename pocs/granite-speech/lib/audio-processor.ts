/**
 * Audio processing utilities for voice input
 */

import { AUDIO_CONFIG } from './constants';

/**
 * Request microphone permission and get MediaStream
 */
export async function getMicrophoneStream(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: AUDIO_CONFIG.channels,
        sampleRate: AUDIO_CONFIG.sampleRate,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    return stream;
  } catch (error) {
    console.error('Failed to get microphone access:', error);
    throw new Error('Microphone access denied or unavailable');
  }
}

/**
 * Create audio recorder from stream
 */
export function createRecorder(stream: MediaStream): MediaRecorder {
  const mimeType = MediaRecorder.isTypeSupported(AUDIO_CONFIG.mimeType)
    ? AUDIO_CONFIG.mimeType
    : 'audio/webm';

  const recorder = new MediaRecorder(stream, {
    mimeType,
    audioBitsPerSecond: 128000,
  });

  return recorder;
}

/**
 * Convert audio blob to array buffer
 */
export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return await blob.arrayBuffer();
}

/**
 * Resample audio to target sample rate using Web Audio API
 */
export async function resampleAudio(
  audioBuffer: AudioBuffer,
  targetSampleRate: number = AUDIO_CONFIG.sampleRate
): Promise<AudioBuffer> {
  const audioContext = new AudioContext({ sampleRate: targetSampleRate });
  
  // Create offline context for resampling
  const offlineContext = new OfflineAudioContext(
    AUDIO_CONFIG.channels,
    Math.ceil(audioBuffer.duration * targetSampleRate),
    targetSampleRate
  );

  // Create buffer source
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start();

  // Render and return resampled buffer
  const resampledBuffer = await offlineContext.startRendering();
  audioContext.close();
  
  return resampledBuffer;
}

/**
 * Convert AudioBuffer to Float32Array (mono)
 */
export function audioBufferToFloat32(audioBuffer: AudioBuffer): Float32Array {
  if (audioBuffer.numberOfChannels === 1) {
    return audioBuffer.getChannelData(0);
  }

  // Mix down to mono if stereo
  const left = audioBuffer.getChannelData(0);
  const right = audioBuffer.getChannelData(1);
  const mono = new Float32Array(left.length);

  for (let i = 0; i < left.length; i++) {
    mono[i] = (left[i] + right[i]) / 2;
  }

  return mono;
}

/**
 * Calculate audio level (RMS) for visualization
 */
export function calculateAudioLevel(audioData: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < audioData.length; i++) {
    sum += audioData[i] * audioData[i];
  }
  const rms = Math.sqrt(sum / audioData.length);
  return Math.min(1, rms * 5); // Normalize and amplify
}

/**
 * Decode audio blob to AudioBuffer
 */
export async function decodeAudioData(blob: Blob): Promise<AudioBuffer> {
  const arrayBuffer = await blobToArrayBuffer(blob);
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  audioContext.close();
  return audioBuffer;
}

/**
 * Process recorded audio for model input
 */
export async function processAudioForModel(blob: Blob): Promise<Float32Array> {
  // Decode audio
  const audioBuffer = await decodeAudioData(blob);
  
  // Resample to 16kHz
  const resampled = await resampleAudio(audioBuffer, AUDIO_CONFIG.sampleRate);
  
  // Convert to Float32Array (mono)
  const audioData = audioBufferToFloat32(resampled);
  
  return audioData;
}
