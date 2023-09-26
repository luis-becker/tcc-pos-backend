
function authController(authService) {
  
  function register(req, res){
    const credentials = req.body
    if (!credentials || !credentials.email || !credentials.password) {
      res.status(400).send('Missing required field: email, password')
      return
    }
    authService.register(credentials).then((response) => {
      if (response && response.email && !response.error) res.status(201).send('User registered.')
      else res.status(500).send(response.error)
    }).catch((err) => {
      console.log(err)
      res.status(500).send('Service Unavailable')
    })
  }
  
  function login(req, res){
    const credentials = req.body
    if (!credentials || !credentials.email || !credentials.password) {
      res.status(400).send('Missing required field: email, password')
      return
    }
    authService.login(credentials).then((token) => {
      if (!token) res.status(401).send('Invalid Credentials')
      else {
        res.status(200)
        res.send({
          email: credentials.email,
          authToken: {
            value: token.value,
            expires: token.expirationDate
          }
        })
      }
    }).catch((err) => {
      console.log(err)
      res.status(500).send('Service Unavailable')
    })
  }
  
  function validateToken(req, res){
    res.send({email: req.email})
  }
  
  function logout(req, res){
    authService.logout(req.headers.authtoken).then((isLoggedOut) => {
      if (isLoggedOut) res.status(200).send('User logged out.')
      else res.status(500).send()
    }).catch((err) => {
      console.log(err)
      res.status(500).send('Service Unavailable')
    })
  }

  return {
    register,
    login,
    validateToken,
    logout
  }
}

module.exports = authController