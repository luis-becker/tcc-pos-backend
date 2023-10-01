const express = require('express')

function authRouter(authMiddleware, authController) {

  const router = express.Router()

  router.get('/', authMiddleware.authorization)
  router.get('/logout', authMiddleware.authorization)


  router.get('/logout', authController.logout)
  router.get('/', authController.validateToken)
  router.post('/login', authController.login)
  router.post('/register', authController.register)

  return router
}
module.exports = authRouter
