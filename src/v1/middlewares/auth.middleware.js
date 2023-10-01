function authMiddleware(authService) {

  async function authorization(req, res, next) {
    const authToken = req.headers.authtoken
    const email = await authService.validateToken(authToken)
    if (email) {
      req.email = email
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