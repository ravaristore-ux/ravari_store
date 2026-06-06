#!/bin/bash

#=============================================================================
# RAVARI STORE - DEPLOYMENT SETUP WIZARD
# Interactive setup for GitHub Actions and Hostinger deployment
#=============================================================================

echo "🚀 RAVARI STORE - DEPLOYMENT SETUP WIZARD"
echo "=========================================="
echo ""

# Function to read user input
read_input() {
    local prompt="$1"
    local default="$2"
    local response
    
    if [ -z "$default" ]; then
        read -p "$prompt: " response
    else
        read -p "$prompt [$default]: " response
        response="${response:-$default}"
    fi
    echo "$response"
}

# Step 1: Hostinger Configuration
echo "📋 STEP 1: Hostinger Configuration"
echo "=================================="
HOSTINGER_USER=$(read_input "Enter your Hostinger username" "your_username")
HOSTINGER_HOST=$(read_input "Enter your Hostinger host" "your_username.hostingersitecom")
HOSTINGER_PASSWORD=$(read_input "Enter your Hostinger password (will not be echoed)" "")

# Step 2: Domain Configuration
echo ""
echo "🌐 STEP 2: Domain Configuration"
echo "==============================="
DOMAIN=$(read_input "Enter your domain (e.g., ravari.in)" "ravari.in")
API_DOMAIN=$(read_input "Enter API domain (leave blank for same domain)" "$DOMAIN")
ADMIN_EMAIL=$(read_input "Enter admin email" "admin@ravari.in")
ADMIN_PASSWORD=$(read_input "Enter admin password (strong!)" "")

# Step 3: MongoDB Configuration
echo ""
echo "📊 STEP 3: MongoDB Configuration"
echo "=================================="
MONGODB_URI=$(read_input "Enter MongoDB Atlas connection string" "mongodb+srv://username:password@cluster.mongodb.net/ravari")

# Step 4: JWT Secret
echo ""
echo "🔐 STEP 4: Security Configuration"
echo "=================================="
JWT_SECRET=$(read_input "Enter JWT Secret (or leave blank to auto-generate)" "")
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT Secret: $JWT_SECRET"
fi

# Step 5: Create Configuration Files
echo ""
echo "📝 STEP 5: Creating Configuration Files"
echo "========================================"

# Create backend .env
cat > backend/.env << ENVEOF
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=$MONGODB_URI

# Security
JWT_SECRET=$JWT_SECRET

# Frontend Configuration
CORS_ORIGIN=https://$DOMAIN

# Admin Credentials
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD
ENVEOF

echo "✓ Created backend/.env"

# Create frontend .env.production
cat > frontend/.env.production << ENVEOF
REACT_APP_API_URL=https://$DOMAIN/api
REACT_APP_GA_ID=
ENVEOF

echo "✓ Created frontend/.env.production"

# Step 6: GitHub Secrets Configuration
echo ""
echo "🔑 STEP 6: GitHub Secrets Setup"
echo "================================"
echo ""
echo "To enable automatic deployment, add these secrets to your GitHub repository:"
echo ""
echo "1. Go to: https://github.com/harshadkhetpal/ravari-store/settings/secrets/actions"
echo "2. Click 'New repository secret' and add:"
echo ""
echo "   Name: HOSTINGER_USER"
echo "   Value: $HOSTINGER_USER"
echo ""
echo "   Name: HOSTINGER_HOST"
echo "   Value: $HOSTINGER_HOST"
echo ""
echo "   Name: HOSTINGER_PASSWORD"
echo "   Value: [Your Hostinger password]"
echo ""
echo "3. Click 'Add secret' for each one"
echo ""

# Step 7: Create deployment checklist
echo ""
echo "✅ STEP 7: Pre-Deployment Checklist"
echo "==================================="

cat > PRE_DEPLOYMENT_CHECKLIST.md << CHECKEOF
# Pre-Deployment Checklist

## Environment Configuration
- [ ] Backend .env file created with all required variables
- [ ] Frontend .env.production file created
- [ ] MongoDB Atlas cluster created and accessible
- [ ] MongoDB IP whitelist includes Hostinger IPs
- [ ] JWT_SECRET is set to a strong random value

## GitHub Configuration
- [ ] Repository pushed to https://github.com/harshadkhetpal/ravari-store
- [ ] GitHub Actions workflow enabled
- [ ] Secrets added to repository:
  - [ ] HOSTINGER_USER
  - [ ] HOSTINGER_HOST
  - [ ] HOSTINGER_PASSWORD

## Hostinger Configuration
- [ ] SSH access enabled on hosting account
- [ ] Node.js 18+ installed
- [ ] Directory created: /public_html/ravari-store/
- [ ] SSL certificate installed for $DOMAIN
- [ ] Reverse proxy configured (.htaccess)

