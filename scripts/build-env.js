#!/usr/bin/env node

/**
 * Advanced Build Script
 * Builds the application for specific environments with custom output directories
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';

const environments = {
  development: {
    name: 'Development',
    outputDir: 'dist-dev',
    color: '\x1b[36m' // Cyan
  },
  staging: {
    name: 'Staging', 
    outputDir: 'dist-staging',
    color: '\x1b[33m' // Yellow
  },
  production: {
    name: 'Production',
    outputDir: 'dist-prod', 
    color: '\x1b[32m' // Green
  }
};

function runCommand(command, description) {
  console.log(`\n📋 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ Failed: ${description}`);
    process.exit(1);
  }
}

function buildForEnvironment(env, outputDir = null) {
  const envConfig = environments[env];
  if (!envConfig) {
    console.error(`❌ Invalid environment: ${env}`);
    console.log('Available environments: development, staging, production');
    process.exit(1);
  }

  const buildDir = outputDir || envConfig.outputDir;
  const color = envConfig.color;
  const reset = '\x1b[0m';

  console.log(`${color}🚀 Building for ${envConfig.name} Environment${reset}`);
  console.log(`📁 Output directory: ${buildDir}`);

  // Step 1: Setup environment
  runCommand(
    `node scripts/setup-env.js ${env} --force`,
    `Setting up ${env} environment`
  );

  // Step 2: Clean output directory
  if (existsSync(buildDir)) {
    console.log(`\n🧹 Cleaning ${buildDir}...`);
    rmSync(buildDir, { recursive: true, force: true });
  }

  // Step 3: Build with custom output directory
  runCommand(
    `npx vite build --outDir ${buildDir}`,
    `Building application for ${env}`
  );

  console.log(`\n${color}✅ Build completed successfully!${reset}`);
  console.log(`📂 Output: ${join(process.cwd(), buildDir)}`);
  console.log(`🌐 To preview: npx vite preview --outDir ${buildDir}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args[0] || 'production';
const outputDir = args.find(arg => arg.startsWith('--out='))?.split('=')[1];
const help = args.includes('--help') || args.includes('-h');

if (help) {
  console.log(`
🏗️  Advanced Build Script

Usage:
  npm run build:advanced <environment> [--out=custom-dir]

Examples:
  npm run build:advanced development     # Build dev to dist-dev/
  npm run build:advanced staging        # Build staging to dist-staging/  
  npm run build:advanced production     # Build prod to dist-prod/
  npm run build:advanced prod --out=release  # Build prod to release/

Available environments:
  - development: Development build with mock API
  - staging: Staging build with staging API
  - production: Production build with production API
`);
} else {
  buildForEnvironment(environment, outputDir);
}