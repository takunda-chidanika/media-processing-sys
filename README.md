# Docker Setup Guide

## Run the Project Using Docker

### Prerequisites

- Docker installed ([Download Docker](https://www.docker.com/get-started))
- Docker Compose (comes with Docker Desktop)
- At least 2GB RAM allocated to Docker

### Quick Start

1. **Clone the repository:**
   ```bash
       git clone https://github.com/takunda-chidanika/media-processing-sys.git
       cd media-processing-sys
   ```
2. **Create environment file:**   Edit the .env file with your configuration.

  ```bash
    REDIS_HOST=  "127.0.0.1"
    REDIS_PORT= 6379
    REDIS_URL= "localhost:6379"
    STORAGE_PATH= "./processed/"
    BASE_URL=  "http://localhost"
    PORT=3200
   ```

3. **Build and start containers:**

  ```bash
    docker-compose up --build -d
   ```

**Stop the Application:**

```bash
  docker-compose down
```

**Restart the Application:**

```bash
      docker-compose restart
```

**View Logs**

```bash
      docker-compose logs -f media-app
```
### Access API Documentation
API Docs http://localhost/api/api-docs/ \
API Docs http://localhost:3200/api/api-docs/

### Access Services
API Server	http://localhost:3200 \
Nginx Proxy	http://localhost 



