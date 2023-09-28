const authModelFunc = require('../models/authModel')
const userModelFunc = require('../models/userModel')
const authServiceFunc = require('../services/authService')
const authControllerFunc = require('../controllers/authController')
const dbConnectorFunc = require('../utils/dbConnector')
const authMiddlewareFunc = require('../middlewares/authMiddleware')
const authRouterFunc = require('../routes/authRoutes')
const logMiddlewareFunc = require('../middlewares/logMiddleware')

// Auth API
const dbConnector = dbConnectorFunc()
const authModel = authModelFunc(dbConnector)
const authService = authServiceFunc(authModel)
const authController = authControllerFunc(authService)

// Middlewares
const authMiddleware = authMiddlewareFunc(authService)
const logMiddleware = logMiddlewareFunc()

// Routers
const authRouter = authRouterFunc(authMiddleware, authController)

module.exports = {
  authRouter,
  dbConnector,
  logMiddleware
}
