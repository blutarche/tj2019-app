const _ = require('lodash')
const { getDistance, getManhattanDistance } = require('../utils/position')
const { checkRobotIdValid } = require('../utils/robotId')
const Joi = require('joi')

const positionSchema = Joi.object().keys({
  x: Joi.number()
    .strict()
    .integer()
    .min(-1000000000)
    .max(1000000000)
    .required(),
  y: Joi.number()
    .strict()
    .integer()
    .min(-1000000000)
    .max(1000000000)
    .required()
})
let robotPosition = {}
const regexRobotId = /^robot[#]([1-9][0-9]*)$/
const postDistance = (req, res) => {
  const schema = Joi.object().keys({
    first_pos: Joi.alternatives()
      .try(
        positionSchema,
        Joi.string()
          .regex(regexRobotId)
          .required()
      )
      .required(),
    second_pos: Joi.alternatives()
      .try(
        positionSchema,
        Joi.string()
          .regex(regexRobotId)
          .required()
      )
      .required(),
    metric: Joi.string().valid('euclidean', 'manhattan')
  })
  const result = Joi.validate(req.body, schema)
  if (result.error) {
    const err = result.error
    res.status(400).send({ message: err.message })
    return
  }
  const { first_pos, second_pos, metric } = req.body
  let pos1 = first_pos
  let robotId1
  if (typeof first_pos === 'string') {
    robotId1 = first_pos.replace('robot#', '')
    pos1 = robotPosition[robotId1]
  }
  let pos2 = second_pos
  let robotId2
  if (typeof second_pos === 'string') {
    robotId2 = second_pos.replace('robot#', '')
    pos2 = robotPosition[robotId2]
  }
  if (!pos1 || !pos2) {
    res.sendStatus(424)
    return
  }
  res.send({
    distance:
      metric === 'manhattan'
        ? getManhattanDistance(pos1, pos2)
        : getDistance(pos1, pos2)
  })
}

const putRobotPosition = (req, res) => {
  const schema = Joi.object().keys({
    position: positionSchema.required()
  })
  const result = Joi.validate(req.body, schema)
  if (result.error) {
    const err = result.error
    res.status(400).send({ message: err.message })
  }
  const { robotId } = req.params
  if (!checkRobotIdValid(robotId)) {
    res.status(400).send({ message: 'robotId invalid' })
  }
  const { position } = req.body
  robotPosition[robotId] = position
  res.status(204).send({
    position
  })
}

const getRobotPosition = (req, res) => {
  const { robotId } = req.params
  if (!checkRobotIdValid(robotId)) {
    res.status(404).send({ message: 'robotId invalid' })
  }
  if (!robotPosition[robotId]) return res.sendStatus(404)
  res.send({
    position: robotPosition[robotId]
  })
}

exports.postDistance = postDistance
exports.putRobotPosition = putRobotPosition
exports.getRobotPosition = getRobotPosition
