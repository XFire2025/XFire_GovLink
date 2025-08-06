# GovLink Azure VM Deployment Guide

This guide will help you set up automated CI/CD deployment of your GovLink Next.js application to an Azure VM using GitHub Actions.

## Prerequisites

### Azure VM Setup
1. **Azure VM Requirements:**
   - Ubuntu 18.04+ or similar Linux distribution
   - At least 2GB RAM (4GB recommended)
   - 20GB+ storage
   - Public IP address
   - SSH access enabled (port 22)

2. **Network Security Group (NSG) Rules:**
   ```
   - SSH (22): Allow from your IP
   - HTTP (80): Allow from Internet (optional, for reverse proxy)
   - HTTPS (443): Allow from Internet (optional, for reverse proxy)
   - Custom (3000): Allow from Internet (for direct access) OR restrict to your IPs
   ```

### Local Requirements
- Your `.pem` private key file for SSH access
- GitHub repository with admin access
- Azure VM public IP and username

## Azure VM Initial Setup

### 1. Connect to your Azure VM
```bash
ssh -i your-key-file.pem azureuser@your-vm-public-ip
```

### 2. Install Node.js
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 3. Install additional tools
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install useful tools
sudo apt install -y curl wget unzip jq nginx

# Install PM2 (alternative process manager)
sudo npm install -g pm2
```

### 4. Setup application directory
```bash
# Create application directory
mkdir -p /home/azureuser/govlink

# Set proper permissions
sudo chown -R azureuser:azureuser /home/azureuser/govlink
```

### 5. Configure firewall (if enabled)
```bash
# Check if ufw is active
sudo ufw status

# If active, allow necessary ports
sudo ufw allow 22    # SSH
sudo ufw allow 3000  # Application
sudo ufw allow 80    # HTTP (optional)
sudo ufw allow 443   # HTTPS (optional)
```

## GitHub Repository Setup

### 1. Add Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AZURE_VM_HOST` | Your VM's public IP address | `20.123.45.67` |
| `AZURE_VM_USERNAME` | SSH username for your VM | `azureuser` |
| `SSH_PRIVATE_KEY` | Contents of your .pem file | Copy entire .pem file content |

### 2. SSH_PRIVATE_KEY Setup

To add your .pem file content to GitHub secrets:

1. Open your `.pem` file in a text editor
2. Copy the entire content including the header and footer:
   ```
   -----BEGIN RSA PRIVATE KEY-----
   (your key content)
   -----END RSA PRIVATE KEY-----
   ```
3. Paste this into the `SSH_PRIVATE_KEY` secret

## Deployment Process

### Automatic Deployment
The CI/CD pipeline automatically triggers when you:
- Push to the `main` branch
- Merge a pull request to `main`

### Manual Deployment
You can also trigger deployment manually:
1. Go to Actions tab in your GitHub repository
2. Select "Deploy to Azure VM" workflow
3. Click "Run workflow"

## Pipeline Steps

The deployment pipeline performs these steps:

1. **Build Phase:**
   - Checkout code
   - Setup Node.js 18
   - Install dependencies
   - Run linting
   - Build Next.js application
   - Create deployment package

2. **Deploy Phase:**
   - Copy deployment package to Azure VM
   - Backup current application (if exists)
   - Extract new application
   - Install production dependencies
   - Stop old service
   - Start new service
   - Perform health check

## Application Management on Azure VM

### Service Management Commands
```bash
# Check service status
sudo systemctl status govlink

# Start/stop/restart service
sudo systemctl start govlink
sudo systemctl stop govlink
sudo systemctl restart govlink

# View real-time logs
sudo journalctl -u govlink -f

# View recent logs
sudo journalctl -u govlink --no-pager -n 50
```

### Manual Application Management
```bash
# Navigate to application directory
cd /home/azureuser/govlink

# Manual start (for testing)
npm start

# Check if application is responding
curl http://localhost:3000
```

### Application Logs
```bash
# View systemd service logs
sudo journalctl -u govlink

# View application logs (if using PM2)
pm2 logs govlink

# Check system logs
sudo tail -f /var/log/syslog | grep govlink
```

## Troubleshooting

### Common Issues

1. **Deployment fails with SSH connection error:**
   - Verify VM public IP in `AZURE_VM_HOST` secret
   - Check SSH private key in `SSH_PRIVATE_KEY` secret
   - Ensure VM allows SSH connections (port 22)

2. **Application fails to start:**
   ```bash
   # Check service status
   sudo systemctl status govlink
   
   # Check logs
   sudo journalctl -u govlink --no-pager -n 50
   
   # Check if port is already in use
   sudo netstat -tlnp | grep :3000
   ```

3. **Build fails:**
   - Check GitHub Actions logs
   - Verify all dependencies are listed in package.json
   - Ensure build script works locally

4. **Application not accessible externally:**
   - Check Azure NSG rules
   - Verify VM firewall settings
   - Confirm application is binding to 0.0.0.0:3000

### Manual Deployment (Backup Method)

If automated deployment fails, you can deploy manually:

```bash
# On your local machine, build the application
npm run build

# Create deployment package
tar -czf govlink-app.tar.gz .next public package.json package-lock.json

# Copy to Azure VM
scp -i your-key.pem govlink-app.tar.gz azureuser@your-vm-ip:/home/azureuser/

# SSH to Azure VM
ssh -i your-key.pem azureuser@your-vm-ip

# Extract and deploy
cd /home/azureuser/govlink
tar -xzf ../govlink-app.tar.gz
npm ci --production
sudo systemctl restart govlink
```

## Security Recommendations

1. **SSH Security:**
   - Use strong SSH keys
   - Disable password authentication
   - Consider changing default SSH port
   - Use SSH key rotation

2. **Application Security:**
   - Keep Node.js and dependencies updated
   - Use environment variables for sensitive data
   - Consider using a reverse proxy (nginx)
   - Enable HTTPS with SSL certificates

3. **VM Security:**
   - Regular system updates
   - Configure proper firewall rules
   - Use Azure Security Center recommendations
   - Monitor access logs

## Reverse Proxy Setup (Optional)

For production, consider setting up nginx as a reverse proxy:

```bash
# Install nginx
sudo apt install nginx

# Create nginx configuration
sudo nano /etc/nginx/sites-available/govlink

# Add configuration:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/govlink /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Monitoring and Maintenance

### Health Checks
The deployment includes automatic health checks. You can also set up:

1. **Application monitoring with PM2:**
   ```bash
   pm2 monitor
   pm2 status
   ```

2. **System monitoring:**
   ```bash
   # CPU and memory usage
   htop
   
   # Disk usage
   df -h
   
   # Network connections
   sudo netstat -tlnp
   ```

3. **Log rotation:**
   ```bash
   # Setup logrotate for application logs
   sudo nano /etc/logrotate.d/govlink
   ```

## Support

If you encounter issues:

1. Check the deployment logs in GitHub Actions
2. Review application logs on the Azure VM
3. Verify all prerequisites are met
4. Check Azure VM connectivity and resources

## Files Created

This setup creates the following files in your project:

- `.github/workflows/deploy-to-azure-vm.yml` - Main CI/CD pipeline
- `deploy/govlink.service` - Systemd service configuration
- `deploy/start-app.sh` - Application startup script
- `DEPLOYMENT.md` - This documentation file

You're now ready to deploy your GovLink application to Azure VM with automated CI/CD!
