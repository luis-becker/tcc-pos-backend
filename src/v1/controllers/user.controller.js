
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
  
    return {
        createUser
    }
  }
  
  module.exports = userController