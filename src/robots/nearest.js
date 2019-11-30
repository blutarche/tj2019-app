const _ = require('lodash')
const { getDistance, getManhattanDistance } = require('../utils/position')
const { positionSchema, getRobotMemory } = require('./position')
const { getRobotId } = require('../utils/robotId')
const { calculateClosestPair } = require('../utils/closestPair')
const Joi = require('joi')

const findNearest = (req, res) => {
  const schema = Joi.object().keys({
    ref_position: positionSchema,
    metric: Joi.string().valid('euclidean', 'manhattan')
  })
  const result = Joi.validate(req.body, schema)
  if (result.error) {
    const err = result.error
    res.status(400).send({ message: err.message })
    return
  }
  const { ref_position, metric } = req.body
  const robots = getRobotMemory()
  const nearest = _.reduce(
    robots,
    (result, robot, robotId) => {
      const dist =
        metric === 'manhattan'
          ? getManhattanDistance(robot.position, ref_position)
          : getDistance(robot.position, ref_position)
      const robotIdNumber = getRobotId(robotId)
      if (result.distance === -1 || dist < result.distance) {
        return {
          distance: dist,
          id: robotIdNumber
        }
      } else if (dist === result.distance && robotIdNumber < result.id) {
        return {
          distance: dist,
          id: robotIdNumber
        }
      }
      return result
    },
    {
      distance: -1,
      id: -1
    }
  )
  if (nearest.id === -1) {
    res.send({
      robot_ids: []
    })
    return
  }
  res.send({
    robot_ids: [nearest.id]
  })
}

const getClosestPair = (req, res) => {
  const robots = getRobotMemory()
  const keys = Object.keys(robots)
  if (keys.length < 2) {
    res.status(424).send({ message: 'insufficient data' })
  }
  const positions = _.map(robots, r => r.position)
  const closestDistance = calculateClosestPair(positions)
  if (_.isUndefined(closestDistance) || _.isNull(closestDistance)) {
    res.status(424).send({ message: 'insufficient data' })
  }
  res.send({
    distance: closestDistance
  })
}

exports.findNearest = findNearest
exports.getClosestPair = getClosestPair
