# Real-Time Voice AI Stacks - Initial Assessment

## Date: 2026-04-22
**Quick Analysis:** Modern stacks for real-time voice AI applications

---

## 🎯 Key Requirements for Real-Time Voice AI

1. **Low Latency:** <200ms end-to-end (user speaks → AI responds)
2. **High Accuracy:** >95% word accuracy (STT)
3. **Natural Voice:** >4.0 MOS score (TTS)
4. **Scalability:** Handle 1000+ concurrent conversations
5. **Cost Effective:** <$0.10 per conversation
6. **Reliability:** >99.9% uptime

---

## 🔊 Speech-to-Text (STT) Options

### Cloud Services

#### 1. **OpenAI Whisper API**
- **Pros:** 
  - High accuracy across languages
  - Good with accents/background noise
  - Reasonable pricing ($0.006/min)
  - Multiple model sizes
- **Cons:**
  - Latency can be 2-5 seconds
  - Not real-time streaming (batch only)
- **Use Case:** Async transcription, offline processing
- **Cost:** ~$0.36/hour of audio

#### 2. **Deepgram Nova-2**
- **Pros:**
  - **Real-time streaming** (<300ms)
  - Best-in-class accuracy
  - WebSocket support
  - Diarization built-in
- **Cons:**
  - More expensive ($0.0043/min for streaming)
  - Requires WebSocket setup
- **Use Case:** Live conversations, real-time transcription
- **Cost:** ~$0.26/hour of audio

#### 3. **AssemblyAI Real-Time**
- **Pros:**
  - Sub-second latency
  - WebSocket API
  - Good accuracy
  - Sentiment analysis built-in
- **Cons:**
  - Pricing ($0.003/min)
  - Limited language support
- **Use Case:** English-primary applications
- **Cost:** ~$0.18/hour of audio

#### 4. **Google Cloud Speech-to-Text V2**
- **Pros:**
  - Very low latency (200-400ms)
  - 100+ languages
  - Streaming support
  - Auto-detect language
- **Cons:**
  - Complex pricing
  - Requires GCP setup
- **Use Case:** Multi-language support
- **Cost:** ~$0.024/min ($1.44/hour)

#### 5. **Azure Speech Service**
- **Pros:**
  - Ultra-low latency (<200ms possible)
  - Streaming mode
  - Custom models possible
  - Good integration with Azure
- **Cons:**
  - Pricier ($1.00/hour standard)
  - Azure lock-in
- **Use Case:** Azure-native applications
- **Cost:** $1.00/hour (standard tier)

### Self-Hosted Options

#### 6. **Whisper (Local)**
- **Pros:**
  - **FREE** (after hardware cost)
  - High accuracy
  - Privacy-first
  - No API limits
- **Cons:**
  - Requires GPU (RTX 3090 or better)
  - 1-3 second latency per chunk
  - Maintenance overhead
- **Use Case:** High-volume, privacy-sensitive
- **Cost:** $0 (after $1500-3000 GPU)

#### 7. **Vosk**
- **Pros:**
  - **Completely free**
  - Offline capable
  - Low resource usage
  - Multiple languages
- **Cons:**
  - Lower accuracy (85-90%)
  - Limited features
  - Manual model management
- **Use Case:** Budget constraints, offline apps
- **Cost:** $0

---

## 🗣️ Text-to-Speech (TTS) Options

### Cloud Services

#### 1. **ElevenLabs**
- **Pros:**
  - **Best voice quality** (MOS >4.5)
  - Emotional range
  - Voice cloning
  - Streaming support
- **Cons:**
  - Expensive ($0.30/1K chars)
  - Rate limits on free tier
- **Use Case:** High-quality voice experiences
- **Cost:** ~$0.30 per 1K chars (~200 words)

#### 2. **OpenAI TTS**
- **Pros:**
  - Natural sounding
  - Multiple voices
  - Reasonable pricing ($0.015/1K chars)
  - Good streaming
