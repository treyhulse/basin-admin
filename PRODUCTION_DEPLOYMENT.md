# Production Deployment Guide

This guide explains how to deploy your MCP server and Next.js app in production, specifically for Vercel deployment.

## 🏗️ **Architecture Overview**

```
┌─────────────────┐    HTTP API    ┌─────────────────┐
│   Next.js App  │ ◄─────────────► │   MCP Server   │
│   (Vercel)     │                │   (External)    │
└─────────────────┘                └─────────────────┘
```

- **Next.js App**: Deployed on Vercel (serverless)
- **MCP Server**: Deployed on external platform (always-on)
- **Communication**: HTTP API calls between them

## 🚀 **Option 1: Deploy MCP Server Separately (Recommended)**

### **Platform Options**

#### **A. Railway (Recommended for simplicity)**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
cd mcp
railway init

# 4. Deploy
railway up
```

#### **B. Render**
```bash
# 1. Create render.yaml in mcp/ directory
services:
  - type: web
    name: basin-mcp-server
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MCP_HTTP_PORT
        value: 10000
```

#### **C. DigitalOcean App Platform**
```bash
# 1. Create app in DigitalOcean dashboard
# 2. Connect GitHub repository
# 3. Set build command: npm run build
# 4. Set run command: npm start
```

### **MCP Server Production Setup**

Create a production-ready MCP server configuration:

```typescript
// mcp/basin.prod.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import http from "node:http";

async function main() {
  const server = new McpServer({ name: "Basin", version: "1.0.0" });

  // Add your tools here...
  
  // Production HTTP server
  const httpServer = http.createServer(async (req, res) => {
    // Add security headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Add rate limiting headers
    res.setHeader('X-RateLimit-Limit', '1000');
    res.setHeader('X-RateLimit-Remaining', '999');
    
    // Your existing endpoints...
  });

  const PORT = process.env.PORT || 3001;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Basin MCP Server running on port ${PORT}`);
  });

  await server.connect(new StdioServerTransport());
}

main().catch(e => { console.error(e); process.exit(1); });
```

### **Environment Variables for Production MCP Server**

```bash
# .env.production
NODE_ENV=production
PORT=3001
ALLOWED_ORIGINS=https://yourdomain.vercel.app
MCP_HTTP_PORT=3001
```

## 🌐 **Option 2: Vercel Edge Functions (Alternative)**

If you prefer to keep everything on Vercel, use Edge Functions:

```typescript
// src/app/api/mcp/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Proxy to external MCP server
  const mcpUrl = process.env.MCP_SERVER_URL;
  
  try {
    const response = await fetch(`${mcpUrl}/health`);
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'MCP server unavailable' },
      { status: 503 }
    );
  }
}
```

## 🔧 **Next.js App Configuration**

### **Environment Variables for Production**

Create `.env.production` in your project root:

```bash
# MCP Server Configuration
NEXT_PUBLIC_MCP_SERVER_URL=https://your-mcp-server.railway.app
NEXT_PUBLIC_MCP_SERVER_PORT=443
NEXT_PUBLIC_MCP_ENABLED=true
NEXT_PUBLIC_MCP_HEALTH_CHECK_INTERVAL=10000
NEXT_PUBLIC_MCP_PRODUCTION_URL=https://your-mcp-server.railway.app
NEXT_PUBLIC_MCP_FALLBACK_ENABLED=true

# Production settings
NODE_ENV=production
```

### **Vercel Deployment**

```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Set environment variables in Vercel dashboard
# Go to Project Settings > Environment Variables
```

## 📦 **Docker Setup for MCP Server**

Create `mcp/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the server
CMD ["npm", "start"]
```

Create `mcp/docker-compose.yml`:

```yaml
version: '3.8'
services:
  mcp-server:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - ALLOWED_ORIGINS=https://yourdomain.vercel.app
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## 🔒 **Security Considerations**

### **CORS Configuration**
```typescript
// In your MCP server
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];

res.setHeader('Access-Control-Allow-Origin', 
  allowedOrigins.includes('*') ? '*' : 
  allowedOrigins.includes(req.headers.origin || '') ? req.headers.origin : ''
);
```

### **Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### **Authentication (Optional)**
```typescript
// Add API key validation
const apiKey = req.headers['x-api-key'];
if (!apiKey || apiKey !== process.env.MCP_API_KEY) {
  res.writeHead(401);
  res.end(JSON.stringify({ error: 'Unauthorized' }));
  return;
}
```

## 📊 **Monitoring and Health Checks**

### **Health Check Endpoint**
```typescript
// Enhanced health check
if (req.url === '/health') {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0',
    environment: process.env.NODE_ENV
  };
  
  res.writeHead(200);
  res.end(JSON.stringify(health));
}
```

### **Logging**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🚀 **Deployment Commands**

### **Railway Deployment**
```bash
cd mcp
railway up
railway domain
```

### **Render Deployment**
```bash
cd mcp
git add .
git commit -m "Production deployment"
git push origin main
```

### **Vercel Deployment**
```bash
vercel --prod
```

## 🔍 **Testing Production Setup**

1. **Deploy MCP server** to your chosen platform
2. **Get the public URL** (e.g., `https://basin-mcp.railway.app`)
3. **Update environment variables** in Vercel dashboard
4. **Deploy Next.js app** to Vercel
5. **Test the dashboard** at your Vercel URL

## 📈 **Scaling Considerations**

- **MCP Server**: Use platform auto-scaling (Railway, Render, DigitalOcean)
- **Next.js App**: Vercel handles scaling automatically
- **Database**: Consider using Supabase or similar for persistent data
- **Caching**: Implement Redis for frequently accessed MCP data

## 🆘 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**: Check `ALLOWED_ORIGINS` environment variable
2. **Connection Timeouts**: Verify MCP server URL and port
3. **Rate Limiting**: Check platform limits and implement proper rate limiting
4. **Memory Issues**: Monitor server resources and implement proper cleanup

### **Debug Commands**
```bash
# Check MCP server status
curl https://your-mcp-server.railway.app/health

# Check environment variables
echo $NEXT_PUBLIC_MCP_SERVER_URL

# Test dashboard connectivity
curl -H "Origin: https://yourdomain.vercel.app" \
     https://your-mcp-server.railway.app/health
```

This setup gives you a production-ready MCP server that works seamlessly with your Vercel-deployed Next.js app!
