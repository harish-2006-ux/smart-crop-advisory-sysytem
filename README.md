# 🌾 Smart Agriculture Big Data Analytics Platform

An End-to-End Big Data Portfolio Project for Data Analyst / Data Scientist Roles

---

## 📋 Project Overview

Farmers make critical decisions based on:
- **Weather conditions** (rainfall, temperature, humidity)
- **Soil characteristics** (nitrogen, phosphorus, potassium)
- **Market prices** (crop economics)
- **Crop diseases** (pest management)
- **Irrigation requirements** (water management)

This **end-to-end big data platform** collects, processes, analyzes, and visualizes agricultural data to provide **actionable insights** for farmers and decision-makers.

---

## 📱 Mobile PWA & Progressive Web App

This project now includes a **complete Progressive Web App (PWA)** for mobile devices!

### Mobile Features
✅ **iOS & Android Support** - Install like a native app
✅ **Offline Functionality** - Works without internet
✅ **Touch-Optimized UI** - Designed for mobile first
✅ **Fast Loading** - Cached assets load instantly
✅ **Home Screen Icon** - Add to home screen
✅ **Push Notifications** - Get important alerts
✅ **Background Sync** - Auto-sync when online returns
✅ **Responsive Design** - Works on all screen sizes

### Mobile Capabilities
- 📱 **iOS**: Safari 13+, home screen installation
- 🤖 **Android**: Chrome, Edge, Samsung Internet
- 🖥️ **Desktop**: Chrome, Edge, Firefox
- 🔌 **Offline**: Complete offline mode with caching
- 📸 **Camera**: Photo upload with file handling

### Getting Started Mobile
1. Open app on phone: `http://localhost:5000`
2. Wait 3 seconds for install prompt
3. Tap **Install** button
4. App installs on home screen
5. Open app and use offline!

See [PWA_SETUP.md](./PWA_SETUP.md) for detailed mobile setup instructions.

---

## 🏗️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Programming** | Python, Scala |
| **IDE** | VS Code / Jupyter |
| **Version Control** | Git, GitHub |
| **Containerization** | Docker, Docker Compose |
| **NoSQL Database** | MongoDB |
| **Distributed Storage** | Hadoop HDFS |
| **SQL on Hadoop** | Hive, Impala |
| **ETL** | Apache Pig, PySpark |
| **Big Data Processing** | Apache Spark |
| **Machine Learning** | Scikit-learn, PySpark MLlib |
| **Visualization** | Tableau, Power BI |
| **Scheduling** | Apache Airflow |
| **Workflow Orchestration** | Kubernetes (optional) |

---

## 📊 Data Sources & Fields

### External Data Sources
- **Weather APIs** - Real-time weather data
- **Government Agriculture Datasets** - Crop production statistics
- **Kaggle Datasets** - Historical agricultural data
- **Soil Datasets** - Soil composition data
- **Rainfall Datasets** - Precipitation patterns
- **Market Price Feeds** - Commodity prices

### Core Data Fields
```
Date, State, District, Village
Crop Type, Season, Variety
Rainfall, Temperature, Humidity
Soil Type, Nitrogen, Phosphorus, Potassium
Market Price, Production Volume, Yield
Disease Occurrence, Pest Type, Severity
Irrigation Schedule, Water Usage
```

---

## 🔄 End-to-End Workflow

```
DATA SOURCES
├── Weather API
├── Crop Dataset (CSV)
├── Soil Dataset (CSV)
├── Market Data (CSV)
└── Disease Database

           ↓

PYTHON ETL LAYER
├── Extract (APIs + Files)
├── Validate (Schema check)
├── Standardize (Units, dates)
└── Enrich (Feature engineering)

           ↓

DUAL STORAGE
├── MongoDB (JSON, real-time)
└── Hadoop HDFS (large batches)

           ↓

BIG DATA PROCESSING
├── Apache Spark (distributed processing)
├── Data Cleaning
├── Feature Engineering
└── Aggregations

           ↓

ANALYTICS LAYER
├── Hive (SQL queries)
├── Spark SQL (advanced analytics)
└── Custom Python transforms

           ↓

MACHINE LEARNING
├── Yield Prediction (Regression)
├── Disease Detection (Classification)
├── Irrigation Recommendation
└── Market Price Forecasting

           ↓

VISUALIZATION
└── Tableau / Power BI Dashboards
    ├── Overview Dashboard
    ├── Weather Dashboard
    ├── Crop Dashboard
    ├── Market Dashboard
    └── Prediction Dashboard
```

