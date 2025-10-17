# Sales Force Tracking React App

A modern React TypeScript application for sales force management and tracking, built with Vite, Ant Design, and comprehensive location-based features.

## Features

- 🔐 **Secure Authentication** with OTP verification
- 📱 **Responsive Design** optimized for mobil### Preview Built Applications

```bash
# Preview specific builds
npx vite preview                    # Preview dist/
npx vite preview --outDir dist-prod # Preview dist-prod/
npx vite preview --outDir dist-staging # Preview dist-staging/
```

## Git Hooks & Code Quality

This project includes automated pre-commit hooks to ensure code quality:

### Pre-commit Hooks Setup

The project uses **Husky** and **lint-staged** to automatically run quality checks before commits:

- ✅ **ESLint**: Checks and auto-fixes code issues
- ✅ **Prettier**: Formats code consistently
- ✅ **Type checking**: Ensures TypeScript correctness
- ✅ **Commit message validation**: Basic commit message checks

### What happens on commit:

1. **Lint staged files**: Only files being committed are checked
2. **Auto-fix issues**: ESLint and Prettier auto-fix what they can
3. **Block bad commits**: Commit fails if critical errors remain
4. **Fast feedback**: Only staged files are processed for speed

### Manual Quality Checks

```bash
# Run all quality checks manually
npm run lint:fix-all                # Auto-fix common issues
npm run lint:check                  # Check for remaining problems
npm run format:check                # Verify code formatting
npm run pre-commit                  # Manually run pre-commit checks

# Step-by-step quality workflow
npm run lint:fix                    # Fix linting issues
npm run format                      # Format all files
npm run lint:check                  # Final validation
```

### Bypassing Hooks (Emergency Only)

```bash
# Skip pre-commit hooks (NOT recommended)
git commit --no-verify -m "emergency fix"

# Better approach: Fix issues first
npm run lint:fix-all
git add .
git commit -m "fix: resolve linting issues"
```

### Quality Standards

- **Zero errors**: No ESLint errors allowed in commits
- **Max 5 warnings**: Some warnings allowed for gradual improvement
- **Consistent formatting**: All code auto-formatted with Prettier
- **TypeScript compliance**: Strict type checking enabledesktop
- 📍 **Location Tracking** with GPS integration
- 📸 **Camera Integration** for visit verification
- 🗺️ **Interactive PJP Management** with detailed counter information
- 🎨 **Modern UI** built with Ant Design components
- ⚡ **Fast Development** powered by Vite and Hot Module Replacement

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7.1.7
- **UI Library**: Ant Design 5.27.5
- **Routing**: React Router 7.9.4
- **HTTP Client**: Axios 1.12.2
- **Styling**: Tailwind CSS 4.1.14
- **Icons**: Lucide React

## Getting Started

Follow these steps to set up the project locally:

### 1. Clone Repository

```bash
git clone https://github.com/geekranjeetkushwaha/Sales-force-tracking-react-app.git
cd Sales-force-tracking-react-app
```

### 2. Checkout to Production Branch

```bash
git checkout prod
```

### 3. Use Correct Node Version

```bash
nvm use
```

This command reads the `.nvmrc` file in the project root and automatically switches to the required Node.js version for this project. This ensures compatibility and prevents version-related issues during development.

### 4. Enable Corepack

```bash
corepack enable
```

**Why use Corepack?**

- **Package Manager Management**: Corepack is Node.js's built-in package manager manager that ensures everyone uses the same package manager version
- **Zero Configuration**: Automatically detects and uses the correct package manager (yarn/pnpm/npm) specified in `package.json`
- **Version Consistency**: Prevents issues caused by different package manager versions across team members
- **Modern Standard**: Part of Node.js core since v14.19.0 and v16.9.0, representing the future of package management

### 5. Install Dependencies

Using Yarn (recommended):

```bash
yarn
```

Or using npm:

```bash
npm install
```

### 6. Start Development Server

Using Yarn:

