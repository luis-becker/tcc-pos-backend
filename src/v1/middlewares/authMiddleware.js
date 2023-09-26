function authMiddleware(authService) {

  function authorization(req, res, next) {
    const authToken = req.headers.authtoken
    authService.validateToken(authToken).then((email) => {
      if (email) {
        req.email = email
        next()
      } else {
        res.status(401).send("Invalid Token.")
      }
    }).catch((err) => {
      console.log(err)
      res.status(500).send('Service Unavailable')
    })
  }

  return {
    authorization
  }
}
module.exports = authMiddleware