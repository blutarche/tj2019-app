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

const stripClosest = (strip = [], d) => {
  let min = d
  const size = strip.length
  // const strip = _.sortBy(positions, ['x', 'y'])

  for (let i = 0; i < size; ++i)
    for (let j = i + 1; j < size && strip[j].y - strip[i].y < min; ++j)
      if (min === -1 || getDistance(strip[i], strip[j]) < min)
        min = getDistance(strip[i], strip[j])

  return min
}

const closestUtil = (posXs = [], posYs = []) => {
  const n = posXs.length
  if (n <= 3) return bruteForce(posXs)

  const mid = Math.floor(n / 2)
  const midPoint = posXs[mid]

  const pyl = []
  const pyr = []
  for (let i = 0; i < n; i++) {
    if (posYs[i].x <= midPoint.x) pyl.push(posYs[i])
    else pyr.push(posYs[i])
  }

  const dl = closestUtil(posXs.slice(0, mid), pyl.slice(0, mid))
  const dr = closestUtil(posXs.slice(mid), pyr.slice(mid))

  const d = Math.min(dl, dr)

  const strip = []
  for (let i = 0; i < n; i++)
    if (Math.abs(posYs[i].x - midPoint.x) < d) strip.push(posYs[i])

  return Math.min(d, stripClosest(strip, d))
}

const calculateClosestPair = (positions = []) => {
  const posXs = _.sortBy(positions, ['x'])
  const posYs = _.sortBy(positions, ['y'])

  return closestUtil(posXs, posYs)
}
exports.calculateClosestPair = calculateClosestPair
