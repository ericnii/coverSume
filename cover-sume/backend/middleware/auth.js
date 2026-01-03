const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL
};

// Export the auth middleware and config
module.exports = {
  authMiddleware: auth(config),
  requiresAuth,
  config
};
