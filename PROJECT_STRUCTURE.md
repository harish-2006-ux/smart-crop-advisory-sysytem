# Project Structure - Smart Agriculture Big Data Analytics Platform

---

## 📁 Complete Directory Layout

```
smart-agri-bigdata/
│
├── 📄 README.md                         # Project overview & getting started
├── 📄 SETUP.md                          # Installation & configuration guide
├── 📄 PROJECT_STRUCTURE.md              # This file
├── 📄 requirements.txt                  # Python dependencies
├── 📄 docker-compose.yml                # Docker services configuration
├── 📄 .env.example                      # Environment variables template
├── 📄 .gitignore                        # Git ignore rules
│
├── 📁 src/                              # Source code
│   ├── 📄 main.py                       # Main pipeline orchestrator
│   ├── 📄 api.py                        # REST API server (Flask)
│   ├── 📄 web_app.py                    # Web application (HTML interface)
│   │
│   ├── 📁 etl/                          # Extract-Transform-Load
│   │   ├── 📄 __init__.py
│   │   ├── 📄 data_collector.py        # Collect from APIs & files
│   │   ├── 📄 data_validator.py        # Data quality checks
│   │   ├── 📄 data_transformer.py      # Clean & standardize data
│   │   └── 📄 data_loader.py           # Load to databases
│   │
│   ├── 📁 analytics/                    # Machine Learning Modules
│   │   ├── 📄 __init__.py
│   │   ├── 📄 yield_prediction.py      # Predict crop yield (Regression)
│   │   ├── 📄 disease_detection.py     # Detect diseases (Classification)
│   │   ├── 📄 irrigation_recommender.py # Water management
│   │   ├── 📄 market_prediction.py     # Price forecasting
│   │   ├── 📄 pest_detection.py        # Pest risk assessment
│   │   ├── 📄 train_all_models.py      # Train all ML models
│   │   └── 📄 model_evaluation.py      # Model performance metrics
│   │
│   ├── 📁 spark/                        # Apache Spark Jobs
│   │   ├── 📄 spark_engine.py          # Distributed data processing
│   │   ├── 📄 spark_streaming.py       # Real-time data processing
│   │   ├── 📄 spark_sql_queries.py     # SQL analytics
│   │   └── 📄 spark_config.py          # Spark configuration
│   │
│   ├── 📁 mongodb/                      # MongoDB Operations
│   │   ├── 📄 mongo_handler.py         # Connection & CRUD
│   │   ├── 📄 mongo_queries.py         # Aggregation queries
│   │   ├── 📄 mongo_schema.py          # Data schema definitions
│   │   └── 📄 mongo_backup.py          # Backup & restore
│   │
│   ├── 📁 hadoop/                       # Hadoop/HDFS Operations
│   │   ├── 📄 hdfs_handler.py          # HDFS file operations
│   │   ├── 📄 hive_queries.hql         # Hive SQL queries
│   │   ├── 📄 pig_scripts.pig          # Pig ETL scripts
│   │   └── 📄 hadoop_config.py         # Hadoop configuration
│   │
│   ├── 📁 utils/                        # Utility Functions
│   │   ├── 📄 logger.py                # Logging configuration
│   │   ├── 📄 config_manager.py        # Configuration management
│   │   ├── 📄 data_validator.py        # Data validation utils
│   │   ├── 📄 performance_monitor.py   # Performance tracking
│   │   └── 📄 error_handler.py         # Error handling
│   │
│   └── 📁 templates/                    # HTML Templates
│       ├── 📄 base.html                # Base template
│       ├── 📄 index.html               # Home page
│       ├── 📄 dashboard.html           # Dashboard
│       ├── 📄 analysis.html            # Analysis page
│       ├── 📄 pest_detection.html      # Pest detection
│       ├── 📄 market_prediction.html   # Market prices
│       ├── 📄 performance.html         # Performance metrics
│       ├── 📄 404.html                 # Error pages
│       └── 📄 500.html
│
├── 📁 data/                             # Data Storage
│   ├── 📁 raw/                          # Raw data from sources
│   │   ├── 📁 weather/                 # Weather API responses
│   │   ├── 📁 soil/                    # Soil datasets
│   │   ├── 📁 crops/                   # Crop production data
│   │   └── 📁 market/                  # Market price data
│   │
│   ├── 📁 cleaned/                      # Processed data
│   │   ├── weather_clean.csv
│   │   ├── soil_clean.csv
│   │   ├── crops_clean.csv
│   │   └── market_clean.csv
│   │
│   ├── 📁 processed/                    # Feature engineered data
│   │   └── features_engineered.parquet
│   │
│   └── 📁 outputs/                      # Analysis results
│       ├── predictions.csv
│       ├── recommendations.csv
│       └── reports/
│
├── 📁 models/                           # Trained ML Models
│   ├── yield_model.pkl                 # Yield prediction
│   ├── disease_model.pkl               # Disease detection
│   ├── market_model.pkl                # Market prediction
│   ├── pest_model.pkl                  # Pest detection
│   ├── irrigation_model.pkl            # Irrigation recommendation
│   └── model_metadata.json             # Model versions & metrics
│
├── 📁 notebooks/                        # Jupyter Notebooks
│   ├── 00_setup.ipynb                  # Environment setup
│   ├── 01_eda.ipynb                    # Exploratory data analysis
│   ├── 02_data_cleaning.ipynb          # Data preprocessing
│   ├── 03_feature_engineering.ipynb    # Feature creation
│   ├── 04_model_training.ipynb         # ML model training
│   ├── 05_model_evaluation.ipynb       # Model performance analysis
│   ├── 06_visualizations.ipynb         # Create visualizations
│   └── 07_production_pipeline.ipynb    # Production workflow
│
├── 📁 docker/                           # Docker Configuration
│   ├── 📄 Dockerfile.base              # Base image
│   ├── 📄 Dockerfile.api               # API container
│   ├── 📄 Dockerfile.spark             # Spark container
│   ├── 📄 docker-compose.yml           # Service orchestration
│   │
│   ├── 📁 mongodb/
│   │   ├── 📄 Dockerfile
│   │   ├── 📄 init.js                  # MongoDB initialization
│   │   └── 📄 mongod.conf              # MongoDB config
│   │
│   ├── 📁 hadoop/
│   │   ├── 📄 Dockerfile
│   │   ├── 📄 core-site.xml            # Core configuration
│   │   └── 📄 hdfs-site.xml            # HDFS configuration
│   │
│   ├── 📁 spark/
│   │   ├── 📄 Dockerfile
│   │   └── 📄 spark-defaults.conf      # Spark configuration
│   │
│   └── 📁 jupyter/
│       ├── 📄 Dockerfile
│       └── 📄 jupyter_notebook_config.py
│
├── 📁 config/                           # Configuration Files
│   ├── 📄 config.yaml                  # Main configuration
│   ├── 📄 schema.json                  # Data schema definitions
│   ├── 📄 database.yaml                # Database config
│   ├── 📄 logging.yaml                 # Logging configuration
│   └── 📄 env.example                  # Example environment variables
│
├── 📁 scripts/                          # Executable Scripts
│   ├── 📄 setup.sh                     # One-time setup
│   ├── 📄 download_data.sh             # Download datasets
│   ├── 📄 train_models.sh              # Train all models
│   ├── 📄 run_pipeline.sh              # Run complete pipeline
│   ├── 📄 deploy.sh                    # Deploy to production
│   └── 📄 backup_data.sh               # Backup script
│
├── 📁 tests/                            # Unit & Integration Tests
│   ├── 📄 __init__.py
│   ├── 📄 test_etl.py                  # ETL pipeline tests
│   ├── 📄 test_analytics.py            # ML module tests
│   ├── 📄 test_spark.py                # Spark job tests
│   ├── 📄 test_api.py                  # API endpoint tests
│   ├── 📄 test_mongodb.py              # Database tests
│   ├── 📄 conftest.py                  # Pytest configuration
│   └── fixtures/                        # Test data
│
├── 📁 docs/                             # Documentation
│   ├── 📄 ARCHITECTURE.md              # System architecture
│   ├── 📄 API_GUIDE.md                 # REST API documentation
│   ├── 📄 DATA_PIPELINE.md             # ETL workflow
│   ├── 📄 ML_MODELS.md                 # Model documentation
│   ├── 📄 DATABASE_SCHEMA.md           # Database design
│   ├── 📄 DEPLOYMENT.md                # Production deployment
│   └── 📄 TROUBLESHOOTING.md           # Common issues
│
├── 📁 dashboard/                        # BI Dashboards
│   ├── 📄 tableau_workbook.twb         # Tableau dashboard
│   ├── 📄 powerbi_report.pbix          # Power BI report
│   └── 📄 README.md                    # Dashboard guide
│
└── 📁 logs/                             # Application Logs
    ├── 📄 app.log
    ├── 📄 etl.log
    ├── 📄 spark.log
    └── 📄 api.log
```

