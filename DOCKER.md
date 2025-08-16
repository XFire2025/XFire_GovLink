# GovLink Docker Setup

This is a simple Docker setup for the GovLink Next.js application using MongoDB Atlas.

## Prerequisites

- Docker and Docker Compose installed
- MongoDB Atlas account and connection string
- Environment variables configured

## Quick Start

1. **Copy environment variables:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file with your actual values:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET` and `JWT_REFRESH_SECRET`: Strong secret keys
   - `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`: Cloudflare R2 credentials
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `TAVILY_API_KEY`: Your Tavily search API key
   - Email configuration for SMTP

3. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Application: http://localhost:3000
   - Health check: http://localhost:3000/api/health

## Environment Variables

The main environment variables you need to configure:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/govlink?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## Commands

- **Build and start:** `docker-compose up --build`
- **Start in background:** `docker-compose up -d`
- **Stop:** `docker-compose down`
- **View logs:** `docker-compose logs -f`
- **Rebuild:** `docker-compose build --no-cache`

## Notes

- The application uses MongoDB Atlas, so no local database is included
- The Docker image is optimized for production with Next.js standalone output
- Health checks are included to monitor application status
