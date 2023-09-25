const express = require('express')

const v1AuthRouter = require("./v1/routes/authRoutes")

const dbConnector = require('./v1/utils/dbConnector')

const app = express()
const port = 3000

app.use(express.json())

app.use("/api/v1/auth", v1AuthRouter)

dbConnector.connect().then(()=>{
  app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
})