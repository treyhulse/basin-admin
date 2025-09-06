#!/usr/bin/env node

/**
 * Health Check Test Script
 * 
 * Tests the /api/health endpoint to ensure it's working correctly.
 * This script can be run independently to verify the health check functionality.
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://basin-backend-production.up.railway.app';

async function testHealthEndpoint() {
  console.log('🔍 Testing Health Endpoint...\n');
  
  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    console.log('📊 Health Check Results:');
    console.log('========================');
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log(`Response Time: ${duration}ms`);
    console.log(`Overall Status: ${data.status}`);
    console.log(`Timestamp: ${data.timestamp}`);
    console.log(`Environment: ${data.environment}`);
    console.log(`Version: ${data.version}`);
    console.log('');
    
    console.log('🔧 Individual Checks:');
    console.log('=====================');
    
    // Backend check
    const backend = data.checks.backend;
    console.log(`Backend: ${backend.status} (${backend.responseTime}ms)`);
    if (backend.error) {
      console.log(`  Error: ${backend.error}`);
    }
    
    // Auth check
    const auth = data.checks.auth;
    console.log(`Auth: ${auth.status} (${auth.responseTime}ms)`);
    if (auth.error) {
      console.log(`  Error: ${auth.error}`);
    }
    
    // Database check
    const database = data.checks.database;
    console.log(`Database: ${database.status} (${database.responseTime}ms)`);
    if (database.error) {
      console.log(`  Error: ${database.error}`);
    }
    
    console.log('');
    
    if (data.errors && data.errors.length > 0) {
      console.log('❌ Errors:');
      data.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
      console.log('');
    }
    
    console.log('⚙️  Configuration:');
    console.log('==================');
    console.log(`API Base URL: ${data.config.apiBaseUrl}`);
    console.log(`Timeout: ${data.config.timeout}ms`);
    console.log(`Environment: ${data.config.environment}`);
    console.log(`Backend URL: ${API_URL}`);
    
    // Overall assessment
    console.log('');
    if (data.status === 'healthy') {
      console.log('✅ Health check PASSED - All systems operational');
    } else {
      console.log('❌ Health check FAILED - Some systems have issues');
    }
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    console.error('This usually means the Next.js server is not running.');
    console.error('Please start the development server with: npm run dev');
    process.exit(1);
  }
}

// Run the test
testHealthEndpoint().catch(console.error);
