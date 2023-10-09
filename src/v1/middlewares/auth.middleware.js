const { default: mongoose } = require("mongoose")

function authMiddleware(authService, userService) {

  async function authorization(req, res, next) {
    let authToken = req.headers.authtoken
    let email = await authService.validateToken(authToken)
    let user = await userService.retrieveUser(email)
    if (!user) {
      user = await userService.createUser({email}).user
    }
    if (email && user?._id) {
      req.email = email
      req.userId = user._id.toString()
      await next()
    } else {
      res.status(401).send('Invalid Token.')
    }
  }

  return {
    authorization
  }
}
module.exports = authMiddleware