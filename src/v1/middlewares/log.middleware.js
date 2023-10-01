function logMiddleware() {

  function logRequest(req, res, next) {
    console.log(`[${(new Date()).toJSON()}] Request: ${req.method} ${req.url}`)
    next()
  }

  return {
    logRequest
  }
}

module.exports = logMiddleware