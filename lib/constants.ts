export const APP_CONFIG = {
  TICKET_PRICE: 3.00,
  MAX_TICKETS_PER_PURCHASE: 10,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
};

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/home',
  HISTORY: '/history',
  PROFILE: '/profile',
  BUY: '/buy',
};