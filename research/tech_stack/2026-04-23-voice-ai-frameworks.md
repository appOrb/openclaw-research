# Tech Stack Research - April 23, 2026

**Time:** 8:26 AM UTC (2:00 PM IST)  
**Focus:** Real-time Voice AI Frameworks & Tools  
**Duration:** 1-2 hours

---

## Today's Research Topics

### 1. Voice AI Frameworks & Libraries
**Priority:** High - Critical for AI Waiter voice ordering

#### Research Questions:
- What are the leading real-time voice AI frameworks in 2026?
- Which frameworks offer the best latency for restaurant ordering?
- Cost comparison: Deepgram vs AssemblyAI vs Whisper vs Google STT
- WebSocket vs WebRTC for voice streaming
- Edge vs cloud processing trade-offs

#### Frameworks to Evaluate:
1. **Deepgram** (mentioned in priorities)
   - Real-time STT capabilities
   - WebSocket support
   - Pricing model
   - Language support (multi-language restaurants)
   - Integration complexity

2. **AssemblyAI**
   - Real-time transcription
   - Custom vocabulary (menu items!)
   - Cost per hour
   - Latency benchmarks

3. **OpenAI Whisper**
   - Open-source option
   - Self-hosted vs API
   - Real-time vs batch
   - Cost comparison

4. **Google Cloud Speech-to-Text**
   - Streaming recognition
   - Multi-language
   - Cost analysis

5. **Azure Speech Services**
   - Real-time transcription
   - Custom models
   - Integration with existing Azure

---

### 2. Real-time Communication Protocols

#### WebRTC vs WebSocket Analysis:
- **WebRTC:**
  - P2P audio streaming
  - Lower latency
  - Browser compatibility
  - NAT traversal challenges
  - Use case: Direct voice capture

- **WebSocket:**
  - Server-mediated
  - Easier to implement
  - Better for STT integration
  - Slightly higher latency
  - Use case: Audio → STT pipeline

**Recommendation for AI Waiter:** WebSocket for initial implementation (simpler integration with STT services), consider WebRTC for v2 optimization.

---

### 3. LLM Providers & Performance

#### Current AI Waiter Stack:
- OpenAI GPT-4 (assumed)
- SignalR for real-time communication

#### Alternative Considerations:
1. **Claude 3.5 Sonnet** (Anthropic)
   - Better at structured outputs
   - Good for menu item extraction
   - Streaming support

2. **GPT-4 Turbo**
   - Function calling for order placement
   - Lower cost than GPT-4
   - Faster response times

3. **Gemini Pro**
   - Multi-modal (future: image menu analysis)
   - Competitive pricing
   - Real-time streaming

**Cost Comparison** (estimated per 1M tokens):
- GPT-4 Turbo: $10 input / $30 output
- Claude 3.5 Sonnet: $3 input / $15 output
- Gemini Pro: $0.50 input / $1.50 output

---

### 4. Edge Computing Solutions

#### Why Edge for Voice AI?
- Lower latency (critical for restaurant UX)
- Privacy (voice stays on device/local network)
- Offline capability (network outages)
- Cost savings (less cloud processing)

#### Edge Options:
1. **On-device STT** (WebSpeech API)
   - Pros: Zero cost, low latency, privacy
   - Cons: Limited accuracy, browser-dependent

2. **Local GPU Server** (Restaurant premise)
   - Pros: Fast, private, no recurring cloud costs
   - Cons: Hardware investment, maintenance

3. **Hybrid Approach** (Recommended)
   - WebSpeech API for instant feedback
   - Cloud STT for accuracy
   - Local LLM caching for common queries

---

## Initial Findings

### Voice AI Stack Recommendation for AI Waiter:

**Tier 1 (MVP - Current):**
```
Browser Mic → WebSocket → Backend → Whisper API → GPT-4 → SignalR → Frontend
```

