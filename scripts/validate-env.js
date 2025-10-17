#!/usr/bin/env node

/**
 * Environment Validation Script
 * Checks if all required environment variables are properly configured
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Required environment variables
const requiredVars = [
  'VITE_API_URL',
  'VITE_APP_NAME',
  'VITE_APP_VERSION'
];

// Optional but recommended variables
const recommendedVars = [
  'VITE_DEV_MODE',
  'VITE_MOCK_API',
  'REACT_APP_ENV'
];

function validateEnvironment() {
  const envPath = join(process.cwd(), '.env');
  
  if (!existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('💡 Run: npm run setup:env');
    process.exit(1);
  }
  
  try {
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    
    // Parse .env file
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#') && !key.startsWith(' ')) {
        envVars[key.trim()] = valueParts.join('=').replace(/^["']|["']$/g, '');
      }
    });
    
    console.log('🔍 Environment Validation Report\n');
    
    // Check required variables
    let missingRequired = [];
    requiredVars.forEach(varName => {
      const value = envVars[varName];
      if (!value) {
        missingRequired.push(varName);
        console.log(`❌ ${varName}: Missing`);
      } else {
        console.log(`✅ ${varName}: ${value}`);
      }
    });
    
    // Check recommended variables
    let missingRecommended = [];
    recommendedVars.forEach(varName => {
      const value = envVars[varName];
      if (!value) {
        missingRecommended.push(varName);
        console.log(`⚠️  ${varName}: Missing (optional)`);
      } else {
        console.log(`✅ ${varName}: ${value}`);
      }
    });
    
    console.log('\n📊 Summary:');
    console.log(`✅ Required variables: ${requiredVars.length - missingRequired.length}/${requiredVars.length}`);
    console.log(`⚠️  Recommended variables: ${recommendedVars.length - missingRecommended.length}/${recommendedVars.length}`);
    
    if (missingRequired.length > 0) {
      console.log('\n❌ Missing required variables. Please update your .env file or run:');
      console.log('   npm run setup:env -- --force');
      process.exit(1);
    } else {
      console.log('\n🎉 Environment configuration is valid!');
    }
    
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
    process.exit(1);
  }
}

validateEnvironment();