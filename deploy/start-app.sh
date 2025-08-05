#!/bin/bash

# GovLink Application Startup Script
# This script sets up and starts the GovLink Next.js application

set -e

echo "🚀 Starting GovLink Application Setup..."

# Configuration
APP_DIR="/home/azureuser/govlink"
SERVICE_NAME="govlink"
PORT=3000

# Check if running as root for service operations
if [[ $EUID -eq 0 ]]; then
    echo "⚠️  Running as root - service operations will be performed"
    ROOT_MODE=true
else
    echo "ℹ️  Running as user - will use sudo for service operations"
    ROOT_MODE=false
fi

# Function to run commands with appropriate privileges
run_privileged() {
    if [ "$ROOT_MODE" = true ]; then
        "$@"
    else
        sudo "$@"
    fi
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   You can install it using:"
    echo "   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "   sudo apt-get install -y nodejs"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"

# Check if application directory exists
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Application directory $APP_DIR does not exist"
    exit 1
fi

cd "$APP_DIR"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm ci --production
else
    echo "✅ Dependencies already installed"
fi

# Check if .next directory exists (built application)
if [ ! -d ".next" ]; then
    echo "❌ Application not built. Please run 'npm run build' first."
    exit 1
fi

echo "✅ Application build found"

# Create systemd service file
echo "⚙️  Setting up systemd service..."

# Create a temporary service file with correct user
SERVICE_CONTENT="[Unit]
Description=GovLink Next.js Application
Documentation=https://nextjs.org/
After=network.target

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PORT=$PORT
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=govlink

[Install]
WantedBy=multi-user.target"

# Write service file
echo "$SERVICE_CONTENT" | run_privileged tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null

# Reload systemd and enable service
echo "🔄 Reloading systemd..."
run_privileged systemctl daemon-reload
run_privileged systemctl enable $SERVICE_NAME

# Stop service if it's running
echo "🛑 Stopping existing service (if running)..."
run_privileged systemctl stop $SERVICE_NAME 2>/dev/null || echo "Service was not running"

# Start the service
echo "▶️  Starting $SERVICE_NAME service..."
run_privileged systemctl start $SERVICE_NAME

# Wait a moment for the service to start
sleep 3

# Check service status
if run_privileged systemctl is-active --quiet $SERVICE_NAME; then
    echo "✅ $SERVICE_NAME service is running successfully!"
    
    # Check if the application responds
    echo "🔍 Performing health check..."
    sleep 5
    
    if curl -f http://localhost:$PORT >/dev/null 2>&1; then
        echo "✅ Application is responding on port $PORT"
        echo ""
        echo "🎉 Deployment completed successfully!"
        echo "📱 Your application is available at:"
        echo "   - Local: http://localhost:$PORT"
        echo "   - External: http://$(curl -s ifconfig.me):$PORT (if firewall allows)"
        echo ""
        echo "📊 Service management commands:"
        echo "   - Check status: sudo systemctl status $SERVICE_NAME"
        echo "   - View logs: sudo journalctl -u $SERVICE_NAME -f"
        echo "   - Restart: sudo systemctl restart $SERVICE_NAME"
        echo "   - Stop: sudo systemctl stop $SERVICE_NAME"
    else
        echo "⚠️  Service is running but application is not responding on port $PORT"
        echo "📊 Check the service status: sudo systemctl status $SERVICE_NAME"
        echo "📋 Check the logs: sudo journalctl -u $SERVICE_NAME -f"
    fi
else
    echo "❌ Failed to start $SERVICE_NAME service"
    echo "📊 Service status:"
    run_privileged systemctl status $SERVICE_NAME
    echo ""
    echo "📋 Recent logs:"
    run_privileged journalctl -u $SERVICE_NAME --no-pager -n 20
    exit 1
fi
