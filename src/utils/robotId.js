const _ = require('lodash')

const regexRobotId = /^robot[#]([1-9][0-9]*)$/
exports.regexRobotId = regexRobotId
const regexRobotOnlyID = /^[1-9][0-9]*$/
exports.getRobotId = robotId => {
  if (!regexRobotOnlyID.test(robotId)) return null
  const robotIdAsNumber = _.toNumber(robotId)
  if (_.isNaN(robotIdAsNumber)) {
    return null
  }
  if (robotIdAsNumber < 1 || 999999 < robotIdAsNumber) {
    return null
  }
  return robotIdAsNumber
}
