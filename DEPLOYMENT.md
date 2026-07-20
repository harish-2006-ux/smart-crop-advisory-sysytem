# 🌾 Smart Crop Advisory System - Deployment Guide

This guide covers deploying the application to various hosting platforms.

## Table of Contents
1. [Local Development](#local-development)
2. [Heroku Deployment](#heroku-deployment)
3. [Railway Deployment](#railway-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)

---

## Local Development

### Prerequisites
- Python 3.11 or higher
- MongoDB running locally
- Git installed

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/harish-2006-ux/smart-crop-advisory-sysytem.git
   cd smart-crop-advisory-sysytem
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run the application**
   ```bash
   python src/api.py
   ```

   The app will be available at `http://localhost:5000`

---

## Heroku Deployment

### Prerequisites
- Heroku CLI installed
- GitHub repository connected
- MongoDB Atlas account (for cloud database)

### Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string:
   ```
   mongodb+srv://username:password@cluster-name.mongodb.net/database-name
   ```

### Step 2: Deploy to Heroku

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   heroku config:set FLASK_ENV=production
   heroku config:set SECRET_KEY=your-secret-key
   ```

4. **Push to Heroku**
   ```bash
   git push heroku main
   ```

5. **View logs**
   ```bash
   heroku logs --tail
   ```

6. **Access your app**
   ```
   https://your-app-name.herokuapp.com
   ```

---

## Railway Deployment

### Prerequisites
- Railway.app account
- GitHub repository

### Step 1: Connect GitHub

1. Go to [Railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository

### Step 2: Configure Environment

1. Go to Variables section
2. Add the following:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   FLASK_ENV=production
   SECRET_KEY=your-secret-key
   PORT=5000
   ```

### Step 3: Deploy

Railway automatically deploys on git push. View deployment in the Railway dashboard.

---

## Docker Deployment

### Prerequisites
- Docker installed
- Docker Hub account (optional, for pushing images)

### Step 1: Build Docker Image

```bash
docker build -t smart-crop-advisory:latest .
```

### Step 2: Run Docker Container

```bash
docker run -p 5000:5000 \
  -e MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname \
  -e FLASK_ENV=production \
  smart-crop-advisory:latest
```

### Step 3: Push to Docker Hub (Optional)

```bash
docker tag smart-crop-advisory:latest yourusername/smart-crop-advisory:latest
docker push yourusername/smart-crop-advisory:latest
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
DEBUG=False

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
DB_NAME=agri_analytics

# Server
PORT=5000
HOST=0.0.0.0

# API Keys (if using external services)
# Add your API keys here

# Logging
LOG_LEVEL=INFO
```

---

## Database Setup

### MongoDB Atlas Setup

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create Cluster**
   - Click "Create a Cluster"
   - Choose free tier
   - Select region close to your users
   - Click "Create"

3. **Configure Network Access**
   - Go to "Network Access"
   - Add IP address (or use 0.0.0.0/0 for development)

4. **Create Database User**
   - Go to "Database Access"
   - Create user with password
   - Remember username and password

5. **Get Connection String**
   - Click "Connect" on cluster
   - Copy connection string
   - Use as `MONGODB_URI` in environment variables

### Collections Setup

The following collections are automatically created:

- `analyses` - Comprehensive farm analyses
- `pest_detections` - Pest risk predictions
- `market_predictions` - Price forecasts
- `performance_metrics` - System performance data

---

## Pre-Deployment Checklist

- [ ] All dependencies in `requirements.txt`
- [ ] `.env` file configured (don't commit secrets)
- [ ] `.gitignore` excludes sensitive files
- [ ] `Procfile` configured for your platform
- [ ] `runtime.txt` specifies Python version
- [ ] Database (MongoDB) set up
- [ ] Static files collected
- [ ] Logging configured
- [ ] Error handling in place
- [ ] CORS properly configured for your domain

---

## Troubleshooting

### "Module not found" Error
```bash
pip install -r requirements.txt --upgrade
```

### Database Connection Failed
- Check `MONGODB_URI` is correct
- Verify IP whitelist in MongoDB Atlas
- Check database user credentials

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # macOS/Linux

# Kill process or use different port
```

### Static Files Not Loading
```bash
# Ensure static files are in correct location
# src/static/ should have all CSS, JS, images
```

---

## Performance Tips for Production

1. **Use a production WSGI server** (gunicorn, uWSGI)
2. **Enable caching** for static assets
3. **Use CDN** for static files
4. **Enable CORS** only for trusted domains
5. **Set up monitoring** and error tracking
6. **Use environment variables** for sensitive data
7. **Enable compression** for HTTP responses
8. **Set up SSL/TLS** certificates
9. **Monitor database performance**
10. **Set up automated backups**

---

## Support

For issues and questions:
- Check the README.md
- Review logs with `heroku logs --tail`
- Check MongoDB Atlas dashboard
- Review Flask documentation