## Code Quality
- [ ] All code committed to main branch
- [ ] No console errors in frontend build
- [ ] Backend server.js runs without errors
- [ ] All dependencies in package.json

## Database
- [ ] MongoDB Atlas connection string verified
- [ ] Database seeding script ready
- [ ] Admin credentials configured
- [ ] Collection indexes created

## Deployment Methods
- [ ] Method 1: Manual - \`./deploy.sh\`
- [ ] Method 2: GitHub Actions - Auto-deploy on push to main
- [ ] Method 3: Hostinger cPanel - Node.js app manager

## Post-Deployment Testing
- [ ] Frontend loads at https://$DOMAIN
- [ ] API responds at https://$DOMAIN/api/health
- [ ] Products display at https://$DOMAIN/api/products
- [ ] Admin panel accessible at https://$DOMAIN/admin
- [ ] Database connection works
- [ ] SSL certificate valid (no warnings)

## Monitoring
- [ ] Application logs accessible
- [ ] Error monitoring configured
- [ ] Uptime monitoring enabled
CHECKEOF

echo "✓ Created PRE_DEPLOYMENT_CHECKLIST.md"

# Step 8: Create deployment instructions
echo ""
echo "📚 STEP 8: Creating Deployment Instructions"
echo "==========================================="

cat > DEPLOYMENT_QUICK_START.md << QUICKEOF
# RAVARI Store - Quick Deployment Guide

## Configuration Complete ✓
Your deployment is configured for:
- **Domain:** $DOMAIN
- **Hostinger User:** $HOSTINGER_USER
- **Database:** MongoDB Atlas

## Deployment Methods

### Method 1: Automatic (Recommended)
Every time you push to GitHub, deployment happens automatically:

\`\`\`bash
git add .
git commit -m "Update website"
git push origin main
\`\`\`

GitHub Actions will automatically:
1. Build the frontend
2. Install backend dependencies
3. Deploy to Hostinger
4. Restart the application

**Monitor deployment:** Go to GitHub → Actions tab

### Method 2: Manual Deployment
Run the deployment script:

\`\`\`bash
export HOSTINGER_USER=$HOSTINGER_USER
export HOSTINGER_HOST=$HOSTINGER_HOST
./deploy.sh
\`\`\`

### Method 3: Hostinger cPanel
1. Log into Hostinger
2. Go to cPanel → Node.js
3. Click "Restart" on your ravari-store application

## Verify Deployment

After deploying, test:

\`\`\`bash
# Test website
curl https://$DOMAIN

# Test API
curl https://$DOMAIN/api/health

# Test products
curl https://$DOMAIN/api/products
\`\`\`

## View Logs

SSH into Hostinger and view logs:

\`\`\`bash
ssh $HOSTINGER_USER@$HOSTINGER_HOST
cd public_html/ravari-store/backend
tail -f logs/app.log
\`\`\`

## Environment Variables

All configuration is in:
- Backend: \`backend/.env\`
- Frontend: \`frontend/.env.production\`

To change configuration:
1. Update the .env files
2. Push to GitHub (auto-deploys)
3. Or manually run \`./deploy.sh\`

## Troubleshooting

**Site not updating:** 
- Clear browser cache (Ctrl+Shift+Delete)
- Wait 2-5 minutes for deployment to complete
- Check GitHub Actions tab for errors

**API not responding:**
- Check MongoDB Atlas connection
- Verify MONGODB_URI in backend/.env
- View logs: \`tail -f logs/app.log\`

**Deployment failed:**
- Check GitHub Actions for error message
- Verify SSH credentials in GitHub Secrets
- Test SSH connection manually

## Next Steps

1. ✅ Verify all files deployed correctly
2. ✅ Test all features (products, cart, admin)
3. ✅ Set up monitoring and alerts
4. ✅ Configure domain DNS if needed
5. ✅ Set up automated backups

**Questions?** Check deployment logs or contact Hostinger support.
QUICKEOF

echo "✓ Created DEPLOYMENT_QUICK_START.md"

# Summary
echo ""
echo "=========================================="
echo "✅ DEPLOYMENT SETUP COMPLETE!"
echo "=========================================="
echo ""
echo "📋 Summary:"
echo "   Domain: $DOMAIN"
echo "   Hostinger: $HOSTINGER_HOST"
echo "   Method: GitHub Actions (automatic)"
echo ""
echo "📝 Configuration files created:"
echo "   • backend/.env"
echo "   • frontend/.env.production"
echo "   • PRE_DEPLOYMENT_CHECKLIST.md"
echo "   • DEPLOYMENT_QUICK_START.md"
echo ""
echo "🚀 Next steps:"
echo "   1. Add GitHub Secrets (see instructions above)"
echo "   2. Push to GitHub: git push origin main"
echo "   3. Check GitHub Actions for deployment"
echo "   4. Verify at: https://$DOMAIN"
echo ""

