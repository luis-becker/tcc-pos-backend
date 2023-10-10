const express = require('express')
const {middlewares, routers} = require('./v1/config/dependencyTree')
const database = require('./v1/utils/mongooseConnector')
console.log(database)

const app = express()
const port = 3000

app.use(express.json())
app.use(middlewares.log.logRequest)
app.use(middlewares.error.stdError)

app.use('/api/v1/auth', routers.auth)
app.use('/api/v1/user', routers.user)
app.use('/api/v1/schedule', routers.schedule)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
