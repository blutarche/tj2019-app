const _ = require('lodash')
const { getDistance } = require('./position')

const bruteForce = (positions = []) => {
  let min = -1
  const n = positions.length
  for (let i = 0; i < n; ++i)
    for (let j = i + 1; j < n; ++j)
      if (min === -1 || getDistance(positions[i], positions[j]) < min)
        min = getDistance(positions[i], positions[j])

  return min
}

const stripClosest = (positions = [], d) => {
  let min = d
  const size = positions.length
  const strip = _.sortBy(positions, ['x', 'y'])

  for (let i = 0; i < size; ++i)
    for (let j = i + 1; j < size && strip[j].y - strip[i].y < min; ++j)
      if (min === -1 || getDistance(strip[i], strip[j]) < min)
        min = getDistance(strip[i], strip[j])

  return min
}

const closestUtil = (positions = []) => {
  const n = positions.length
  if (n <= 3) return bruteForce(positions)

  const mid = Math.floor(n / 2)
  const midPoint = positions[mid]

  const dl = closestUtil(positions.slice(0, mid))
  const dr = closestUtil(positions.slice(mid))

  const d = Math.min(dl, dr)

  const strip = []
  for (let i = 0; i < n; i++)
    if (Math.abs(positions[i].x - midPoint.x) < d) strip.push(positions[i])

  return Math.min(d, stripClosest(strip, d))
}

const calculateClosestPair = (positions = []) => {
  positions = _.sortBy(positions, ['x', 'y'])
  return closestUtil(positions, positions.length)
}
exports.calculateClosestPair = calculateClosestPair
