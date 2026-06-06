#!/bin/bash

#=============================================================================
# RAVARI STORE - AUTOMATED DEPLOYMENT SCRIPT
# Deploy to Hostinger with one command
#=============================================================================

set -e  # Exit on any error

echo "🚀 RAVARI STORE - DEPLOYMENT SCRIPT"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
HOSTINGER_USER="${HOSTINGER_USER:-your_username}"
HOSTINGER_HOST="${HOSTINGER_HOST:-your_hosting.hostingersitecom}"
HOSTINGER_PATH="/home/${HOSTINGER_USER}/public_html/ravari-store"
GITHUB_REPO="https://github.com/harshadkhetpal/ravari-store.git"

# Functions
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Step 1: Verify environment
echo ""
echo "📋 STEP 1: Verifying environment..."
if [ -z "$HOSTINGER_USER" ] || [ "$HOSTINGER_USER" = "your_username" ]; then
    log_error "HOSTINGER_USER not set!"
    echo "Run: export HOSTINGER_USER=your_hosting_username"
    exit 1
fi
log_info "Hostinger user: $HOSTINGER_USER"

# Step 2: Build frontend
echo ""
echo "🔨 STEP 2: Building frontend..."
cd frontend
npm install --production
npm run build
log_info "Frontend built successfully"
cd ..

# Step 3: Prepare backend
echo ""
echo "📦 STEP 3: Preparing backend..."
cd backend
npm install --production
log_info "Backend dependencies installed"

# Check if .env exists
if [ ! -f ".env" ]; then
    log_warning ".env file not found!"
    echo "Creating .env.example template..."
    cat > .env.example << 'ENVEOF'
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ravari
JWT_SECRET=change_this_to_random_secure_key
CORS_ORIGIN=https://ravari.in
ADMIN_EMAIL=admin@ravari.in
ADMIN_PASSWORD=change_this_to_strong_password
ENVEOF
    log_error "⚠️  Please create backend/.env with your credentials"
    exit 1
fi
log_info "Backend environment verified"
cd ..

# Step 4: Deploy to Hostinger
echo ""
echo "🌐 STEP 4: Deploying to Hostinger..."

# Check SSH connectivity
log_info "Testing SSH connection..."
ssh "${HOSTINGER_USER}@${HOSTINGER_HOST}" "echo '✓ SSH connection successful'" || {
    log_error "SSH connection failed!"
    exit 1
}

# Deploy
log_info "Deploying files to Hostinger..."
ssh "${HOSTINGER_USER}@${HOSTINGER_HOST}" << SSHEOF
    # Navigate to app directory
    cd ${HOSTINGER_PATH} 2>/dev/null || {
        echo "Creating directory..."
        mkdir -p ${HOSTINGER_PATH}
        cd ${HOSTINGER_PATH}
    }
    
    # Pull latest from GitHub or clone if new
    if [ -d ".git" ]; then
        echo "Updating from GitHub..."
        git fetch origin
        git reset --hard origin/main
    else
        echo "Cloning repository..."
        git clone ${GITHUB_REPO} .
    fi
    
    # Install dependencies
    echo "Installing backend dependencies..."
    cd backend
    npm install --production
    cd ..
    
    # Build frontend
    echo "Building frontend..."
    cd frontend
    npm install --production
    npm run build
    cd ..
    
    echo "✓ Files deployed successfully!"
SSHEOF

log_info "Deployment to Hostinger completed"

# Step 5: Restart application
echo ""
echo "🔄 STEP 5: Restarting application..."
ssh "${HOSTINGER_USER}@${HOSTINGER_HOST}" << SSHEOF
    # Method 1: Using pm2 (if available)
    if command -v pm2 &> /dev/null; then
        echo "Restarting with pm2..."
        pm2 restart ravari-store || pm2 start ${HOSTINGER_PATH}/backend/server.js --name ravari-store
    fi
    
    # Method 2: Using Node.js directly (for cPanel)
    # The app will auto-restart via cPanel Node.js manager
    
    echo "✓ Application restart triggered"
SSHEOF

log_info "Application restarted"

# Step 6: Verification
echo ""
echo "✅ STEP 6: Verifying deployment..."
log_info "Website: https://ravari.in"
log_info "API: https://ravari.in/api/health"
log_info "Admin: https://ravari.in/admin"

echo ""
echo "=================================="
echo -e "${GREEN}✓ DEPLOYMENT COMPLETE!${NC}"
echo "=================================="
echo ""
echo "Next steps:"
echo "1. Verify website loads at https://ravari.in"
echo "2. Check API at https://ravari.in/api/health"
echo "3. Test admin at https://ravari.in/admin"
echo ""
echo "View deployment logs:"
echo "  ssh ${HOSTINGER_USER}@${HOSTINGER_HOST}"
echo "  tail -f ~/public_html/ravari-store/backend/logs/app.log"
