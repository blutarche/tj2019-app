const _ = require('lodash')
const {
  getDistance,
  getManhattanDistance,
  convertPosition
} = require('../utils/position')
const { regexRobotId, getRobotId } = require('../utils/robotId')
const Joi = require('joi')
const {
  xyPositionSchema,
  northWestPositionSchema,
  northEastPositionSchema,
  southWestPositionSchema,
  southEastPositionSchema
} = require('../utils/positionSchema')

let robotMemory = {}
const postDistance = (req, res) => {
  const schema = Joi.object().keys({
    first_pos: Joi.alternatives()
      .try(
        xyPositionSchema,
        northWestPositionSchema,
        northEastPositionSchema,
        southWestPositionSchema,
        southEastPositionSchema,
        Joi.string().regex(regexRobotId)
      )
      .required(),
    second_pos: Joi.alternatives()
      .try(
        xyPositionSchema,
        northWestPositionSchema,
        northEastPositionSchema,
        southWestPositionSchema,
        southEastPositionSchema,
        Joi.string().regex(regexRobotId)
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
    robotId1 = getRobotId(robotId1)
    pos1 = robotMemory[robotId1]
  }
  let pos2 = second_pos
  let robotId2
  if (typeof second_pos === 'string') {
    robotId2 = second_pos.replace('robot#', '')
    robotId2 = getRobotId(robotId2)
    pos2 = robotMemory[robotId2]
  }
  if (!pos1 || !pos2) {
    res.sendStatus(424)
    return
  }
  pos1 = convertPosition(pos1)
  pos2 = convertPosition(pos2)
  res.send({
    distance:
      metric === 'manhattan'
        ? getManhattanDistance(pos1, pos2)
        : getDistance(pos1, pos2)
  })
}

const putRobotPosition = (req, res) => {
  const schema = Joi.object().keys({
    position: Joi.alternatives()
      .try(
        xyPositionSchema,
        northWestPositionSchema,
        northEastPositionSchema,
        southWestPositionSchema,
        southEastPositionSchema
      )
      .required()
  })
  const result = Joi.validate(req.body, schema)
  if (result.error) {
    const err = result.error
    res.status(400).send({ message: err.message })
    return
  }
  const { robotId } = req.params
  const robotIdMapped = getRobotId(robotId)
  if (!robotIdMapped) {
    res.status(400).send({ message: 'robotId invalid' })
    return
  }
  const { position: unconvertedPos } = req.body
  const position = convertPosition(unconvertedPos)
  robotMemory[robotId] = { id: robotId, position }
  res.status(204).send({
    position
  })
}

const getRobotPosition = (req, res) => {
  const { robotId } = req.params
  const robotIdMapped = getRobotId(robotId)
  if (!robotIdMapped) {
    res.status(404).send({ message: 'robotId invalid' })
    return
  }
  if (!robotMemory[robotId] || !robotMemory[robotId].position) {
    res.sendStatus(404)
    return
  }
  res.send({
    position: robotMemory[robotId].position
  })
}

const getRobotMemory = () => robotMemory
const getRobotById = robotId => robotMemory[robotId]
exports.postDistance = postDistance
exports.putRobotPosition = putRobotPosition
exports.getRobotPosition = getRobotPosition
exports.getRobotMemory = getRobotMemory
exports.getRobotById = getRobotById
