const _ = require('lodash')

exports.checkRobotIdValid = robotId => {
  const robotIdAsNumber = _.toNumber(robotId)
  if (_.isNaN(robotIdAsNumber)) {
    return false
  }
  if (robotIdAsNumber < 1 || 999999 < robotIdAsNumber) {
    return false
  }
  return true
}
