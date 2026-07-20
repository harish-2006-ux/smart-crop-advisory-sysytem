# Getting Started Guide

Welcome to the **Smart Agriculture Big Data Analytics Platform**! This guide will get you up and running in 5 minutes.

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Run Locally (Easiest)

```bash
# 1. Navigate to project
cd c:\Users\hhare\OneDrive\Desktop\bda\agri_analytics

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start API
python src/api.py

# 5. Open browser
http://localhost:5000
```

### Option 2: Docker (Recommended for Production)

```bash
# 1. Start all services
docker-compose up -d

# 2. Wait for services to start (30-60 seconds)
docker-compose ps

# 3. Access services
API:      http://localhost:5000
Dashboard: http://localhost:5000/dashboard
Jupyter:   http://localhost:8888
Spark UI:  http://localhost:8080
Airflow:   http://localhost:8070
```

---

## 📚 Key Files to Read First

1. **README.md** - Project overview (start here!)
2. **SETUP.md** - Detailed installation guide
3. **PROJECT_STRUCTURE.md** - Directory layout
4. **IMPLEMENTATION_SUMMARY.md** - What's been built

---

## 🌐 Available URLs

### Web Interface
| URL | Purpose |
|-----|---------|
| http://localhost:5000 | Home page |
| http://localhost:5000/dashboard | Dashboard |
| http://localhost:5000/analysis | Analysis tool |
| http://localhost:5000/pest-detection-page | Pest detection |
| http://localhost:5000/market-prediction-page | Market prices |
| http://localhost:5000/performance-page | Performance stats |

### Big Data Tools
| URL | Tool |
|-----|------|
| http://localhost:8888 | Jupyter Notebooks |
| http://localhost:8080 | Spark UI |
| http://localhost:50070 | Hadoop NameNode |
| http://localhost:8070 | Airflow |

### APIs
```
GET  /health                          # Health check
POST /api/crop-recommendation         # Get crop suggestions
POST /api/yield-prediction            # Predict yield
POST /api/fertilizer-suggestion       # Get fertilizer advice
POST /api/irrigation-schedule         # Get water schedule
POST /api/pest-detection              # Detect pests
POST /api/market-prediction           # Forecast prices
POST /api/comprehensive-analysis      # Full analysis
GET  /api/performance                 # Performance stats
```

---

## 🎯 Common Tasks

### 1. Test the API

**Using Python:**
```python
import requests

response = requests.post('http://localhost:5000/api/comprehensive-analysis', json={
    "nitrogen": 50,
    "phosphorus": 30,
    "potassium": 150,
    "temperature": 22,
    "humidity": 65,
    "rainfall_mm": 12,
    "ph": 6.8,
    "crop": "wheat"
})

print(response.json())
```

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/pest-detection \
  -H "Content-Type: application/json" \
  -d '{"temperature": 20, "humidity": 75, "rainfall_mm": 18, "crop": "wheat"}'
```

### 2. Train ML Models

```bash
# Train all models
python src/analytics/yield_prediction.py
python src/analytics/pest_detection.py
python src/analytics/market_prediction.py

# Models saved in models/ folder
```

### 3. View Dashboard

Simply open http://localhost:5000/dashboard in your browser!

### 4. Run Data Pipeline

```bash
# Run complete ETL pipeline
python src/main.py

# Or run specific steps
python src/etl/data_collector.py
python src/etl/data_validator.py
python src/etl/data_transformer.py
```

### 5. Access Databases

**MongoDB:**
```bash
docker exec -it agri-mongodb mongosh -u admin -p password
use agri_analytics
db.weather.find().limit(5)
```

**PostgreSQL:**
```bash
docker exec -it agri-postgres psql -U admin -d agri_analytics
SELECT * FROM farmers LIMIT 5;
```

**Spark SQL:**
```bash
docker exec -it agri-spark-worker spark-sql \
  --master spark://spark-master:7077
```

---

## 📊 Example: Complete Analysis

Here's how to get a complete analysis for a farm:

```python
import requests
import json

# Farm conditions
farm_data = {
    "nitrogen": 50,
    "phosphorus": 30,
    "potassium": 150,
    "temperature": 22,
    "humidity": 65,
    "rainfall_mm": 12,
    "ph": 6.8,
    "crop": "wheat",
    "moisture": 35,
    "wind_speed": 3,
    "month": 8
}

# Get comprehensive analysis
response = requests.post(
    'http://localhost:5000/api/comprehensive-analysis',
    json=farm_data
)

result = response.json()

# Extract insights
analysis = result['comprehensive_analysis']

print("=== FARM ANALYSIS REPORT ===\n")

# Crop recommendations
print("TOP CROP RECOMMENDATIONS:")
for i, crop in enumerate(analysis['recommendations']['crops'][:3], 1):
    print(f"  {i}. {crop['crop']} (Score: {crop['suitability_score']})")

