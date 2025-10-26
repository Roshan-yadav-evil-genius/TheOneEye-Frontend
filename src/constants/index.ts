// Application Constants
export const APP_CONFIG = {
  name: 'TheOneEye',
  description: 'Automation-as-a-Service Platform',
  version: '1.0.0',
  url: 'https://theoneeye.com',
  supportEmail: 'support@theoneeye.com',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// Route Paths
export const ROUTES = {
  home: '/',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  nodes: '/nodes',
  'nodes.create': '/nodes/create',
  'nodes.edit': '/nodes/edit',
  workflow: '/workflow',
  'form-builder': '/form-builder',
  'test-api': '/test-api',
  'not-found': '/not-found',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  authToken: 'theoneeye_auth_token',
  refreshToken: 'theoneeye_refresh_token',
  userPreferences: 'theoneeye_user_preferences',
  theme: 'theoneeye_theme',
  sidebarState: 'theoneeye_sidebar_state',
} as const;

// Form Validation
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Name must be 2-50 characters and contain only letters and spaces',
  },
} as const;

// UI Constants
export const UI_CONFIG = {
  sidebar: {
    width: 256,
    collapsedWidth: 64,
  },
  header: {
    height: 64,
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  },
  toast: {
    duration: 5000,
    position: 'top-right' as const,
  },
} as const;

// Node Types
export const NODE_TYPES = {
  FORM: 'form',
  API: 'api',
  DATABASE: 'database',
  EMAIL: 'email',
  SMS: 'sms',
  WEBHOOK: 'webhook',
  CONDITION: 'condition',
  LOOP: 'loop',
  DELAY: 'delay',
} as const;

// Workflow Status
export const WORKFLOW_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  PAGE_NOT_FOUND: 'The page you are looking for does not exist.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  DASHBOARD_ERROR: 'Something went wrong while loading the dashboard.',
  NODES_ERROR: 'Something went wrong while loading the nodes.',
  WORKFLOW_ERROR: 'Something went wrong while loading the workflow.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  NODE_CREATED: 'Node created successfully',
  NODE_UPDATED: 'Node updated successfully',
  NODE_DELETED: 'Node deleted successfully',
  WORKFLOW_CREATED: 'Workflow created successfully',
  WORKFLOW_UPDATED: 'Workflow updated successfully',
  WORKFLOW_DELETED: 'Workflow deleted successfully',
  FORM_SAVED: 'Form saved successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_BETA_FEATURES: process.env.NEXT_PUBLIC_ENABLE_BETA_FEATURES === 'true',
} as const;

// Environment
export const ENV = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;
