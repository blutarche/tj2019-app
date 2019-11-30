const _ = require('lodash')
const { getDistance } = require('../utils/position')
const Joi = require('joi')

const postDistance = (req, res) => {
  const schema = Joi.object().keys({
    first_pos: Joi.object().keys({
      x: Joi.number()
        .integer()
        .min(-1000000000)
        .max(1000000000),
      y: Joi.number()
        .integer()
        .min(-1000000000)
        .max(1000000000)
    }),
    second_pos: Joi.object().keys({
      x: Joi.number()
        .integer()
        .min(-1000000000)
        .max(1000000000),
      y: Joi.number()
        .integer()
        .min(-1000000000)
        .max(1000000000)
    })
  })
  const result = Joi.validate(req.body, schema)
  if (result.error) {
    const err = result.error
    res.status(400).send({ message: err.message })
  }
  const { first_pos, second_pos } = req.body
  return res.send({
    distance: getDistance(first_pos, second_pos)
  })
}

exports.postDistance = postDistance
