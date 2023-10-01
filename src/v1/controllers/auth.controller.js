
function authController(authService) {
  
  async function register(req, res){
    const credentials = req.body
    if (!credentials || !credentials.email || !credentials.password) {
      res.status(400).send('Missing required field: email, password')
      return
    }
    const response = await authService.register(credentials)
    if (response && response.email && !response.error) res.status(201).send('User registered.')
    else if (response && response.error=='E-mail already registered.') res.status(409).send(response.error)
    else if (response && response.error) res.status(500).send(response.error)
    else res.status(500).send(response.error)
  }
  
  async function login(req, res){
    const credentials = req.body
    if (!credentials || !credentials.email || !credentials.password) {
      res.status(400).send('Missing required field: email, password')
      return
    }
    const token = await authService.login(credentials)
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
  }
  
  async function validateToken(req, res){
    return await res.send({email: req.email})
  }
  
  async function logout(req, res){
    const isLoggedOut = await authService.logout(req.headers.authtoken)
    if (isLoggedOut) res.status(200).send('User logged out.')
    else res.status(500).send()
  }

  return {
    register,
    login,
    validateToken,
    logout
  }
}

module.exports = authController