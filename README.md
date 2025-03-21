# Promotion Tracker Frontend

An Angular frontend application for managing employee promotions, appraisals, and bonuses.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Angular CLI (`npm install -g @angular/cli`)

## Project Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure the environment:

Edit `src/environments/environment.ts` to match your backend API URL:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api'
};
```

## Running the Application

### Development Mode
```bash
npm start
```
The application will be available at http://localhost:4200

### Production Build
```bash
npm run build
```

## Features

- User Authentication
  - Login/Logout functionality
  - Role-based access control (USER, HOD, HR, ADMIN, CEO)

- Dashboard
  - Overview of pending appraisals
  - Total employees count (Admin/HR)
  - Pending reviews count (Admin/HR)

- Appraisal Management
  - Create new appraisals
  - View appraisal history
  - Update appraisal status
  - Delete appraisals

- Bonus Management (Admin/HR only)
  - Manage employee bonuses
  - Batch update bonuses
  - Mark bonuses as paid

## Default Users

The application comes with two default user accounts:

1. Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: ADMIN

2. Test User
   - Email: test@example.com
   - Password: test123
   - Role: USER

## Project Structure

```
src/
├── app/
│   ├── auth/          # Authentication components
│   ├── core/          # Core services and models
│   ├── features/      # Feature modules (appraisal, bonus)
│   └── shared/        # Shared components and modules
├── environments/      # Environment configurations
└── assets/           # Static assets
```

## Authentication

The application uses JWT (JSON Web Token) for authentication. The token is:
- Stored in localStorage
- Automatically attached to API requests
- Cleared on logout or session expiry

## Role-Based Access

Access to different features is controlled by user roles:
- USER: Can view and create appraisals
- HOD: Can manage appraisals for their department
- HR: Can manage appraisals and bonuses
- ADMIN: Full system access
- CEO: Full system access

## Role-Based Access and Default Credentials

### Available Roles and Permissions

1. **USER (Regular Employee)**
   - Access to personal dashboard
   - View and create personal appraisals
   - View personal bonus history
   - Example credentials:
     ```
     Email: test@example.com
     Password: test123
     ```

2. **HOD (Head of Department)**
   - All USER permissions
   - Department dashboard access
   - Manage department appraisals
   - View department metrics

3. **HR (Human Resources)**
   - All HOD permissions
   - Access to HR dashboard
   - Manage all appraisals
   - Manage bonus allocations
   - Example credentials:
     ```
     Email: hr@example.com
     Password: hr123
     ```

4. **ADMIN (System Administrator)**
   - Full system access
   - User management
   - System configuration
   - Default admin credentials:
     ```
     Email: admin@example.com
     Password: admin123
     ```

5. **CEO**
   - Full system access
   - Executive dashboard
   - Company-wide metrics

### Protected Routes
- `/` - Dashboard (All roles)
- `/appraisal` - Appraisal management (All roles with different permissions)
- `/bonus` - Bonus management (ADMIN and HR only)

### Authentication Flow
1. Users log in through `/auth/login`
2. JWT token is stored in localStorage
3. Token is automatically attached to API requests
4. Role-based route guards protect access

### User Session Management
- Tokens expire after 24 hours
- Session is cleared on logout
- Unauthorized access redirects to login
- Invalid tokens trigger automatic logout

## Development Guidelines

### Adding New Features
1. Create a new module under `src/app/features/`
2. Add routing configuration
3. Implement components and services
4. Add to main routing configuration

### Style Guide
- Follow Angular style guide
- Use Material Design components
- Implement responsive layouts

## Testing

```bash
# unit tests
npm run test

# end-to-end tests
npm run e2e
```

## Common Issues

### Authentication Issues
- Ensure backend API is running
- Check if JWT token is present in localStorage
- Verify API URL in environment configuration

### Access Denied
- Verify user role permissions
- Check if token is expired
- Ensure proper route guards are in place
