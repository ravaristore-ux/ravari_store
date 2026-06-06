# Hostinger Deployment Guide

Complete guide to deploy Ravari e-commerce to Hostinger.

## Prerequisites

- Hostinger account with VPS or App Hosting
- Domain name (pointed to Hostinger)
- Terminal/SSH knowledge
- Completed local testing

## Hostinger Server Options

### Recommended: Hostinger Business VPS
- 2GB RAM / 2 Core CPU minimum
- Ubuntu 20.04 or 22.04 LTS
- SSH access included
- ~₹200-300/month

### Alternative: Hostinger App Hosting (Easier)
- Node.js support
- Automatic SSL
- Easy deployment
- Limited customization
- ~₹300-400/month

This guide covers **VPS deployment** (most control/cost-effective).

## Step 1: VPS Initial Setup

### 1. Access Hostinger Control Panel
- Login to Hostinger account
- Go to VPS → Your VPS
- Click "Manage"
- Note down IP address, username, password

### 2. Connect via SSH
```bash
ssh root@your-vps-ip

# First login will prompt for password
# Change password on first login
```

### 3. Update System
```bash
apt-get update
apt-get upgrade -y
```

## Step 2: Install Required Software

### Install Node.js (v18 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Verify
node --version
npm --version
```

### Install MongoDB
```bash
# Add MongoDB repository
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-5.0.list

# Install
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Verify
systemctl status mongod
```

### Install Nginx (Reverse Proxy)
```bash
apt-get install -y nginx

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Verify
systemctl status nginx
```

### Install PM2 (Process Manager)
```bash
npm install -g pm2

# Verify
pm2 --version
```

### Install Certbot (SSL Certificates)
```bash
apt-get install -y certbot python3-certbot-nginx
```

## Step 3: Deploy Ravari Backend

### 1. Create Application Directory
```bash
mkdir -p /var/www/ravari-api
cd /var/www/ravari-api

# Set permissions
chown -R www-data:www-data /var/www/ravari-api
chmod -R 755 /var/www/ravari-api
```

### 2. Upload/Clone Backend Code
```bash
# Option A: Clone from Git (recommended)
cd /var/www/ravari-api
git clone https://your-repo-url.git .
cd backend

# Option B: Upload via SCP
scp -r ./backend root@your-vps-ip:/var/www/ravari-api/
```

### 3. Install Dependencies
```bash
cd /var/www/ravari-api/backend
npm install --production
```

### 4. Configure Environment
```bash
# Create .env
nano .env
```

**Production .env Configuration:**
```
MONGODB_URI=mongodb://localhost:27017/ravari
JWT_SECRET=your-super-secret-key-generate-random-32-char
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 5. Start Backend with PM2
```bash
cd /var/www/ravari-api/backend

# Start application
pm2 start server.js --name "ravari-api"

# Save PM2 configuration
pm2 save

# Create startup script
pm2 startup

# Verify it's running
pm2 list
pm2 logs ravari-api
```

## Step 4: Deploy Ravari Frontend

### 1. Build React App
```bash
cd /var/www/ravari-frontend
npm install --production
npm run build

# This creates a 'build' folder
```

### 2. Copy Build to Nginx
```bash
cp -r /var/www/ravari-frontend/build/* /var/www/html/
```

## Step 5: Configure Nginx

### 1. Create Nginx Configuration
```bash
nano /etc/nginx/sites-available/ravari
```

**Add Configuration:**
```nginx
# API Backend
upstream ravari_api {
    server localhost:5000;
}

# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS - Main Configuration
server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;

    # API Proxy
    location /api/ {
        proxy_pass http://ravari_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Files
    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }

    # Images
    location /images/ {
        root /var/www/ravari-api/backend/public;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Favicon
    location = /favicon.ico {
        access_log off;
        log_not_found off;
    }
}
```

### 2. Enable Configuration
```bash
# Create symlink
ln -s /etc/nginx/sites-available/ravari /etc/nginx/sites-enabled/ravari

# Remove default
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

## Step 6: Setup SSL Certificate

### 1. Generate Certificate
```bash
certbot certonly --nginx -d your-domain.com -d www.your-domain.com
```

### 2. Auto-Renewal
```bash
# Test renewal (doesn't actually renew)
certbot renew --dry-run

# Enable auto-renewal timer
systemctl enable certbot.timer
systemctl start certbot.timer

# Check renewal
systemctl status certbot.timer
```

## Step 7: Firewall Configuration

```bash
# Enable UFW
ufw enable

