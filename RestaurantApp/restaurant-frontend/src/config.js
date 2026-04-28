// Central API config — reads from environment variable at build time
// Set VITE_API_URL in Render's environment variables for production
export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5021';
