#!/usr/bin/env node

/**
 * Environment Setup Script
 * Automatically creates .env file with default configuration
 */

import { writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default environment configuration
const defaultEnvConfig = {
  // API Configuration
  VITE_API_URL: 'https://mobilityqacloud.dalmiabharat.com',
  
  // App Configuration
  VITE_APP_NAME: 'TSO',
  VITE_APP_VERSION: '1.0.0',
  VITE_BUILD_VERSION: '1',
  
  // Development Settings
  VITE_DEV_MODE: 'true',
  VITE_MOCK_API: 'true',
  
  // Legacy React App variables (kept for compatibility)
  REACT_APP_API_URL: 'https://mobilityqacloud.dalmiabharat.com/',
  REACT_APP_ENV: 'development',
  REACT_APP_APP_NAME: 'Sales Force Tracking',
  REACT_APP_VERSION: '1.0.0'
};

// Environment-specific configurations
const environments = {
  development: {
    ...defaultEnvConfig,
    VITE_DEV_MODE: 'true',
    VITE_MOCK_API: 'true',
    REACT_APP_ENV: 'development'
  },
  staging: {
    ...defaultEnvConfig,
    VITE_API_URL: 'https://staging-api.dalmiabharat.com',
    VITE_DEV_MODE: 'false',
    VITE_MOCK_API: 'false',
    REACT_APP_ENV: 'staging',
    REACT_APP_API_URL: 'https://staging-api.dalmiabharat.com/'
  },
  production: {
    ...defaultEnvConfig,
    VITE_API_URL: 'https://api.dalmiabharat.com',
    VITE_DEV_MODE: 'false',
    VITE_MOCK_API: 'false',
    REACT_APP_ENV: 'production',
    REACT_APP_API_URL: 'https://api.dalmiabharat.com/'
  }
};

function createEnvFile(environment = 'development', force = false) {
  const envPath = join(process.cwd(), '.env');
  
  // Check if .env file already exists
  if (existsSync(envPath) && !force) {
    console.log('📄 .env file already exists!');
    console.log('💡 Use --force flag to overwrite existing .env file');
    console.log('   Example: npm run setup:env -- --force');
    return;
  }
  
  const config = environments[environment] || environments.development;
  
  // Create .env file content
  let envContent = `# Environment Configuration for Dalmia TSO Application
# Generated automatically by setup script
# Environment: ${environment.toUpperCase()}
# Generated on: ${new Date().toISOString()}

`;

  // Add configuration sections
  envContent += `# API Configuration\n`;
  envContent += `VITE_API_URL=${config.VITE_API_URL}\n\n`;
  
  envContent += `# App Configuration\n`;
  envContent += `VITE_APP_NAME=${config.VITE_APP_NAME}\n`;
  envContent += `VITE_APP_VERSION=${config.VITE_APP_VERSION}\n`;
  envContent += `VITE_BUILD_VERSION=${config.VITE_BUILD_VERSION}\n\n`;
  
  envContent += `# Development Settings\n`;
  envContent += `VITE_DEV_MODE=${config.VITE_DEV_MODE}\n`;
  envContent += `VITE_MOCK_API=${config.VITE_MOCK_API}\n\n`;
  
  envContent += `# Legacy React App variables (kept for compatibility)\n`;
  envContent += `REACT_APP_API_URL=${config.REACT_APP_API_URL}\n`;
  envContent += `REACT_APP_ENV=${config.REACT_APP_ENV}\n`;
  envContent += `REACT_APP_APP_NAME="${config.REACT_APP_APP_NAME}"\n`;
  envContent += `REACT_APP_VERSION=${config.REACT_APP_VERSION}\n`;
  
  try {
    writeFileSync(envPath, envContent);
    console.log(`✅ .env file created successfully for ${environment} environment!`);
    console.log(`📍 Location: ${envPath}`);
    console.log(`🚀 You can now run: npm run dev`);
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
🛠️  Environment Setup Script

Usage:
  npm run setup:env                    # Create .env for development
  npm run setup:env dev               # Create .env for development  
  npm run setup:env staging           # Create .env for staging
  npm run setup:env production        # Create .env for production
  npm run setup:env -- --force        # Overwrite existing .env file
  npm run setup:env dev --force       # Create dev .env and overwrite existing

Available environments:
  - development (default): Development with mock API
  - staging: Staging environment with staging API
  - production: Production environment with production API

Examples:
  npm run setup:env                   # Development environment
  npm run setup:env production        # Production environment  
  npm run setup:env -- --force        # Force overwrite existing .env
`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args.find(arg => !arg.startsWith('--')) || 'development';
const force = args.includes('--force');
const help = args.includes('--help') || args.includes('-h');

if (help) {
  showHelp();
} else {
  createEnvFile(environment, force);
}