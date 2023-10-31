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
const scheduleModel = require('../models/schedule.model')
const scheduleService = require('../services/schedule.service')
const scheduleController = require('../controllers/schedule.controller')
const scheduleRouter = require('../routes/schedule.routes')
const notificationModel = require('../models/notification.model')
const notificationService = require('../services/notification.service')
const notificationRouter = require('../routes/notification.routes')
const notificationController = require('../controllers/notification.controller')



// DB Connector
const dbConnector = dbConnectorF()

// Models
const models = {
  auth: authModel,
  user: userModel,
  schedule: scheduleModel,
  notification: notificationModel
}

// Services
const services = {
  auth: authService(models.auth),
  user: userService(models.user, models.schedule),
  schedule: scheduleService(models.schedule, models.user),
  notification: notificationService(models.notification)
}

// Controllers
const controllers = {
  auth: authController(services.auth),
  user: userController(services.user),
  schedule: scheduleController(services.schedule, services.notification),
  notification: notificationController(services.notification)
}

// Middlewares
const middlewares = {
  log: logMiddleware(),
  error: errorMiddleware(),
  auth: authMiddleware(services.auth, services.user)
}

// Routers
const routers = {
  auth: authRouter(middlewares.auth, controllers.auth),
  user: userRouter(middlewares.auth, controllers.user),
  schedule: scheduleRouter(middlewares.auth, controllers.schedule),
  notification: notificationRouter(middlewares.auth, controllers.notification)
}

module.exports = {
  dbConnector,
  models,
  services,
  controllers,
  middlewares,
  routers
}
