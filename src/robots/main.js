const express = require('express')
const { postDistance } = require('./postDistance')

const router = express.Router()
router.post('/distance', express.json(), postDistance)

exports.router = router
