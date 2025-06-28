# Appointment Scheduler

## Overview

This is a full-stack appointment scheduling application built with React, Express, and PostgreSQL. The application allows users to book appointments through a web interface, with support for email and SMS reminders, cancellation, and rescheduling functionality. The system includes multilingual support (English and French) and is designed with a modern, responsive UI using shadcn/ui components.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: i18next for multilingual support (English/French)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Authentication**: JWT tokens for secure appointment management
- **API Design**: RESTful API endpoints for appointment operations

### Project Structure
- `client/` - React frontend application
- `server/` - Express backend application
- `shared/` - Shared schemas and types between frontend and backend
- `migrations/` - Database migration files

## Key Components

### Database Schema
- **Users Table**: Basic user management with username/password
- **Appointments Table**: Core appointment data including:
  - Personal information (name, email, phone)
  - Appointment details (date, time, status)
  - Reminder preferences (email/SMS)
  - Security tokens for cancellation/rescheduling
  - Language preference
  - Timestamps for audit trail

### API Endpoints
- `POST /api/appointments` - Create new appointment
- `GET /api/appointments/cancel/:token` - Cancel appointment via secure token
- `GET /api/appointments/reschedule/:token` - Access rescheduling interface
- `POST /api/appointments/reschedule/:token` - Update appointment details

### External Service Integrations
- **Email Service**: SendGrid for email notifications and reminders
- **SMS Service**: Twilio for SMS notifications and reminders
- **Scheduled Tasks**: Node-cron for automated reminder system

## Data Flow

1. **Appointment Creation**:
   - User fills out appointment form with validation
   - Frontend sends data to backend API
   - Backend validates data and creates database record
   - Secure tokens generated for cancellation/rescheduling
   - Confirmation email sent if email provided
   - Success response returned with appointment details

2. **Reminder System**:
   - Cron job runs hourly to check for upcoming appointments
   - 24-hour and 1-hour reminders sent via email/SMS
   - Reminders respect user preferences and language settings

3. **Appointment Management**:
   - Cancel/reschedule links use secure JWT tokens
   - Token validation ensures appointment security
   - Status updates reflected in database
   - Confirmation messages sent for changes

## External Dependencies

### Core Dependencies
- **Database**: Drizzle ORM with PostgreSQL driver
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Validation**: Zod for runtime type checking
- **Date Handling**: Luxon for date/time manipulation
- **HTTP Client**: Fetch API with TanStack Query wrapper

### Third-Party Services
- **SendGrid**: Email delivery service (API key required)
- **Twilio**: SMS delivery service (credentials required)
- **Neon Database**: Serverless PostgreSQL hosting

### Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Backend bundling for production
- **Tailwind CSS**: Utility-first CSS framework

## Deployment Strategy

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for token generation
- `SENDGRID_API_KEY` - SendGrid email service API key
- `TWILIO_ACCOUNT_SID` - Twilio SMS service account ID
- `TWILIO_AUTH_TOKEN` - Twilio SMS service auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number for SMS
- `FROM_EMAIL` - Default sender email address
- `REPLIT_DOMAINS` - Domain configuration for deployment

### Build Process
1. Frontend built with Vite to `dist/public`
2. Backend bundled with ESBuild to `dist/index.js`
3. Database migrations applied with Drizzle Kit
4. Static files served by Express in production

### Production Considerations
- Database connection pooling with Neon serverless
- Error handling with proper HTTP status codes
- CORS configuration for domain restrictions
- Request logging and monitoring
- Graceful fallbacks for third-party service failures

## Changelog
- June 28, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.