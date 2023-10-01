const assert = require('assert')
const resMocker = require('../../mocks/resMocker')
const authServiceFunc = require('../../../src/v1/services/auth.service')
const authControllerFunc = require('../../../src/v1/controllers/auth.controller')
const authMiddlewareFunc = require('../../../src/v1/middlewares/auth.middleware')
const crypto = require('crypto')

describe('Auth Endpoint', function () {
  let authModelMock = {}
  let authService = authServiceFunc(authModelMock)
  let authController = authControllerFunc(authService)
  let authMiddleware = authMiddlewareFunc(authService)
  let resMock = null
  let reqMock = null
  let nextMock = null

  beforeEach(function() {
    resMock = resMocker()
    reqMock = {
      body: null,
      headers: null
    }
  })

  describe('#register', function () {
    it('should return 400 if email is missing', async function () {
      reqMock.body = {
        password: '123456'
      }
      await authController.register(reqMock, resMock)
      assert.equal(resMock.code, 400);
      assert.equal(resMock.message, 'Missing required field: email, password');
    })

    it('should return 400 if password is missing', async function () {
      reqMock.body = {
        email: 'meuEmail'
      }
      await authController.register(reqMock, resMock)
      assert.equal(resMock.code, 400);
      assert.equal(resMock.message, 'Missing required field: email, password');
    })

    it('should return 409 if email is already registered', async function () {
      reqMock.body = {
        email: 'meuEmail',
        password: '123456'
      }
      authModelMock.retrieveAuthByEmail = async function(email) {
        return {email: email}
      }

      await authController.register(reqMock, resMock)
      assert.equal(resMock.code, 409);
      assert.equal(resMock.message, 'E-mail already registered.');
    })

    it('should return 500 if unable to save credentials', async function () {
      reqMock.body = {
        email: 'meuEmail',
        password: '123456'
      }
      authModelMock.retrieveAuthByEmail = async function() {
        return null
      }
      authModelMock.createAuth = async function() {
        return {}
      }
      await authController.register(reqMock, resMock)
      assert.equal(resMock.code, 500);
      assert.equal(resMock.message, 'Unable to save credentials.');
    })
  })

  describe('#login', function () {
    it('should return 400 if email is missing', async function () {
      reqMock.body = {
        password: '123456'
      }
      await authController.login(reqMock, resMock)
      assert.equal(resMock.code, 400);
      assert.equal(resMock.message, 'Missing required field: email, password');
    })

    it('should return 400 if password is missing', async function () {
      reqMock.body = {
        email: 'meuEmail'
      }
      await authController.login(reqMock, resMock)
      assert.equal(resMock.code, 400);
      assert.equal(resMock.message, 'Missing required field: email, password');
    })

    it('should return 401 if user not registered', async function () {
      reqMock.body = {
        email: 'meuEmail',
        password: '123456'
      }
      authModelMock.retrieveAuthByEmail = async function() {
        return null
      }
      await authController.login(reqMock, resMock)
      assert.equal(resMock.code, 401);
      assert.equal(resMock.message, 'Invalid Credentials');
    })

    it('should return 401 if password is invalid', async function () {
      reqMock.body = {
        email: 'meuEmail',
        password: '123456'
      }
      authModelMock.retrieveAuthByEmail = async function() {
        return {email: 'meuEmail', password: 'senhaErradaHash', salt: 'salt'}
      }
      await authController.login(reqMock, resMock)
      assert.equal(resMock.code, 401);
      assert.equal(resMock.message, 'Invalid Credentials');
    })

    it('should return 200 if credentials are valid', async function () {
      reqMock.body = {
        email: 'meuEmail',
        password: '123456'
      }
      authModelMock.retrieveAuthByEmail = async function() {
        return {
          email: 'meuEmail',
          passwordHash: crypto.pbkdf2Sync('123456', 'salt', 1000, 64, 'sha512').toString('hex'),
          salt: 'salt'
        }
      }
      authModelMock.saveToken = async function() {
        return {acknowledged: true}
      }
      await authController.login(reqMock, resMock)
      assert.equal(resMock.code, 200)
      assert.equal(resMock.message.email, 'meuEmail')
      assert.notEqual(resMock.message.authToken.value, undefined)
      assert.notEqual(resMock.message.authToken.expires, undefined)
    })
  })

  describe('#validateToken', function () {
    beforeEach(function() {
      reqMock.headers = {authtoken: 'meuToken'}
      nextMock = () => {
        return authController.validateToken(reqMock, resMock)
      }
    })

    it('should return 401 if token is invalid', async function () {
      authModelMock.retrieveToken = () => null
      await authMiddleware.authorization(reqMock, resMock, nextMock)
      assert.equal(resMock.code, 401)
      assert.equal(resMock.message, 'Invalid Token.')
    })

    it('should return 401 if token is expired', async function () {
      authModelMock.retrieveToken = (token) => {
        return {
          email: 'meuEmail',
          tokens: [
            {
              value: token,
              expirationDate: new Date(Date.now() - 60*60*1000)
            }
          ]
        }
      }
      await authMiddleware.authorization(reqMock, resMock, nextMock)
      assert.equal(resMock.code, 401)
      assert.equal(resMock.message, 'Invalid Token.')
    })

    it('should return 200 if token is valid', async function () {
      authModelMock.retrieveToken = (token) => {
        return {
          email: 'meuEmail',
          tokens: [
            {
              value: token,
              expirationDate: new Date(Date.now() + 60*60*1000)
            }
          ]
        }
      }
      await authMiddleware.authorization(reqMock, resMock, nextMock)
      assert.equal(resMock.code, 200)
      assert.notEqual(resMock.message, undefined)
      assert.equal(resMock.message.email, 'meuEmail')
    })
  })

  describe('#logout', function () {
    beforeEach(function() {
      reqMock.headers = {authtoken: 'meuToken'}
      nextMock = () => {
        return authController.logout(reqMock, resMock)
      }
    })

    it('should return 401 if token is invalid', async function () {
      authModelMock.retrieveToken = () => null
      await authMiddleware.authorization(reqMock, resMock, nextMock)
      assert.equal(resMock.code, 401)
      assert.equal(resMock.message, 'Invalid Token.')
    })

    it('should return 401 if token is expired', async function () {
      authModelMock.retrieveToken = async (token) => {
        return {
          email: 'meuEmail',
          tokens: [
            {
              value: token,
              expirationDate: new Date(Date.now() - 60*60*1000)
            }
          ]
        }
      }
      await authMiddleware.authorization(reqMock, resMock, nextMock)
      assert.equal(resMock.code, 401)
      assert.equal(resMock.message, 'Invalid Token.')
    })

    it('should return 200 if token is valid', async function () {
      authModelMock.retrieveToken = async (token) => {
        return {
          email: 'meuEmail',
          tokens: [
            {
              value: token,
              expirationDate: new Date(Date.now() + 60*60*1000)
            }
          ]
        }
      }
      authModelMock.deleteToken = async () => {
        return {matchedCount: 1}
      }
      await authMiddleware.authorization(reqMock, resMock, nextMock)
      assert.equal(resMock.code, 200)
      assert.notEqual(resMock.message, undefined)
      assert.equal(resMock.message, 'User logged out.')
    })
  })
})