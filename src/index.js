const express = require('express')
const cors = require('cors')
const { router: robotRouter } = require('./robots/main')
const { router: privateRouter } = require('./private/main')

const app = express()
app.use(cors())
const port = process.env.PORT || 4000

app.use('/', robotRouter)
app.use('/private', privateRouter)

app.listen(port, () => {
  console.log(`🚀 Listening on port ${port}`)
})
