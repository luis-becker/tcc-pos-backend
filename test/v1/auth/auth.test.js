const assert = require('assert')
const resMocker = require('../../mocks/resMocker')
const authServiceFunc = require('../../../src/v1/services/authService')
const authControllerFunc = require('../../../src/v1/controllers/authController')
const crypo = require('crypto')

describe('Auth Endpoint', function () {
  let authModelMock = {}
  let userModelMock = {}
  let authService = authServiceFunc(authModelMock, userModelMock)
  let authController = authControllerFunc(authService)
  let resMock = null
  let reqMock = null

  beforeEach(function() {
    resMock = resMocker()
    reqMock = {
      body: null
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
          passwordHash: crypo.pbkdf2Sync('123456', 'salt', 1000, 64, 'sha512').toString('hex'),
          salt: 'salt'
        }
      }
      authModelMock.saveToken = async function() {
        return {acknowledged: true}
      }
      await authController.login(reqMock, resMock)
      assert.equal(resMock.code, 200);
      assert.equal(resMock.message.email, 'meuEmail');
      assert.notEqual(resMock.message.authToken.value, undefined);
      assert.notEqual(resMock.message.authToken.expires, undefined);
    })
  })
})