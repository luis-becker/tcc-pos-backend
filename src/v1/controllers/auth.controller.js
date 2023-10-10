const { ValidationError } = require('mongoose').Error

function authController(authService) {

  async function register(req, res) {
    try {
      let { email } = await authService.createAuth(req.body)
      res.status(201).send({ email })
    } catch (err) {
      console.log(err)
      if (err instanceof ValidationError) res.status(400).send(err.message)
      else if (err.code === 11000) res.status(409).send('User already exists.')
      else res.status(500).send(err)
    }
  }

  async function login(req, res) {
    const credentials = req.body
    if (!credentials || !credentials.email || !credentials.password) {
      res.status(400).send('Missing required field: email, password')
      return
    }
    try {
      const token = await authService.login(credentials)
      if (!token) res.status(401).send('Invalid Credentials')
      else {
        res.status(200)
        res.send({
          email: credentials.email,
          authtoken: {
            value: token.value,
            expires: token.expirationDate
          }
        })
      }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async function validateToken(req, res) {
    return await res.send({ email: req.email, userId: req.userId })
  }

  async function logout(req, res) {
    try{
      const isLoggedOut = await authService.logout(req.headers.authtoken)
      if (isLoggedOut) res.status(200).send('User logged out.')
      else res.status(401).send('Invalid Token.')
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  return {
    register,
    login,
    validateToken,
    logout
  }
}

module.exports = authController