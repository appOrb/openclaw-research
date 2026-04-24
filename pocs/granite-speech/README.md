# Granite Speech POC

**Voice Ordering System Prototype using IBM Granite 4.0 1B Speech**

Client-side AI speech recognition powered by WebGPU for the AI Waiter application.

---

## 🎯 Project Overview

This is a proof-of-concept (POC) to evaluate IBM Granite Speech for voice ordering in the AI Waiter application. The POC runs entirely in the browser using WebGPU/WebAssembly, requiring no backend servers.

**Key Features:**
- ✅ Client-side speech recognition (no server needed)
- ✅ GPU-accelerated inference via WebGPU
- ✅ Zero cost per transcription
- ✅ Complete privacy (audio never leaves device)
- ✅ Keyword biasing for menu items
- ✅ Real-time audio visualization

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Modern browser with WebGPU support (Chrome 113+, Edge 113+)
- 8-16 GB RAM (for model loading)

### Installation

```bash
# Clone/navigate to project
cd /home/azureuser/projects/granite-speech-poc

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 How It Works

### Architecture

```
User speaks
    ↓
Browser microphone (MediaRecorder API)
    ↓
Web Audio API (16kHz mono PCM)
    ↓
Granite 4.0 1B Speech (WebGPU/WASM)
    ↓
Transcription text (with keyword biasing)
    ↓