- **Cons:**
  - Limited voice customization
  - Newer product (less mature)
- **Use Case:** General purpose TTS
- **Cost:** $0.015 per 1K chars

#### 3. **Google Cloud TTS (WaveNet)**
- **Pros:**
  - Very natural voices
  - Low latency
  - Many languages
  - SSML support
- **Cons:**
  - Pricing ($16/million chars)
  - Requires GCP
- **Use Case:** Multi-language apps
- **Cost:** $0.016 per 1K chars

#### 4. **Azure Neural TTS**
- **Pros:**
  - High quality
  - Custom voices
  - SSML support
  - Good latency
- **Cons:**
  - Azure lock-in
  - Pricing ($15/million chars)
- **Use Case:** Enterprise Azure apps
- **Cost:** $0.015 per 1K chars

#### 5. **Amazon Polly (Neural)**
- **Pros:**
  - Natural voices
  - AWS integration
  - Streaming support
  - Pricing ($16/million chars)
- **Cons:**
  - AWS dependency
  - Less expressive than ElevenLabs
- **Use Case:** AWS-native applications
- **Cost:** $0.016 per 1K chars

### Self-Hosted Options

#### 6. **Coqui TTS**
- **Pros:**
  - **FREE**
  - High quality
  - Voice cloning
  - Emotional control
- **Cons:**
  - Requires GPU
  - Slower than cloud
  - Maintenance needed
- **Use Case:** Privacy, high-volume
- **Cost:** $0 (after hardware)

#### 7. **Piper TTS**
- **Pros:**
  - **FREE**
  - Very fast (real-time CPU)
  - Low resource usage
  - Good quality
- **Cons:**
  - Limited voices
  - Less expressive
- **Use Case:** Resource-constrained, budget apps
- **Cost:** $0

---

## 🤖 LLM Providers (Conversational AI)

### 1. **OpenAI GPT-4o**
- **Pros:**
  - Best reasoning
  - Streaming responses
  - Function calling
  - Wide adoption
- **Cons:**
  - Expensive ($15/1M input, $60/1M output)
  - Rate limits
- **Use Case:** Complex conversations
- **Cost:** ~$0.02-0.10 per conversation

### 2. **Anthropic Claude 3.5 Sonnet**
- **Pros:**
  - Excellent reasoning
  - 200K context window
  - Good streaming
  - Safety focused
- **Cons:**
  - Pricing ($3/1M input, $15/1M output)
  - Newer ecosystem
- **Use Case:** Long conversations, context-heavy
- **Cost:** ~$0.005-0.03 per conversation

### 3. **Google Gemini 1.5 Flash**
- **Pros:**
  - **FAST** (<1 second)
  - Very low cost ($0.075/1M input, $0.30/1M output)
  - 1M token context
  - Multimodal
- **Cons:**
  - Less capable than GPT-4
  - Newer product
- **Use Case:** High-volume, cost-sensitive
- **Cost:** ~$0.001-0.005 per conversation

### 4. **Meta Llama 3.3 70B (Self-Hosted)**
- **Pros:**
  - **FREE** (open source)
  - Good quality
  - Full control
  - Privacy
- **Cons:**
  - Requires 2x A100 GPUs ($20K+)
  - Slower inference
  - Maintenance overhead
- **Use Case:** High-volume, privacy-critical
- **Cost:** $0 (after $20K+ hardware)

---

## 🏗️ Recommended Stacks for AI Waiter

### **Stack A: Cloud-Native (Best for MVP)**

**Components:**
- **STT:** Deepgram Nova-2 (streaming)
- **TTS:** OpenAI TTS (good quality/price ratio)
- **LLM:** Google Gemini 1.5 Flash (fast + cheap)
- **Real-time:** SignalR (current)
- **Hosting:** Azure/AWS

**Pros:**
- Quick to implement
- Reliable infrastructure
- Scalable
- Good quality

**Cons:**
- Recurring API costs
- Vendor dependencies
- Data leaves premises

