const authMiddleware = require('../middlewares/auth.middleware')
const logMiddleware = require('../middlewares/log.middleware')
const errorMiddleware = require('../middlewares/error.middleware')
const dbConnectorF = require('../utils/dbConnector')
const authModel = require('../models/auth.model')
const authService = require('../services/auth.service')
const authController = require('../controllers/auth.controller')
const authRouter = require('../routes/auth.routes')
const userModel = require('../models/user.model')
const userService = require('../services/user.service')
const userController = require('../controllers/user.controller')
const userRouter = require('../routes/user.routes')



// DB Connector
const dbConnector = dbConnectorF()

// Models
const models = {
  auth: authModel(dbConnector),
  user: userModel(dbConnector)
}

// Services
const services = {
  auth: authService(models.auth),
  user: userService(models.user)
}

// Controllers
const controllers = {
  auth: authController(services.auth),
  user: userController(services.user)
}

// Middlewares
const middlewares = {
  log: logMiddleware(),
  error: errorMiddleware(),
  auth: authMiddleware(services.auth)
}

// Routers
const routers = {
  auth: authRouter(middlewares.auth, controllers.auth),
  user: userRouter(middlewares.auth, controllers.user)
}

module.exports = {
  dbConnector,
  models,
  services,
  controllers,
  middlewares,
  routers
}
