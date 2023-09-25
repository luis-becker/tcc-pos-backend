const crypto = require('crypto')
const authModel = require('../models/authModel')
const userModel = require('../models/userModel')

authService = {}

authService.register = async (credentials) => {
  if (await authModel.retrieveAuthByEmail(credentials.email)) return {email: credentials.email, error: 'E-mail already registered.'}
  let hashedCred = authFactory(credentials)
  let res = await authModel.createAuth(hashedCred)
  if (!res.acknowledged || !res.insertedId) return {email: credentials.email, error: 'Unable to save credentials.'}
  res = await userModel.createUser({email: credentials.email})
  if (!res.acknowledged || !res.insertedId) return {email: credentials.email, error: 'Unable to create user.'}
  return {email: credentials.email, error: null}
}

authService.login = async (credentials) => {
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

authService.validateToken = async (token) => {
  if(!token) return null
  const hashedToken = hashToken(token)
  const res = await authModel.retrieveToken(hashedToken)
  console.log(res)
  if (!res || !res.email) return null
  const responseToken = {
    email: res.email,
    token: res.tokens.find(t => t.value === hashedToken)
  }
  if(isTokenExpired(responseToken)) return null
  return res.email
}

authService.logout = async (token) => {
  const hashedToken = hashToken(token)
  let res = await authModel.retrieveToken(hashedToken)
  if(!res && !res?.token) throw new InvalidToken('Token is invalid.')
  res = await authModel.deleteToken(hashedToken)
  if(res && res.matchedCount===1) return true
  return false
}

const authFactory = (auth) => {
  const salt = generateSalt()
  const passwordHash = hashPassowrd(auth.password, salt)
  return {
    email: auth.email,
    passwordHash: passwordHash,
    salt: salt
  }
}

const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex')
}

const generateToken = () => {
  return {
    value: crypto.randomBytes(32).toString('hex'),
    expirationDate: new Date(new Date() + 60 * 60 * 1000)
  }
}

const hashPassowrd = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}

const hashToken = (token) => {
  const hash = crypto.createHash('sha256').update(token);
  return hash.digest('hex')
}

const hashAndComparePassword = (passwordHash, password, salt) => {
  const inputPasswordHash = hashPassowrd(password, salt)
  return passwordHash === inputPasswordHash
}

const isTokenExpired = (token) => {
  const expirationDate = token.expirationDate
  const currentDate = new Date()
  return expirationDate > currentDate
}
module.exports = authService