---

## 📊 Component Details

### 1. Data Layer (data/)

**Raw Data**
- Weather API responses (JSON)
- Agricultural CSV files
- Soil datasets
- Market price feeds

**Cleaned Data**
- Deduplicated records
- Standardized formats
- Missing value handling
- Normalized values

**Processed Data**
- Feature-engineered datasets
- Aggregations & summaries
- Ready for ML training

### 2. ETL Pipeline (src/etl/)

```
data_collector.py
  ↓ Fetches data from APIs & downloads CSVs
  ↓
data_validator.py
  ↓ Schema validation & quality checks
  ↓
data_transformer.py
  ↓ Cleaning & standardization
  ↓
data_loader.py
  ↓ Store in MongoDB & HDFS
```

### 3. Big Data Processing (src/spark/)

- **Spark Engine**: Distributed data processing
- **Spark Streaming**: Real-time data handling
- **Spark SQL**: SQL analytics on large datasets
- **Configuration**: Cluster setup & tuning

### 4. ML Models (src/analytics/)

| Model | Task | Algorithm | Output |
|-------|------|-----------|--------|
| Yield Prediction | Regression | Ensemble (RF, GB) | kg/ha |
| Disease Detection | Classification | CNN / Ensemble | Disease type |
| Market Prediction | Forecasting | ARIMA / Prophet | Price |
| Pest Detection | Classification | Ensemble | Pest type |
| Irrigation | Recommendation | Rule-based + ML | Water needed |