**Estimated Cost per Conversation:**
- STT: $0.01 (2 min audio)
- TTS: $0.03 (200 words response)
- LLM: $0.002 (streaming response)
- **Total: ~$0.042 per conversation**

**At Scale (1000 conversations/day):**
- Daily: $42
- Monthly: $1,260
- Yearly: $15,120

---

### **Stack B: Hybrid (Best for Production)**

**Components:**
- **STT:** Whisper (local GPU) + Deepgram (failover)
- **TTS:** Piper TTS (local) + OpenAI (premium voices)
- **LLM:** Llama 3.3 70B (local) + Claude 3.5 (complex queries)
- **Real-time:** WebRTC (direct p2p) + SignalR (signaling)
- **Hosting:** Kubernetes + Edge nodes

**Pros:**
- Much lower cost at scale
- Better latency (edge processing)
- Privacy control
- Fallback to cloud

**Cons:**
- Complex infrastructure
- Higher setup cost
- More maintenance

**Estimated Cost per Conversation:**
- STT: $0.001 (local Whisper)
- TTS: $0.001 (local Piper)
- LLM: $0.002 (local Llama)
- **Total: ~$0.004 per conversation**

**At Scale (1000 conversations/day):**
- Daily: $4
- Monthly: $120
- Yearly: $1,440 + hardware ($25K upfront)

---

### **Stack C: Edge-First (Best for Scale)**

**Components:**
- **STT:** Whisper.cpp (edge devices)
- **TTS:** Piper TTS (edge devices)
- **LLM:** Llama 3.1 8B (quantized, edge)
- **Real-time:** WebRTC (p2p)
- **Hosting:** Edge CDN + central orchestration

**Pros:**
- Ultra-low latency (<100ms)
- Minimal server costs
- Privacy-first
- Works offline

**Cons:**
- Device resource requirements
- Complex deployment
- Lower quality (smaller models)

**Estimated Cost per Conversation:**
- STT: $0
- TTS: $0
- LLM: $0
- **Total: ~$0.001 per conversation (compute only)**

**At Scale (1000 conversations/day):**
- Daily: $1
- Monthly: $30
- Yearly: $360 + edge infrastructure ($10K)

---

## 🎯 Initial Recommendation

**For AI Waiter MVP:**

**Use Stack A (Cloud-Native) with this specific setup:**

1. **STT:** Deepgram Nova-2 Streaming
   - Real-time WebSocket
   - Sub-300ms latency
   - $0.0043/min

2. **TTS:** OpenAI TTS (HD model)
   - Good quality for price
   - Streaming support
   - $0.015/1K chars

3. **LLM:** Google Gemini 1.5 Flash
   - Fast responses (<1s)
   - Very cost-effective
   - Streaming enabled

4. **Real-Time:** Keep SignalR
   - Already implemented
   - Works well with .NET
   - Good for orchestration

5. **Infrastructure:** Azure or AWS
   - Managed services
   - Auto-scaling
   - Good monitoring

**Why this stack:**
- **Fast:** End-to-end <500ms possible
- **Reliable:** Enterprise-grade services
- **Affordable:** ~$0.04 per conversation
- **Quick to build:** All have good APIs/docs
- **Future proof:** Easy to swap components

**Migration path to hybrid:**
- After 10K conversations/month, move STT to local Whisper
- After 50K conversations/month, add local LLM
- Keeps cloud as fallback

---

## 📅 Next Steps

**Tomorrow's Research (2 PM IST):**
1. Deep dive into Deepgram vs AssemblyAI vs Google STT
2. Latency benchmarks for each
3. Code examples for integration
4. Cost calculator spreadsheet

**This Week:**
- Complete STT comparison matrix
- Test Deepgram streaming API
- Build latency test harness
- Create proof-of-concept

---

**Questions for Discussion:**
1. What's your budget per conversation?
2. Is sub-second latency critical?
3. Privacy concerns (keep data local)?
4. Expected scale (conversations/month)?
5. Language support needed?
