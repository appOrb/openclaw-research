/**
 * Granite Speech model integration using Transformers.js
 * Client-side only - no SSR
 */

import { MODEL_CONFIG, MENU_ITEMS } from './constants';

let model: any = null;
let processor: any = null;
let isLoading = false;
let isLoaded = false;
let transformers: any = null;

export interface TranscriptionResult {
  text: string;
  confidence?: number;
  latency: number;
  modelLoadTime?: number;
}

export interface ModelLoadProgress {
  status: 'loading' | 'downloading' | 'loaded' | 'error';
  progress: number; // 0-100
  message: string;
}

/**
 * Initialize transformers library (client-side only)
 */
async function initTransformers() {
  if (transformers) return;
  if (typeof window === 'undefined') {
    throw new Error('Transformers.js can only run in browser');
  }
  transformers = await import('@xenova/transformers');
}

/**
 * Load Granite Speech model (4 GB, one-time download)
 */
export async function loadGraniteSpeechModel(
  onProgress?: (progress: ModelLoadProgress) => void
): Promise<void> {
  if (isLoaded) {
    console.log('Model already loaded');
    return;
  }

  if (isLoading) {
    console.log('Model is currently loading');
    throw new Error('Model is already being loaded');
  }

  isLoading = true;

  try {
    // Initialize transformers first
    await initTransformers();

    onProgress?.({
      status: 'downloading',
      progress: 0,
      message: 'Downloading Granite Speech model (4 GB, one-time)...',
    });

    // Load processor
    onProgress?.({
      status: 'loading',
      progress: 20,
      message: 'Loading audio processor...',
    });

    processor = await transformers.AutoProcessor.from_pretrained(MODEL_CONFIG.modelId, {
      progress_callback: (progress: any) => {
        if (progress.status === 'progress') {
          const percent = Math.round((progress.loaded / progress.total) * 40) + 20;
          onProgress?.({
            status: 'downloading',
            progress: percent,
            message: `Downloading processor: ${(progress.loaded / 1024 / 1024).toFixed(1)} MB / ${(progress.total / 1024 / 1024).toFixed(1)} MB`,
          });
        }
      },
    });

    // Load model
    onProgress?.({
      status: 'loading',
      progress: 60,
      message: 'Loading speech model...',
    });

    model = await transformers.AutoModelForSpeechSeq2Seq.from_pretrained(MODEL_CONFIG.modelId, {
      dtype: MODEL_CONFIG.dtype as any,
      progress_callback: (progress: any) => {
        if (progress.status === 'progress') {
          const percent = Math.round((progress.loaded / progress.total) * 30) + 60;
          onProgress?.({
            status: 'downloading',
            progress: percent,
            message: `Downloading model: ${(progress.loaded / 1024 / 1024).toFixed(1)} MB / ${(progress.total / 1024 / 1024).toFixed(1)} MB`,
          });
        }
      },
    } as any);

    onProgress?.({
      status: 'loaded',
      progress: 100,
      message: 'Model loaded successfully!',
    });

    isLoaded = true;
    isLoading = false;

    console.log('Granite Speech model loaded successfully');
  } catch (error) {
    isLoading = false;
    console.error('Failed to load Granite Speech model:', error);
    
    onProgress?.({
      status: 'error',
      progress: 0,
      message: `Error loading model: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });

    throw error;
  }
}

/**
 * Transcribe audio using Granite Speech
 */
export async function transcribeAudio(
  audioData: Float32Array,
  useKeywordBiasing: boolean = true
): Promise<TranscriptionResult> {
  if (!isLoaded || !model || !processor) {
    throw new Error('Model not loaded. Call loadGraniteSpeechModel() first.');
  }

  const startTime = performance.now();

  try {
    // Build prompt with optional keyword biasing
    const keywords = useKeywordBiasing ? MENU_ITEMS.join(', ') : '';
    const userPrompt = keywords
      ? `<|audio|>can you transcribe the speech into a written format? Keywords: ${keywords}`
      : '<|audio|>can you transcribe the speech into a written format?';

    const chat = [
      { role: 'user', content: userPrompt },
    ];

    // Apply chat template
    const prompt = processor.tokenizer.apply_chat_template(chat, {
      tokenize: false,
      add_generation_prompt: true,
    });

    // Process audio
    const modelInputs = await processor(prompt, audioData);

    // Generate transcription
    const outputs = await model.generate({
      ...modelInputs,
      max_new_tokens: MODEL_CONFIG.maxNewTokens,
      do_sample: false,
      num_beams: 1,
    });

    // Decode output
    const numInputTokens = modelInputs.input_ids.dims[1];
    const newTokens = outputs.slice(null, [numInputTokens, null]);
    const transcription = processor.tokenizer.batch_decode(newTokens, {
      add_special_tokens: false,
      skip_special_tokens: true,
    })[0];

    const endTime = performance.now();
    const latency = endTime - startTime;

    return {
      text: transcription.trim(),
      latency: Math.round(latency),
    };
  } catch (error) {
    console.error('Transcription failed:', error);
    throw new Error(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if WebGPU is available
 */
export async function checkWebGPUSupport(): Promise<boolean> {
  try {
    const nav = navigator as any;
    if (!nav.gpu) {
      return false;
    }

    const adapter = await nav.gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

/**
 * Get model info
 */
export function getModelInfo() {
  return {
    modelId: MODEL_CONFIG.modelId,
    isLoaded,
    isLoading,
    device: MODEL_CONFIG.device,
    dtype: MODEL_CONFIG.dtype,
  };
}

/**
 * Unload model to free memory
 */
export function unloadModel() {
  model = null;
  processor = null;
  isLoaded = false;
  isLoading = false;
  console.log('Model unloaded');
}
