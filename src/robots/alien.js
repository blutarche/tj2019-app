const _ = require('lodash')
const Joi = require('joi')
const { calculateThreeCircleIntersection } = require('../utils/position')
const { getRobotId } = require('../utils/robotId')
const { regexAlienId, validateAlienId } = require('../utils/alienId')
const { getRobotById } = require('./position')

const alienMemory = {}
const postReportAlienPosition = (req, res) => {
  const schema = Joi.object().keys({
    robot_id: Joi.number()
      .strict()
      .integer()
      .min(1)
      .max(999999)
      .required(),
    distance: Joi.number()
      .strict()
      .required()
  })
  const result = Joi.validate(req.body, schema)
  if (result.error) {
    const err = result.error
    res.status(400).send({ message: err.message })
    return
  }
  const { objectDNA } = req.params
  if (!validateAlienId(objectDNA)) {
    res.status(400).send({ message: 'object_dna not valid' })
    return
  }
  const { robot_id, distance } = req.body
  const robot = getRobotById(robot_id)
  if (!robot) {
    res.status(400).send({ message: 'robot not found' })
    return
  }
  if (!alienMemory[objectDNA]) {
    alienMemory[objectDNA] = []
  }
  const alien = alienMemory[objectDNA]
  const existed = _.some(alien, report => {
    return report.x === robot.position.x && report.y === robot.position.y
  })
  if (!existed) {
    alienMemory[objectDNA].push({
      x: robot.position.x,
      y: robot.position.y,
      distance: distance
    })
  }
  res.sendStatus(200)
}
const getAlienPosition = (req, res) => {
  const { objectDNA } = req.params
  if (!validateAlienId(objectDNA)) {
    res.status(424).send({ message: 'object_dna not valid' })
    return
  }
  if (!alienMemory[objectDNA]) {
    res.status(424).send({ message: 'object_dna not valid' })
    return
  }
  const reports = alienMemory[objectDNA] || []
  if (reports.length < 3) {
    res.status(424).send({ message: 'insufficient data' })
    return
  }
  const r1 = reports[0]
  const r2 = reports[1]
  const r3 = reports[2]
  const position = calculateThreeCircleIntersection(
    r1.x,
    r1.y,
    r1.distance,
    r2.x,
    r2.y,
    r2.distance,
    r3.x,
    r3.y,
    r3.distance
  )
  if (!position) {
    res.status(424).send({ message: 'insufficient data' })
    return
  }
  res.send({ position })
}

exports.postReportAlienPosition = postReportAlienPosition
exports.getAlienPosition = getAlienPosition
