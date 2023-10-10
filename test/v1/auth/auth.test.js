const assert = require('assert')
const resMocker = require('../../mocks/resMocker')
const authService = require('../../../src/v1/services/auth.service')
const authController = require('../../../src/v1/controllers/auth.controller')
const authMiddleware = require('../../../src/v1/middlewares/auth.middleware')
const modelMocker = require('../../mocks/modelMocker')
const authModel = require('../../../src/v1/models/auth.model')
const userModel = require('../../../src/v1/models/user.model')
const userService = require('../../../src/v1/services/user.service')
const crypto = require('crypto')
const { ObjectId } = require('mongoose').Types

describe('Auth Endpoint', function () {
  let modelMock
  let services
  let controller
  let resMock
  let reqMock

  beforeEach(function() {
    modelMock = modelMocker(authModel)
    services = {
      auth: authService(modelMock),
      user: userService(modelMocker(userModel))
    },
    controller = authController(services.auth)
    resMock = resMocker()
    reqMock = {
      headers: {
        authtoken: '123456'
      },
      body: null,
      email: 'someEmail@someHost.com',
      userId: (new ObjectId()).toString()
    }
  })

  describe('#register', function () {
    let auth
    beforeEach(function() {
      auth = {
        email: 'someEmail@someHost.com',
        password: '123456'
      }
      reqMock.body = auth
    })

    it('should return 201 if credentials are valid', async function () {
      await controller.register(reqMock, resMock)
      assert.equal(resMock.code, 201);
      assert.equal(resMock.message.email, auth.email);
    })

    it('should return 400 if email is missing', async function () {
      reqMock.body = {
        password: '123456'
      }
      await controller.register(reqMock, resMock)
      assert.equal(resMock.code, 400);
    })

    it('should return 400 if password is missing', async function () {
      reqMock.body = {
        email: 'meuEmail@meuEmail.com'
      }
      await controller.register(reqMock, resMock)
      assert.equal(resMock.code, 400);
    })

    it('should return 400 if email is invalid', async function () {
      reqMock.body.email = 'invalidEmail'
      await controller.register(reqMock, resMock)
      assert.equal(resMock.code, 400);
    })

    it('should return 409 if user already exists', async function () {
      modelMock.prototype.save = async function () {
        throw { code: 11000 }
      }
      await controller.register(reqMock, resMock)
      assert.equal(resMock.code, 409);
      assert.equal(resMock.message, 'User already exists.');
    })
  })

  describe('#login', function () {
    let password = '123456'
    let salt = '456789'
    beforeEach(function() {
      auth = {
        email: 'someEmail@someHost.com',
        password: crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'),
        salt: salt
      }
      reqMock.body = {email: auth.email, password: password}
      modelMock.objList = [auth]
    })

    it('should return 400 if email is missing', async function () {
      reqMock.body = {
        password: '123456'
      }
      await controller.login(reqMock, resMock)
      assert.equal(resMock.code, 400);
      assert.equal(resMock.message, 'Missing required field: email, password');
    })

    it('should return 400 if password is missing', async function () {
      reqMock.body = {
        email: 'meuEmail'
      }
      await controller.login(reqMock, resMock)
      assert.equal(resMock.code, 400);
      assert.equal(resMock.message, 'Missing required field: email, password');
    })

    it('should return 401 if user not registered', async function () {
      modelMock.objList = []
      await controller.login(reqMock, resMock)
      assert.equal(resMock.code, 401);
      assert.equal(resMock.message, 'Invalid Credentials');
    })

    it('should return 401 if password is invalid', async function () {
      reqMock.body.password = 'invalidPassword'
      await controller.login(reqMock, resMock)
      assert.equal(resMock.code, 401);
      assert.equal(resMock.message, 'Invalid Credentials');
    })

    it('should return 200 if credentials are valid', async function () {
      modelMock.prototype.hashPassword = async function () {
        return this.password
      }
      await controller.login(reqMock, resMock)
      assert.equal(resMock.code, 200);
      assert.equal(resMock.message.email, auth.email);
      assert.notEqual(resMock.message.authtoken, undefined);
      assert.notEqual(resMock.message.authtoken.value, undefined);
      assert.notEqual(resMock.message.authtoken.expires, undefined);
    })
  })

  describe('#validateToken', function () {
    it('should return email and userId', async function () {
      await controller.validateToken(reqMock, resMock)
      assert.equal(resMock.code, 200);
      assert.equal(resMock.message.email, reqMock.email);
      assert.equal(resMock.message.userId, reqMock.userId);
    })
  })

  describe('#logout', function () {
    let auth
    beforeEach(function() {
      auth = {
        email: 'someEmail@someHost.com',
        tokens: [
          {
            value: crypto.createHash('sha512').update(reqMock.headers.authtoken).digest('hex'),
            expirationDate: new Date()
          }
        ],
        salt: '456789',
        password: crypto.pbkdf2Sync('123456', '456789', 1000, 64, 'sha512').toString('hex')
      }
      modelMock.objList = [auth]
    })

    it('should return 401 if token is invalid', async function () {
      modelMock.objList = []
      await controller.logout(reqMock, resMock)
      assert.equal(resMock.code, 401);
      assert.equal(resMock.message, 'Invalid Token.');
    })

    it('should return 200 if token is valid', async function () {
      await controller.logout(reqMock, resMock)
      assert.equal(resMock.code, 200);
      assert.equal(resMock.message, 'User logged out.');
    })
  })  
})

describe('Auth Middleware', function () {
  let models
  let services
  let middleware
  let resMock
  let reqMock

  beforeEach(function() {
    models = {
      auth: modelMocker(authModel),
      user: modelMocker(userModel)
    }
    services = {
      auth: authService(models.auth),
      user: userService(models.user)
    }
    middleware = authMiddleware(services.auth, services.user)
    resMock = resMocker()
    reqMock = {
      headers: {
        authtoken: '123456'
      }
    }
  })

  describe('#authorization', function () {
    let auth
    let user
    beforeEach(function() {
      auth = {
        email: 'someEmail@someHost.com',
        password: crypto.pbkdf2Sync('123456', '456789', 1000, 64, 'sha512').toString('hex'),
        salt: '456789',
        tokens: [{
          value: crypto.createHash('sha512').update(reqMock.headers.authtoken).digest('hex'),
          expirationDate: new Date(Date.now() + 60*60*1000)
        }]
      }
      user = {
        _id: (new ObjectId()).toString(),
        email: auth.email,
      }
      models.auth.objList = [auth]
      models.user.objList = [user]
    })

    it('should return 401 if token is invalid', async function () {
      models.auth.objList = []
      await middleware.authorization(reqMock, resMock, () => {})
      assert.equal(resMock.code, 401);
      assert.equal(resMock.message, 'Invalid Token.');
    })

    it('should return 401 if token is expired', async function () {
      models.auth.objList[0].tokens[0].expirationDate = new Date(Date.now() - 60*60*1000)
      await middleware.authorization(reqMock, resMock, () => {})
      assert.equal(resMock.code, 401);
      assert.equal(resMock.message, 'Invalid Token.');
    })

    it('should return 200 if token is valid', async function () {
      await middleware.authorization(reqMock, resMock, () => {})
      assert.notEqual(resMock.code, 401);
      assert.notEqual(resMock.code, 500);
      assert.equal(reqMock.email, auth.email);
      assert.equal(reqMock.userId, user._id);
    })
  })
})