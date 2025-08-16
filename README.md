# 🏛️ GovLink

**GovLink** is a comprehensive Next.js-based digital government platform designed to revolutionize citizen-government interactions. Built with modern web technologies, it provides a unified interface for citizens, government agents, departments, and administrators to access various government services efficiently.

## 🌟 Project Overview

GovLink bridges the digital divide between citizens and government services by providing a centralized, accessible platform that offers:

- **Digital Service Delivery**: Streamlined online government services
- **Appointment Management**: Intelligent booking system with QR code integration
- **Real-time Communication**: Chat functionality with AI-powered RAG bot
- **Multi-level Administration**: Role-based access control for different user types
- **Document Management**: Secure file handling and verification
- **Multi-language Support**: Internationalization with i18next
- **Analytics & Reporting**: Comprehensive dashboards for insights

## ✨ Key Features

### 👥 **Multi-Role System**
- **Citizens**: Access services, book appointments, chat with agents
- **Agents**: Manage appointments, communicate with citizens, handle service requests
- **Departments**: Oversee agents, manage services, configure department settings
- **Administrators**: System-wide management, user oversight, system configuration

### 🔐 **Authentication & Security**
- JWT-based authentication for all user types
- Role-based access control (RBAC)
- Password encryption with bcrypt
- Rate limiting for API security
- Account verification and email notifications

### 📱 **Smart Appointment System**
- QR code generation for appointment passes
- Email notifications with QR code attachments
- Department-specific appointment slots
- Agent-specific booking options
- Real-time availability checking

### 🤖 **AI-Powered Features**
- RAG (Retrieval-Augmented Generation) chatbot
- LangChain integration for intelligent responses
- OpenAI and Tavily search capabilities
- Context-aware government service assistance

### 🌍 **Internationalization**
- Multi-language support (English, Sinhala, Tamil)
- Language detection and switching
- Localized content for better accessibility

### 📊 **Analytics & Management**
- Department analytics dashboards
- Agent performance tracking
- User engagement metrics
- Service usage statistics

### 🔄 **File Management**
- AWS S3 (R2) integration for file storage
- Secure file upload and download
- Document verification workflows
- Profile picture management

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [Next.js 15.4.5](https://nextjs.org) with React 19
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com) with custom components
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Theme**: Next-themes for dark/light mode
- **Icons**: Lucide React

### **Backend & APIs**
- **Runtime**: Node.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **File Storage**: AWS S3 (R2) with S3 SDK v3
- **Email Service**: Nodemailer
- **AI/ML**: LangChain, OpenAI, Tavily Search

### **Development Tools**
- **Language**: TypeScript 5
- **Linting**: ESLint with Next.js config
- **Build Tool**: Next.js with Turbopack
- **Package Manager**: npm
- **Version Control**: Git

### **Deployment & Monitoring**
- **Platform**: Netlify (with Azure VM support)
- **Analytics**: Vercel Analytics & Speed Insights
- **Environment**: Multi-environment support (dev, prod)

## 📁 Project Structure

```
govlink/
├── src/                          # Source code
│   ├── app/                      # Next.js app router
│   │   ├── admin/               # Admin dashboard & management
│   │   ├── agent/               # Agent portal & features
│   │   ├── department/          # Department management
│   │   ├── user/                # Citizen portal
│   │   ├── api/                 # API routes & serverless functions
│   │   ├── account-suspended/   # Suspension handling
│   │   ├── feedback/            # Feedback system
│   │   └── ragbot/              # AI chatbot interface
│   ├── components/              # Reusable React components
│   │   ├── adminSystem/         # Admin-specific components
│   │   ├── agent/               # Agent portal components
│   │   ├── department/          # Department components
│   │   ├── user/                # User/citizen components
│   │   └── Icons/               # Custom icon components
│   ├── lib/                     # Utility libraries & services
│   │   ├── auth/                # Authentication middleware
│   │   ├── i18n/                # Internationalization
│   │   ├── models/              # Database schemas
│   │   ├── services/            # Business logic services
│   │   ├── tools/               # Utility tools
│   │   └── utils/               # Helper functions
│   └── types/                   # TypeScript type definitions
├── public/                      # Static assets
├── scripts/                     # Database migration & utility scripts
├── .github/                     # CI/CD workflows & templates
└── docs/                        # Documentation files
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas
- **Git**: For version control

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/govlink
# or MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/govlink

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# AWS S3 (R2) Configuration
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=your-bucket-name
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# Email Configuration (Nodemailer)
EMAIL_FROM=noreply@govlink.lk
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# OpenAI API (for RAG bot)
OPENAI_API_KEY=your-openai-api-key

# Tavily Search API (for RAG bot)
TAVILY_API_KEY=your-tavily-api-key

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000
```

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/XFire2025/govlink.git
   cd govlink
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up MongoDB**:
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `govlink`
   - Update the `MONGODB_URI` in your `.env.local`

