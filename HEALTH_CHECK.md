# Health Check System

This document describes the health check system implemented in the Basin Admin application.

## Overview

The health check system provides real-time monitoring of the backend API and its dependencies. It consists of:

1. **API Endpoint**: `/api/health` - Server-side health check
2. **UI Component**: `ApiStatus` - Real-time health indicator in the UI
3. **Test Script**: `scripts/test-health.mjs` - Standalone testing utility

## API Endpoint

### GET /api/health

Performs comprehensive health checks on the backend system.

#### Response Format

```json
{
  "status": "healthy" | "unhealthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "duration": 1250,
  "version": "1.0.0",
  "environment": "development" | "production",
  "checks": {
    "backend": {
      "status": "healthy" | "unhealthy" | "skipped",
      "responseTime": 500,
      "error": null | "error message"
    },
    "auth": {
      "status": "healthy" | "unhealthy" | "skipped",
      "responseTime": 300,
      "error": null | "error message"
    },
    "database": {
      "status": "healthy" | "unhealthy" | "skipped",
      "responseTime": 200,
      "error": null | "error message"
    }
  },
  "errors": ["error1", "error2"],
  "config": {
    "apiBaseUrl": "https://api.example.com",
    "timeout": 10000,
    "environment": "development"
  }
}
```

#### Health Checks Performed

1. **Backend Connectivity**
   - Tests basic connectivity to the backend API
   - Pings the root URL of the backend (NEXT_PUBLIC_API_URL)
   - Measures response time

2. **Authentication Service**
   - Tests `/auth/context` endpoint
   - Verifies auth service is responding
   - Only runs if backend check passes

3. **Database Connectivity**
   - Tests `/items/collections` endpoint
   - Verifies database is accessible
   - Only runs if backend check passes

#### HTTP Status Codes

- `200` - All systems healthy
- `503` - One or more systems unhealthy

## UI Component

### ApiStatus Component

Located at `src/components/api-status.tsx`, this component provides:

- **Real-time Status**: Visual indicator of system health
- **Periodic Updates**: Automatically checks health every 30 seconds
- **Detailed Tooltips**: Hover to see detailed health information
- **Last Check Time**: Shows when the last check was performed

#### Status Indicators

- 🟢 **Green**: All systems healthy
- 🔴 **Red**: One or more systems have issues
- 🟡 **Yellow**: Currently checking status

## Testing

### Manual Testing

You can test the health endpoint directly:

```bash
# Test the health endpoint
curl http://localhost:3000/api/health

# Or use the test script
npm run test:health
```

### Test Script

The `scripts/test-health.mjs` script provides:

- Detailed health check results
- Response time measurements
- Error reporting
- Configuration display
- Overall pass/fail assessment

## Configuration

The health check system uses the following configuration from `src/lib/config.ts`:

```typescript
export const config = {
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://basin-backend-production.up.railway.app',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  },
  // ... other config
};
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_API_TIMEOUT` - API request timeout in milliseconds
- `NODE_ENV` - Environment (development/production)

## Monitoring Integration

The health check system is designed to integrate with monitoring tools:

1. **Health Endpoint**: Can be used by load balancers and monitoring services
2. **Structured Logging**: All health checks are logged with structured data
3. **Metrics**: Response times and status are tracked
4. **Error Reporting**: Detailed error information for debugging

## Troubleshooting

### Common Issues

1. **Backend Unreachable**
   - Check if the backend server is running
   - Verify the `NEXT_PUBLIC_API_URL` environment variable
   - Check network connectivity

2. **Authentication Failures**
   - Verify the auth service is running
   - Check if the `/auth/context` endpoint is accessible
   - Review authentication configuration

3. **Database Issues**
   - Check database connectivity
   - Verify the `/items/collections` endpoint
   - Review database configuration

### Debug Information

The health endpoint provides detailed debug information:

- Individual check results and response times
- Error messages for failed checks
- Configuration details
- Timestamp and duration information

## Future Enhancements

Potential improvements to the health check system:

1. **Additional Checks**
   - Redis connectivity
   - External service dependencies
   - Disk space and memory usage

2. **Enhanced Monitoring**
   - Historical health data
   - Alerting integration
   - Performance metrics dashboard

3. **Health Check UI**
   - Dedicated health status page
   - Historical health graphs
   - System metrics display
