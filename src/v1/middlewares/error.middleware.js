function errorMiddleware() {

    async function stdError(req, res, next) {
        try {
            await next()
        }
        catch(err) {
            console.log(err)
            res.status(500).send('Service Unavailable')
          }
    }
  
    return {
        stdError
    }
  }
  
  module.exports = errorMiddleware