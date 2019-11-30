const Joi = require('joi')

const MAX = 1000000000
exports.xyPositionSchema = Joi.object().keys({
  x: Joi.number()
    .strict()
    .integer()
    .min(-MAX)
    .max(MAX)
    .required(),
  y: Joi.number()
    .strict()
    .integer()
    .min(-MAX)
    .max(MAX)
    .required()
})
exports.northWestPositionSchema = Joi.object().keys({
  north: Joi.number()
    .strict()
    .integer()
    .min(0)
    .max(MAX)
    .required(),
  west: Joi.number()
    .strict()
    .integer()
    .min(0)
    .max(MAX)
    .required()
})

exports.northEastPositionSchema = Joi.object().keys({
  north: Joi.number()
    .strict()
    .integer()
    .min(0)
    .max(MAX)
    .required(),
  east: Joi.number()
    .strict()
    .integer()
    .min(0)
    .max(MAX)
    .required()
})

exports.southWestPositionSchema = Joi.object().keys({
  south: Joi.number()
    .strict()
    .integer()
    .min(0)
    .max(MAX)
    .required(),
  west: Joi.number()
    .strict()
    .integer()
    .min(0)
    .max(MAX)
    .required()
})

exports.southEastPositionSchema = Joi.object().keys({
  south: Joi.number()
    .strict()
    .integer()
    .min(0)
    .max(MAX)
    .required(),
  east: Joi.number()
    .strict()
    .integer()
    .min(0)
    .max(MAX)
    .required()
})