# Allow SSH
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Check status
ufw status
```

## Step 8: Database Backup

### 1. Create Backup Script
```bash
nano /home/backup_db.sh
```

**Add:**
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mongodb"
mkdir -p $BACKUP_DIR

mongodump --out $BACKUP_DIR/$(date +%Y%m%d_%H%M%S)

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

### 2. Make Executable and Schedule
```bash
chmod +x /home/backup_db.sh

# Add to crontab for daily backup at 2 AM
crontab -e
# Add: 0 2 * * * /home/backup_db.sh
```

## Step 9: Monitoring & Logging

### 1. Check Application Status
```bash
# View all PM2 applications
pm2 list

# View logs
pm2 logs ravari-api

# Monitor
pm2 monit
```

### 2. Check Nginx Logs
```bash
# Real-time logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 3. Check MongoDB
```bash
# MongoDB status
systemctl status mongod

# View MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

## Step 10: Domain Pointing

### 1. In Hostinger DNS Panel
- Go to Hosting → DNS Zone Editor
- Point A record to your VPS IP
- Point www A record to same IP
- Wait for DNS propagation (5-30 mins)

### 2. Verify
```bash
dig your-domain.com
nslookup your-domain.com
```

## Testing Production Deployment

### 1. Test API
```bash
curl https://your-domain.com/api/health

# Should return:
# {
#   "success": true,
#   "status": "API is running",
#   ...
# }
```

### 2. Test Frontend
- Visit https://your-domain.com in browser
- Check Console (F12) for errors
- Test login
- Test product browsing
- Test cart functionality

### 3. Test HTTPS
- Visit https://your-domain.com
- Check SSL certificate (lock icon)
- Click lock → Certificate details
- Verify it's your domain

## Performance Optimization

### 1. Enable Database Indexing
```bash
mongo
use ravari
db.products.createIndex({ "category": 1, "price": 1 })
db.products.createIndex({ "name": "text", "description": "text" })
```

### 2. Configure PM2 Clustering
```bash
pm2 stop ravari-api
pm2 delete ravari-api

# Start with max CPU cores
pm2 start server.js -i max --name "ravari-api"
```

### 3. Setup Redis Cache (Optional)
```bash
apt-get install -y redis-server
systemctl start redis-server
systemctl enable redis-server
```

## Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs ravari-api

# Check for port conflicts
netstat -tlnp | grep 5000

# Manually start to see errors
cd /var/www/ravari-api/backend && node server.js
```

### MongoDB Connection Error
```bash
# Check MongoDB is running
systemctl status mongod

# Check connection
mongo
show dbs

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Nginx 502 Bad Gateway
```bash
# Check backend is running
pm2 list

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Test Nginx config
nginx -t
```

### SSL Certificate Issues
```bash
# Renew manually
certbot renew --force-renewal

# Check certificate
ssl-cert-check -c /etc/letsencrypt/live/your-domain.com/fullchain.pem
```

## Maintenance Commands

```bash
# Restart application
pm2 restart ravari-api

# Restart Nginx
systemctl restart nginx

# Restart MongoDB
systemctl restart mongod

# View system resources
free -h  # Memory
df -h    # Disk space
top      # CPU usage

# Update system
apt-get update && apt-get upgrade -y

# Update Node packages
cd /var/www/ravari-api/backend
npm update
pm2 restart ravari-api
```

## Post-Deployment Checklist

- [ ] Domain points to VPS
- [ ] SSL certificate valid
- [ ] API health check passes
- [ ] Frontend loads
- [ ] Login works
- [ ] Products display
- [ ] Cart functions
- [ ] Database backups run
- [ ] Email notifications configured
- [ ] Payment gateway configured (Razorpay)
- [ ] Analytics set up (Google Analytics)
- [ ] Security headers configured
- [ ] CORS properly configured

## Next Steps

1. **Configure Payment Gateway:**
   - Get Razorpay Live Keys
   - Update .env with production keys
   - Test payment flow

2. **Set Up Email:**
   - Configure SMTP credentials in .env
   - Test order notifications

3. **Monitor Performance:**
   - Setup uptime monitoring
   - Configure alerting
   - Monitor error rates

4. **Scrape Products:**
   - SSH into server
   - Run scraper: `node scrapers/ravaryScraper.js`
   - Or add via admin panel

## Support

For Hostinger support:
- Hostinger Help Center: https://support.hostinger.com/
- Hostinger VPS Docs: https://support.hostinger.in/en/categories/vps

---

**Your site is now live!** 🎉

- Frontend: https://your-domain.com
- API: https://your-domain.com/api
- Admin Panel: Will be built in Phase 3
