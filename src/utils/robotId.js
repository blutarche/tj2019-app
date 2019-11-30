const _ = require('lodash')

exports.getRobotId = robotId => {
  const robotIdAsNumber = _.toNumber(robotId)
  if (_.isNaN(robotIdAsNumber)) {
    return null
  }
  if (robotIdAsNumber < 1 || 999999 < robotIdAsNumber) {
    return null
  }
  return robotIdAsNumber
}