---

## 📁 Project Structure

```
smart-agri-bigdata/
├── data/
│   ├── raw/                    # Raw data from sources
│   │   ├── weather/
│   │   ├── soil/
│   │   └── crops/
│   ├── cleaned/                # Cleaned intermediate data
│   ├── processed/              # Feature-engineered data
│   └── outputs/                # Final analysis results
│
├── src/
│   ├── etl/                    # ETL pipeline
│   │   ├── data_collector.py   # Collect from APIs
│   │   ├── data_validator.py   # Validate data
│   │   └── data_transformer.py # Transform & standardize
│   │
│   ├── analytics/              # ML modules
│   │   ├── yield_prediction.py
│   │   ├── disease_detection.py
│   │   ├── irrigation_recommender.py
│   │   ├── market_prediction.py
│   │   └── pest_detection.py
│   │
│   ├── spark/                  # Spark jobs
│   │   ├── spark_engine.py
│   │   ├── spark_streaming.py
│   │   └── spark_sql_queries.py
│   │
│   ├── mongodb/                # MongoDB operations
│   │   ├── mongo_handler.py
│   │   └── mongo_queries.py
│   │
│   ├── hadoop/                 # Hadoop/HDFS operations
│   │   ├── hdfs_handler.py
│   │   └── hive_queries.hql
│   │
│   ├── api.py                  # REST API
│   ├── web_app.py              # Web interface
│   └── main.py                 # Main pipeline orchestrator
│
├── notebooks/
│   ├── 01_exploratory_analysis.ipynb
│   ├── 02_feature_engineering.ipynb
│   ├── 03_model_training.ipynb
│   └── 04_visualizations.ipynb
│
├── models/
│   ├── yield_model.pkl
│   ├── disease_model.pkl
│   └── market_model.pkl
│
├── dashboard/
│   ├── tableau_workbook.twb
│   └── powerbi_report.pbix
│
├── docker/
│   ├── Dockerfile.base
│   ├── docker-compose.yml
│   ├── mongodb/
│   ├── hadoop/
│   ├── spark/
│   └── jupyter/
│
├── config/
│   ├── config.yaml
│   ├── schema.json
│   └── env.example
│
├── scripts/
│   ├── setup.sh
│   ├── download_data.sh
│   ├── train_models.sh
│   └── run_pipeline.sh
│
├── tests/
│   ├── test_etl.py
│   ├── test_analytics.py
│   ├── test_api.py
│   └── test_models.py
│
├── requirements.txt
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Project Phases

### Phase 1: Data Collection
- Extract data from weather APIs (JSON → MongoDB)
- Download bulk CSV files (Store in HDFS)
- Validate data quality

### Phase 2: Data Cleaning
- Remove duplicates
- Handle missing values
- Standardize dates and units
- Normalize numerical values

### Phase 3: Big Data Storage
- Partition data in HDFS by Year → Month → State
- Create MongoDB collections for real-time data
- Create backup copies

### Phase 4: Hive SQL Analytics
- Create Hive tables for:
  - Crop production facts
  - Weather dimensions
  - Soil characteristics
  - Market prices
- Run analytical queries

### Phase 5: Spark Analytics
- Calculate average trends
- Analyze rainfall patterns
- Compare fertilizer usage
- Track yield across regions

### Phase 6: Machine Learning
- **Yield Prediction** - Regression (Random Forest, Gradient Boosting)
- **Disease Detection** - Classification (Ensemble methods)
- **Irrigation Recommendation** - Rule-based + ML
- **Market Price Forecasting** - Time series + Regression

### Phase 7: Dashboard & Visualization
- Overview Dashboard (KPIs)
- Weather Dashboard (conditions, trends)
- Crop Dashboard (yield, production)
- Market Dashboard (prices, trends)
- Prediction Dashboard (models, forecasts)

---

## 📊 Key Analytics & Insights

### Production Insights
- Top-yielding districts and crops
- Average production by region and season
- Yield trends over time

### Weather Analysis
- Rainfall patterns by region
- Temperature trends
- Humidity impact on yield

### Market Intelligence
- Highest/lowest priced crops
- Price trends by season
- Market volatility analysis

### Predictive Insights
- Expected yield for conditions
- Disease risk assessment
- Optimal irrigation schedules
- Price forecasts

---

## 🐳 Docker Architecture

All services run as containers:

```bash
docker-compose up -d
```

Services:
- **MongoDB** - NoSQL data store
- **Hadoop NameNode + DataNode** - Distributed storage
- **Hive Server** - SQL on Hadoop
- **Spark Master + Workers** - Distributed processing
- **Jupyter** - Interactive notebooks
- **Airflow** - Workflow orchestration
- **PostgreSQL** - Metadata & scheduling

---

## 🛠️ Installation & Setup

### Prerequisites
- Docker & Docker Compose
- Python 3.8+
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/smart-agri-bigdata
cd smart-agri-bigdata

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start Docker containers
docker-compose up -d

# Run ETL pipeline
python src/main.py

# Access web interface
# Open http://localhost:5001 in browser

# Access Tableau/Power BI
# Connect to Hive for live data
```

