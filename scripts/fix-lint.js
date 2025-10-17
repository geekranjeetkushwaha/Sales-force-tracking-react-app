#!/usr/bin/env node

/**
 * Lint Fix Script
 * Automatically fixes common linting issues
 */

import { execSync } from 'child_process';

console.log('🔧 Running lint fixes...\n');

try {
  // Run ESLint with --fix to auto-fix what it can
  console.log('1. Running ESLint auto-fix...');
  execSync('npx eslint . --fix', { stdio: 'inherit' });

  // Run Prettier to format code
  console.log('\n2. Running Prettier formatting...');
  execSync('npx prettier --write .', { stdio: 'inherit' });

  console.log('\n✅ Automatic fixes completed!');
  console.log('💡 Run "npm run lint:check" to see remaining issues');
} catch (error) {
  console.log('\n⚠️  Some issues require manual fixing');
  console.log('🔍 Run "npm run lint" to see details');
  process.exit(0); // Don't fail, just warn
}