```bash
yarn dev
```

Or using npm:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Environment Configuration

#### Automated Setup (Recommended)

Use the automated environment setup script:

```bash
# Create .env file with development configuration
npm run setup:env

# Or specify environment
npm run setup:env:dev      # Development environment
npm run setup:env:staging  # Staging environment
npm run setup:env:prod     # Production environment

# Force overwrite existing .env
npm run setup:env -- --force
```

#### Manual Setup

If you prefer manual setup, create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add the following content to `.env`:

```env
# API Configuration
VITE_API_URL=https://mobilityqacloud.dalmiabharat.com

# App Configuration
VITE_APP_NAME=TSO
VITE_APP_VERSION=1.0.0
VITE_BUILD_VERSION=1

# Development Settings
VITE_DEV_MODE=true
VITE_MOCK_API=true

# Legacy React App variables (kept for compatibility)
REACT_APP_API_URL=https://mobilityqacloud.dalmiabharat.com/
REACT_APP_ENV=development
REACT_APP_APP_NAME="Sales Force Tracking"
REACT_APP_VERSION=1.0.0
```

#### Environment Validation

Validate your environment configuration:

```bash
# Check if all required environment variables are set
npm run validate:env
```

> **Note**: The app uses both `VITE_` and `REACT_APP_` prefixed variables for compatibility. Vite will automatically load variables with the `VITE_` prefix.

## Demo Credentials

For testing the authentication flow:

- **Admin**: `admin@dalmia.com` / `password`
- **User**: `user@dalmia.com` / `password`
- **Demo OTP**: `123456`
- **Test Unauthorized**: `unauthorized@test.com` (triggers DM1004 error)

## Project Structure

```
src/
├── auth/                 # Authentication context and types
├── components/          # Reusable UI components
├── common-components/   # Shared components across pages
├── pages/              # Page components (Login, OTP, Home, etc.)
├── services/           # API services and endpoints
├── utils/              # Utility functions and helpers
├── routes/             # Routing configuration
└── placeholder-data/   # Mock data for development
```

## Available Scripts

In the project directory, you can run:

### Development Scripts