Display result + metrics
```

### Model Details

- **Model:** IBM Granite 4.0 1B Speech
- **Size:** ~4 GB (one-time download, cached in browser)
- **Accuracy:** 5.52% WER (average across benchmarks)
- **Speed:** 280x real-time on GPU
- **Languages:** English, French, German, Spanish, Portuguese, Japanese
- **License:** Apache 2.0

---

## 🔧 Technology Stack

```json
{
  "framework": "Next.js 16.2.4",
  "runtime": "React 19",
  "ml_library": "@xenova/transformers",
  "compute": "WebGPU (GPU) / WASM (fallback)",
  "audio": "Web Audio API + MediaRecorder",
  "styling": "Tailwind CSS 4",
  "animations": "Framer Motion"
}
```

---

## 💰 Cost Analysis

### Current (Deepgram)
- **Cost:** ₹0.84 per order
- **Monthly (1K orders/day):** ₹25,200
- **Annual:** ₹3,02,400

### With Granite (Client-Side)
- **Cost:** ₹0 per order
- **Infrastructure:** ₹0
- **Annual savings:** ₹3,02,400 🎉

**ROI:** 3 months (₹75K POC development cost)

---

## 📈 Performance Targets

| Metric | Target | Baseline (Deepgram) |
|--------|--------|---------------------|
| Word Error Rate (WER) | <8% | 5-6% |
| Latency (end-to-end) | <2s | ~1s |
| First-word latency | <500ms | ~300ms |
| RAM usage | <2 GB | N/A |
| Cost per 1K orders | ₹0 | ₹840 |

---

## 🧪 Testing

### Manual Testing

1. Open http://localhost:3000
2. Wait for model to load (progress bar shown)
3. Click "Start" to begin recording
4. Speak: "I want masala dosa with extra sambar"
5. Click "Stop" to transcribe
6. Review transcription + latency metrics

### Sample Test Cases

**Indian Dishes:**
- "I want masala dosa with extra sambar"
- "One plate biryani and two butter chicken"
- "Can I get palak paneer without garlic"

**Modifiers:**
- "Make it extra spicy"
- "Half portion please"
- "No onion in the curry"

**Actions:**
- "Add one more naan"
- "Cancel the samosa"
- "Remove the dal from my order"

---

## 🎨 Features

### 1. Real-Time Recording
- Visual waveform (audio level meter)
- Recording duration timer
- Start/Stop controls
- Microphone permission handling

### 2. Smart Transcription
- Keyword biasing (menu items from constants.ts)
- Automatic punctuation
- Confidence scores (if available)
- Latency tracking

### 3. Performance Metrics
- Model load time
- Transcription latency
- GPU acceleration status
- Memory usage (browser DevTools)

### 4. User Experience
- One-click recording
- Loading indicators (model download)
- Error states (clear messages)
- Visual feedback (animations)

---

## 📁 Project Structure

```
granite-speech-poc/
├── app/
│   ├── page.tsx              # Landing page with VoiceInput
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Tailwind styles
├── components/
│   └── VoiceInput.tsx        # Main voice recording component
├── lib/
│   ├── granite-speech.ts     # Model loading & transcription
│   ├── audio-processor.ts    # Audio utilities
│   └── constants.ts          # Menu items & config
├── public/
│   └── sample-audio/         # Test audio files (optional)
├── package.json
└── README.md
```

---

## 🔍 Key Files

### `components/VoiceInput.tsx`
Main React component for voice recording and transcription.

**Features:**
- Microphone access (MediaRecorder API)
- Real-time audio visualization
- Model loading progress
- Transcription display

### `lib/granite-speech.ts`
Granite Speech model integration using Transformers.js.

**Functions:**
- `loadGraniteSpeechModel()` - Load model (4 GB, one-time)
- `transcribeAudio()` - Transcribe audio with keyword biasing
- `checkWebGPUSupport()` - Detect GPU acceleration

### `lib/audio-processor.ts`
Audio processing utilities.

**Functions:**
- `getMicrophoneStream()` - Request mic permission
- `processAudioForModel()` - Convert to 16kHz mono PCM
- `calculateAudioLevel()` - For visualization

### `lib/constants.ts`
Configuration and menu items.

**Exports:**
- `MENU_ITEMS` - Keywords for biasing (masala dosa, biryani, etc.)
- `AUDIO_CONFIG` - 16kHz, mono
- `MODEL_CONFIG` - Granite 4.0 1B Speech

---

## 🚧 Known Limitations

1. **Model Size (4 GB)**
   - One-time download required
   - ~5-10 minutes on slow connections
   - Cached after first load

2. **Browser Support**
   - **WebGPU:** Chrome 113+, Edge 113+
   - **WASM fallback:** All modern browsers (slower)
   - Safari/Firefox: No WebGPU yet

3. **Device Requirements**
   - 8-16 GB RAM recommended
   - GPU for WebGPU (Intel/AMD/NVIDIA)
   - Slower on low-end devices

4. **First-Load Experience**
   - 4 GB model download (one-time)
   - Progress bar shown
   - Can take 5-10 minutes

---

## 🔄 Next Steps

### Phase 2: Testing & Benchmarking (Day 5)
- [ ] Test with 50 sample orders
- [ ] Compare accuracy vs. Deepgram
- [ ] Benchmark latency (p50, p95, p99)
- [ ] Test with background noise

### Phase 3: Integration Design (Day 6)
- [ ] API integration plan
- [ ] Frontend modifications needed
- [ ] Backend changes (if any)
- [ ] Migration strategy

### Phase 4: Demo & Handoff (Day 7)
- [ ] Video demo recording
- [ ] Documentation finalization
- [ ] Integration recommendations
- [ ] Known issues & workarounds

---

## 📊 Performance Benchmarks

_(To be updated after testing)_

### Accuracy
- Sample size: 50 orders
- WER: TBD%
- Keyword accuracy: TBD%

### Latency
- Model load time: TBD
- Transcription (p50): TBD ms
- Transcription (p95): TBD ms

### Resource Usage
- RAM: TBD GB
- GPU: TBD%
- Battery impact: TBD

---

## 🐛 Troubleshooting

### Model Won't Load
**Error:** "Failed to load model"

**Solutions:**
1. Check browser console for errors
2. Verify 4 GB free disk space (IndexedDB)
3. Try clearing browser cache
4. Use Chrome/Edge (best WebGPU support)

### No Microphone Access
**Error:** "Microphone access denied"

**Solutions:**
1. Check browser permissions (camera icon in URL bar)
2. Use HTTPS (required for microphone)
3. Reload page after granting permission

### Slow Transcription
**Issue:** >5s transcription time

**Solutions:**
1. Check WebGPU status (should say "enabled")
2. Close other tabs (free RAM)
3. Try shorter recordings (<30s)

### Low Accuracy
**Issue:** Wrong transcriptions

**Solutions:**
1. Speak clearly, avoid mumbling
2. Reduce background noise
3. Use menu keywords (biasing active)
4. Try shorter sentences

---

## 📚 Resources

- **Model Card:** https://huggingface.co/ibm-granite/granite-4.0-1b-speech
- **Transformers.js:** https://huggingface.co/docs/transformers.js
- **IBM Granite:** https://www.ibm.com/granite
- **Project Plan:** `/home/azureuser/granite_speech_poc_plan.md`

---

## 📞 Contact

**Author:** OpenClaw AppOrb  
**Date:** 2026-04-23  
**Status:** Day 1 - Implementation in progress  
**Discord:** #general

---

## 📝 License

MIT License (code)  
Apache 2.0 (Granite model)

---

**Status: 🚧 Under Development**

Day 1 complete: Setup + core components  
Next: Testing + benchmarking
