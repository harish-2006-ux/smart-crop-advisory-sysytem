# 🌾 Smart Crop Advisory System - Hosting Setup Guide

Your application has been pushed to GitHub and is ready for deployment! This guide provides step-by-step instructions for various hosting platforms.

## Quick Links
- **GitHub Repository**: https://github.com/harish-2006-ux/smart-crop-advisory-sysytem
- **Branch**: main
- **Status**: ✅ Ready for deployment

---

## 🚀 Option 1: Deploy on Heroku (Easiest)

### Prerequisites
- Heroku account (free tier available at https://www.heroku.com)
- Heroku CLI installed
- Credit card for verification (free tier doesn't require charges)

### Steps

1. **Install Heroku CLI**
   ```bash
   # Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
   # Or use chocolatey
   choco install heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create MongoDB Atlas Database** (Free)
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a cluster
   - Get connection string: `mongodb+srv://username:password@cluster-name.mongodb.net/dbname`

4. **Clone and Deploy**
   ```bash
   git clone https://github.com/harish-2006-ux/smart-crop-advisory-sysytem.git
   cd smart-crop-advisory-sysytem
   
   heroku create your-unique-app-name
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/dbname"
   heroku config:set FLASK_ENV=production
   heroku config:set SECRET_KEY=$(openssl rand -hex 32)
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **View Your App**
   ```bash
   heroku open
   ```
   Or visit: `https://your-unique-app-name.herokuapp.com`

8. **Monitor Logs**
   ```bash
   heroku logs --tail
   ```

---

## 🚀 Option 2: Deploy on Railway (Modern Alternative)

### Prerequisites
- Railway account at https://railway.app
- GitHub connected to Railway

### Steps

1. **Sign up at Railway**
   - Go to https://railway.app
   - Click "Login with GitHub"

2. **Create New Project**
   - Click "New Project"
   - Click "Deploy from GitHub repo"
   - Select `smart-crop-advisory-sysytem`

3. **Configure Variables**
   - Go to "Variables" tab
   - Add:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
     FLASK_ENV=production
     SECRET_KEY=your-random-secret-key
     ```

4. **Deploy**
   - Railway auto-deploys on git push
   - Watch deployment in dashboard
   - Get live URL from Railway dashboard

5. **Domain Setup** (Optional)
   - Railway gives you a free domain
   - Or connect custom domain in settings

---

## 🚀 Option 3: Deploy on Render

### Prerequisites
- Render account at https://render.com
- GitHub repository

### Steps

1. **Connect Repository**
   - Go to https://render.com
   - Click "New Web Service"
   - Connect GitHub account
   - Select `smart-crop-advisory-sysytem`

2. **Configure Build Settings**
   - Runtime: Python 3.11
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn -w 4 -b 0.0.0.0:$PORT src.api:app`

3. **Set Environment Variables**
   - MONGODB_URI: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
   - FLASK_ENV: `production`
   - SECRET_KEY: Generate with openssl

4. **Deploy**
   - Click "Deploy Web Service"
   - Wait for build and deploy
   - Get URL like: `https://smart-crop.onrender.com`

---

## 🚀 Option 4: Deploy on DigitalOcean App Platform

### Prerequisites
- DigitalOcean account
- GitHub repository connected

### Steps

1. **Go to App Platform**
   - https://cloud.digitalocean.com/apps

2. **Create New App**
   - Click "Create App"
   - Select GitHub repository

3. **Configure**
   - Select Python runtime
   - Set environment variables

4. **Deploy**
   - Click "Deploy"
   - Monitor build process

---

## 🚀 Option 5: Docker Deployment (Advanced)

### Using Docker Hub

1. **Build Docker Image**
   ```bash
   docker build -t your-username/smart-crop-advisory:latest .
   ```

2. **Push to Docker Hub**
   ```bash
   docker login
   docker push your-username/smart-crop-advisory:latest
   ```

3. **Deploy on Any Cloud**
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - etc.

### Using Docker Compose (Local/VPS)

```bash
docker-compose up -d
```

---

## 📊 MongoDB Atlas Setup (Required for All Options)

### Step-by-Step

1. **Create Account**
   - https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create Cluster**
   - Click "Create" → "Cluster"
   - Choose M0 (free tier)
   - Select region close to users
   - Click "Create"

3. **Create User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `admin` (or custom)
   - Password: Use auto-generated strong password
   - Click "Add User"

4. **Whitelist IPs**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For testing: `0.0.0.0/0` (allows all)
   - For production: Add specific IP addresses only

5. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy connection string:
     ```
     mongodb+srv://admin:password@cluster-name.mongodb.net/dbname?retryWrites=true&w=majority
     ```

6. **Update MONGODB_URI**
   - Replace `password` with your actual password
   - Replace `dbname` with `agri_analytics`
   - Use this in your hosting platform environment variables

---

## ✅ Pre-Deployment Checklist

- [ ] Repository pushed to GitHub (main branch)
- [ ] `.gitignore` file present (secrets excluded)
- [ ] `requirements.txt` updated with `gunicorn`
- [ ] `Procfile` created and configured
- [ ] `runtime.txt` specifies Python version
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] Connection string generated
- [ ] Environment variables documented
- [ ] `.env.example` file included (no secrets)

---

## 🔐 Security Best Practices

1. **Never commit secrets**
   - Use `.env` files (add to `.gitignore`)
   - Use environment variables on hosting platform
   - Use `.env.example` for documentation only

2. **Strong Passwords**
   ```bash
   # Generate random secret key
   python -c "import secrets; print(secrets.token_hex(32))"
   ```

3. **Database Security**
   - Use strong MongoDB password
   - Whitelist only necessary IPs
   - Enable MongoDB authentication
   - Use HTTPS for connections

4. **CORS Configuration**
   - Whitelist only your domain
   - Don't use `*` in production
   - Example: `https://yourdomain.com`

5. **API Keys**
   - Store in environment variables
   - Rotate regularly
   - Don't commit to repository

---

## 📈 Monitoring & Logs

### Heroku
```bash
heroku logs --tail
heroku logs --dyno=web
heroku ps
```

### Railway
- View in Railway dashboard
- Real-time log streaming

### Docker
```bash
docker logs container-name
docker exec -it container-name bash
```

---

## 🆘 Troubleshooting

### "Build Failed" Error
- Check `requirements.txt` syntax
- Verify Python version compatibility
- Check build logs for specific errors

### "Module Not Found"
```bash
pip install -r requirements.txt
```

### Database Connection Failed
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user credentials are right
- Test locally first

### Port Issues
- Platform usually assigns PORT via environment
- App should use `os.environ.get('PORT', 5000)`

### Static Files Not Loading
- Ensure files in `src/static/` directory
- Check path configuration in Flask app
- Verify `STATIC_FOLDER` setting

---

## 📞 Support Resources

- **Flask Deployment**: https://flask.palletsprojects.com/en/2.3.x/deploying/
- **Heroku Docs**: https://devcenter.heroku.com/
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
- **Docker**: https://docs.docker.com/
- **Railway Docs**: https://docs.railway.app/
- **Render Docs**: https://render.com/docs/

---

## 🎉 Next Steps After Deployment

1. **Test the Application**
   - Navigate to all pages
   - Test analysis features
   - Verify database connectivity

2. **Set Up Custom Domain**
   - Update DNS records
   - Configure SSL certificate
   - Test with domain

3. **Monitor Performance**
   - Set up uptime monitoring
   - Configure error tracking
   - Monitor database usage

4. **Set Up CI/CD** (Optional)
   - GitHub Actions for automated testing
   - Auto-deployment on push

5. **Backup Database**
   - Enable MongoDB Atlas backups
   - Configure retention policy

---

## 📝 Deployment Checklist Template

After successful deployment:

```
Deployment Date: ___________
Platform: ___________
URL: ___________
MongoDB Connected: Yes/No
All Features Working: Yes/No
Performance Score: ___________
Notes: ___________
```

---

**🎊 Your Smart Crop Advisory System is ready to serve farmers worldwide!**

For questions or issues, refer to the documentation files:
- `DEPLOYMENT.md` - Detailed deployment steps
- `GETTING_STARTED.md` - Quick start guide
- `USER_GUIDE.md` - User documentation
- `README.md` - Project overview
