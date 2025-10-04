# MobileShop - Retail Management System

## Overview

MobileShop is a comprehensive retail management system designed for mobile phone shops and similar retail businesses. The application provides a complete suite of tools for managing daily operations including point-of-sale transactions, inventory tracking, customer management, and business analytics. Built as a single-page application (SPA), it offers a modern, responsive interface for retail staff to efficiently manage all aspects of their business operations.

The system is designed to streamline retail workflows by consolidating multiple business functions into a unified platform, reducing the need for separate tools and improving operational efficiency.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**
- **Framework**: React 18 with Vite as the build tool
- **Styling**: Hybrid approach combining Bootstrap 5 and Tailwind CSS
  - Bootstrap provides pre-built UI components and grid system
  - Tailwind CSS offers utility-first styling for custom components
- **State Management**: React Query (@tanstack/react-query) for server state management
  - Handles data fetching, caching, and synchronization
  - Reduces need for global state management for API data

**Routing and Navigation**
- **Client-Side Routing**: React Router DOM v7
- **Navigation Pattern**: Single-page application with programmatic page switching
  - Uses local state (`activePage`) to render different page components
  - Sidebar component controls navigation between modules

**Component Architecture**
- **UI Component Library**: Radix UI primitives for accessible, unstyled components
  - Tooltip component for enhanced UX
  - Custom component wrappers (Toaster, Sonner) for notifications
- **Charting and Data Visualization**: 
  - Chart.js with react-chartjs-2 wrapper
  - Recharts for additional visualization options
  - Dual charting libraries provide flexibility for different chart types

**Utility Libraries**
- **Styling Utilities**: 
  - `clsx` and `tailwind-merge` for conditional class composition
  - `class-variance-authority` for variant-based component styling
- **Icons**: Lucide React for consistent iconography
- **Notifications**: 
  - react-hot-toast for toast notifications
  - Sonner for alternative notification patterns
- **Data Export**: XLSX library for Excel export functionality

### Module Structure

The application is organized into distinct functional modules:

1. **Dashboard** - Overview and key metrics
2. **Point of Sale (POS)** - Transaction processing
3. **Inventory Management** - Stock tracking and management
4. **Customer Management** - Customer data and relationship tracking
5. **Reports** - Business analytics and reporting
6. **Settings** - Configuration (placeholder for future implementation)

### Development Configuration

**Build System**: Vite
- Fast development server with Hot Module Replacement (HMR)
- Optimized production builds
- Special configuration for Replit deployment:
  - Host: `0.0.0.0` (accessible externally)
  - Port: 5000
  - Strict port enforcement
  - WebSocket Secure (wss) protocol for HMR over HTTPS
  - Base path set to `./` for flexible deployment

**Design Rationale**
- Vite chosen over Create React App for faster builds and better developer experience
- Bootstrap + Tailwind hybrid approach balances rapid prototyping with custom design needs
- React Query eliminates need for complex state management like Redux for API interactions

## External Dependencies

### API Integration

**HTTP Client**: Axios
- Centralized API client configuration in `src/config/api.js`
- Base URL configured via environment variable (`VITE_API_BASE_URL`)
- Fallback to `http://localhost:5000` for local development
- Standardized JSON content-type headers

**Backend Expectations**
- RESTful API architecture assumed
- JSON request/response format
- Expected endpoints for:
  - Product inventory operations
  - Customer CRUD operations
  - Transaction/sales processing
  - Report data aggregation

### CDN Dependencies

**Bootstrap**
- Version: 5.3.3
- Loaded via CDN for CSS and JavaScript bundles
- Provides responsive grid system and pre-built components
- Integrity hashes for security (SRI)

### Styling Architecture

**CSS Approach**
- Tailwind CSS directives in `src/index.css`
- Custom CSS properties (CSS variables) for theming:
  - Primary, secondary, success, danger, warning, info colors
  - Centralized color management for consistent branding
- Component-specific stylesheets (e.g., `reports.css`)
- Global styles for body and font-family

### State and Data Management

**React Query Configuration**
- Default QueryClient instance
- Wraps entire application for data fetching context
- Automatic background refetching and cache invalidation
- Error and loading state management

**Advantages**
- Reduces boilerplate for API state management
- Built-in caching improves performance
- Optimistic updates support for better UX
- Server state separated from UI state

### Notification System

**Dual Notification Strategy**
- Primary: Custom Toaster component
- Secondary: Sonner library
- Provides flexibility for different notification patterns (toast, alerts, etc.)
- Ensures consistent user feedback across all operations

### Data Export Capability

**XLSX Library**
- Enables export of reports and data to Excel format
- Client-side file generation (no server dependency for exports)
- Useful for inventory lists, sales reports, customer data exports

### Accessibility

**Radix UI Primitives**
- Provides accessible component foundations
- Tooltip component ensures keyboard navigation and screen reader support
- TooltipProvider wraps application for consistent tooltip behavior