5. **Run database migrations** (optional):
   ```bash
   npm run migrate:departments
   ```

6. **Start the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run seed:departments` - Seed initial department data
- `npm run migrate:departments` - Run department migrations

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

#### **Quick Start**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/XFire2025/govlink.git
   cd govlink
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.docker.example .env
   # Edit .env with your configuration
   ```

3. **Start all services**:
   ```bash
   docker-compose up -d
   ```

4. **Access the application**:
   - **GovLink App**: http://localhost:3000
   - **MongoDB**: localhost:27017
   - **MongoDB Express** (optional): http://localhost:8081

#### **Available Profiles**

```bash
# Development with hot reload
docker-compose up

# Production with optimized build
docker-compose --profile production up -d

# With MongoDB Express for database management
docker-compose --profile development up -d

# With Redis caching
docker-compose --profile cache up -d

# With Nginx reverse proxy
docker-compose --profile production up -d
```

#### **Environment Configuration**

Create a `.env` file based on `.env.docker.example`:

```bash
# Required variables
JWT_SECRET=your-super-secret-jwt-key-must-be-at-least-32-characters-long
OPENAI_API_KEY=your-openai-api-key
TAVILY_API_KEY=your-tavily-api-key

# AWS S3/R2 Configuration
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=your-bucket
R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### **Development Workflow**

```bash
# Start development environment
docker-compose up

# View logs
docker-compose logs -f govlink-app

# Execute commands in container
docker-compose exec govlink-app npm run build

# Stop services
docker-compose down

# Clean up volumes (⚠️ This will delete data)
docker-compose down -v
```

#### **Production Deployment**

```bash
# Build and start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale the application
docker-compose up -d --scale govlink-app=3

# View production logs
docker-compose logs -f --tail=100
```

### **Docker Services Overview**

| Service | Port | Description | Profile |
|---------|------|-------------|---------|
| `govlink-app` | 3000 | Next.js application | default |
| `mongodb` | 27017 | MongoDB database | default |
| `mongo-express` | 8081 | Database admin UI | development |
| `redis` | 6379 | Caching layer | cache |
| `nginx` | 80, 443 | Reverse proxy | production |

### **Health Checks**

All services include health checks:

```bash
# Check service status
docker-compose ps

# View health status
docker inspect govlink-app | grep Health -A 10
```

### **Data Persistence**

Docker volumes ensure data persistence:

- `mongodb_data`: Database files
- `govlink_uploads`: User uploaded files
- `redis_data`: Cache data (if using Redis)
- `nginx_logs`: Web server logs

### **Troubleshooting Docker**

```bash
# Rebuild containers
docker-compose build --no-cache

# View container logs
docker-compose logs govlink-app

# Access container shell
docker-compose exec govlink-app sh

# Reset everything
docker-compose down -v
docker system prune -a
```

## 🌐 Deployment

### Production Deployment Status

- **Main Branch** (Production): 
  [![Netlify Status](https://api.netlify.com/api/v1/badges/c64faf7b-b410-4c26-82fa-ac50e5b38da1/deploy-status)](https://app.netlify.com/projects/govlink25/deploys)

- **Dev Branch** (Development): 
  [![Netlify Status](https://api.netlify.com/api/v1/badges/399ab7d0-ba49-474d-b44b-a5637bfb2d1b/deploy-status)](https://app.netlify.com/projects/govlinkdev/deploys)

### Deployment Options

#### 1. **Netlify Deployment** (Current)
- Automatic deployments from GitHub
- Environment variable configuration
- Custom domain support
- Serverless functions support

#### 2. **Azure VM Deployment**
- Complete deployment guide available in `DEPLOYMENT.md`
- CI/CD pipeline with GitHub Actions
- Custom server configuration
- SSL certificate setup

#### 3. **Docker Deployment**
- Use the provided `docker-compose.yml`
- Containerized application with MongoDB
- Easy scaling and environment management

### Environment-Specific Configuration

#### **Development**
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### **Production**
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### **How to Contribute**

1. **Fork the repository**
   ```bash
   git fork https://github.com/XFire2025/govlink.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description of your changes
   - Link any related issues
   - Ensure all tests pass

### **Code Style Guidelines**

- Use TypeScript for all new code
- Follow the existing naming conventions
- Add JSDoc comments for functions
- Use Tailwind CSS for styling
- Follow the component structure patterns

### **Pull Request Process**

