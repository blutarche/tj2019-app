const regexAlienId = /^[a-z]{16}$/
exports.regexAlienId = regexAlienId
exports.validateAlienId = id => {
  return regexAlienId.test(id)
}