# Yield prediction
if 'yield' in analysis['predictions']:
    yield = analysis['predictions']['yield']
    print(f"\nYIELD PREDICTION: {yield['predicted_yield']} kg/ha")
    print(f"  Range: {yield['prediction_interval']['lower']} - {yield['prediction_interval']['upper']}")

# Pest risk
if 'pests' in analysis['risk_assessment']:
    pest = analysis['risk_assessment']['pests']
    print(f"\nPEST RISK: {pest['risk_level']} ({pest['predicted_pest']})")
    print("  Recommendations:")
    for rec in pest['recommendations'][:3]:
        print(f"    - {rec}")

# Market price
if 'market_price' in analysis['predictions']:
    market = analysis['predictions']['market_price']
    print(f"\nMARKET PRICE: ₹{market['predicted_price']}/ton")
    print(f"  Outlook: {market['market_analysis']['outlook']}")

# Fertilizer
if 'fertilizer' in analysis['suggestions']:
    fert = analysis['suggestions']['fertilizer']
    npk = fert['npk_recommendation']
    print(f"\nFERTILIZER SUGGESTION:")
    print(f"  {npk['ratio']} (N:P:K)")
    print(f"  Total: {npk['total_kg_per_ha']} kg/ha")

# Irrigation
if 'irrigation' in analysis['suggestions']:
    irr = analysis['suggestions']['irrigation']
    print(f"\nIRRIGATION SCHEDULE:")
    print(f"  Urgency: {irr['irrigation_schedule']['urgency']}")
    print(f"  Interval: Every {irr['irrigation_schedule']['interval_days']} days")
    print(f"  Water needed: {irr['irrigation_schedule']['water_volume_mm']} mm")
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker-compose logs agri-api

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Models Not Found
```bash
# Train models
python src/analytics/yield_prediction.py
python src/analytics/pest_detection.py

# Check if files exist
ls models/
```

---

## 📖 Learning Resources

### Videos & Demos
1. Watch the dashboard in action
2. Try the comprehensive analysis
3. Explore the API endpoints
4. Check Jupyter notebooks for deep dives

### Documentation
1. **API_GUIDE.md** - Endpoint documentation
2. **ARCHITECTURE.md** - System design
3. **ML_MODELS.md** - Model details
4. **DATABASE_SCHEMA.md** - Data structure

### Notebooks
Start with Jupyter notebooks for hands-on learning:
- `notebooks/01_eda.ipynb` - Exploratory analysis
- `notebooks/02_data_cleaning.ipynb` - Data preprocessing
- `notebooks/03_model_training.ipynb` - Train models
- `notebooks/04_visualizations.ipynb` - Create charts

---

## 🎓 Learning Path

### Day 1: Understanding
- Read README.md
- Explore project structure
- Run local setup
- Try API endpoints

### Day 2: Exploration
- Run Jupyter notebooks
- Analyze sample data
- View dashboards
- Test predictions

### Day 3: Extension
- Modify models
- Add new features
- Connect real data
- Deploy changes

### Week 2: Production
- Deploy with Docker
- Set up monitoring
- Configure databases
- Create dashboards

---

## 🚀 Next Steps

1. **✅ Completed**: Basic setup and understanding
2. **→ Current**: Try API and dashboards
3. **→ Next**: Integrate your own data
4. **→ Then**: Deploy to production
5. **→ Finally**: Extend with new features

---

## 💡 Pro Tips

### For Development
```bash
# Watch for code changes and auto-reload
export FLASK_ENV=development
export FLASK_DEBUG=True
python src/api.py
```

### For Performance
```bash
# Use Docker for full stack
docker-compose up -d

# Monitor with
docker-compose stats
```

### For Debugging
```bash
# Check API logs
docker logs agri-api -f

# Check Spark logs
docker logs agri-spark-master -f

# Check all logs
docker-compose logs -f
```

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| API won't start | Check port 5000 is free, see SETUP.md |
| Models not found | Run `python src/analytics/*.py` to train |
| Database connection error | Check MongoDB/PostgreSQL are running |
| Docker issues | Run `docker-compose down` then `up` |
| Can't access dashboard | Make sure API is running on localhost:5000 |

---

## 🎯 Success Checklist

- [ ] Project downloaded/cloned
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] API started successfully
- [ ] Web interface accessible
- [ ] Dashboard showing data
- [ ] API endpoint responding
- [ ] Models trained
- [ ] Docker setup (optional)
- [ ] Databases connected

---

## 🎉 You're Ready!

You now have a **production-ready agricultural analytics platform** that:
- Collects and processes data
- Trains ML models
- Provides insights
- Scales horizontally
- Demonstrates enterprise skills

**Start exploring, experimenting, and building!**

---

## 📚 Additional Resources

- **GitHub Issues**: For questions and discussions
- **Documentation**: Complete guides in docs/ folder
- **Notebooks**: Interactive learning in notebooks/ folder
- **Code Comments**: Well-documented code throughout

---

**Happy Analytics! 🌾📊**

Need help? Check TROUBLESHOOTING.md or SETUP.md for more details!
