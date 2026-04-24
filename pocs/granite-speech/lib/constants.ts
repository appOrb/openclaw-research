// Menu items for keyword biasing
export const MENU_ITEMS = [
  // Indian dishes
  'masala dosa',
  'biryani',
  'butter chicken',
  'palak paneer',
  'samosa',
  'tandoori chicken',
  'naan',
  'roti',
  'idli',
  'vada',
  'uttapam',
  'chole bhature',
  'dal makhani',
  'chicken tikka',
  'paneer tikka',
  'gulab jamun',
  'rasgulla',
  'lassi',
  'chai',
  'coffee',
  
  // Common modifiers
  'extra',
  'spicy',
  'mild',
  'no onion',
  'no garlic',
  'half',
  'full',
  'large',
  'medium',
  'small',
  
  // Actions
  'order',
  'add',
  'remove',
  'cancel',
];

// Audio configuration
export const AUDIO_CONFIG = {
  sampleRate: 16000,
  channels: 1, // Mono
  format: 'audio/wav',
  mimeType: 'audio/webm;codecs=opus',
};

// Model configuration
export const MODEL_CONFIG = {
  modelId: 'ibm-granite/granite-4.0-1b-speech',
  device: 'webgpu', // Will fallback to wasm if not available
  dtype: 'fp16',
  maxNewTokens: 200,
};

// Performance thresholds
export const PERFORMANCE_THRESHOLDS = {
  maxLatency: 2000, // ms
  targetWER: 8, // %
  minConfidence: 0.7,
};
