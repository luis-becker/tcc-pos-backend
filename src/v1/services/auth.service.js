const crypto = require('crypto')

function authService(authModel) {

  async function createAuth(params) {
    params.salt = generateSalt()
    if(params.password) {
      params.password = hashPassowrd(params.password, params.salt)
    }
    let auth = new authModel(params)
    return await auth.save()
  }
  
  async function login(params) {
    if (!params || !params.email || !params.password) return null
    let auth = await authModel.findOne({ email: params.email })
    if (!auth) return null
    params.password = hashPassowrd(params.password, auth.salt)
    if (auth.password !== params.password) return null
    let token = generateToken()
    auth.tokens.push({ value: hashToken(token.value), expirationDate: token.expirationDate})
    await auth.save()
    return token
  }
  
  async function validateToken(param) {
    if(!param) return null
    let hashedToken = hashToken(param)
    let auth = await authModel.findOne({ 'tokens.value': hashedToken })
    if (!auth) return null
    let token = auth.tokens.find(e => e.value === hashedToken)
    if(isTokenExpired(token)) return null
    return { user: auth.user, email: auth.email}
  }
  
  async function logout(param) {
    if(!param) return null
    let hashedToken = hashToken(param)
    let auth = await authModel.findOne({ 'tokens.value': hashedToken })
    if (!auth) return null
    auth.tokens = auth.tokens.filter(e => e.value !== hashedToken)
    await auth.save()
    return auth.email
  }

  async function addUserRef(userId, email) {
    let auth = await authModel.findOne({ email: email })
    auth.user = userId
    await auth.save()
    return { user: auth.user, email: auth.email}
  }

  return {
    createAuth,
    login,
    validateToken,
    logout,
    addUserRef
  }
}
module.exports = authService

function generateSalt() {
  return crypto.randomBytes(16).toString('hex')
}

function generateToken() {
  const expirationDate = new Date(Date.now() + 60*60*1000)
  return {
    value: crypto.randomBytes(32).toString('hex'),
    expirationDate: expirationDate
  }
}

function hashPassowrd(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

function hashToken(token) {
  return crypto.createHash('sha512').update(token).digest('hex')
}

function isTokenExpired(token) {
  const expirationDate = token.expirationDate
  const currentDate = new Date()
  return expirationDate < currentDate
}