# Enhanced Logging System Guide

This guide explains the comprehensive logging system implemented to help debug authentication, API, and data operation issues.

## Overview

The new logging system provides:
- **Detailed API request/response logging** with timing and context
- **Authentication state tracking** throughout the login process
- **Network error detection** to distinguish between auth failures and connection issues
- **Real-time log viewing** in the dashboard (development only)
- **Structured logging** with context, request IDs, and performance metrics

## Key Features

### 1. Request Tracking
Every API request gets a unique ID that's tracked through the entire lifecycle:
- Request initiation
- Response handling
- Error processing
- Performance timing

### 2. Enhanced Error Messages
Instead of generic "Invalid email or password" errors, you'll now see:
- **Connection errors**: "Cannot connect to the backend server. Please check if the server is running and accessible."
- **Timeout errors**: "Request timed out. The backend server may be overloaded or unreachable."
- **Server errors**: Specific HTTP status codes with detailed messages
- **Network errors**: Clear indication when the backend is unreachable

### 3. Authentication Flow Logging
The entire authentication process is logged:
```
[AUTH] Login attempt started in auth provider
[API] Request started: POST /auth/login
[API] Response received: 200 OK
[AUTH] Token stored successfully
[AUTH] Basic user and tenant info set
[AUTH] Refreshing auth context
[AUTH] Auth context refreshed successfully
[AUTH] Login completed successfully
```

## Using the Debug Panel

### Accessing the Debug Panel
1. Navigate to `/dashboard` in development mode
2. Scroll down to see the "Debug Information" section
3. The panel shows connection status and application logs

### Connection Status
- **Check Connection**: Test if the backend is reachable
- **Status**: Shows connected/disconnected state
- **Response Time**: Measures API response latency
- **Last Check**: Timestamp of the last connection test

### Log Viewer
- **Filter by Level**: View logs by error, warn, info, or debug level
- **Request Tracking**: Each log entry shows request IDs for correlation
- **Context Information**: Detailed context for each operation
- **Error Details**: Full error stack traces and messages

## Environment Configuration

### Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_TIMEOUT=10000

# Logging Level
NEXT_PUBLIC_LOG_LEVEL=debug  # debug, info, warn, error
```

### Log Levels
- **debug**: Detailed debugging information
- **info**: General information about operations
- **warn**: Warning messages for potential issues
- **error**: Error messages for failed operations

## Common Debugging Scenarios

### 1. "Invalid email or password" Error
**Before**: Generic error message
**Now**: Detailed error showing the actual issue:
- Connection timeout
- Network error (backend unreachable)
- Server error (500 status)
- Authentication failure (401 status)

### 2. Backend Connection Issues
**Symptoms**: Login fails with connection errors
**Debug Steps**:
1. Check the Debug Panel connection status
2. Look for network error logs
3. Verify backend server is running
4. Check `NEXT_PUBLIC_API_URL` configuration

### 3. Slow Authentication
**Symptoms**: Login takes a long time
**Debug Steps**:
1. Check response times in logs
2. Look for timeout errors
3. Verify backend performance
4. Check network latency

## Log Structure

### Log Entry Format
```typescript
interface LogEntry {
  timestamp: string;        // ISO timestamp
  level: LogLevel;         // debug, info, warn, error
  message: string;         // Human-readable message
  context?: LogContext;    // Request context
  error?: Error;           // Error object if applicable
  data?: any;              // Additional data
}
```

### Context Information
```typescript
interface LogContext {
  userId?: string;         // User ID if authenticated
  tenantId?: string;       // Tenant ID if applicable
  requestId?: string;      // Unique request identifier
  endpoint?: string;       // API endpoint
  method?: string;         // HTTP method
  statusCode?: number;     // HTTP status code
  duration?: number;       // Request duration in ms
  userAgent?: string;      // Browser user agent
}
```

## Best Practices

### 1. Development Logging
- Use `NEXT_PUBLIC_LOG_LEVEL=debug` for maximum detail
- Check the Debug Panel regularly during development
- Monitor connection status when testing

### 2. Production Logging
- Set `NEXT_PUBLIC_LOG_LEVEL=error` for production
- Logs are still stored but with minimal detail
- Consider sending logs to external logging service

### 3. Error Handling
- Always check the actual error message, not just the UI display
- Use request IDs to correlate related operations
- Monitor response times for performance issues

## Troubleshooting

### Common Issues

#### 1. No Logs Appearing
- Check if logging is enabled in config
- Verify localStorage is available
- Check browser console for errors

#### 2. Connection Test Fails
- Verify backend server is running
- Check `NEXT_PUBLIC_API_URL` configuration
- Test with curl or Postman
- Check firewall/network settings

#### 3. High Response Times
- Monitor backend server performance
- Check network latency
- Verify timeout configuration
- Look for backend bottlenecks

### Debug Commands

#### Check Configuration
```typescript
import { getConfigSummary, validateConfig } from '@/lib/config';

console.log('Config:', getConfigSummary());
console.log('Validation:', validateConfig());
```

#### Manual Logging
```typescript
import { logger } from '@/lib/logging';

logger.info('Custom message', { customContext: 'value' });
logger.error('Error occurred', { userId: '123' }, error);
```

## Integration with Existing Code

The logging system integrates seamlessly with existing code:

### Before
```typescript
try {
  await login(email, password);
} catch (error) {
  setError('Invalid email or password');
}
```

### After
```typescript
try {
  await login(email, password);
} catch (error) {
  // Error message now includes actual cause
  setError(error.message);
}
```

## Performance Impact

- **Minimal overhead**: Logging adds <1ms per request
- **Local storage**: Logs stored in browser localStorage
- **Automatic cleanup**: Only last 100 logs retained
- **Conditional logging**: Logs filtered by level

## Future Enhancements

- **Remote logging**: Send logs to external services
- **Log persistence**: Store logs across browser sessions
- **Performance metrics**: Track API performance over time
- **Alert system**: Notify developers of critical errors
