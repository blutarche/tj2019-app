const express = require('express')

const add = (req, res) => {
  const { a, b } = req.body
  res.send({ result: a + b })
}

const router = express.Router()
router.post('/add', express.json(), add)
exports.router = router
