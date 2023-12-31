const express = require('express')

function userRouter(authMiddleware, userController) {

  const router = express.Router()

  router.use(authMiddleware.authorization)
  router.post('/', userController.createUser)
  router.get('/', userController.retrieveUser)
  router.patch('/', userController.updateUser)
  router.get('/:id', userController.retrieveUserById)

  return router
}
module.exports = userRouter