![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/XFire2025/XFire_GovLink?utm_source=oss&utm_medium=github&utm_campaign=XFire2025%2FXFire_GovLink&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

1. All PRs are reviewed using CodeRabbit AI
2. Maintainers will review your changes
3. Address any feedback or requested changes
4. Once approved, your PR will be merged

## 📚 Documentation

- **[Admin RBAC Documentation](ADMIN_RBAC_DOCUMENTATION.md)**: Role-based access control details
- **[Deployment Guide](DEPLOYMENT.md)**: Complete Azure VM deployment instructions  
- **[QR Code Implementation](QR_CODE_IMPLEMENTATION.md)**: QR code system documentation
- **API Documentation**: Available in individual route files under `src/app/api/`

## 🤖 AI Integration

### **RAG (Retrieval-Augmented Generation) Bot**

GovLink features an advanced AI chatbot powered by:

- **LangChain**: For conversation flow and context management
- **OpenAI GPT**: For natural language understanding and generation
- **Tavily Search**: For real-time information retrieval
- **Custom Knowledge Base**: Government-specific information and procedures

### **Features**
- Context-aware responses about government services
- Multi-language support for better accessibility
- Real-time information retrieval
- Integration with appointment booking system
- Escalation to human agents when needed

## 🔧 API Documentation

### **Authentication Endpoints**
- `POST /api/auth/admin` - Admin authentication
- `POST /api/auth/agent/login` - Agent login
- `POST /api/auth/department/login` - Department login
- `GET /api/auth/*/me` - Get current user profile

### **User Management**
- `GET /api/admin/admins` - List all admins (Super Admin only)
- `POST /api/admin/admins` - Create new admin
- `GET /api/admin/agents` - List all agents
- `POST /api/admin/agents` - Create new agent

### **Department APIs**
- `GET /api/admin/departments` - List all departments
- `POST /api/admin/departments` - Create new department
- `PUT /api/admin/departments/[id]` - Update department
- `DELETE /api/admin/departments/[id]` - Delete department

### **Agent Management**
- `GET /api/department/agents` - Get department agents
- `POST /api/department/agents` - Create new agent
- `PUT /api/department/agents/[id]` - Update agent
- `DELETE /api/department/agents/[id]` - Deactivate agent

### **Public APIs**
- `GET /api/user/departments` - Get all active departments
- `GET /api/user/departments/[id]/agents` - Get department agents
- `POST /api/ragbot` - Chat with AI assistant

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: bcrypt with salt rounds
- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security
- **Environment Variables**: Secure configuration management
- **Role-Based Access**: Granular permission system

## 📊 Monitoring & Analytics

- **Vercel Analytics**: User engagement tracking
- **Speed Insights**: Performance monitoring
- **Custom Dashboards**: Role-specific analytics
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: API response time monitoring

## 🚨 Troubleshooting

### **Common Issues**

#### **Database Connection Issues**
```bash
# Check MongoDB service status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

#### **Environment Variable Issues**
- Ensure all required environment variables are set
- Check for typos in variable names
- Verify `.env.local` is in the root directory
- Restart the development server after changes

#### **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run build
```

#### **Port Already in Use**
```bash
# Kill process using port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### **Performance Optimization**

- Enable Turbopack in development: `npm run dev` (already configured)
- Use Next.js Image component for optimized images
- Implement proper caching strategies
- Monitor bundle size with `@next/bundle-analyzer`

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/XFire2025/govlink/issues)
- **Discussions**: [GitHub Discussions](https://github.com/XFire2025/govlink/discussions)
- **Documentation**: [Project Wiki](https://github.com/XFire2025/govlink/wiki)
- **Security**: Report security issues to security@govlink.lk

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### **Phase 1: Core Platform** ✅
- [x] Multi-role authentication system
- [x] Department and agent management
- [x] Basic appointment booking
- [x] Admin dashboard

### **Phase 2: Enhanced Features** ✅
- [x] QR code integration
- [x] Email notification system
- [x] RAG chatbot integration
- [x] Multi-language support

### **Phase 3: Advanced Features** 🔄
- [ ] Mobile application
- [ ] Advanced analytics
- [ ] Payment gateway integration
- [ ] Document verification system
- [ ] API rate limiting improvements

### **Phase 4: Enterprise Features** 📋
- [ ] Multi-tenant architecture
- [ ] Advanced reporting
- [ ] Audit logging
- [ ] SSO integration
- [ ] Advanced security features

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **MongoDB**: For the flexible database solution
- **Tailwind CSS**: For the utility-first CSS framework
- **OpenAI**: For AI integration capabilities
- **Netlify**: For deployment and hosting
- **Government of Sri Lanka**: For the project inspiration and requirements

---

<div align="center">

**Built with ❤️ by the GovLink Team**

[🌐 Website](https://govlink25.netlify.app) • [📚 Documentation](DEPLOYMENT.md) • [🐛 Report Bug](https://github.com/XFire2025/govlink/issues) • [✨ Request Feature](https://github.com/XFire2025/govlink/issues)

</div>
