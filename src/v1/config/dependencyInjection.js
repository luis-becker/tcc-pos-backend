const authModelFunc = require('../models/auth.model')
const authServiceFunc = require('../services/auth.service')
const authControllerFunc = require('../controllers/auth.controller')
const dbConnectorFunc = require('../utils/dbConnector')
const authMiddlewareFunc = require('../middlewares/auth.middleware')
const authRouterFunc = require('../routes/auth.routes')
const logMiddlewareFunc = require('../middlewares/log.middleware')
const errorMiddlewareFunc = require('../middlewares/error.middleware')

// Auth API
const dbConnector = dbConnectorFunc()
const authModel = authModelFunc(dbConnector)
const authService = authServiceFunc(authModel)
const authController = authControllerFunc(authService)

// Middlewares
const authMiddleware = authMiddlewareFunc(authService)
const logMiddleware = logMiddlewareFunc()
const errorMiddleware = errorMiddlewareFunc()

// Routers
const authRouter = authRouterFunc(authMiddleware, authController)

module.exports = {
  authRouter,
  dbConnector,
  logMiddleware,
  errorMiddleware
}
