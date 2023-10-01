const express = require('express')

function userRouter(authMiddleware, userController) {

  const router = express.Router()

  router.use(authMiddleware.authorization)
  router.post('/', userController.createUser)

  return router
}
module.exports = userRouter
