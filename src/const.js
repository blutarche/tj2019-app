const _ = require('lodash')
exports.DECIMAL_PLACES = process.env.DECIMAL_PLACES
  ? _.toNumber(process.env.DECIMAL_PLACES)
  : 4
