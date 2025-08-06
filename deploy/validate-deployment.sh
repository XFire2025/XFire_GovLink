#!/bin/bash

# Deployment Validation Script
# Run this on your Azure VM to validate the deployment setup

echo "🔍 GovLink Deployment Validation"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check Node.js
echo ""
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js installed: $NODE_VERSION"
    
    # Check if version is 16 or higher
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
    if [ "$NODE_MAJOR" -ge 16 ]; then
        print_status 0 "Node.js version is compatible (v16+)"
    else
        print_warning "Node.js version might be too old. Recommended: v18+"
    fi
else
    print_status 1 "Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status 0 "npm installed: $NPM_VERSION"
else
    print_status 1 "npm not found"
fi

# Check application directory
echo ""
echo "📁 Checking application directory..."
APP_DIR="/home/$(whoami)/govlink"
if [ -d "$APP_DIR" ]; then
    print_status 0 "Application directory exists: $APP_DIR"
    
    cd "$APP_DIR"
    
    # Check if package.json exists
    if [ -f "package.json" ]; then
        print_status 0 "package.json found"
    else
        print_status 1 "package.json not found"
    fi
    
    # Check if .next directory exists
    if [ -d ".next" ]; then
        print_status 0 "Built application (.next) found"
    else
        print_warning "Built application not found - run deployment first"
    fi
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        print_status 0 "Dependencies (node_modules) installed"
    else
        print_warning "Dependencies not installed"
    fi
else
    print_status 1 "Application directory not found: $APP_DIR"
fi

# Check systemd service
echo ""
echo "⚙️  Checking systemd service..."
if [ -f "/etc/systemd/system/govlink.service" ]; then
    print_status 0 "Systemd service file exists"
    
    # Check if service is enabled
    if systemctl is-enabled govlink &> /dev/null; then
        print_status 0 "Service is enabled"
    else
        print_warning "Service is not enabled"
    fi
    
    # Check if service is active
    if systemctl is-active --quiet govlink; then
        print_status 0 "Service is running"
    else
        print_warning "Service is not running"
    fi
else
    print_status 1 "Systemd service file not found"
fi

# Check port availability
echo ""
echo "🌐 Checking network..."
if command -v netstat &> /dev/null; then
    if netstat -tlnp | grep :3000 &> /dev/null; then
        print_status 0 "Port 3000 is in use (application might be running)"
    else
        print_warning "Port 3000 is not in use"
    fi
else
    print_warning "netstat not available - install net-tools"
fi

# Check application response
echo ""
echo "🔍 Testing application response..."
if curl -f http://localhost:3000 &> /dev/null; then
    print_status 0 "Application responds to HTTP requests"
else
    print_warning "Application not responding on http://localhost:3000"
fi

# Check firewall
echo ""
echo "🔥 Checking firewall..."
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status | head -1)
    echo "UFW Status: $UFW_STATUS"
    
    if echo "$UFW_STATUS" | grep -q "active"; then
        if sudo ufw status | grep -q "3000"; then
            print_status 0 "Port 3000 allowed in UFW"
        else
            print_warning "Port 3000 not explicitly allowed in UFW"
        fi
    else
        print_status 0 "UFW is inactive"
    fi
else
    print_warning "UFW not found"
fi

# Check disk space
echo ""
echo "💾 Checking disk space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)
if [ "$DISK_USAGE" -lt 80 ]; then
    print_status 0 "Disk usage: ${DISK_USAGE}% (healthy)"
elif [ "$DISK_USAGE" -lt 90 ]; then
    print_warning "Disk usage: ${DISK_USAGE}% (moderate)"
else
    print_status 1 "Disk usage: ${DISK_USAGE}% (critical)"
fi

# Check memory
echo ""
echo "🧠 Checking memory..."
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.1f", $3*100/$2}')
echo "Memory usage: ${MEMORY_USAGE}%"

# Summary
echo ""
echo "📊 Validation Summary"
echo "===================="

if systemctl is-active --quiet govlink && curl -f http://localhost:3000 &> /dev/null; then
    echo -e "${GREEN}🎉 Deployment appears to be working correctly!${NC}"
    echo ""
    echo "✅ Service is running"
    echo "✅ Application is responding"
    echo ""
    echo "🌍 Your application should be accessible at:"
    echo "   - Locally: http://localhost:3000"
    if command -v curl &> /dev/null; then
        PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unable-to-detect")
        if [ "$PUBLIC_IP" != "unable-to-detect" ]; then
            echo "   - Externally: http://$PUBLIC_IP:3000 (if firewall allows)"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Deployment needs attention${NC}"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Check service status: sudo systemctl status govlink"
    echo "   2. Check logs: sudo journalctl -u govlink -f"
    echo "   3. Try manual start: cd $APP_DIR && npm start"
fi

echo ""
echo "📚 For more help, see DEPLOYMENT.md"
