# Pedident Dental Charting System

## Overview

Pedident is a specialized dental charting application designed for hands-free operation using foot pedal inputs (numpad). The system enables dentists to perform comprehensive dental examinations and charting without touching the computer, maintaining sterile conditions while documenting patient dental health status. The application supports both deciduous (baby) and permanent teeth using FDI notation, with detailed surface-level charting capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern component development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable interface elements
- **Styling**: Tailwind CSS with custom CSS variables for theming and medical-specific color schemes
- **State Management**: React hooks pattern with custom hooks for dental charting logic
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful endpoints for patient management and dental chart operations
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot module replacement and development middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Structured tables for patients and dental charts with JSON storage for complex tooth state data
- **Connection**: Neon serverless PostgreSQL for cloud database hosting
- **Migrations**: Drizzle-kit for database schema management and versioning

### Component Organization
- **Modular Design**: Separate components for patient setup, odontogram display, control panels, and tooth diagrams
- **Dental Logic**: Custom hooks managing charting state, tooth sequences, and pedal input handling
- **Visual Feedback**: Active tooth highlighting with blinking animations and color-coded tooth states

### Input System Architecture
- **Pedal Integration**: Numpad-based input system for hands-free operation
- **Command Mapping**: Specific key mappings for tooth states (sound, missing, carious, prosthesis)
- **Navigation Controls**: Forward/backward tooth navigation and sequence jumping
- **Surface Selection**: Advanced mode for detailed surface-level charting

### Export and Documentation
- **PDF Generation**: jsPDF integration for creating printable dental charts
- **Report Structure**: Comprehensive patient information with visual tooth state representation
- **Data Persistence**: JSON-based tooth state storage allowing complex surface-level details

## External Dependencies

### Database and ORM
- **PostgreSQL**: Primary database system via Neon serverless platform
- **Drizzle ORM**: Type-safe database operations with automatic TypeScript integration
- **Drizzle-kit**: Database migration and schema management tools

### UI and Styling Framework
- **Radix UI**: Headless UI primitives for accessible component foundation
- **Tailwind CSS**: Utility-first CSS framework with custom medical color variables
- **Shadcn/ui**: Pre-built component library following design system patterns
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Frontend build tool with development server and hot reload
- **React Query**: Server state management and API data fetching
- **Wouter**: Lightweight routing library for single-page application navigation

### PDF and Export Services
- **jsPDF**: Client-side PDF generation for dental chart reports
- **Date-fns**: Date manipulation and formatting utilities

### Form and Validation
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation integrated with Drizzle for type safety
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### Session and State Management
- **Connect-pg-simple**: PostgreSQL-based session storage for user sessions
- **React Query**: Caching and synchronization of server state