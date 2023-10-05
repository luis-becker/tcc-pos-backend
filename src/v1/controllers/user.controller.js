
function userController(userService) {
  
    async function createUser(req, res) {
        const user = req.body
        if(!user || !user.email) {
            res.status(400).send('Missing required field: email.')
            return
        } 
        if(user.email != req.email) {
            res.status(401).send('New user email does not match logged user email.')
            return
        }
        const response = await userService.createUser(user)
        if(response.error) {
            response.error == 'User already exists.' ? res.status(409) : res.status(500)
            res.send(response.error)
            return
        }
        res.status(201).send(response.user)
        return
    }

    async function retrieveUser(req, res) {
        const email = req.email
        if(!email) {
            res.status(400).send('Missing required field: email.')
            return
        }
        const user = await userService.retrieveUser(email)
        if(!user) {
            res.status(404).send('User not found.')
            return
        }
        res.status(200).send(user)
        return
    }

    async function updateUser(req, res) {
        const email = req.email
        let user = req.body
        if(!user.email) {
            res.status(400).send('Missing required field: email.')
            return
        }
        if(user.email != req.email) {
            res.status(401).send('User to update email does not match logged user email.')
            return
        }
        user = await userService.updateUser(user)
        if(!user) {
            res.status(404).send('User not found.')
            return
        }
        res.status(200).send(user)
        return
    }
  
    return {
        createUser,
        retrieveUser,
        updateUser
    }
  }
  
  module.exports = userController