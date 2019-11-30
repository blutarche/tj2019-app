const _ = require('lodash')
const { getDistance } = require('../utils/position')
const { positionSchema, getRobotPositionMemory } = require('./position')
const Joi = require('joi')

const findNearest = (req, res) => {
  const schema = Joi.object().keys({
    ref_position: positionSchema
  })
  const result = Joi.validate(req.body, schema)
  if (result.error) {
    const err = result.error
    res.status(400).send({ message: err.message })
    return
  }
  const { ref_position } = req.body
  const robotPositions = getRobotPositionMemory()
  const nearest = _.reduce(
    robotPositions,
    (result, robot, robotId) => {
      const dist = getDistance(robot.position, ref_position)
      if (result.distance === -1 || dist < result.distance) {
        return {
          distance: dist,
          id: robotId
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
exports.findNearest = findNearest