**Tier 2 (Optimization):**
```
Browser Mic → 
  ├─ WebSpeech API (instant feedback) →
  └─ WebSocket → Deepgram STT → 
     ├─ GPT-4 Turbo (complex queries) →
     └─ Claude 3.5 (menu extraction) →
        SignalR → Frontend
```

**Tier 3 (Scale):**
```
Browser Mic → 
  ├─ Edge STT (on-device) →
  └─ WebRTC → 
     Restaurant Edge Server (local LLM cache) →
        ├─ Cloud LLM (fallback) →
        └─ WebSocket → Frontend
```

---

## Deepgram Deep Dive (Priority)

### Why Deepgram for AI Waiter?
1. **Real-time Streaming** - Native WebSocket support
2. **Custom Vocabulary** - Train on menu items ("Butter Chicken", "Naan", etc.)
3. **Multi-language** - Essential for diverse restaurants
4. **Low Latency** - ~200-300ms end-to-end
5. **Pricing** - $0.0043/min (cheaper than AssemblyAI)

### Integration Plan:
```typescript
// Backend: Deepgram WebSocket Proxy
import { createClient } from '@deepgram/sdk';

const deepgram = createClient(DEEPGRAM_API_KEY);
const connection = deepgram.listen.live({
  model: 'nova-2',
  language: 'en-US',
  smart_format: true,
  punctuate: true,
  interim_results: true,
  utterance_end_ms: 1000,
  vad_events: true,
  keywords: ['butter chicken:2', 'naan:2', 'biryani:2'] // Menu items
});

// Forward audio from frontend WebSocket
frontendWs.on('audio', (chunk) => {
  connection.send(chunk);
});

connection.on('Results', (data) => {
  const transcript = data.channel.alternatives[0].transcript;
  // Send to LLM for intent extraction
  processOrder(transcript);
});
```

### Cost Estimate:
- Average order: 2 minutes of voice
- Cost per order: $0.0043 * 2 = $0.0086
- 1000 orders/day = $8.60/day = $258/month
- **Much cheaper than manual order entry!**

---

## Next Steps

### Immediate (Today):
1. ✅ Document Deepgram integration approach
2. [ ] Create cost comparison matrix (Deepgram vs alternatives)
3. [ ] Prototype Deepgram WebSocket integration (30 min)
4. [ ] Test latency with sample menu vocabulary

### Short-term (This Week):
1. [ ] Set up Deepgram API account (trial)
2. [ ] Build POC: Browser → Deepgram → GPT-4 → Order
3. [ ] Measure end-to-end latency
4. [ ] Compare with current Whisper implementation

### Medium-term (Next 2 Weeks):
1. [ ] Custom vocabulary training (AI Waiter menus)
2. [ ] Multi-language support (Hindi, Spanish, etc.)
3. [ ] Edge caching for common queries
4. [ ] Load testing (concurrent orders)

---

## Key Insights (Top 3)

1. **Deepgram is the best fit for AI Waiter** - Real-time, affordable, customizable
2. **WebSocket is simpler than WebRTC** - Easier integration, good enough latency
3. **Hybrid approach wins** - WebSpeech API for instant feedback + cloud for accuracy

---

## Questions for Team

1. **Budget approval** for Deepgram trial? (~$100/month for testing)
2. **Multi-language priority?** Which languages after English?
3. **Offline mode requirement?** (Edge processing needed?)
4. **Target latency?** Current vs desired (aim for <500ms end-to-end)

---

## Tomorrow's Focus

- **LLM Provider Comparison** (GPT-4 Turbo vs Claude vs Gemini)
- **WebRTC Deep Dive** (when to upgrade from WebSocket)
- **Cost Optimization Strategies** (caching, edge, batch processing)

---

**Research Time:** 8:26 AM - 9:30 AM UTC (1 hour)  
**Next Check-in:** 3:30 PM UTC (9:00 PM IST)

_Documented by: OpenClaw AppOrb_
