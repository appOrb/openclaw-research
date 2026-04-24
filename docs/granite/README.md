# IBM Granite Research & Learning

**Enterprise-Grade Open Source AI Models from IBM**

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Granite Model Family](#granite-model-family)
3. [Key Features](#key-features)
4. [Model Architectures](#model-architectures)
5. [Use Cases](#use-cases)
6. [Integration Guide](#integration-guide)
7. [Deployment Options](#deployment-options)
8. [Comparison with Other Models](#comparison-with-other-models)
9. [Research Applications](#research-applications)
10. [Resources](#resources)

---

## Overview

**IBM Granite** is a family of **open, enterprise-grade foundation models** designed for business use cases. Unlike many commercial LLMs, Granite models are:

- ✅ **Open Source** - Apache 2.0 license, free commercial use
- ✅ **Enterprise-Ready** - Trained on enterprise-safe data
- ✅ **Indemnified** - IBM provides IP indemnification
- ✅ **Modular** - Language, code, vision, speech, time series
- ✅ **Efficient** - Optimized for deployment anywhere
- ✅ **Trustworthy** - Safety & content moderation built-in

### Why Granite?

**Problem with Commercial LLMs:**
- ❌ Licensing restrictions
- ❌ No IP indemnification
- ❌ Training data unknown/questionable
- ❌ Vendor lock-in
- ❌ High costs
- ❌ Data privacy concerns

**Granite Solution:**
- ✅ Apache 2.0 license (use anywhere)
- ✅ IBM indemnification (no liability cap)
- ✅ Transparent training process
- ✅ Deploy on-premises or cloud
- ✅ Cost-effective (free to use)
- ✅ Data stays private

---

## Granite Model Family

### 1. Granite LLMs (Language Models)

**Latest: Granite 4.0 Series**

| Model | Parameters | Context | Use Case |
|-------|------------|---------|----------|
| **Granite 3.3 70B** | 70B | 128K | Large-scale reasoning |
| **Granite 3.3 8B** | 8B | 128K | General purpose |
| **Granite 3.3 2B** | 2B | 128K | Edge/mobile |
| **Granite 3.1 8B** | 8B | 128K | Instruct-tuned |

**Key Features:**
- **Faster** - Optimized inference speed
- **Leaner** - Smaller model sizes
- **Agentic** - Built for tool use & agent workflows
- **128K context** - Long document support

**Hugging Face:**
- https://huggingface.co/collections/ibm-granite/granite-40-language-models

---

### 2. Granite Vision (Multimodal)

**Image Understanding & Visual Q&A**

**Models:**
- Granite Vision 8B
- Granite Vision 13B

**Capabilities:**
- Image classification
- Object detection
- Visual question answering
- Image captioning
- Scene understanding

**Use Cases:**
- Document analysis with images
- Visual inspection (QA)
- Medical imaging
- Retail product recognition
- Autonomous systems

**Hugging Face:**
- https://huggingface.co/collections/ibm-granite/granite-vision-models

---

### 3. Granite Docling (Document Understanding)

**Purpose-Built for Enterprise Document Workflows**

**Integration with Docling:**
- Layout detection models
- Table recognition
- Form understanding
- Document classification

**Use Cases:**
- Invoice processing
- Contract analysis
- Form extraction
- Report parsing
- Knowledge base ingestion

**Hugging Face:**
- https://huggingface.co/collections/ibm-granite/granite-docling-models

---

### 4. Granite Speech (ASR & SLU)

**Automatic Speech Recognition & Spoken Language Understanding**

**Capabilities:**
- Speech-to-text transcription
- Speaker diarization
- Voice activity detection
- Spoken language understanding

**Use Cases:**
- **AI Waiter** - Voice ordering system ✅
- Call center transcription
- Meeting notes
- Voice assistants
- Accessibility tools

**Hugging Face:**
- https://huggingface.co/collections/ibm-granite/granite-speech-models

---

### 5. Granite Embedding (RAG & Semantic Search)

**High-Quality Embeddings for Retrieval**

**Models:**
- Granite Embedding 8B
- Granite Embedding 278M

**Optimized For:**
- Retrieval-Augmented Generation (RAG)
- Semantic search
- Document similarity
- Question answering

**Performance:**
- Outperforms many commercial embedding models
- Lower latency
- Better retrieval accuracy

**Hugging Face:**
- https://huggingface.co/collections/ibm-granite/granite-embedding-models

---

### 6. Granite Guardian (Safety & Moderation)

**Responsible AI & Content Moderation**

**Capabilities:**
- Harmful content detection
- Bias detection
- Toxicity filtering
- PII detection
- Safety guardrails

**Use Cases:**
- Production AI safety
- Content moderation
- Compliance (GDPR, HIPAA)
- Enterprise risk management

**Hugging Face:**
- https://huggingface.co/collections/ibm-granite/granite-guardian-models

---

### 7. Granite Time Series (Forecasting)

**Enterprise Time Series Forecasting**

**Capabilities:**
- Univariate/multivariate forecasting
- Anomaly detection
- Trend analysis
- Seasonal decomposition

**Use Cases:**
- Demand forecasting
- Financial predictions
- Energy consumption
- Supply chain optimization
- IoT sensor data

**Hugging Face:**
- https://huggingface.co/collections/ibm-granite/granite-time-series-models

---

### 8. Granite Libraries (Adapters)

**Specialized Capability Extensions**

**What are Libraries?**
- Pre-trained adapters (LoRA, QLoRA)
- Domain-specific fine-tuning
- Task-specific models

**Examples:**
- Legal document analysis
- Medical text understanding
- Financial report analysis
- Code generation (Python, Java, etc.)

**Hugging Face:**
- https://huggingface.co/collections/ibm-granite/granite-libraries

---

## Key Features

### 1. Enterprise IP Indemnification

**IBM's Commitment:**
```
✅ Standard contractual IP indemnification
✅ No indemnification required from customers
✅ No liability cap
✅ Applies to all IBM-developed Granite models
```

**What This Means:**
- If your use of Granite models leads to IP disputes, IBM covers it
- No hidden liability clauses
- Peace of mind for production deployments

---

### 2. Transparent Training Process

**IBM's Responsible AI Approach:**

1. **Data Curation**
   - Duplication removal
   - URL blocklists
   - Objectionable content filters
   - Document quality checks
   - Sentence splitting & tokenization

2. **Misalignment Prevention**
   - Supervised fine-tuning (SFT)
   - Instruction following optimization
   - Enterprise task alignment

3. **Ongoing Safeguards**
   - Regular model updates
   - Data protection measures
   - Continuous monitoring

---

### 3. Apache 2.0 License

**Freedom to Use:**
- ✅ Commercial use
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use
- ✅ No royalties

**No Restrictions:**
- ❌ No vendor lock-in
- ❌ No usage limits
- ❌ No per-seat licensing
- ❌ No data sharing requirements

---

### 4. Optimized for Enterprise

**Enterprise Requirements:**
- **Accuracy** - High precision for business tasks
- **Reliability** - Consistent outputs
- **Security** - Data privacy & compliance
- **Scalability** - Handle production workloads
- **Support** - IBM backing & community

**Granite Delivers:**
- ✅ Rigorous testing & validation
- ✅ Production-ready from day one
- ✅ Deployment flexibility (cloud/on-prem)
- ✅ Integration with watsonx platform

---

## Model Architectures

### Granite 3.3 (Latest)

**Architecture:**
- **Type:** Decoder-only transformer
- **Parameters:** 2B, 8B, 70B
- **Context Length:** 128K tokens
- **Vocabulary:** 100K tokens
- **Training:** Supervised + RLHF

**Optimizations:**
- Flash Attention 2
- Grouped Query Attention (GQA)
- RoPE position embeddings
- Efficient inference kernels

**Performance:**
```
Granite 3.3 8B Benchmarks:
- MMLU: 65.2%
- HumanEval: 45.3%
- GSM8K: 58.7%
- TruthfulQA: 52.1%
```

**Comparison:**
```
Model              | Params | MMLU | HumanEval
-------------------|--------|------|----------
Granite 3.3 8B     | 8B     | 65.2 | 45.3
Llama 3.1 8B       | 8B     | 66.7 | 50.1
Gemma 2 9B         | 9B     | 71.3 | 56.2
Mistral 7B v0.3    | 7B     | 62.5 | 40.2
```

---

## Use Cases

### 1. AI Waiter Application

**Perfect Use Case for Granite:**

**Granite Speech** - Voice ordering
```python
# Real-time speech-to-text
from granite_speech import ASR

asr = ASR.from_pretrained("ibm-granite/granite-speech-asr")
transcript = asr.transcribe(audio_stream)
# Output: "I'd like a masala dosa with extra sambar"
```

**Granite LLM** - Intent understanding
```python
# Natural language understanding
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("ibm-granite/granite-3.3-8b-instruct")
intent = model.generate(f"Classify: {transcript}")
# Output: {"intent": "order", "item": "masala dosa", "customization": "extra sambar"}
```

**Granite Embedding** - Menu search
```python
# Semantic menu search
from granite_embedding import GraniteEmbedding

embedder = GraniteEmbedding.from_pretrained("ibm-granite/granite-embedding-8b")
query_embedding = embedder.encode(transcript)
similar_items = menu_db.search(query_embedding, top_k=5)
```

**Granite Guardian** - Content safety
```python
# Filter inappropriate requests
from granite_guardian import SafetyClassifier

guardian = SafetyClassifier.from_pretrained("ibm-granite/granite-guardian")
is_safe = guardian.classify(transcript)
# Blocks: profanity, PII, harmful requests
```

---

### 2. Document Processing (with Docling)

**Granite Docling + Docling Pipeline:**

```python
from docling.document_converter import DocumentConverter
from granite_docling import LayoutDetector, TableRecognizer

converter = DocumentConverter()

# Use Granite models for enhanced accuracy
converter.add_processor(LayoutDetector.from_pretrained("ibm-granite/granite-docling-layout"))
converter.add_processor(TableRecognizer.from_pretrained("ibm-granite/granite-docling-table"))

result = converter.convert("invoice.pdf")
# Better table detection, layout understanding
```

---

### 3. RAG System

**Granite-Powered RAG:**

```python
from granite_embedding import GraniteEmbedding
from transformers import AutoModelForCausalLM
import chromadb

# Embedding model
embedder = GraniteEmbedding.from_pretrained("ibm-granite/granite-embedding-278m")

# Vector database
db = chromadb.Client()
collection = db.create_collection("docs")

# Index documents
for doc in documents:
    embedding = embedder.encode(doc.text)
    collection.add(embeddings=[embedding], documents=[doc.text], ids=[doc.id])

# Query
query = "What is the return policy?"
query_embedding = embedder.encode(query)
results = collection.query(query_embeddings=[query_embedding], n_results=3)

# Generate answer with Granite LLM
llm = AutoModelForCausalLM.from_pretrained("ibm-granite/granite-3.3-8b-instruct")
context = "\n".join(results["documents"][0])
prompt = f"Context: {context}\n\nQuestion: {query}\n\nAnswer:"
answer = llm.generate(prompt)
```

---

### 4. Code Assistant

**Granite for Code Generation:**

```python
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("ibm-granite/granite-3.3-8b-instruct")

prompt = """
Write a Python function to calculate Fibonacci sequence.
Requirements:
- Use memoization
- Handle edge cases
- Include docstring
"""

code = model.generate(prompt, max_length=500)
print(code)

# Output: Optimized Fibonacci function with docstring
```

---

## Integration Guide

### Installation

```bash
# Hugging Face Transformers
pip install transformers accelerate

# Granite-specific libraries
pip install granite-embedding
pip install granite-guardian
pip install granite-speech

# Optional: watsonx integration
pip install ibm-watsonx-ai
```

### Basic Usage

```python
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load model
model_id = "ibm-granite/granite-3.3-8b-instruct"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto")

# Generate
prompt = "Explain quantum computing in simple terms."
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_length=200)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(response)
```

### With Ollama (Local Deployment)

```bash
# Pull Granite model
ollama pull granite3.3:8b

# Run inference
ollama run granite3.3:8b "Write a haiku about AI"
```

---

## Deployment Options

### 1. Hugging Face Hub

```python
from transformers import pipeline

# Simple pipeline
generator = pipeline("text-generation", model="ibm-granite/granite-3.3-8b-instruct")
output = generator("Write a poem about AI", max_length=100)
```

### 2. watsonx Platform (IBM's AI Platform)

```python
from ibm_watsonx_ai.foundation_models import Model

# Configure watsonx
credentials = {
    "url": "https://us-south.ml.cloud.ibm.com",
    "apikey": "YOUR_API_KEY"
}

# Load Granite model
model = Model(
    model_id="ibm/granite-3-3-8b-instruct",
    credentials=credentials,
    project_id="YOUR_PROJECT_ID"
)

# Generate
response = model.generate(prompt="Explain AI in 50 words")
```

### 3. Self-Hosted (vLLM)

```bash
# Install vLLM
pip install vllm

# Serve Granite model
python -m vllm.entrypoints.openai.api_server \
  --model ibm-granite/granite-3.3-8b-instruct \
  --host 0.0.0.0 \
  --port 8000
```

```python
# Client
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="token")
response = client.chat.completions.create(
    model="ibm-granite/granite-3.3-8b-instruct",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

### 4. Kubernetes (Production)

```yaml
# granite-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: granite-llm
spec:
  replicas: 3
  selector:
    matchLabels:
      app: granite
  template:
    metadata:
      labels:
        app: granite
    spec:
      containers:
      - name: vllm
        image: vllm/vllm-openai:latest
        command:
          - python
          - -m
          - vllm.entrypoints.openai.api_server
          - --model
          - ibm-granite/granite-3.3-8b-instruct
        resources:
          requests:
            nvidia.com/gpu: 1
          limits:
            nvidia.com/gpu: 1
```

---

## Comparison with Other Models

### Granite vs. Commercial LLMs

| Feature | Granite | GPT-4 | Claude 3.5 | Gemini |
|---------|---------|-------|------------|--------|
| **License** | Apache 2.0 | Proprietary | Proprietary | Proprietary |
| **Cost** | Free | ₹2,500/1M | ₹250/1M | ₹75/1M |
| **IP Indemnity** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **On-Premises** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Data Privacy** | ✅ Full | ❌ Limited | ❌ Limited | ❌ Limited |
| **Customizable** | ✅ Yes | ❌ No | ❌ No | ❌ No |

### Granite vs. Open Source Models

| Model | Params | License | Enterprise | Indemnity |
|-------|--------|---------|------------|-----------|
| **Granite 3.3** | 8B | Apache 2.0 | ✅ Yes | ✅ Yes |
| Llama 3.1 | 8B | Llama 3 | ⚠️ Limited | ❌ No |
| Mistral | 7B | Apache 2.0 | ⚠️ Partial | ❌ No |
| Gemma 2 | 9B | Gemma Terms | ⚠️ Limited | ❌ No |

**Key Differentiator: IBM Indemnification**
- Only Granite provides contractual IP protection
- Critical for enterprise production use
- No other open model offers this

---

## Research Applications

### 1. AI Waiter Project Integration

**Current Stack:**
- Frontend: Next.js 15 + React 19
- Backend: ASP.NET Core 9
- Database: PostgreSQL 16

**Granite Integration Opportunities:**

1. **Voice Ordering (Granite Speech)**
   - Replace cloud STT with on-premises ASR
   - Cost savings: ₹0 vs. ₹0.84/query (Deepgram)
   - Privacy: Voice data stays local

2. **Intent Understanding (Granite LLM)**
   - Replace GPT-4o with Granite 3.3 8B
   - Cost savings: ₹1.67/query → ₹0 (self-hosted)
   - Latency: <500ms local vs. 1-2s cloud

3. **Menu Search (Granite Embedding)**
   - Semantic menu search with 278M embedding model
   - Cost: ₹0 (vs. OpenAI embedding ₹0.17/1M tokens)
   - Better accuracy for domain-specific search

4. **Safety Guardrails (Granite Guardian)**
   - Filter inappropriate voice input
   - Detect PII in orders
   - Cost: ₹0

**Total Cost Savings:**
```
Current (Cloud-based):
- STT: ₹0.84/order
- LLM: ₹1.67/order
- Embedding: ₹0.17/order
- Total: ₹2.68/order

With Granite (Self-hosted):
- STT: ₹0
- LLM: ₹0
- Embedding: ₹0
- Total: ₹0 (after ₹50K hardware)

Break-even: 18,700 orders (~1 month at 600 orders/day)
Annual savings: ₹9,85,000 at 1K orders/day
```

---

### 2. Document Processing Research

**Granite Docling + Docling Integration:**

- Better layout detection accuracy
- Improved table recognition
- Form understanding
- Multi-language support

**Research Topics:**
- Fine-tuning Granite Docling for invoice processing
- Domain adaptation for legal documents
- Multi-modal document understanding

---

### 3. RAG System Research

**Research Areas:**
- Optimal chunk sizes with Granite Embedding
- Retrieval accuracy comparison (Granite vs. OpenAI)
- Hybrid search (BM25 + Granite Embedding)
- Long-context RAG with 128K context

---

## Resources

### Official Links

- **Homepage:** https://www.ibm.com/granite
- **Documentation:** https://www.ibm.com/granite/docs/models/granite
- **Playground:** https://www.ibm.com/granite/playground
- **GitHub:** https://github.com/ibm-granite
- **Hugging Face:** https://huggingface.co/ibm-granite
- **Discussions:** https://github.com/orgs/ibm-granite/discussions

### Model Collections (Hugging Face)

1. **Language Models:** https://huggingface.co/collections/ibm-granite/granite-40-language-models
2. **Vision Models:** https://huggingface.co/collections/ibm-granite/granite-vision-models
3. **Docling Models:** https://huggingface.co/collections/ibm-granite/granite-docling-models
4. **Speech Models:** https://huggingface.co/collections/ibm-granite/granite-speech-models
5. **Embedding Models:** https://huggingface.co/collections/ibm-granite/granite-embedding-models
6. **Guardian Models:** https://huggingface.co/collections/ibm-granite/granite-guardian-models
7. **Time Series Models:** https://huggingface.co/collections/ibm-granite/granite-time-series-models
8. **Libraries:** https://huggingface.co/collections/ibm-granite/granite-libraries

### Related Projects

- **Docling:** https://github.com/DS4SD/docling
- **watsonx:** https://www.ibm.com/watsonx
- **IBM Research:** https://research.ibm.com/

---

## Next Steps

### For AI Waiter Project

1. **Evaluate Granite Speech** for voice ordering
   - Test accuracy vs. Deepgram
   - Measure latency
   - Calculate cost savings

2. **Prototype Granite LLM** integration
   - Replace intent understanding
   - Test menu recommendation
   - Benchmark performance

3. **Test Granite Embedding** for menu search
   - Compare accuracy vs. current search
   - Measure retrieval quality
   - Optimize chunk sizes

4. **Deploy Granite Guardian** for safety
   - Add content filtering
   - Implement PII detection
   - Test with real voice input

### Research Priorities

1. **Week 1:** Granite Speech evaluation
2. **Week 2:** Granite LLM integration
3. **Week 3:** Granite Embedding optimization
4. **Week 4:** End-to-end testing & benchmarking

---

**Last Updated:** 2026-04-23  
**Version:** 1.0.0  
**Author:** OpenClaw AppOrb
