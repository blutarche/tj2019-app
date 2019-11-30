const _ = require('lodash')

const cross = (O, A, B) => {
  return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x)
}
const convexHull = (positions = []) => {
  const n = positions.length
  let k = 0
  const H = []
  const P = _.sortBy(positions, ['x', 'y'])
  for (let i = 0; i < n; ++i) {
    while (k >= 2 && cross(H[k - 2], H[k - 1], P[i]) <= 0) k--
    H[k++] = P[i]
  }
  for (let i = n - 2, t = k + 1; i >= 0; i--) {
    while (k >= t && cross(H[k - 2], H[k - 1], P[i]) <= 0) k--
    H[k++] = P[i]
  }
  return H.slice(0, k - 1)
}

exports.convexHull = convexHull
