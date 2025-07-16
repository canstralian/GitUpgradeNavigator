# Git & GitHub Upgrade Planning Tool

## Overview

This is a full-stack web application that helps teams assess their current Git/GitHub setup and generate comprehensive improvement roadmaps. The tool provides step-by-step guidance for upgrading Git workflows, implementing best practices, and improving team collaboration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: React Query (@tanstack/react-query) for server state
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript (ESM modules)
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-based sessions using connect-pg-simple
- **API Style**: REST API with JSON responses

### Database Schema
The application uses four main tables:
- `assessments`: Stores user assessment data about current Git/GitHub setup
- `upgradePlans`: Contains generated improvement plans with steps and progress tracking
- `resources`: Library of tools, tutorials, and best practices
- `workflowTemplates`: Pre-defined Git workflow strategies and templates

## Key Components

### Assessment System
- Multi-step form for evaluating current Git/GitHub practices
- Covers team size, branching strategy, code review processes, and collaboration tools
- Form validation using react-hook-form with Zod schemas
- Results stored in PostgreSQL for plan generation

### Workflow Designer
- Visual interface for designing Git workflow strategies
- Pre-built templates for GitFlow, trunk-based development, and feature branches
- Interactive workflow diagrams and comparisons
- Customizable workflow recommendations based on team needs

### Plan Generator
- Automated creation of improvement roadmaps based on assessment results
- Step-by-step implementation guides with progress tracking
- Priority-based task organization
- PDF export functionality for offline reference

### Resource Library
- Curated collection of Git/GitHub learning materials
- Filterable by skill level, category, and resource type
- Includes tutorials, tools, best practices, and training materials
- Rating and download tracking system

## Data Flow

1. **Assessment Flow**: Users complete assessment form → Data validated and stored → Triggers plan generation
2. **Plan Generation**: Assessment data processed → Workflow recommendations generated → Implementation steps created → Progress tracking initialized
3. **Resource Discovery**: Users browse filtered resources → Access external links or downloadable content → Usage tracked for popularity metrics
4. **Progress Tracking**: Users update step completion → Progress calculated and stored → Visual progress indicators updated

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management and caching
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **date-fns**: Date manipulation utilities
- **jspdf**: PDF generation for plan exports

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **esbuild**: Server-side bundling for production

## Deployment Strategy

### Development Environment
- Vite development server with HMR for frontend
- tsx for running TypeScript server files
- Automatic database migrations with Drizzle
- Replit-specific plugins for development experience

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Database: Migrations applied via `drizzle-kit push`
- Static file serving through Express in production

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment mode (development/production)
- Session secrets and database credentials managed through environment variables

### Database Management
- Drizzle Kit for schema management and migrations
- PostgreSQL schema defined in `shared/schema.ts`
- Automatic migration generation and application
- Type-safe database operations with full TypeScript support

The application is designed to be deployed on platforms supporting Node.js with PostgreSQL, with specific optimizations for Replit deployment including development banners and cartographer integration.

## Recent Changes: Latest modifications with dates

### January 16, 2025 - Enhanced Upgrade Plan Generation
- **Comprehensive Plan Structure**: Implemented detailed 6-phase upgrade plans covering:
  - Phase 1: Repository Configuration & Security (audit, branch protection, security settings)
  - Phase 2: Workflow Implementation (GitFlow/Trunk-based setup, release processes)
  - Phase 3: Code Review & Collaboration (PR templates, commit conventions)
  - Phase 4: Automation & CI/CD (testing pipelines, quality gates)
  - Phase 5: Documentation & Training (guides, team training sessions)
  - Phase 6: Monitoring & Optimization (metrics, continuous improvement)
- **Detailed Step Instructions**: Each plan step includes specific implementation instructions
- **Plan Detail Page**: Added comprehensive plan view with phase organization, progress tracking, and step-by-step guidance
- **Interactive Plan Management**: Users can mark steps as complete and track progress
- **Plan Generation Dialog**: Enhanced plan creation with assessment and workflow selection
- **TypeScript Fixes**: Resolved storage layer type compatibility issues