const express = require('express')
const {authRouter, dbConnector, logMiddleware, errorMiddleware} = require('./v1/config/dependencyInjection')

const app = express()
const port = 3000

app.use(express.json())
app.use(logMiddleware.logRequest)
app.use(errorMiddleware.stdError)

app.use("/api/v1/auth", authRouter)

dbConnector.connect().then(()=>{
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
})