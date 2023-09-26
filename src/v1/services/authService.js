const crypto = require('crypto')

function authService(authModel, userModel) {

  async function register(credentials) {
    if (await authModel.retrieveAuthByEmail(credentials.email)) return {email: credentials.email, error: 'E-mail already registered.'}
    let hashedCred = authFactory(credentials)
    let res = await authModel.createAuth(hashedCred)
    if (!res.acknowledged || !res.insertedId) return {email: credentials.email, error: 'Unable to save credentials.'}
    res = await userModel.createUser({email: credentials.email})
    if (!res.acknowledged || !res.insertedId) return {email: credentials.email, error: 'Unable to create user.'}
    return {email: credentials.email, error: null}
  }
  
  async function login(credentials) {
    const dbCredentials = await authModel.retrieveAuthByEmail(credentials.email)
    if (!dbCredentials || !dbCredentials.email) return null
    if (!hashAndComparePassword(dbCredentials.passwordHash, credentials.password, dbCredentials.salt)) return null
    const newToken = generateToken()
    const hashedTokenValue = hashToken(newToken.value)
    const hashedToken = {
      value: hashedTokenValue,
      expirationDate: newToken.expirationDate
    }
    const res = await authModel.saveToken(dbCredentials, hashedToken)
    if (!res?.acknowledged) return null
    return newToken
  }
  
  async function validateToken(token) {
    if(!token) return null
    const hashedToken = hashToken(token)
    const res = await authModel.retrieveToken(hashedToken)
    if (!res || !res.email) return null
    const responseToken = {
      email: res.email,
      token: res.tokens.find(t => t.value === hashedToken)
    }
    if(isTokenExpired(responseToken)) return null
    return res.email
  }
  
  async function logout(token) {
    const hashedToken = hashToken(token)
    let res = await authModel.retrieveToken(hashedToken)
    if(!res && !res?.token) throw new InvalidToken('Token is invalid.')
    res = await authModel.deleteToken(hashedToken)
    if(res && res.matchedCount===1) return true
    return false
  }

  return {
    register,
    login,
    validateToken,
    logout
  }
}
module.exports = authService

function authFactory(auth) {
  const salt = generateSalt()
  const passwordHash = hashPassowrd(auth.password, salt)
  return {
    email: auth.email,
    passwordHash: passwordHash,
    salt: salt
  }
}

function generateSalt() {
  return crypto.randomBytes(16).toString('hex')
}

function generateToken() {
  return {
    value: crypto.randomBytes(32).toString('hex'),
    expirationDate: new Date(new Date() + 60 * 60 * 1000)
  }
}

function hashPassowrd(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

function hashToken(token) {
  const hash = crypto.createHash('sha256').update(token);
  return hash.digest('hex')
}

function hashAndComparePassword(passwordHash, password, salt) {
  const inputPasswordHash = hashPassowrd(password, salt)
  return passwordHash === inputPasswordHash
}

function isTokenExpired(token) {
  const expirationDate = token.expirationDate
  const currentDate = new Date()
  return expirationDate > currentDate
}