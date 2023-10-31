function authMiddleware(authService, userService) {

  async function authorization(req, res, next) {
    try {
      let auth = await authService.validateToken(req.headers.authtoken)
      if (!auth) {
        res.status(401).send('Invalid Token.')
        return
      }
      let user = await userService.retrieveUserByEmail(auth.email)
      if (!auth.user) {
        if (user) {
          auth = await authService.addUserRef(user._id, auth.email)
        }
      }
  
      req.email = auth.email
      req.userId = auth.user
      req.user = user
  
      next()
    }
    catch (err) {
      res.status(500).send(err.message)
    }
  }

  return {
    authorization
  }
}
module.exports = authMiddleware