# Docling Production Documentation

**IBM Docling - Intelligent Document Processing for Production AI Systems**

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [What is Docling?](#what-is-docling)
3. [Architecture](#architecture)
4. [Production Deployment](#production-deployment)
5. [Use Cases](#use-cases)
6. [Cost Analysis](#cost-analysis)
7. [Integration Patterns](#integration-patterns)
8. [Lab Guides](#lab-guides)
9. [Production Checklist](#production-checklist)
10. [Resources](#resources)

---

## Overview

This documentation provides a comprehensive guide to understanding and deploying **IBM Docling** in production environments. Docling is an open-source document intelligence platform that converts complex documents (PDFs, Word, PowerPoint, images) into AI-ready formats while preserving structure, layout, and semantic meaning.

**Key Benefits:**
- 🎯 **Cost Reduction:** 60-80% token savings vs. direct PDF-to-LLM uploads
- 🚀 **Better RAG:** Structure-aware chunking improves retrieval accuracy
- 🔧 **Multi-Format:** Handles PDFs, DOCX, PPTX, images, tables, charts
- 🏗️ **Production Ready:** REST API, Docker support, horizontal scaling
- 🤖 **AI-Native:** MCP integration for AI agent tool use

**Documentation Structure:**
- `01_OVERVIEW.md` - High-level introduction and concepts
- `02_ARCHITECTURE.md` - Technical architecture and components
- `03_DEPLOYMENT.md` - Production deployment strategies
- `04_USE_CASES.md` - Real-world applications and patterns
- `05_COST_ANALYSIS.md` - ROI calculations and token savings
- `06_API_REFERENCE.md` - Complete API documentation
- `07_LAB_GUIDES/` - Hands-on tutorials (6 labs)
- `08_PRODUCTION_CHECKLIST.md` - Go-live readiness checklist

---

## What is Docling?

**Docling** is an **intelligent document processing engine** developed by IBM Research that:

1. **Extracts** text, tables, images, and layout from documents
2. **Preserves** document structure (headings, sections, lists, hierarchies)
3. **Enriches** content with semantic metadata
4. **Converts** to AI-ready formats (Markdown, JSON, DoclingDocument)
5. **Chunks** intelligently for RAG systems
6. **Serves** via REST API or Python SDK

### Why Docling?

**Traditional Problem:**
```
PDF (100 pages) → Upload to Claude → 150,000-300,000 tokens @ ₹250/1M = ₹37.50-75
```

**With Docling:**
```
PDF (100 pages) → Docling → Markdown (30,000 tokens) → Claude @ ₹250/1M = ₹7.50
**Savings: 60-80% on token costs**
```

---

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Documents     │
│ PDF/DOCX/PPTX   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Docling Engine  │
│ ┌─────────────┐ │
│ │ OCR Engine  │ │  ← EasyOCR/Tesseract
│ ├─────────────┤ │
│ │ PDF Parser  │ │  ← DLParse V2
│ ├─────────────┤ │
│ │ Layout Det. │ │  ← Table detection
│ ├─────────────┤ │
│ │ Converter   │ │  ← Markdown/JSON
│ └─────────────┘ │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Output Formats │
│ • Markdown      │
│ • JSON          │
│ • DoclingDoc    │
│ • Chunks        │
└─────────────────┘
```

### Components

1. **Document Converter** - Core conversion engine
2. **OCR Engine** - Optional text recognition (EasyOCR)
3. **PDF Backend** - `dlparse_v2` or `pypdfium2`
4. **Layout Detector** - Table/chart detection
5. **Chunker** - Intelligent text splitting
6. **API Server** - `docling-serve` REST API
7. **MCP Server** - Model Context Protocol for AI agents

---

## Production Deployment

### Deployment Options

#### Option 1: Python Library (Development/Scripts)

```bash
pip install docling
```

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("document.pdf")
markdown = result.document.export_to_markdown()
```

**Use When:**
- Prototyping
- Batch processing scripts
- Jupyter notebooks
- Single-machine workloads

---

#### Option 2: REST API (Production/Microservices)

```bash
# Install
pip install docling-serve

# Start server
docling-serve run --host 0.0.0.0 --port 5000

# Or with Docker
docker run -p 5000:5000 quay.io/docling-project/docling-serve
```

```python
# Client usage
import httpx

response = httpx.post(
    "http://localhost:5000/v1/convert/source",
    json={
        "sources": [{"kind": "http", "url": "https://example.com/doc.pdf"}],
        "options": {
            "do_ocr": False,
            "pdf_backend": "dlparse_v2"
        }
    },
    timeout=120.0
)

result = response.json()
markdown = result["md"]
```

**Use When:**
- Microservices architecture
- Multi-language clients (Node, Java, Go, etc.)
- Horizontal scaling needed
- Load balancing required

---

#### Option 3: Kubernetes (Enterprise Scale)

```yaml
# docling-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docling-serve
spec:
  replicas: 3
  selector:
    matchLabels:
      app: docling
  template:
    metadata:
      labels:
        app: docling
    spec:
      containers:
      - name: docling
        image: quay.io/docling-project/docling-serve:latest
        ports:
        - containerPort: 5000
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        env:
        - name: DOCLING_OCR_ENABLED
          value: "false"
---
apiVersion: v1
kind: Service
metadata:
  name: docling-service
spec:
  selector:
    app: docling
  ports:
  - port: 80
    targetPort: 5000
  type: LoadBalancer
```

**Deploy:**
```bash
kubectl apply -f docling-deployment.yaml
```

**Use When:**
- High availability required
- Auto-scaling needed (HPA)
- Multi-region deployment
- Enterprise production

---

### Performance Tuning

**Conversion Speed:**
- PDF (10 pages): ~3-5 seconds
- PDF (100 pages): ~30-50 seconds
- With OCR: 2-3x slower

**Resource Requirements:**
- CPU: 1-2 cores per worker
- Memory: 2-4 GB per worker
- Storage: Minimal (stateless)

**Scaling Strategy:**
```
Single Server:    ~10-20 docs/min
3 Replicas:       ~30-60 docs/min
10 Replicas:      ~100-200 docs/min
```

---

## Use Cases

### 1. RAG Systems (Retrieval Augmented Generation)

**Before Docling:**
```python
# Naive chunking loses structure
chunks = pdf_text.split('\n\n')  # Random breaks!
embeddings = embed(chunks)
```

**With Docling:**
```python
from docling_core.transforms.chunker import HierarchicalChunker

converter = DocumentConverter()
result = converter.convert("document.pdf")

chunker = HierarchicalChunker()
chunks = list(chunker.chunk(result.document))

# Each chunk preserves:
# - Section hierarchy
# - Heading context
# - List membership
# - Table associations
```

**Result:** 30-50% better retrieval accuracy

---

### 2. Document Q&A with Cost Savings

**Scenario:** 100-page PDF Q&A with Claude

| Approach | Tokens | Cost (Sonnet) | Quality |
|----------|--------|---------------|---------|
| Direct Upload | 150K-300K | ₹37.50-75 | Good |
| Docling → Claude | 30K-50K | ₹7.50-12.50 | Excellent |
| **Savings** | **70-80%** | **₹25-60** | **Better** |

---

### 3. Knowledge Base Ingestion

```python
# Batch process 1000 documents
from docling.document_converter import DocumentConverter
import chromadb

converter = DocumentConverter()
db = chromadb.Client()
collection = db.create_collection("docs")

for pdf_path in pdf_paths:
    result = converter.convert(pdf_path)
    
    # Extract with structure
    for chunk in chunker.chunk(result.document):
        collection.add(
            documents=[chunk.text],
            metadatas=[{
                "source": pdf_path,
                "heading": chunk.meta.get("heading"),
                "page": chunk.meta.get("page")
            }],
            ids=[f"{pdf_path}_{chunk.id}"]
        )
```

---

### 4. Multi-Modal RAG (Images + Text)

Docling can extract and process images from documents:

```python
result = converter.convert("report.pdf")

# Get images with captions
for image in result.document.images:
    # Image data
    image_bytes = image.get_image()
    
    # Context
    caption = image.caption
    page_num = image.page
    
    # Send to vision model
    description = vision_model.describe(image_bytes)
```

---

### 5. AI Agent Tool Integration (MCP)

```yaml
# Continue config (~/.continue/config.yaml)
mcpServers:
  - name: Docling
    command: uvx
    args:
      - --from=docling-mcp
      - docling-mcp-server
```

**Agent Interaction:**
```
User: "Summarize the PDF at https://arxiv.org/pdf/2501.17887"

Agent: [Uses convert_document tool]
       [Reads markdown output]
       [Generates summary]
       
Output: "The paper introduces..."
```

**Available MCP Tools:**
- `convert_document` - Convert any document
- `create_new_docling_document` - Create structured doc
- `add_title_to_docling_document` - Add title
- `add_section_heading_to_docling_document` - Add section
- `export_docling_document_to_markdown` - Export

---

## Cost Analysis

### Token Cost Comparison (100-page PDF)

#### Direct Upload to Claude
```
Pages: 100
Tokens per page: 1,500-3,000
Total tokens: 150,000-300,000

Cost (Sonnet 3.5):
Input: 150K-300K × ₹0.25/1K = ₹37.50-75
```

#### Docling Preprocessing
```
Pages: 100
Extracted text: 30,000-50,000 tokens
Total tokens: 30,000-50,000

Cost (Sonnet 3.5):
Input: 30K-50K × ₹0.25/1K = ₹7.50-12.50

Savings: ₹25-60 per query (60-80%)
```

### Annual Cost Savings (1000 docs/month)

| Scenario | Direct Upload | With Docling | Annual Savings |
|----------|---------------|--------------|----------------|
| 1K docs/mo | ₹4,50,000 | ₹1,00,000 | ₹3,50,000 (78%) |
| 5K docs/mo | ₹22,50,000 | ₹5,00,000 | ₹17,50,000 (78%) |
| 10K docs/mo | ₹45,00,000 | ₹10,00,000 | ₹35,00,000 (78%) |

**ROI:**
- Setup cost: ₹50,000 (2-week dev + infra)
- Break-even: Month 1 at 1K docs/month
- 12-month ROI: 700% at 1K docs/month

---

## Integration Patterns

### Pattern 1: Synchronous API

```python
# Upload → Convert → Return
@app.post("/convert")
async def convert_document(file: UploadFile):
    result = converter.convert(file.file)
    return {"markdown": result.document.export_to_markdown()}
```

**Use When:**
- Small documents (<10 pages)
- Low latency required (<10s)
- Simple workflows

---

### Pattern 2: Async Queue

```python
# Upload → Queue → Process → Notify
from celery import Celery

app = Celery('docling_tasks')

@app.task
def process_document(file_path, user_id):
    result = converter.convert(file_path)
    
    # Store result
    db.save_result(user_id, result)
    
    # Notify user
    notify_user(user_id, "Document ready!")
```

**Use When:**
- Large documents (>50 pages)
- Batch processing
- High volume (>100/hour)

---

### Pattern 3: Streaming

```python
# Stream chunks as they're ready
@app.post("/convert/stream")
async def convert_stream(file: UploadFile):
    result = converter.convert(file.file)
    
    async def generate():
        for chunk in chunker.chunk(result.document):
            yield json.dumps({
                "chunk": chunk.text,
                "meta": chunk.meta
            }) + "\n"
    
    return StreamingResponse(generate())
```

**Use When:**
- Real-time UX needed
- Progressive loading
- Large documents

---

## Lab Guides

Complete hands-on tutorials in `07_LAB_GUIDES/`:

1. **Lab 1: Document Conversion** - Core conversion features
2. **Lab 2: Chunking** - Structure-aware chunking for RAG
3. **Lab 3: Multimodal RAG** - Images + text retrieval
4. **Lab 4: Docling as a Service** - REST API deployment
5. **Lab 5: Token Cost Comparison** - ROI analysis
6. **Lab 6: MCP for AI Agents** - Agent tool integration

Each lab includes:
- Learning objectives
- Prerequisites
- Step-by-step instructions
- Code examples
- Expected outputs

---

## Production Checklist

See `08_PRODUCTION_CHECKLIST.md` for complete readiness checklist.

**Quick Checklist:**
- [ ] Choose deployment pattern (API/Library/K8s)
- [ ] Set up monitoring (health checks, metrics)
- [ ] Configure logging (structured logs)
- [ ] Implement error handling (retries, fallbacks)
- [ ] Security review (API keys, CORS, rate limits)
- [ ] Load testing (target: 100 docs/min)
- [ ] Backup strategy (document archive)
- [ ] Cost tracking (token usage monitoring)
- [ ] Documentation (API docs, runbooks)
- [ ] Rollback plan (version pinning)

---

## Resources

### Official Documentation
- **Docling Homepage:** https://docling-project.github.io/docling/
- **GitHub:** https://github.com/DS4SD/docling
- **Workshop:** https://ibm-granite-community.github.io/docling-workshop/

### API Servers
- **docling-serve:** https://github.com/docling-project/docling-serve
- **docling-mcp:** https://github.com/docling-project/docling-mcp

### Community
- **IBM Granite Community:** https://ibm-granite-community.github.io/
- **Model Context Protocol:** https://modelcontextprotocol.io/

### Related Tools
- **ChromaDB:** https://www.trychroma.com/ (Vector DB)
- **LangChain:** https://www.langchain.com/ (RAG framework)
- **Ollama:** https://ollama.ai/ (Local LLMs)
- **Continue:** https://continue.dev/ (AI coding assistant)

---

## Quick Start

### 1. Install Docling

```bash
# Python library
pip install docling

# REST API server
pip install docling-serve
```

### 2. Convert Your First Document

```python
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
result = converter.convert("document.pdf")

# Get markdown
markdown = result.document.export_to_markdown()
print(markdown)

# Get JSON
json_doc = result.document.export_to_dict()
```

### 3. Start REST API

```bash
docling-serve run --host 0.0.0.0 --port 5000

# Test
curl http://localhost:5000/health
```

### 4. Make API Request

```bash
curl -X POST http://localhost:5000/v1/convert/source \
  -H "Content-Type: application/json" \
  -d '{
    "sources": [{"kind": "http", "url": "https://example.com/doc.pdf"}],
    "options": {"do_ocr": false}
  }'
```

---

## Support

**Issues:** https://github.com/DS4SD/docling/issues  
**Discussions:** https://github.com/DS4SD/docling/discussions  
**Email:** docling@ibm.com

---

**Last Updated:** 2026-04-23  
**Version:** 1.0.0  
**Author:** OpenClaw AppOrb
