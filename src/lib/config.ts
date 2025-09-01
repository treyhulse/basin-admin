export const config = {
  // API Configuration
  api: {
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  },
  
  // MCP Configuration
  mcp: {
    serverUrl: process.env.NEXT_PUBLIC_MCP_SERVER_URL || 'http://localhost:3001',
    serverPort: parseInt(process.env.NEXT_PUBLIC_MCP_SERVER_PORT || '3001'),
    enabled: process.env.NEXT_PUBLIC_MCP_ENABLED === 'true',
    healthCheckInterval: parseInt(process.env.NEXT_PUBLIC_MCP_HEALTH_CHECK_INTERVAL || '5000'),
    // Production settings
    isProduction: process.env.NODE_ENV === 'production',
    productionServerUrl: process.env.NEXT_PUBLIC_MCP_PRODUCTION_URL,
    fallbackEnabled: process.env.NEXT_PUBLIC_MCP_FALLBACK_ENABLED === 'true',
  },
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Logging
  logging: {
    level: (process.env.NEXT_PUBLIC_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info',
    enableConsoleColors: process.env.NODE_ENV === 'development',
    enableLocalStorage: true,
    maxStoredLogs: 100,
  },
  
  // Authentication
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
    tokenExpiryKey: 'token_expiry',
  },
  
  // Debug
  debug: {
    showDebugPanel: process.env.NODE_ENV === 'development',
    enableRequestLogging: true,
    enableResponseLogging: true,
    enableErrorLogging: true,
  },
};

// Helper function to validate configuration
export const validateConfig = () => {
  const issues: string[] = [];
  
  if (!config.api.baseURL) {
    issues.push('API base URL is not configured');
  }
  
  if (config.api.timeout < 1000) {
    issues.push('API timeout is too low (should be at least 1000ms)');
  }
  
  if (config.api.timeout > 60000) {
    issues.push('API timeout is too high (should be at most 60000ms)');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
};

// Helper function to get configuration summary for debugging
export const getConfigSummary = () => {
  return {
    environment: config.env,
    api: {
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
    },
    logging: {
      level: config.logging.level,
      enableConsoleColors: config.logging.enableConsoleColors,
    },
    debug: {
      showDebugPanel: config.debug.showDebugPanel,
      enableRequestLogging: config.debug.enableRequestLogging,
    },
  };
};

export default config;
