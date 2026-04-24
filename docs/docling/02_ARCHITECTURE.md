# Docling Technical Architecture

**Deep Dive into Docling's Internal Architecture and Components**

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Components](#core-components)
3. [Document Processing Pipeline](#document-processing-pipeline)
4. [Data Models](#data-models)
5. [PDF Backends](#pdf-backends)
6. [OCR Integration](#ocr-integration)
7. [Layout Detection](#layout-detection)
8. [Chunking Strategies](#chunking-strategies)
9. [API Server Architecture](#api-server-architecture)
10. [Scaling Patterns](#scaling-patterns)

---

## System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                              │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │ Python │  │  REST  │  │  MCP   │  │ Jupyter│            │
│  │  SDK   │  │  API   │  │ Agent  │  │Notebook│            │
│  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘            │
└──────┼───────────┼───────────┼───────────┼─────────────────┘
       │           │           │           │
       └───────────┴───────────┴───────────┘
                       │
┌──────────────────────┼────────────────────────────────────────┐
│                 DOCLING CORE                                   │
│  ┌───────────────────┴────────────────────┐                  │
│  │     DocumentConverter (Main Entry)      │                  │
│  └───────────────────┬────────────────────┘                  │
│                      │                                         │
│  ┌───────────────────┴────────────────────┐                  │
│  │        Format Detection Layer           │                  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐     │                  │
│  │  │  PDF   │ │ DOCX   │ │ PPTX   │     │                  │
│  │  │Detector│ │Detector│ │Detector│     │                  │
│  │  └────────┘ └────────┘ └────────┘     │                  │
│  └───────────────────┬────────────────────┘                  │
│                      │                                         │
│  ┌───────────────────┴────────────────────┐                  │
│  │      Document Parser Layer              │                  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐│                  │
│  │  │PDF Parse│  │DOCX Parse│  │PPTX Parse││                  │
│  │  │(dlparse)│  │(docx lib)│  │(pptx lib)││                  │
│  │  └────┬────┘  └────┬────┘  └────┬─────┘│                  │
│  └───────┼────────────┼────────────┼──────┘                  │
│          │            │            │                           │
│  ┌───────┴────────────┴────────────┴──────┐                  │
│  │      Content Extraction Layer           │                  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐  │                  │
│  │  │ Text │ │Tables│ │Images│ │Layout│  │                  │
│  │  └──────┘ └──────┘ └──────┘ └──────┘  │                  │
│  └───────────────────┬─────────────────────┘                  │
│                      │                                         │
│  ┌───────────────────┴────────────────────┐                  │
│  │    Optional Enhancement Layer           │                  │
│  │  ┌──────┐ ┌──────┐ ┌──────┐           │                  │
│  │  │ OCR  │ │Table │ │Image │           │                  │
│  │  │Engine│ │ Det. │ │ Desc.│           │                  │
│  │  └──────┘ └──────┘ └──────┘           │                  │
│  └───────────────────┬─────────────────────┘                  │
│                      │                                         │
│  ┌───────────────────┴────────────────────┐                  │
│  │      Document Assembly Layer            │                  │
│  │    (DoclingDocument construction)       │                  │
│  └───────────────────┬─────────────────────┘                  │
│                      │                                         │
│  ┌───────────────────┴────────────────────┐                  │
│  │      Export/Transform Layer             │                  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐     │                  │
│  │  │Markdown│ │  JSON  │ │ Chunks │     │                  │
│  │  └────────┘ └────────┘ └────────┘     │                  │
│  └─────────────────────────────────────────┘                  │
└────────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────────┐
│                    OUTPUT FORMATS                               │
│  • Markdown (MD)                                               │
│  • JSON (structured)                                           │
│  • DoclingDocument (Python object)                             │
│  • Chunks (HierarchicalChunker)                                │
└────────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. DocumentConverter

**Main entry point for all document processing.**

```python
class DocumentConverter:
    def __init__(
        self,
        format_options: dict = None,
        pipeline_options: PipelineOptions = None,
        pdf_backend: str = "dlparse_v2",
        do_ocr: bool = False
    ):
        # Initialize format handlers
        # Set up processing pipeline
        # Configure OCR if enabled
```

**Key Methods:**
- `convert(source: str | Path | bytes) -> ConversionResult`
- `batch_convert(sources: List[str]) -> List[ConversionResult]`

**Responsibilities:**
- Format detection (PDF, DOCX, PPTX, images)
- Pipeline orchestration
- Resource management
- Error handling

---

### 2. FormatHandler (Abstract)

Each format has a specialized handler:

```python
class PDFFormatHandler(FormatHandler):
    def __init__(self, backend: str):
        self.backend = backend  # "dlparse_v2" or "pypdfium2"
        
    def parse(self, source) -> RawDocument:
        # Extract raw content
        
    def process(self, raw_doc) -> DoclingDocument:
        # Build structured document
```

**Available Handlers:**
- `PDFFormatHandler` - PDF documents
- `DocxFormatHandler` - Word documents
- `PptxFormatHandler` - PowerPoint
- `ImageFormatHandler` - Images (JPEG, PNG, etc.)

---

### 3. DoclingDocument

**Core data structure representing a processed document.**

```python
class DoclingDocument:
    def __init__(self):
        self.metadata = DocumentMetadata()
        self.pages = []
        self.elements = []  # Headings, paragraphs, tables, etc.
        self.images = []
        self.tables = []
        
    def export_to_markdown(self) -> str:
        # Convert to markdown
        
    def export_to_dict(self) -> dict:
        # Convert to JSON
        
    def export_to_chunks(self, chunker) -> List[Chunk]:
        # Split into chunks
```

**Document Elements:**
- `Heading` - Section headings (H1-H6)
- `Paragraph` - Text blocks
- `ListItem` - Bulleted/numbered lists
- `Table` - Tabular data
- `Image` - Pictures/diagrams
- `Caption` - Image/table captions
- `Code` - Code blocks
- `Formula` - Mathematical equations

---

### 4. PDF Backends

#### dlparse_v2 (Default, Recommended)

**Deep Learning-based PDF parser**

```python
backend = "dlparse_v2"

# Features:
# - Layout detection (columns, headers, footers)
# - Table detection (complex tables with merged cells)
# - Image extraction with coordinates
# - Text order preservation
# - Font/style detection
```

**Performance:**
- Speed: ~0.5-1 sec/page
- Accuracy: 95-98%
- GPU: Optional (faster with GPU)

**Best For:**
- Complex layouts (multi-column)
- Scientific papers
- Reports with tables/charts
- Production deployments

---

#### pypdfium2 (Lightweight)

**Native PDF parser (no ML)**

```python
backend = "pypdfium2"

# Features:
# - Fast text extraction
# - Simple layout detection
# - Low resource usage
# - No GPU required
```

**Performance:**
- Speed: ~0.1-0.3 sec/page
- Accuracy: 85-90%
- Resource: Very low

**Best For:**
- Simple text documents
- High-volume processing
- Resource-constrained environments
- Development/testing

---

## Document Processing Pipeline

### Step-by-Step Flow

```
1. INPUT
   ┌─────────────┐
   │ PDF/DOCX/   │
   │ PPTX/Image  │
   └──────┬──────┘
          │
2. FORMAT DETECTION
   ┌──────┴──────┐
   │ MIME Type   │
   │ Magic Bytes │
   └──────┬──────┘
          │
3. PARSING
   ┌──────┴──────────┐
   │ Backend-Specific│
   │ Parser          │
   │ (dlparse/docx)  │
   └──────┬──────────┘
          │
4. EXTRACTION
   ┌──────┴──────────┐
   │ • Text          │
   │ • Images        │
   │ • Tables        │
   │ • Layout        │
   └──────┬──────────┘
          │
5. ENRICHMENT (Optional)
   ┌──────┴──────────┐
   │ • OCR           │
   │ • Table Det.    │
   │ • Image Desc.   │
   └──────┬──────────┘
          │
6. ASSEMBLY
   ┌──────┴──────────┐
   │ Build           │
   │ DoclingDocument │
   └──────┬──────────┘
          │
7. EXPORT
   ┌──────┴──────────┐
   │ • Markdown      │
   │ • JSON          │
   │ • Chunks        │
   └─────────────────┘
```

---

## Data Models

### DocumentMetadata

```python
class DocumentMetadata:
    title: str
    author: str
    creation_date: datetime
    modification_date: datetime
    page_count: int
    file_size: int
    mime_type: str
```

### PageNode

```python
class PageNode:
    page_number: int
    width: float
    height: float
    elements: List[Element]
    images: List[Image]
```

### Element (Abstract)

```python
class Element:
    element_type: ElementType  # HEADING, PARAGRAPH, etc.
    bbox: BoundingBox  # x1, y1, x2, y2
    page_number: int
    text: str
    confidence: float
```

### Table

```python
class Table:
    rows: int
    cols: int
    cells: List[List[Cell]]
    caption: str
    bbox: BoundingBox
```

### Image

```python
class Image:
    image_bytes: bytes
    caption: str
    bbox: BoundingBox
    page_number: int
    
    def get_image(self) -> PIL.Image:
        # Return PIL Image object
```

---

## OCR Integration

### EasyOCR (Recommended)

```python
# Enable OCR
converter = DocumentConverter(do_ocr=True)

# Automatically detects text in images and scanned PDFs
result = converter.convert("scanned.pdf")
```

**Features:**
- 80+ languages
- High accuracy (95%+)
- GPU acceleration
- Free and open-source

**Installation:**
```bash
pip install easyocr
```

**Language Support:**
```python
# Specify languages
ocr_options = {"ocr_languages": ["en", "es", "fr"]}
converter = DocumentConverter(do_ocr=True, pipeline_options=ocr_options)
```

---

### Tesseract (Alternative)

```bash
# Install Tesseract
sudo apt-get install tesseract-ocr

# Use with Docling
export DOCLING_OCR_ENGINE=tesseract
```

---

## Layout Detection

### Table Detection

**Detects tables in documents and preserves structure:**

```python
# Tables are automatically detected
result = converter.convert("report.pdf")

for table in result.document.tables:
    print(f"Table: {table.rows}x{table.cols}")
    print(table.caption)
    
    # Export as DataFrame
    df = table.to_dataframe()
```

**Capabilities:**
- Complex table layouts
- Merged cells
- Nested tables
- Header detection
- Caption association

---

### Multi-Column Layouts

**Handles complex page layouts:**
- 2-column academic papers
- Magazine layouts
- Newspaper formats
- Mixed single/multi-column

**Reading Order:**
- Top-to-bottom, left-to-right
- Column-aware
- Preserves logical flow

---

## Chunking Strategies

### HierarchicalChunker

**Structure-aware chunking for RAG systems:**

```python
from docling_core.transforms.chunker import HierarchicalChunker

chunker = HierarchicalChunker(
    max_tokens=512,
    include_heading=True,
    heading_as_metadata=True
)

chunks = list(chunker.chunk(result.document))

for chunk in chunks:
    print(f"Chunk {chunk.id}:")
    print(f"  Text: {chunk.text[:100]}...")
    print(f"  Heading: {chunk.meta.get('heading')}")
    print(f"  Page: {chunk.meta.get('page')}")
```

**Features:**
- Respects document structure (sections, subsections)
- Includes heading context
- Preserves semantic boundaries
- Metadata enrichment

**Chunk Metadata:**
```python
{
    "heading": "3.2 Methodology",
    "page": 12,
    "section_path": ["Chapter 3", "Methods", "Methodology"],
    "element_type": "paragraph",
    "bbox": {"x1": 100, "y1": 200, "x2": 500, "y2": 400}
}
```

---

### Comparison: Naive vs. Hierarchical Chunking

**Naive Chunking:**
```python
# Breaks at arbitrary points
chunks = text.split('\n\n')

# Problems:
# - Breaks mid-sentence
# - Loses section context
# - Mixes topics
# - Poor retrieval accuracy
```

**Hierarchical Chunking:**
```python
# Respects document structure
chunks = chunker.chunk(document)

# Benefits:
# - Semantic boundaries
# - Section context preserved
# - Better retrieval (30-50% improvement)
# - Metadata-rich
```

---

## API Server Architecture

### docling-serve

**Production-ready REST API server**

```bash
# Start server
docling-serve run --host 0.0.0.0 --port 5000 --workers 4
```

### Architecture

```
┌─────────────────────────────────────────────┐
│           Load Balancer (Nginx)             │
└──────────────┬──────────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐ ┌─────▼──────┐
│  Worker 1   │ │  Worker 2  │
│  (Gunicorn) │ │  (Gunicorn)│
└──────┬──────┘ └─────┬──────┘
       │               │
       └───────┬───────┘
               │
┌──────────────▼─────────────────────────────┐
│        DocumentConverter Pool               │
│  ┌────────┐  ┌────────┐  ┌────────┐       │
│  │Conv #1 │  │Conv #2 │  │Conv #3 │       │
│  └────────┘  └────────┘  └────────┘       │
└─────────────────────────────────────────────┘
```

### Endpoints

**1. Health Check**
```bash
GET /health

Response: 200 OK
{
  "status": "healthy",
  "version": "1.0.0"
}
```

**2. Convert from URL**
```bash
POST /v1/convert/source

Request:
{
  "sources": [{"kind": "http", "url": "https://example.com/doc.pdf"}],
  "options": {
    "do_ocr": false,
    "pdf_backend": "dlparse_v2"
  }
}

Response:
{
  "md": "# Document Title\n\n...",
  "json": {...},
  "status": "success"
}
```

**3. Convert from Upload**
```bash
POST /v1/convert/file

Request: multipart/form-data
- file: document.pdf
- options: {"do_ocr": false}

Response:
{
  "md": "# Document Title\n\n...",
  "json": {...}
}
```

**4. OpenAPI Documentation**
```bash
GET /docs

# Interactive Swagger UI
```

---

## Scaling Patterns

### Horizontal Scaling

**Deploy multiple instances behind a load balancer:**

```yaml
# docker-compose.yml
version: '3.8'

services:
  docling-lb:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - docling-1
      - docling-2
      - docling-3

  docling-1:
    image: quay.io/docling-project/docling-serve
    expose:
      - "5000"

  docling-2:
    image: quay.io/docling-project/docling-serve
    expose:
      - "5000"

  docling-3:
    image: quay.io/docling-project/docling-serve
    expose:
      - "5000"
```

**Nginx Config:**
```nginx
upstream docling_backend {
    least_conn;
    server docling-1:5000;
    server docling-2:5000;
    server docling-3:5000;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://docling_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### Kubernetes Auto-Scaling

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: docling-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: docling-serve
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

**Result:**
- Scales up when CPU > 70%
- Scales down when CPU < 50%
- Min 3 pods, max 20 pods
- Auto-recovery on failures

---

### Async Processing (Celery)

**For large document batches:**

```python
from celery import Celery
from docling.document_converter import DocumentConverter

app = Celery('docling_tasks', broker='redis://localhost:6379')

converter = DocumentConverter()

@app.task
def convert_document(file_path: str, user_id: str):
    result = converter.convert(file_path)
    
    # Store in DB
    db.save_result(user_id, result.document.export_to_dict())
    
    # Notify user
    notify_user(user_id, "Document ready!")
    
    return result.document.export_to_markdown()
```

**Usage:**
```python
# Enqueue job
task = convert_document.delay("/path/to/doc.pdf", "user123")

# Check status
print(task.status)  # PENDING, STARTED, SUCCESS, FAILURE

# Get result (blocks until complete)
result = task.get()
```

---

## Performance Benchmarks

### Conversion Speed

| Document Type | Pages | Time (dlparse_v2) | Time (pypdfium2) |
|---------------|-------|-------------------|------------------|
| Simple text   | 10    | 5s                | 2s               |
| Complex layout| 10    | 8s                | 3s               |
| With tables   | 10    | 10s               | 4s               |
| With OCR      | 10    | 25s               | N/A              |
| Large doc     | 100   | 45s               | 18s              |

### Throughput

| Configuration | Documents/Min | Cost/Hour (₹) |
|---------------|---------------|---------------|
| 1 instance    | 10-20         | ₹100          |
| 3 instances   | 30-60         | ₹300          |
| 10 instances  | 100-200       | ₹1,000        |
| K8s (auto)    | 50-500        | ₹500-5,000    |

---

## Resource Requirements

### Single Instance

```yaml
CPU: 1-2 cores
Memory: 2-4 GB
Storage: 10 GB (temp files)
Network: 100 Mbps
```

### Production Cluster (100 docs/min)

```yaml
Instances: 5-10
Total CPU: 10-20 cores
Total Memory: 20-40 GB
Load Balancer: 1 instance
Message Queue: Redis/RabbitMQ (1 instance)
Storage: S3/GCS for document archive
```

---

## Monitoring & Observability

### Health Checks

```python
# Liveness probe
GET /health
→ 200 if server is up

# Readiness probe
GET /ready
→ 200 if ready to accept requests
```

### Metrics

**Key Metrics to Track:**
- Conversion time (p50, p95, p99)
- Throughput (docs/min)
- Error rate (%)
- Queue depth (for async)
- CPU/memory usage
- Disk I/O

**Prometheus Example:**
```python
from prometheus_client import Counter, Histogram

conversions_total = Counter('docling_conversions_total', 'Total conversions')
conversion_duration = Histogram('docling_conversion_seconds', 'Conversion time')

@conversion_duration.time()
def convert_document(path):
    result = converter.convert(path)
    conversions_total.inc()
    return result
```

---

## Security Considerations

### Input Validation

```python
# Validate file size
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB

if file.size > MAX_FILE_SIZE:
    raise ValueError("File too large")

# Validate MIME type
ALLOWED_TYPES = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

if file.content_type not in ALLOWED_TYPES:
    raise ValueError("Invalid file type")
```

### Sandboxing

**Run in Docker container with:**
- Read-only root filesystem
- No network access (for conversion)
- Resource limits (CPU, memory)
- Non-root user

```dockerfile
FROM python:3.13-slim

# Create non-root user
RUN useradd -m -u 1000 docling

USER docling

# Install Docling
RUN pip install docling

CMD ["docling-serve", "run"]
```

### Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/convert")
@limiter.limit("10/minute")
async def convert_document(file: UploadFile):
    # Convert document
```

---

## Error Handling

### Retry Logic

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def convert_with_retry(file_path):
    return converter.convert(file_path)
```

### Graceful Degradation

```python
def convert_document(file_path):
    try:
        # Try with OCR
        converter = DocumentConverter(do_ocr=True)
        return converter.convert(file_path)
    except OCRError:
        # Fallback to non-OCR
        converter = DocumentConverter(do_ocr=False)
        return converter.convert(file_path)
    except Exception as e:
        # Log error and return fallback
        logger.error(f"Conversion failed: {e}")
        return create_fallback_result(file_path)
```

---

**Last Updated:** 2026-04-23  
**Version:** 1.0.0
