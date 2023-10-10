const assert = require('assert')
const resMocker = require('../../mocks/resMocker')
const userService = require('../../../src/v1/services/user.service')
const userController = require('../../../src/v1/controllers/user.controller')
const modelMocker = require('../../mocks/modelMocker')
const userModel = require('../../../src/v1/models/user.model')
const { CastError } = require('mongoose').Error
const { ObjectId } = require('mongoose').Types
const testUtils = require('../../utils/testUtils')()

describe('User Endpoint', function () {
    let modelMock
    let service
    let controller
    let resMock
    let reqMock

    beforeEach(() => {
        modelMock = modelMocker(userModel)
        service = userService(modelMock)
        controller = userController(service)
        resMock = resMocker()
        reqMock = {
            header: null,
            body: null,
            email: 'someEmail@someHost.com',
            userId: (new ObjectId()).toString(),
            params: { id: (new ObjectId()).toString() }
        }
    })

    describe('#createUser', function () {
        let user
        beforeEach(() => {
            user = {
                email: 'testEmail',
                name: 'testName',
                address: 'testAddress',
                service: 'testService',
                agenda: [{
                    weekDay: 1,
                    startTime: { hour: 10, minute: 30 },
                    endTime: { hour: 11, minute: 30 }
                }]
            }
            modelMock.objList = [user]
            reqMock.body = user
        })

        it('Should create user', async function () {
            await controller.createUser(reqMock, resMock)
            assert.equal(resMock.code, 201)
            assert.equal(resMock.message?.email, reqMock.email)
            assert.equal(resMock.message?.name, user.name)
            assert.equal(resMock.message?.address, user.address)
            assert.equal(resMock.message?.service, user.service)
            assert.equal(resMock.message?.agenda?.length, user.agenda.length)
            assert.equal(resMock.message?.agenda[0].weekDay, user.agenda[0].weekDay)
            assert.equal(resMock.message?.agenda[0].startTime.hour, user.agenda[0].startTime.hour)
            assert.equal(resMock.message?.agenda[0].startTime.minute, user.agenda[0].startTime.minute)
            assert.equal(resMock.message?.agenda[0].endTime.hour, user.agenda[0].endTime.hour)
            assert.equal(resMock.message?.agenda[0].endTime.minute, user.agenda[0].endTime.minute)
        })

        it('Should not create user if user already exists', async function () {
            modelMock.prototype.save = async function () {
                throw { code: 11000 }
            }
            await controller.createUser(reqMock, resMock)
            assert.equal(resMock.code, 409)
            assert.equal(resMock.message, 'User already exists.')
        })

        it('Should not create user if agenda is invalid', async function () {
            user.agenda[0].weekDay = 7
            user.agenda[0].endTime.hour = 18
            await controller.createUser(reqMock, resMock)
            assert.equal(resMock.code, 400)
        })
    })

    describe('#retrieveUser', function () {
        let user
        beforeEach(() => {
            user = {
                email: 'testEmail',
                name: 'testName',
                address: 'testAddress',
                service: 'testService',
                agenda: [{
                    weekDay: 1,
                    startTime: { hour: 10, minute: 30 },
                    endTime: { hour: 11, minute: 30 }
                }]
            }
            modelMock.objList = [user]
        })

        it('Should retrieve user', async function () {
            await controller.retrieveUser(reqMock, resMock)
            assert.equal(resMock.code, 200)
            assert.equal(resMock.message.email, user.email)
        })

        it('Should not retrieve user if user does not exist', async function () {
            modelMock.objList = []
            await controller.retrieveUser(reqMock, resMock)
            assert.equal(resMock.code, 404)
            assert.equal(resMock.message, 'User not found.')
        })
    })

    describe('#updateUser', function () {
        let user
        beforeEach(() => {
            user = {
                email: 'testEmail@testHost.com',
                name: 'testName',
                address: 'testAddress',
                service: 'testService',
                agenda: [{
                    weekDay: 1,
                    time: {
                        start: { hour: 10, minute: 30 },
                        end: { hour: 11, minute: 30 }
                    }
                }]
            }
            modelMock.objList = [user]
            reqMock.body = { ...user }
            reqMock.body.agenda = user.agenda.map(e => ({ ...e }))
        })

        it('Should update user', async function () {
            await controller.updateUser(reqMock, resMock)
            assert.equal(resMock.code, 200)
            assert.equal(resMock.message?.email, user.email)
            assert.equal(resMock.message?.name, user.name)
            assert.equal(resMock.message?.address, user.address)
            assert.equal(resMock.message?.service, user.service)
            assert.equal(resMock.message?.agenda?.length, user.agenda.length)
        })

        it('Should not update user if user does not exists', async function () {
            modelMock.objList = []
            await controller.updateUser(reqMock, resMock)
            assert.equal(resMock.code, 404)
            assert.equal(resMock.message, 'User not found.')
        })

    })

    describe('#retrieveUserById', function () {
        let user
        beforeEach(() => {
            user = {
                email: 'testEmail@testHost.com',
                name: 'testName',
                address: 'testAddress',
                service: 'testService',
                agenda: [{
                    weekDay: 1,
                    time: {
                        start: { hour: 10, minute: 30 },
                        end: { hour: 11, minute: 30 }
                    }
                }]
            }
            modelMock.objList = [user]
        })
        
        it('Should retrieve user without email', async function () {
            await controller.retrieveUserById(reqMock, resMock)
            assert.equal(resMock.code, 200)
            assert.equal(resMock.message._doc.email, undefined)
        })

        it('Should not retrieve user if user does not exist', async function () {
            modelMock.objList = []
            await controller.retrieveUserById(reqMock, resMock)
            assert.equal(resMock.code, 404)
            assert.equal(resMock.message, 'User not found.')
        })

        it('Should not retrieve user if id is invalid', async function () {
            reqMock.params.id = 'invalidId'
            modelMock.findOne = async function (params) {
                throw new CastError('Invalid id.')
            }
            await controller.retrieveUserById(reqMock, resMock)
            assert.equal(resMock.code, 400)
            assert.equal(resMock.message, 'Invalid id.')
        })
    })
})