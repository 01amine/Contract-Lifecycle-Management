# Use Python 3.11 slim base image
FROM python:3.11-slim

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Set working directory
WORKDIR /app

# Install system dependencies (including tesseract for pytesseract)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Install uv (Python package manager)
RUN pip install --no-cache-dir uv

# Copy project files
COPY pyproject.toml ./
COPY uv.lock* ./
COPY ./app ./app

# Sync dependencies using uv
RUN uv sync

# Install specific packages with pip that might have issues with uv
RUN uv pip install --system \
    python-docx \
    google-generativeai \
    qdrant-client

# Expose port
EXPOSE 8000

# Run FastAPI app using uv
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]