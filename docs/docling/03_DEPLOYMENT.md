# Docling Production Deployment Guide

**Step-by-Step Guide to Deploying Docling in Production Environments**

---

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Docker Deployment](#docker-deployment)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Cloud Deployments](#cloud-deployments)
7. [Configuration Management](#configuration-management)
8. [Monitoring & Logging](#monitoring--logging)
9. [Security Hardening](#security-hardening)
10. [Backup & Disaster Recovery](#backup--disaster-recovery)
11. [Performance Optimization](#performance-optimization)
12. [Troubleshooting](#troubleshooting)

---

## Deployment Overview

### Deployment Options Matrix

| Option | Complexity | Scalability | Cost | Use Case |
|--------|------------|-------------|------|----------|
| **Python Library** | Low | Low | Low | Development, scripts |
| **Docker Single** | Low | Medium | Low | Small production |
| **Docker Compose** | Medium | Medium | Medium | Multi-service apps |
| **Kubernetes** | High | Very High | Medium-High | Enterprise production |
| **Serverless** | Medium | High | Variable | Event-driven workloads |

---

## Prerequisites

### System Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 4 GB
- Storage: 20 GB
- OS: Linux (Ubuntu 22.04+ recommended)

**Recommended (Production):**
- CPU: 4-8 cores
- RAM: 8-16 GB
- Storage: 100 GB SSD
- OS: Ubuntu 22.04 LTS or RHEL 9

### Software Dependencies

```bash
# Python 3.10+
python --version  # >= 3.10

# Docker (for container deployments)
docker --version  # >= 20.10

# kubectl (for Kubernetes)
kubectl version  # >= 1.25

# Optional: Ollama (for MCP integration)
ollama --version
```

---

## Local Development Setup

### Step 1: Install Python & Dependencies

```bash
# Using uv (recommended)
curl -LsSf https://astral.sh/uv/install.sh | sh
uv python install --default 3.13
uv python update-shell

# Or using system Python
sudo apt-get update
sudo apt-get install python3.13 python3.13-venv
```

### Step 2: Create Virtual Environment

```bash
# With uv
cd ~/docling-workspace
uv venv --clear --seed --python 3.13 venv

# Activate
source venv/bin/activate

# Or with standard venv
python3.13 -m venv venv
source venv/bin/activate
```

### Step 3: Install Docling

```bash
# Core library
uv pip install docling

# REST API server
uv pip install docling-serve

# Optional: OCR support
uv pip install easyocr

# Optional: MCP server
uv pip install docling-mcp
```

### Step 4: Verify Installation

```python
# test_docling.py
from docling.document_converter import DocumentConverter

converter = DocumentConverter()
print("Docling installed successfully!")
```

```bash
python test_docling.py
# Output: Docling installed successfully!
```

---

## Docker Deployment

### Single Container (Simple)

#### Dockerfile

```dockerfile
# Dockerfile
FROM python:3.13-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Docling
RUN pip install --no-cache-dir docling docling-serve

# Create non-root user
RUN useradd -m -u 1000 docling && chown -R docling:docling /app
USER docling

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Run server
CMD ["docling-serve", "run", "--host", "0.0.0.0", "--port", "5000"]
```

#### Build & Run

```bash
# Build image
docker build -t docling-serve:latest .

# Run container
docker run -d \
  --name docling-server \
  -p 5000:5000 \
  --memory 4g \
  --cpus 2 \
  --restart unless-stopped \
  docling-serve:latest

# Check logs
docker logs -f docling-server

# Test
curl http://localhost:5000/health
```

---

### Docker Compose (Multi-Service)

#### docker-compose.yml

```yaml
version: '3.8'

services:
  docling:
    image: quay.io/docling-project/docling-serve:latest
    container_name: docling-server
    ports:
      - "5000:5000"
    environment:
      - DOCLING_OCR_ENABLED=false
      - DOCLING_LOG_LEVEL=info
    volumes:
      - docling-temp:/tmp
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 4G
        reservations:
          cpus: '1'
          memory: 2G
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 30s
    restart: unless-stopped
    networks:
      - docling-network

  # Optional: Redis for caching
  redis:
    image: redis:7-alpine
    container_name: docling-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped
    networks:
      - docling-network

  # Optional: Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: docling-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - docling
    restart: unless-stopped
    networks:
      - docling-network

volumes:
  docling-temp:
  redis-data:

networks:
  docling-network:
    driver: bridge
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    upstream docling_backend {
        least_conn;
        server docling:5000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=docling_limit:10m rate=10r/s;

    server {
        listen 80;
        server_name docling.example.com;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name docling.example.com;

        # SSL certificates
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        # SSL configuration
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Max upload size (100 MB)
        client_max_body_size 100M;

        # Timeouts
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;

        location / {
            limit_req zone=docling_limit burst=20 nodelay;

            proxy_pass http://docling_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check endpoint (no rate limit)
        location /health {
            proxy_pass http://docling_backend;
        }
    }
}
```

#### Deploy

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f docling

# Scale Docling instances
docker-compose up -d --scale docling=3

# Stop services
docker-compose down
```

---

## Kubernetes Deployment

### Complete K8s Manifests

#### Namespace

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: docling-production
```

#### ConfigMap

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: docling-config
  namespace: docling-production
data:
  DOCLING_OCR_ENABLED: "false"
  DOCLING_LOG_LEVEL: "info"
  DOCLING_MAX_WORKERS: "4"
```

#### Secret

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: docling-secrets
  namespace: docling-production
type: Opaque
data:
  # Base64 encoded values
  API_KEY: <base64-encoded-api-key>
```

#### Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docling-serve
  namespace: docling-production
  labels:
    app: docling
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: docling
  template:
    metadata:
      labels:
        app: docling
        version: v1
    spec:
      containers:
      - name: docling
        image: quay.io/docling-project/docling-serve:latest
        ports:
        - containerPort: 5000
          name: http
        envFrom:
        - configMapRef:
            name: docling-config
        - secretRef:
            name: docling-secrets
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 30
          timeoutSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 10
          periodSeconds: 10
        volumeMounts:
        - name: tmp
          mountPath: /tmp
      volumes:
      - name: tmp
        emptyDir: {}
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
```

#### Service

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: docling-service
  namespace: docling-production
spec:
  selector:
    app: docling
  ports:
  - port: 80
    targetPort: 5000
    protocol: TCP
    name: http
  type: ClusterIP
```

#### Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: docling-ingress
  namespace: docling-production
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "100m"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "120"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "120"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "120"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - docling.example.com
    secretName: docling-tls
  rules:
  - host: docling.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: docling-service
            port:
              number: 80
```

#### HorizontalPodAutoscaler

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: docling-hpa
  namespace: docling-production
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
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
```

#### Deploy to Kubernetes

```bash
# Create namespace
kubectl apply -f namespace.yaml

# Apply all manifests
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml

# Check status
kubectl get all -n docling-production

# View logs
kubectl logs -f -l app=docling -n docling-production

# Scale manually
kubectl scale deployment docling-serve --replicas=5 -n docling-production

# Port forward (for testing)
kubectl port-forward svc/docling-service 5000:80 -n docling-production
```

---

## Cloud Deployments

### AWS ECS (Elastic Container Service)

#### Task Definition (JSON)

```json
{
  "family": "docling-serve",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "2048",
  "memory": "4096",
  "containerDefinitions": [
    {
      "name": "docling",
      "image": "quay.io/docling-project/docling-serve:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DOCLING_OCR_ENABLED",
          "value": "false"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/docling-serve",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:5000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 30
      }
    }
  ]
}
```

#### Deploy with AWS CLI

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name docling-cluster

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster docling-cluster \
  --service-name docling-service \
  --task-definition docling-serve \
  --desired-count 3 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

---

### Google Cloud Run

```bash
# Build and push to GCR
docker build -t gcr.io/PROJECT_ID/docling-serve .
docker push gcr.io/PROJECT_ID/docling-serve

# Deploy to Cloud Run
gcloud run deploy docling-serve \
  --image gcr.io/PROJECT_ID/docling-serve \
  --platform managed \
  --region us-central1 \
  --memory 4Gi \
  --cpu 2 \
  --max-instances 10 \
  --allow-unauthenticated \
  --port 5000
```

---

### Azure Container Instances

```bash
# Create resource group
az group create --name docling-rg --location eastus

# Deploy container
az container create \
  --resource-group docling-rg \
  --name docling-server \
  --image quay.io/docling-project/docling-serve:latest \
  --cpu 2 \
  --memory 4 \
  --ports 5000 \
  --dns-name-label docling-server \
  --environment-variables DOCLING_OCR_ENABLED=false
```

---

## Configuration Management

### Environment Variables

```bash
# Core settings
DOCLING_OCR_ENABLED=false              # Enable/disable OCR
DOCLING_PDF_BACKEND=dlparse_v2         # PDF backend (dlparse_v2 or pypdfium2)
DOCLING_LOG_LEVEL=info                 # Logging level
DOCLING_MAX_WORKERS=4                  # Worker processes

# Server settings (docling-serve)
DOCLING_HOST=0.0.0.0
DOCLING_PORT=5000
DOCLING_RELOAD=false                   # Hot reload (dev only)

# Performance
DOCLING_MAX_UPLOAD_SIZE=104857600      # 100 MB
DOCLING_TIMEOUT=120                    # Request timeout (seconds)
DOCLING_CONCURRENCY=10                 # Max concurrent conversions
```

### Configuration File

```yaml
# docling-config.yaml
ocr:
  enabled: false
  languages: ["en"]
  engine: easyocr

pdf:
  backend: dlparse_v2
  extract_images: true
  extract_tables: true

chunking:
  max_tokens: 512
  include_heading: true

server:
  host: 0.0.0.0
  port: 5000
  workers: 4
  timeout: 120

logging:
  level: info
  format: json
```

**Load config:**
```python
import yaml
from docling.document_converter import DocumentConverter

with open("docling-config.yaml") as f:
    config = yaml.safe_load(f)

converter = DocumentConverter(
    do_ocr=config["ocr"]["enabled"],
    pdf_backend=config["pdf"]["backend"]
)
```

---

## Monitoring & Logging

### Prometheus Metrics

```python
# Add to docling-serve
from prometheus_client import Counter, Histogram, Gauge, generate_latest

# Metrics
conversions_total = Counter('docling_conversions_total', 'Total conversions', ['status'])
conversion_duration = Histogram('docling_conversion_seconds', 'Conversion duration')
active_conversions = Gauge('docling_active_conversions', 'Active conversions')

@app.post("/convert")
async def convert_endpoint(file: UploadFile):
    active_conversions.inc()
    start = time.time()
    
    try:
        result = converter.convert(file.file)
        conversions_total.labels(status='success').inc()
        return result
    except Exception as e:
        conversions_total.labels(status='error').inc()
        raise
    finally:
        conversion_duration.observe(time.time() - start)
        active_conversions.dec()

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Docling Production Metrics",
    "panels": [
      {
        "title": "Conversions/min",
        "targets": [
          {
            "expr": "rate(docling_conversions_total[1m])"
          }
        ]
      },
      {
        "title": "Conversion Duration (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, docling_conversion_seconds_bucket)"
          }
        ]
      },
      {
        "title": "Active Conversions",
        "targets": [
          {
            "expr": "docling_active_conversions"
          }
        ]
      }
    ]
  }
}
```

---

## Security Hardening

### 1. Input Validation

```python
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB
ALLOWED_MIME_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
]

@app.post("/convert")
async def convert_endpoint(file: UploadFile):
    # Validate size
    if file.size > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large")
    
    # Validate MIME type
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(415, "Unsupported file type")
    
    # Scan for malware (optional)
    # scan_file(file)
    
    result = converter.convert(file.file)
    return result
```

### 2. Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/convert")
@limiter.limit("10/minute")
async def convert_endpoint(file: UploadFile):
    # Convert document
```

### 3. API Key Authentication

```python
from fastapi.security import APIKeyHeader

API_KEY_HEADER = APIKeyHeader(name="X-API-Key")

def verify_api_key(api_key: str = Depends(API_KEY_HEADER)):
    if api_key not in VALID_API_KEYS:
        raise HTTPException(401, "Invalid API key")
    return api_key

@app.post("/convert")
async def convert_endpoint(
    file: UploadFile,
    api_key: str = Depends(verify_api_key)
):
    # Convert document
```

---

## Backup & Disaster Recovery

### Document Archive Strategy

```bash
# S3 backup script
#!/bin/bash

# Upload converted documents to S3
aws s3 sync /var/docling/output/ s3://docling-archive/ \
  --storage-class INTELLIGENT_TIERING \
  --exclude "*.tmp" \
  --exclude "*.log"

# Retain for 90 days
aws s3api put-bucket-lifecycle-configuration \
  --bucket docling-archive \
  --lifecycle-configuration file://lifecycle.json
```

### Database Backup

```bash
# Backup metadata database
pg_dump docling_metadata > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_*.sql s3://docling-backups/db/
```

---

## Performance Optimization

### 1. Caching Strategy

```python
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def convert_with_cache(file_hash: str, file_path: str):
    return converter.convert(file_path)

@app.post("/convert")
async def convert_endpoint(file: UploadFile):
    # Calculate file hash
    file_content = await file.read()
    file_hash = hashlib.sha256(file_content).hexdigest()
    
    # Check cache
    result = convert_with_cache(file_hash, file.filename)
    return result
```

### 2. Async Processing

```python
from celery import Celery

celery_app = Celery('docling', broker='redis://localhost:6379')

@celery_app.task
def convert_async(file_path: str):
    result = converter.convert(file_path)
    return result.document.export_to_dict()

@app.post("/convert/async")
async def convert_async_endpoint(file: UploadFile):
    # Save file
    file_path = save_upload(file)
    
    # Enqueue task
    task = convert_async.delay(file_path)
    
    return {"task_id": task.id, "status": "processing"}
```

---

## Troubleshooting

### Common Issues

**1. Out of Memory**
```bash
# Symptoms
docker logs docling-server
# OOMKilled

# Solution
# Increase memory limit
docker run --memory 8g docling-serve
```

**2. Slow Conversions**
```bash
# Check CPU usage
docker stats docling-server

# Scale up
docker-compose up -d --scale docling=5
```

**3. OCR Failures**
```bash
# Check EasyOCR installation
pip list | grep easyocr

# Reinstall
pip uninstall easyocr
pip install easyocr
```

---

**Last Updated:** 2026-04-23  
**Version:** 1.0.0
