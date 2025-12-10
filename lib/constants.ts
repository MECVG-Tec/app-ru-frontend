export const APP_CONFIG = {
  TICKET_LUNCH_PRICE: 3.50,
  TICKET_DINNER_PRICE: 3.00,
  TICKET_LUNCH_PRICE_EXTERNAL: 18.00,
  TICKET_DINNER_PRICE_EXTERNAL: 16.00,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
};

export const ROUTES = {
  LOGIN: '/login',
  HOME: '/home',
  HISTORY: '/history',
  PROFILE: '/profile',
  BUY: '/buy',
};