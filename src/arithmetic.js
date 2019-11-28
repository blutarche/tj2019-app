const express = require('express')
const _ = require('lodash')
const { DECIMAL_PLACES } = require('./const')

const operate = (left, operator, right) => {
  switch (operator) {
    case '+':
      return left + right
    case '-':
      return left - right
    case '*':
      return left * right
    case '/':
      return left / right
    default:
      throw new Error('Operator not valid')
  }
}

const add = (req, res) => {
  const { a, b } = req.body
  res.send({ result: a + b })
}

let mem = {}
const variable = (req, res) => {
  const { name } = req.params
  const { value } = req.body
  const numberValue = _.toNumber(value)
  if (_.isNaN(numberValue)) {
    res.status(400).send('Invalid value')
    return
  }
  mem[name] = numberValue
  res.sendStatus(201)
}
const getVariable = (req, res) => {
  const { name } = req.params
  const value = _.toNumber(mem[name])
  if (_.isNaN(value)) {
    res.status(400).send('No variable')
    return
  }
  res.status(200).send({ value: value.toFixed(DECIMAL_PLACES) })
}

const calc = (req, res) => {
  const { expression } = req.body
  if (!expression || typeof expression !== 'string') {
    res.sendStatus(400)
  }
  const [left, operator, right] = expression.split(' ')
  let leftVal = _.toNumber(left)
  let rightVal = _.toNumber(right)

  if (_.isNaN(leftVal)) {
    leftVal = mem[left]
  }
  if (_.isNaN(rightVal)) {
    rightVal = mem[right]
  }
  if (_.isNaN(leftVal)) {
    res.status(400).send('Invalid left operand')
    return
  }
  if (_.isNaN(rightVal)) {
    res.status(400).send('Invalid right operand')
    return
  }
  try {
    const result = operate(leftVal, operator, rightVal)
    res.send({
      result: result.toFixed(DECIMAL_PLACES)
    })
  } catch (err) {
    res.status(400).send(err.message)
  }
}

const router = express.Router()
router.post('/add', express.json(), add)
router.post('/calc', express.json(), calc)
router.put('/variable/:name', express.json(), variable)
router.get('/variable/:name', express.json(), getVariable)
exports.router = router
