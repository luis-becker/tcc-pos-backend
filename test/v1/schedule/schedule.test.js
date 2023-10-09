const assert = require('assert')
const resMocker = require('../../mocks/resMocker')
const scheduleService = require('../../../src/v1/services/schedule.service')
const scheduleController = require('../../../src/v1/controllers/schedule.controller')
const modelMocker = require('../../mocks/modelMocker')
const scheduleModel = require('../../../src/v1/models/schedule.model')
const { CastError } = require('mongoose').Error
const { ObjectId } = require('mongoose').Types
const testUtils = require('../../utils/testUtils')()

describe('Schedule Endpoint', function () {
    let modelMock
    let service
    let controller
    let resMock
    let reqMock

    beforeEach(() => {
        modelMock = modelMocker(scheduleModel)
        service = scheduleService(modelMock)
        controller = scheduleController(service)
        resMock = resMocker()
        reqMock = {
            header: null,
            body: null,
            email: 'someEmail@someHost.com',
            userId: (new ObjectId()).toString(),
            params: { id: (new ObjectId()).toString() }
        }
    })

    describe('#createSchedule', function () {
        let schedule
        beforeEach(() => {
            schedule = {
                owner: { ref: (new ObjectId()).toString(), name: 'owner' },
                service: 'service',
                address: 'address',
                time: {
                    start: new Date('2020-01-01T01:00:00.000Z'),
                    end: new Date('2020-01-01T02:00:00.000Z')
                },
            }
        })

        it('Should create schedule', async function () {
            reqMock.body = schedule
            await controller.createSchedule(reqMock, resMock)
            console.log(resMock)
            assert.equal(resMock.code, 201)
            assert.equal(resMock.message?.owner?.ref, schedule.owner.ref)
            assert.equal(resMock.message?.owner?.name, schedule.owner.name)
            assert.equal(resMock.message?.attendee?.ref, reqMock.userId)
            assert.equal(resMock.message?.service, schedule.service)
            assert.equal(resMock.message?.address, schedule.address)
            assert.equal(resMock.message?.time?.start, schedule.time.start)
            assert.equal(resMock.message?.time?.end, schedule.time.end)
        })

        it('Should return 400 if start time is after end time', async function () {
            schedule.time.end = new Date('2020-01-01T00:00:00.000Z')
            reqMock.body = schedule
            await controller.createSchedule(reqMock, resMock)
            assert.equal(resMock.code, 400)
        })

        it('Should return 400 if some required field is missing', async function () {
            schedule.owner.ref = null
            reqMock.body = schedule
            await controller.createSchedule(reqMock, resMock)
            assert.equal(resMock.code, 400)
        })

    })

    describe('#retrieveSchedules', function () {
        let schedules
        beforeEach(() => {
            schedules = [
                {
                    owner: { ref: (new ObjectId()).toString(), name: 'owner' },
                    attendee: { ref: reqMock.userId, name: 'attendee' },
                    service: 'service',
                    address: 'address',
                    time: {
                        start: new Date('2020-01-01T01:00:00.000Z'),
                        end: new Date('2020-01-01T02:00:00.000Z')
                    },
                },
                {
                    owner: { ref: (new ObjectId()).toString(), name: 'owner' },
                    service: 'service',
                    address: 'address',
                    time: {
                        start: new Date('2020-01-01T01:00:00.000Z'),
                        end: new Date('2020-01-01T02:00:00.000Z')
                    },
                }
            ]
            modelMock.objList = schedules
        })

        it('Should retrieve schedules', async function () {
            await controller.retrieveSchedules(reqMock, resMock)
            assert.equal(resMock.code, 200)
            assert.equal(resMock.message.length, 2)
        })
    })

    describe('#retrieveSchedule', function () {
        let schedule
        beforeEach(() => {
            schedule = {
                owner: { ref: (new ObjectId()).toString(), name: 'owner' },
                attendee: { ref: reqMock.userId, name: 'attendee' },
                service: 'service',
                address: 'address',
                time: {
                    start: new Date('2020-01-01T01:00:00.000Z'),
                    end: new Date('2020-01-01T02:00:00.000Z')
                },
            }
            modelMock.objList = [schedule]
        })

        it('Should retrieve schedule', async function () {
            await controller.retrieveSchedule(reqMock, resMock)
            assert.equal(resMock.code, 200)
            assert.equal(resMock.message?.owner?.ref, schedule.owner.ref)
            assert.equal(resMock.message?.owner?.name, schedule.owner.name)
            assert.equal(resMock.message?.attendee?.ref, reqMock.userId)
            assert.equal(resMock.message?.service, schedule.service)
            assert.equal(resMock.message?.address, schedule.address)
            assert.equal(resMock.message?.time?.start, schedule.time.start)
            assert.equal(resMock.message?.time?.end, schedule.time.end)
        })

        it('Should return 400 if id is invalid', async function () {
            reqMock.params = { id: 'invalidId' }
            modelMock.findOne = async function (params) {
                throw new CastError('Invalid id.')
            }
            await controller.retrieveSchedule(reqMock, resMock)
            assert.equal(resMock.code, 400)
        })

        it('Should return 404 if schedule is not found', async function () {
            modelMock.objList = []
            await controller.retrieveSchedule(reqMock, resMock)
            assert.equal(resMock.code, 404)
        })
    })

    describe('#cancelSchedule', function () {
        let schedule
        beforeEach(() => {
            schedule = {
                owner: { ref: (new ObjectId()).toString(), name: 'owner' },
                attendee: { ref: reqMock.userId, name: 'attendee' },
                service: 'service',
                address: 'address',
                time: {
                    start: new Date('2020-01-01T01:00:00.000Z'),
                    end: new Date('2020-01-01T02:00:00.000Z')
                },
            }
            modelMock.objList = [schedule]
        })

        it('Should cancel schedule', async function () {
            await controller.cancelSchedule(reqMock, resMock)
            assert.equal(resMock.code, 200)
            assert.equal(resMock.message?.owner?.ref, schedule.owner.ref)
            assert.equal(resMock.message?.owner?.name, schedule.owner.name)
            assert.equal(resMock.message?.attendee?.ref, reqMock.userId)
            assert.equal(resMock.message?.service, schedule.service)
            assert.equal(resMock.message?.address, schedule.address)
            assert.equal(resMock.message?.time?.start, schedule.time.start)
            assert.equal(resMock.message?.time?.end, schedule.time.end)
            assert.equal(resMock.message?.canceled, true)
        })

        it('Should return 400 if id is invalid', async function () {
            reqMock.params = { id: 'invalidId' }
            modelMock.findOne = async function (params) {
                throw new CastError('Invalid id.')
            }
            await controller.cancelSchedule(reqMock, resMock)
            assert.equal(resMock.code, 400)
        })

        it('Should return 404 if schedule is not found', async function () {
            modelMock.objList = []
            await controller.cancelSchedule(reqMock, resMock)
            assert.equal(resMock.code, 404)
        })
    })
})