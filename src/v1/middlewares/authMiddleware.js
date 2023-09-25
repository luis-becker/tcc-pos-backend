const authService = require('../services/authService')

authMiddleware = {}

authMiddleware.authorization = (req, res, next) => {
  const authToken = req.headers.authtoken
  authService.validateToken(authToken).then((email) => {
    if (email) {
      req.email = email
      next()
    } else {
      res.status(401).send("Invalid Token.")
    }
  })
}

module.exports = authMiddleware