# Setup Guide - Smart Agriculture Big Data Analytics Platform

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Setup](#docker-setup)
4. [Configuration](#configuration)
5. [Running the Pipeline](#running-the-pipeline)
6. [Accessing Services](#accessing-services)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Python** 3.8 or higher
- **Docker** & **Docker Compose** (for containerized setup)
- **Git** for version control
- **VS Code** or any IDE of choice

### Hardware Requirements
- Minimum 8GB RAM (16GB recommended)
- 50GB free disk space (for data storage)
- Multi-core processor (4+ cores recommended)

### System Requirements
- Linux, macOS, or Windows (with WSL2 for Windows)
- Internet connectivity for downloading data

---

## Local Development Setup

### Step 1: Clone Repository

```bash
# Clone the project
git clone https://github.com/yourusername/smart-agri-bigdata
cd smart-agri-bigdata

# Or navigate to existing folder
cd c:\Users\hhare\OneDrive\Desktop\bda\agri_analytics
```

### Step 2: Create Virtual Environment

**On Windows:**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Upgrade pip
python -m pip install --upgrade pip
```

**On macOS/Linux:**
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
python -m pip install --upgrade pip
```

### Step 3: Install Dependencies

```bash
# Install all required packages
pip install -r requirements.txt

# Verify installation
python -c "import pandas; import pyspark; print('All dependencies installed!')"
```

### Step 4: Set Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
# On Windows
notepad .env

# On macOS/Linux
nano .env
```

**Example .env file:**
```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/agri_analytics
MONGODB_USER=admin
MONGODB_PASSWORD=password

# PostgreSQL
POSTGRES_URI=postgresql://admin:password@localhost:5432/agri_analytics
POSTGRES_USER=admin
POSTGRES_PASSWORD=password

# Spark
SPARK_MASTER=local[*]
SPARK_MEMORY=4g

# Hive
HIVE_HOST=localhost
HIVE_PORT=10000

# Flask
FLASK_ENV=development
FLASK_DEBUG=True
API_PORT=5000

# Data Paths
DATA_RAW_PATH=./data/raw
DATA_CLEANED_PATH=./data/cleaned
DATA_PROCESSED_PATH=./data/processed
```

---

## Docker Setup

### Step 1: Install Docker

**On Windows:**
1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Install and restart your machine
3. Enable WSL2 (Windows Subsystem for Linux)

**On macOS:**
1. Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. Install and start Docker

**On Linux:**
```bash
# Install Docker
sudo apt-get install docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

### Step 2: Build and Run Containers

```bash
# Navigate to project root
cd smart-agri-bigdata

# Build custom images
docker-compose build

# Start all services (in background)
docker-compose up -d

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Step 3: Verify Services

```bash
# Check if all containers are healthy
docker-compose ps

# Test MongoDB connection
docker exec agri-mongodb mongosh -u admin -p password --eval "db.adminCommand('ping')"

# Test Hadoop
docker exec agri-hadoop-namenode hdfs dfsadmin -report

# Test Spark
docker exec agri-spark-master spark-shell --version
```

---

## Configuration

### MongoDB Setup

```bash
# Connect to MongoDB
docker exec -it agri-mongodb mongosh -u admin -p password

# Create databases and collections
use agri_analytics

# Create collections
db.createCollection("weather")
db.createCollection("soil")
db.createCollection("crops")
db.createCollection("market_prices")
db.createCollection("diseases")
db.createCollection("predictions")

# Create indexes for performance
db.weather.createIndex({ date: -1, location: 1 })
db.crops.createIndex({ crop_type: 1, season: 1 })
```

### PostgreSQL Setup

```bash
# Connect to PostgreSQL
docker exec -it agri-postgres psql -U admin -d agri_analytics

# Create tables
CREATE TABLE IF NOT EXISTS farmers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    location VARCHAR(255),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farm_data (
    id SERIAL PRIMARY KEY,
    farmer_id INT REFERENCES farmers(id),
    date DATE,
    rainfall FLOAT,
    temperature FLOAT,
    humidity FLOAT,
    crop_type VARCHAR(100),
    yield FLOAT
);

-- Create indexes
CREATE INDEX idx_farm_date ON farm_data(date);
CREATE INDEX idx_farm_farmer ON farm_data(farmer_id);
```

### Hadoop/HDFS Setup

```bash
# Create HDFS directories
docker exec agri-hadoop-namenode hdfs dfs -mkdir -p /agri_analytics/{raw,cleaned,processed}

# Set permissions
docker exec agri-hadoop-namenode hdfs dfs -chmod 755 /agri_analytics

# Verify directories
docker exec agri-hadoop-namenode hdfs dfs -ls /agri_analytics
```

### Hive Setup

```bash
# Start Hive shell
docker exec -it agri-hive-server hive

# Create database
CREATE DATABASE IF NOT EXISTS agri_analytics LOCATION '/agri_analytics/warehouse';

# Create tables
CREATE EXTERNAL TABLE weather (
    date STRING,
    location STRING,
    rainfall FLOAT,
    temperature FLOAT,
    humidity FLOAT
)
PARTITIONED BY (year INT, month INT, state STRING)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ','
STORED AS TEXTFILE
LOCATION '/agri_analytics/weather';

-- Add partitions
ALTER TABLE weather ADD PARTITION (year=2024, month=1, state='Punjab');
```

---

## Running the Pipeline

### Step 1: Collect Data

```bash
# Run data collection script
python src/etl/data_collector.py

# This will:
# - Fetch weather API data
# - Download agricultural datasets
# - Store in MongoDB and HDFS
```

### Step 2: Clean & Validate Data

```bash
# Run data validation
python src/etl/data_validator.py

# Run data cleaning
python src/etl/data_transformer.py

# Output: Cleaned data in data/cleaned/
```

### Step 3: Run Spark Processing

```bash
# Submit Spark job
spark-submit src/spark/spark_engine.py

# Or run with specific master
spark-submit --master spark://spark-master:7077 src/spark/spark_engine.py

# Monitor job
# Visit http://localhost:8080 (Spark UI)
```

### Step 4: Run Hive Analytics

```bash
# Execute Hive queries
hive -f src/hadoop/hive_queries.hql

# Or use Beeline
beeline -u jdbc:hive2://localhost:10000
```

### Step 5: Train Machine Learning Models

```bash
# Train all models
python src/analytics/train_all_models.py

# Train specific model
python src/analytics/yield_prediction.py
python src/analytics/disease_detection.py
python src/analytics/market_prediction.py

# Models saved in models/ directory
```

### Step 6: Start API Server

```bash
# Run API in local environment
python src/api.py

# Or using Flask
export FLASK_APP=src/api.py
flask run --port 5000

# Or in Docker
docker-compose up api-server
```

### Step 7: Access Web Interface

```bash
# Open in browser
http://localhost:5000
http://localhost:5001  # Alternative port
```

---

## Accessing Services

### Web Applications

| Service | URL | Purpose |
|---------|-----|---------|
| **Home** | http://localhost:5000 | Landing page |
| **Dashboard** | http://localhost:5000/dashboard | KPIs & Overview |
| **Analysis** | http://localhost:5000/analysis | Comprehensive analysis |
| **API** | http://localhost:5000/api | REST API endpoints |

### Big Data Tools

| Service | URL | Purpose |
|---------|-----|---------|
| **Jupyter** | http://localhost:8888 | Notebooks |
| **Spark UI** | http://localhost:8080 | Spark monitoring |
| **Hadoop NameNode** | http://localhost:50070 | HDFS monitoring |
| **Airflow** | http://localhost:8070 | Workflow scheduling |
| **Hive Server** | localhost:10000 | SQL query engine |

### Databases

| Service | Connection |
|---------|-----------|
| **MongoDB** | mongodb://admin:password@localhost:27017 |
| **PostgreSQL** | postgresql://admin:password@localhost:5432 |
| **HDFS NameNode** | hdfs://localhost:9000 |

---

## Troubleshooting

### Docker Issues

**Problem**: Containers won't start
```bash
# Solution: Check logs
docker-compose logs -f service_name

# Rebuild images
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Problem**: Port already in use
```bash
# Solution: Change port in docker-compose.yml or kill process
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Linux/macOS
lsof -i :5000
kill -9 <PID>
```

### Python/Dependency Issues

**Problem**: Module not found
```bash
# Solution: Reinstall dependencies
pip install --upgrade -r requirements.txt
pip install -e .
```

**Problem**: Incompatible versions
```bash
# Solution: Create fresh virtual environment
deactivate
rm -rf venv
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Database Connection Issues

**Problem**: Cannot connect to MongoDB
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Check logs
docker logs agri-mongodb

# Test connection
docker exec agri-mongodb mongosh -u admin -p password --eval "db.adminCommand('ping')"
```

**Problem**: Cannot connect to PostgreSQL
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs agri-postgres

# Test connection
docker exec agri-postgres psql -U admin -d agri_analytics -c "SELECT version();"
```

### API Issues

**Problem**: API won't start
```bash
# Check if port is available
curl http://localhost:5000/health

# Check Flask logs
python src/api.py  # Run in foreground to see errors
```

**Problem**: Slow API responses
```bash
# Check if models are trained
ls -la models/

# Train models if missing
python src/analytics/train_all_models.py

# Monitor API performance
curl http://localhost:5000/api/performance
```

---

## Next Steps

1. **Data Ingestion**: Load your agricultural data (see DATA_COLLECTION.md)
2. **Exploratory Analysis**: Run Jupyter notebooks (notebooks/)
3. **Model Training**: Train ML models (src/analytics/)
4. **Dashboard Development**: Create Tableau dashboards
5. **Deployment**: Deploy to production (see DEPLOYMENT.md)

---

## Support

For issues or questions:
- Check documentation in docs/ folder
- Review error logs in logs/ folder
- Open issue on GitHub
- Contact: support@agri-analytics.com

---

**Happy Analytics! 🌾📊**
