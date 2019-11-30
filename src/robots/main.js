const express = require('express')
const {
  postDistance,
  putRobotPosition,
  getRobotPosition
} = require('./position')
const { findNearest } = require('./nearest')
const { postReportAlienPosition, getAlienPosition } = require('./alien')

const router = express.Router()
router.post('/distance', express.json(), postDistance)
router.put('/robot/:robotId/position', express.json(), putRobotPosition)
router.get('/robot/:robotId/position', express.json(), getRobotPosition)
router.post('/nearest', express.json(), findNearest)
router.post('/alien/:objectDNA/report', express.json(), postReportAlienPosition)
router.get('/alien/:objectDNA/position', express.json(), getAlienPosition)

exports.router = router