### 5. Databases

**MongoDB** - NoSQL (flexible schema)
- Real-time weather data
- User interactions
- Flexible documents

**PostgreSQL** - Relational (structured data)
- Farmer information
- Farm metadata
- Historical records

**Hadoop HDFS** - Distributed storage
- Large batch files
- Archival data
- Data warehouse

**Hive** - SQL on Hadoop
- SQL queries on HDFS
- Structured analytics

### 6. API & Web (src/)

**REST API** (api.py)
- `/api/predict/yield` - Yield prediction
- `/api/predict/disease` - Disease detection
- `/api/recommend/irrigation` - Water management
- `/api/market/prices` - Market data

**Web Application** (web_app.py)
- HTML templates
- Interactive dashboards
- Real-time visualizations

### 7. Orchestration & Scheduling (airflow/)

- Daily data collection DAG
- Model training DAG
- Data validation DAG
- Report generation DAG

---

## 🔄 Data Flow

```
External Sources
├── Weather APIs
├── Government Databases
├── Kaggle Datasets
└── Market Price Feeds

         ↓

ETL Pipeline (Python)
├── Extract
├── Validate
├── Transform
└── Load

         ↓

Dual Storage
├── MongoDB (real-time)
└── Hadoop HDFS (batch)

         ↓

Processing Engines
├── Spark (distributed)
├── Hive (SQL)
└── Pig (data flow)

         ↓

ML Models
├── Yield
├── Disease
├── Market
└── Irrigation

         ↓

Visualization & Dashboards
├── Tableau
├── Power BI
├── Web Interface
└── Reports

         ↓

Decision Support Systems
└── Farmers & Agri-Businesses
```

---

## 🛠️ Technology Mapping

| Layer | Technologies |
|-------|-------------|
| **Data Collection** | Python, APIs, requests |
| **Storage** | MongoDB, PostgreSQL, HDFS |
| **Processing** | Spark, Hive, Pig |
| **Analytics** | Pandas, NumPy, Scikit-learn |
| **ML** | TensorFlow, XGBoost, LightGBM |
| **Orchestration** | Airflow, Kubernetes |
| **Visualization** | Tableau, Power BI, Plotly |
| **APIs** | Flask, Flask-RESTful |
| **Web** | HTML, CSS, JavaScript, Chart.js |
| **DevOps** | Docker, Docker Compose |
| **Monitoring** | Prometheus, ELK Stack |

---

## 📈 Code Statistics

| Component | Files | Lines | Purpose |
|-----------|-------|-------|---------|
| ETL | 5 | 1,500 | Data pipeline |
| Analytics | 6 | 2,000 | ML models |
| Spark | 4 | 1,000 | Big data processing |
| API | 2 | 500 | REST services |
| Tests | 8 | 1,500 | Quality assurance |
| Docs | 8 | 2,000 | Documentation |
| **Total** | **33+** | **9,000+** | Complete system |

---

## 🚀 Deployment Stages

```
Development
    ↓
Staging (Docker Compose)
    ↓
Production (Kubernetes)
    ↓
Monitoring & Maintenance
```

---

## 📚 Key Files to Start With

1. **README.md** - Start here! Project overview
2. **SETUP.md** - Installation instructions
3. **notebooks/01_eda.ipynb** - Exploratory analysis
4. **src/main.py** - Main pipeline entry point
5. **docker-compose.yml** - Container orchestration

---

## ✅ Checklist for Getting Started

- [ ] Clone repository
- [ ] Create virtual environment
- [ ] Install dependencies
- [ ] Copy .env.example to .env
- [ ] Start Docker containers
- [ ] Run data collection
- [ ] Train models
- [ ] Start API server
- [ ] Access web interface

---

**This modular structure makes the project scalable, maintainable, and production-ready!** 🚀

