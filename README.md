# Sales Force Tracking React App

A modern React TypeScript application for sales force management and tracking, built with Vite, Ant Design, and comprehensive location-based features.

## Features

- 🔐 **Secure Authentication** with OTP verification
- 📱 **Responsive Design** optimized for mobile and desktop
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
| Environment | API URL | Mock API | Dev Mode | Use Case |
|-------------|---------|----------|----------|----------|
| `development` | `mobilityqacloud.dalmiabharat.com` | ✅ | ✅ | Local development with mock data |
| `staging` | `staging-api.dalmiabharat.com` | ❌ | ❌ | Pre-production testing |
| `production` | `api.dalmiabharat.com` | ❌ | ❌ | Live production environment |

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

| Method | Command | Environment | Output Directory | Use Case |
|--------|---------|-------------|------------------|----------|
| Simple | `npm run build:prod` | Production | `dist/` | Single environment deployment |
| Advanced | `npm run build:advanced production` | Production | `dist-prod/` | Multi-environment comparison |
| Manual | `npm run setup:env:prod && npm run build` | Production | `dist/` | Manual control |

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
