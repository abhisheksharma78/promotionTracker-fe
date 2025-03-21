# Promotion Tracker Frontend

An Angular frontend application for managing employee promotions, appraisals, and bonuses.

## System Requirements

1. **Core Requirements**
   - Node.js >= 20.x
   - npm >= 9.x
   - Angular CLI: `npm install -g @angular/cli`

2. **Development Tools**
   - Git
   - VS Code (recommended) with extensions:
     - Angular Language Service
     - TypeScript and JavaScript
     - ESLint
     - Prettier

## Installation Methods

### Method 1: Docker Setup (Recommended)

1. Install Docker and Docker Compose (if not already installed):
   ```bash
   # For Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install docker.io docker-compose

   # For macOS (using Homebrew)
   brew install docker docker-compose
   ```

2. Navigate to the backend directory and start all services:
   ```bash
   cd ../promotionTracker-be
   docker-compose up -d
   ```

This will:
- Build and start the PostgreSQL database
- Build and start the backend API
- Build and serve the frontend application
- Set up all necessary networking

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3000/api
- Database: localhost:5432

### Method 2: Manual Setup

1. **Install Node.js and npm**
   ```bash
   # Using nvm (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 20
   nvm use 20
   ```

2. **Install Angular CLI**
   ```bash
   npm install -g @angular/cli
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Configure Environment**
   Edit `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'http://localhost:3000/api'
   };
   ```

5. **Start Development Server**
   ```bash
   npm start
   ```

## Application Structure

```
src/
├── app/
│   ├── auth/          # Authentication components
│   ├── core/          # Core services and models
│   ├── features/      # Feature modules
│   └── shared/        # Shared components
├── environments/      # Environment configurations
└── assets/           # Static assets
```

## Default Users

The system comes with predefined users:

1. **Admin User**
   ```
   Email: admin@example.com
   Password: admin123
   Role: ADMIN
   ```

2. **Test User**
   ```
   Email: test@example.com
   Password: test123
   Role: USER
   ```

3. **HR Manager**
   ```
   Email: hr@example.com
   Password: hr123
   Role: HR
   ```

## Role-Based Access Control

1. **USER (Regular Employee)**
   - View personal dashboard
   - Create/view personal appraisals
   - View bonus history

2. **HOD (Head of Department)**
   - All USER permissions
   - Manage department appraisals
   - View department metrics

3. **HR Manager**
   - All HOD permissions
   - Manage all appraisals
   - Manage bonus allocation
   - Access HR dashboard

4. **ADMIN**
   - Full system access
   - User management
   - System configuration
   - Access all features

5. **CEO**
   - Full system access
   - Executive dashboard
   - Company-wide metrics

## Protected Routes
- `/` - Dashboard (All roles)
- `/appraisal` - Appraisal management
- `/bonus` - Bonus management (ADMIN/HR only)

## Common Issues & Troubleshooting

### Authentication Issues
1. Verify backend is running
2. Check environment.ts configuration
3. Clear browser cache/localStorage
4. Verify correct credentials

### Access Denied
1. Verify user role permissions
2. Check token expiration
3. Try logging out and back in

### Database Connection
If using Docker:
1. Check if postgres container is running
2. Verify database credentials in docker-compose.yml

If manual setup:
1. Verify PostgreSQL is running
2. Check database connection in backend .env file

## Testing

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run e2e
```

## Building for Production

```bash
# Build
npm run build

# Serve using NGINX (if installed)
sudo cp -r dist/* /var/www/html/
```

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [Material Design Components](https://material.angular.io/components/categories)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