---

## 📈 Skills Demonstrated

✅ **Data Engineering**
- ETL pipeline design
- Data validation & quality checks
- Schema design

✅ **Big Data Technologies**
- Hadoop HDFS (distributed storage)
- Apache Spark (distributed processing)
- Hive (SQL on Hadoop)

✅ **Databases**
- MongoDB (NoSQL design)
- SQL analytics

✅ **Machine Learning**
- Regression (yield prediction)
- Classification (disease detection)
- Ensemble methods
- Model evaluation & optimization

✅ **DevOps & Deployment**
- Docker containerization
- Docker Compose orchestration
- Environment management

✅ **Visualization**
- Tableau dashboards
- Real-time KPIs
- Interactive reports

✅ **Software Engineering**
- REST API design
- Web application development
- Code organization
- Git workflow

---

## 💼 Why This Stands Out to Recruiters

Instead of listing tools individually ("I know Hadoop, Spark, MongoDB, Docker"), this project demonstrates:

1. **System Architecture** - How multiple technologies work together
2. **Real-World Problem** - Agriculture is a known, complex domain
3. **End-to-End Solution** - From data collection to decision support
4. **Production-Ready** - Containerization, error handling, monitoring
5. **Practical Skills** - ETL, analytics, ML, DevOps in one project

This is a **complete portfolio piece** showing job-ready competency.

---

## 🔧 Advanced Extensions

### Real-Time Processing
- Kafka for streaming weather data
- Storm for real-time predictions
- WebSocket updates to dashboards

### Production Deployment
- Kubernetes for container orchestration
- CI/CD pipeline (Jenkins/GitHub Actions)
- Monitoring & alerting (Prometheus, ELK stack)

### Advanced ML
- Deep Learning for image-based disease detection
- Time series forecasting (ARIMA, Prophet)
- Ensemble models with feature selection

### Data Privacy
- Data encryption (TLS, at-rest)
- Access control & auditing
- GDPR compliance

---

## 📞 Support & Documentation

- **Setup Guide** - See `SETUP.md`
- **API Documentation** - See `API_GUIDE.md`
- **Architecture Guide** - See `ARCHITECTURE.md`
- **Troubleshooting** - See `TROUBLESHOOTING.md`

---

## 📄 License

MIT License - See `LICENSE` file

---

## 👥 Contributing

Contributions welcome! Please see `CONTRIBUTING.md` for guidelines.

---

**Last Updated**: July 2026  
**Version**: 2.0 - Production Ready  
**Status**: ✅ Fully Implemented