- **`npm run dev`** - Starts the development server with hot reload at [http://localhost:5173](http://localhost:5173)
- **`npm run build`** - Builds the app using current environment configuration to the `dist` folder
- **`npm run lint`** - Runs ESLint to check for code quality issues
- **`npm run preview`** - Serves the built app for local preview

### Environment-Specific Build Scripts

- **`npm run build:dev`** - Build with development configuration
- **`npm run build:staging`** - Build with staging configuration
- **`npm run build:prod`** - Build with production configuration
- **`npm run build:advanced <env>`** - Advanced build with custom output directories

### Environment Setup Scripts

- **`npm run setup`** - Complete setup: install dependencies + create .env file
- **`npm run setup:env`** - Create .env file for development environment
- **`npm run setup:env:dev`** - Create .env file for development
- **`npm run setup:env:staging`** - Create .env file for staging environment
- **`npm run setup:env:prod`** - Create .env file for production environment
- **`npm run validate:env`** - Validate environment configuration

### Code Quality Scripts

- **`npm run lint`** - Run ESLint to check for code issues
- **`npm run lint:fix`** - Run ESLint and auto-fix issues
- **`npm run lint:check`** - Run ESLint with zero warnings tolerance
- **`npm run lint:fix-all`** - Auto-fix common linting and formatting issues
- **`npm run format`** - Format code with Prettier
- **`npm run format:check`** - Check if code is properly formatted
- **`npm run pre-commit`** - Manually run pre-commit checks

### Quick Start

```bash
# Complete project setup in one command
npm run setup

# Or step by step
npm install
npm run setup:env
npm run dev
```

## Environment Automation

This project includes powerful automation for environment management:

### Features

- **Multi-environment support**: Development, staging, and production configurations
- **Automatic validation**: Ensures all required variables are present before starting the app
- **Force overwrite**: Option to recreate existing .env files
- **Smart defaults**: Sensible defaults for each environment type

### Environment Types

| Environment   | API URL                            | Mock API | Dev Mode | Use Case                         |
| ------------- | ---------------------------------- | -------- | -------- | -------------------------------- |
| `development` | `mobilityqacloud.dalmiabharat.com` | ✅       | ✅       | Local development with mock data |
| `staging`     | `staging-api.dalmiabharat.com`     | ❌       | ❌       | Pre-production testing           |
| `production`  | `api.dalmiabharat.com`             | ❌       | ❌       | Live production environment      |

### Advanced Usage

```bash
# View detailed help
npm run setup:env -- --help

# Environment-specific configurations
npm run setup:env:staging            # Staging with staging API
npm run setup:env:prod               # Production with production API

# Force overwrite existing files
npm run setup:env production --force # Production with force overwrite
npm run setup:env -- --force         # Development with force overwrite

# Validation and debugging
npm run validate:env                 # Comprehensive environment check
```

### Validation Features

The validation script checks:

- ✅ All required variables are present
- ⚠️ Warns about missing optional variables
- 📊 Provides summary report
- 🎉 Confirms valid configuration
- ❌ Prevents startup with missing required variables

## Environment-Specific Builds

Build your application for different environments with these methods:

### **Method 1: Simple Environment Builds**

```bash
# Quick environment builds (uses default dist/ folder)
npm run build:dev        # Development build
npm run build:staging    # Staging build
npm run build:prod       # Production build
```

### **Method 2: Advanced Builds with Custom Output**

```bash
# Advanced builds with separate output directories
npm run build:advanced development   # → dist-dev/
npm run build:advanced staging      # → dist-staging/
npm run build:advanced production   # → dist-prod/

# Custom output directory
npm run build:advanced production --out=release
```

### **Method 3: Manual Switch + Build**

```bash
# Switch environment then build
npm run setup:env:prod -- --force   # Switch to production
npm run build                       # Build with current environment

npm run setup:env:staging -- --force # Switch to staging
npm run build                       # Build with staging config
```

### **Build Output Comparison**

| Method   | Command                                   | Environment | Output Directory | Use Case                      |
| -------- | ----------------------------------------- | ----------- | ---------------- | ----------------------------- |
| Simple   | `npm run build:prod`                      | Production  | `dist/`          | Single environment deployment |
| Advanced | `npm run build:advanced production`       | Production  | `dist-prod/`     | Multi-environment comparison  |
| Manual   | `npm run setup:env:prod && npm run build` | Production  | `dist/`          | Manual control                |

### **Preview Built Applications**

```bash
# Preview specific builds
npx vite preview                    # Preview dist/
npx vite preview --outDir dist-prod # Preview dist-prod/
npx vite preview --outDir dist-staging # Preview dist-staging/
```

## Development Notes

- The app uses **Ant Design App component** for consistent theming and message handling
- **Location permissions** are required for visit functionality
- **Camera access** is needed for visit verification photos
- The project supports both **real API integration** and **mock data** for development

## ESLint Error Prevention Codes

Use these ESLint disable comments during development to temporarily bypass specific rules. **Remember to remove them before production!**

### Type Safety Overrides

```typescript
// Disable explicit any type checking
/* eslint-disable @typescript-eslint/no-explicit-any */
const data: any = fetchData();
/* eslint-enable @typescript-eslint/no-explicit-any */

// Single line disable
const result: any = processData(); // eslint-disable-line @typescript-eslint/no-explicit-any

// Disable unused variables (useful for function parameters)
const handleClick = (_event: MouseEvent) => {
  // eslint-disable-line @typescript-eslint/no-unused-vars
  console.log('Button clicked');
};

// Disable non-null assertion warnings
const element = document.getElementById('root')!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
```

### React-Specific Overrides

```typescript
// Disable React hooks dependency warnings
useEffect(() => {
  fetchData();
}, []); // eslint-disable-line react-hooks/exhaustive-deps

// Disable React refresh warnings for components
/* eslint-disable react-refresh/only-export-components */
export const MyComponent = () => <div>Hello</div>;
export const utilities = { helper: () => {} };
/* eslint-enable react-refresh/only-export-components */

// Disable missing key prop warnings
const items = data.map((item, index) => ( // eslint-disable-line react/no-array-index-key
  <div key={index}>{item}</div>
));

// Disable dangerous innerHTML warnings
<div dangerouslySetInnerHTML={{ __html: content }} />; // eslint-disable-line react/no-danger
```

### Console and Debug Overrides

```typescript
// Allow console statements during development
console.log('Debug info:', data); // eslint-disable-line no-console
console.error('Error occurred:', error); // eslint-disable-line no-console

// Disable console for entire file
/* eslint-disable no-console */
// All console statements in this file are allowed
/* eslint-enable no-console */
```

### Function and Variable Overrides

```typescript
// Disable empty function warnings
const noop = () => {}; // eslint-disable-line @typescript-eslint/no-empty-function

// Disable prefer const warnings
let counter = 0; // eslint-disable-line prefer-const
// ... code that might reassign counter

// Disable no-var warnings (legacy code)
var legacyVariable = 'old code'; // eslint-disable-line no-var

// Disable camelcase warnings for API responses
const { user_id, full_name } = apiResponse; // eslint-disable-line @typescript-eslint/naming-convention
```

### Import and Module Overrides

```typescript
// Disable import order warnings
import { Component } from 'react'; // eslint-disable-line import/order
import axios from 'axios';

// Disable dynamic require warnings
const config = require(`./config/${env}.json`); // eslint-disable-line @typescript-eslint/no-require-imports

// Disable default export warnings
export = MyClass; // eslint-disable-line import/no-default-export
```

### Performance and Logic Overrides

```typescript
// Disable assignment in condition warnings
let match;
while ((match = regex.exec(text))) {
  // eslint-disable-line no-cond-assign
  // Process match
}

// Disable no-await-in-loop for intentional sequential processing
for (const item of items) {
  await processItem(item); // eslint-disable-line no-await-in-loop
}

// Disable complexity warnings for complex but necessary functions
function complexLogic() {
  // eslint-disable-line complexity
  // Complex but necessary logic here
}
```

### File-Level Overrides

```typescript
// Disable multiple rules for entire file
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-console */

// Disable all ESLint rules for file (emergency only!)
/* eslint-disable */
// Entire file content
/* eslint-enable */

// Disable specific rule for entire file
/* eslint-disable @typescript-eslint/no-explicit-any */
// File content with any types allowed
```

### Quick Development Patterns

```typescript
// Component with relaxed type checking
/* eslint-disable @typescript-eslint/no-explicit-any */
const QuickComponent: React.FC<any> = (props) => {
  return <div>{props.children}</div>;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

// API call with minimal typing
const fetchData = async (): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const response = await axios.get('/api/data');
    return response.data;
  } catch (error) {
    console.error('API Error:', error); // eslint-disable-line no-console
    throw error;
  }
};

// Event handler with ignored parameter
const handleSubmit = (_formData: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  // Implementation pending
};
```

### Best Practices for Using Overrides

1. **Be Specific**: Use rule-specific disables rather than disabling all rules
2. **Temporary Only**: Add TODO comments to remove overrides later
3. **Document Why**: Add comments explaining why the override is necessary
4. **Minimal Scope**: Use single-line disables when possible instead of block disables
5. **Review Regularly**: Remove overrides when proper implementation is added

### Example with TODO Comments

```typescript
// TODO: Replace with proper typing once API schema is defined
const apiResponse: any = await fetch('/api/users'); // eslint-disable-line @typescript-eslint/no-explicit-any

// TODO: Add proper error handling
useEffect(() => {
  loadData();
}, []); // eslint-disable-line react-hooks/exhaustive-deps
```
