const { ValidationError, CastError } = require("mongoose").Error

function userController(userService) {
  
    async function createUser(req, res) {
        try {
            const user = await userService.createUser(req.body, req.email)
            res.status(201).send(user)
        } catch (err) {
            if (err instanceof ValidationError) res.status(400).send(err.message)
            else if (err.code === 11000) res.status(409).send('User already exists.')
            else res.status(500).send(err)
        }
    }

    async function retrieveUser(req, res) {
        try {
            const user = await userService.retrieveUserByEmail(req.email)
            if (!user) res.status(404).send('User not found.')
            else res.send(user)
        } catch (err) {
            res.status(500).send(err.message)
        }
    }

    async function updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.body, req.userId)
            if (!user) res.status(404).send('User not found.')
            else res.send(user)
        } catch (err) {
            if (err instanceof ValidationError) res.status(400).send(err.message)
            else res.status(500).send(err.message)
        }
    }

    async function retrieveUserById(req, res) {
        try {
            const user = await userService.retrieveUserById(req.params.id)
            if (!user) res.status(404).send('User not found.')
            else res.send(user)
        } catch (err) {
            if (err instanceof CastError) res.status(400).send('Invalid id.')
            else res.status(500).send(err.message)
        }
    }

    async function retrieveUserById(req, res) {
        const userId = req.params?.id
        if (!userId) {
            res.status(400).send('Missing required param: id.')
            return
        }
        const user = await userService.retrieveUserById(userId)
        if (!user) res.status(404).send('User not found.')
        else res.status(200).send(user)
        return
    }
  
    return {
        createUser,
        retrieveUser,
        updateUser,
        retrieveUserById
    }
  }
  
  module.exports = userController