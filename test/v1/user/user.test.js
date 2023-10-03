const assert = require('assert')
const resMocker = require('../../mocks/resMocker')
const userService = require('../../../src/v1/services/user.service')
const userController = require('../../../src/v1/controllers/user.controller')
const testUtils = require('../../utils/testUtils')()

describe('User Endpoint', function () {
    let modelMock = {}
    let service = userService(modelMock)
    let controller = userController(service)
    let resMock = null
    let reqMock = null

    beforeEach(() => {
        resMock = resMocker()
        reqMock = {
            header: null,
            body: null
        }
    })

    describe('#createUser', function () {
        let user
        beforeEach(() => {
            user = {
                email: 'testEmail',
                address: 'testAddress',
                service: 'testService',
                agenda: [{
                    weekDay: 1,
                    startTime: { hour: 10, minutes: 30 },
                    endTime: { hour: 11, minutes: 30 }
                }]
            }
        })

        it('Should create user', async function () {
            modelMock.getUserByEmail = () => null
            modelMock.createUser = () => { return {insertedId: 1}}
            reqMock.email = user.email
            reqMock.body = user
            await controller.createUser(reqMock, resMock)
            assert.equal(resMock.code, 201)
            assert.notEqual(resMock.message, undefined)
            assert.equal(resMock.message.email, user.email)
            assert.equal(resMock.message.address, user.address)
            assert.equal(resMock.message.service, user.service)
            assert.notEqual(resMock.message.agenda, undefined)
            assert.equal(resMock.message.agenda.length, user.agenda.length)
            assert.equal(testUtils.isDeepEqual(resMock.message.agenda[0], user.agenda[0]), true)
        })

        it('Should not create user if email does not match', async function () {
            reqMock.email = 'OtherEmail'
            reqMock.body = user
            await controller.createUser(reqMock, resMock)
            assert.equal(resMock.code, 401)
            assert.equal(resMock.message, 'New user email does not match logged user email.')
        })

        it('Should not create user if email is missing', async function () {
            reqMock.email = user.email
            reqMock.body = {}
            await controller.createUser(reqMock, resMock)
            assert.equal(resMock.code, 400)
            assert.equal(resMock.message, 'Missing required field: email.')
        })

        it('Should not create user if user already exists', async function () {
            modelMock.getUserByEmail = () => {return {email: user.email}}
            reqMock.email = user.email
            reqMock.body = user
            await controller.createUser(reqMock, resMock)
            assert.equal(resMock.code, 409)
            assert.equal(resMock.message, 'User already exists.')
        })

    })

    describe('#retrieveUser', function () {
        it('Should retrieve user', async function () {
            modelMock.getUserByEmail = () => {return {email: 'testEmail'}}
            reqMock.email = 'testEmail'
            await controller.retrieveUser(reqMock, resMock)
            assert.equal(resMock.code, 200)
            assert.equal(resMock.message.email, 'testEmail')
        })

        it('Should not retrieve user if email is missing', async function () {
            modelMock.getUserByEmail = () => {return {email: 'testEmail'}}
            reqMock.email = null
            await controller.retrieveUser(reqMock, resMock)
            assert.equal(resMock.code, 400)
            assert.equal(resMock.message, 'Missing required field: email.')
        })

        it('Should not retrieve user if user does not exist', async function () {
            modelMock.getUserByEmail = () => null
            reqMock.email = 'testEmail'
            await controller.retrieveUser(reqMock, resMock)
            assert.equal(resMock.code, 404)
            assert.equal(resMock.message, 'User not found.')
        })
    })
})