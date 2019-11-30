const _ = require('lodash')
const { getDistance, getManhattanDistance } = require('../utils/position')
const { positionSchema, getRobotMemory } = require('./position')
const { getRobotId } = require('../utils/robotId')
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
  const robotPositions = getRobotMemory()
  console.log('TCL: findNearest -> robotPositions', robotPositions)
  const nearest = _.reduce(
    robotPositions,
    (result, robot, robotId) => {
      console.log('TCL: findNearest -> robot', robot)
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
      } else if (dist === result.distance && result.id < robotIdNumber) {
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
  console.log('TCL: findNearest -> nearest', nearest)
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
