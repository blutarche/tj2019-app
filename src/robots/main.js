const express = require('express')
const {
  postDistance,
  putRobotPosition,
  getRobotPosition
} = require('./position')
const { findNearest } = require('./nearest')

const router = express.Router()
router.post('/distance', express.json(), postDistance)
router.put('/robot/:robotId/position', express.json(), putRobotPosition)
router.get('/robot/:robotId/position', express.json(), getRobotPosition)
router.post('/nearest', express.json(), findNearest)

exports.router = router
