const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
const port = process.env.PORT || 4000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => {
  console.log(`🚀 Listening on port ${port}`)
})
