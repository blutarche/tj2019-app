const _ = require('lodash')

exports.getDistance = (pos1, pos2) => {
  const diffX = pos1.x - pos2.x
  const diffY = pos1.y - pos2.y
  return Math.sqrt(diffX * diffX + diffY * diffY)
}

exports.getManhattanDistance = (pos1, pos2) => {
  const diffX = pos1.x - pos2.x
  const diffY = pos1.y - pos2.y
  return Math.abs(diffX) + Math.abs(diffY)
}

const EPSILON = 1e-2
exports.calculateThreeCircleIntersection = (
  x0,
  y0,
  r0,
  x1,
  y1,
  r1,
  x2,
  y2,
  r2
) => {
  let a, dx, dy, d, h, rx, ry
  let point2_x, point2_y

  /* dx and dy are the vertical and horizontal distances between
   * the circle centers.
   */
  dx = x1 - x0
  dy = y1 - y0

  /* Determine the straight-line distance between the centers. */
  d = Math.sqrt(dy * dy + dx * dx)

  /* Check for solvability. */
  if (d > r0 + r1) {
    /* no solution. circles do not intersect. */
    return false
  }
  if (d < Math.abs(r0 - r1)) {
    /* no solution. one circle is contained in the other */
    return false
  }

  /* 'point 2' is the point where the line through the circle
   * intersection points crosses the line between the circle
   * centers.
   */

  /* Determine the distance from point 0 to point 2. */
  a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d)

  /* Determine the coordinates of point 2. */
  point2_x = x0 + (dx * a) / d
  point2_y = y0 + (dy * a) / d

  /* Determine the distance from point 2 to either of the
   * intersection points.
   */
  h = Math.sqrt(r0 * r0 - a * a)

  /* Now determine the offsets of the intersection points from
   * point 2.
   */
  rx = -dy * (h / d)
  ry = dx * (h / d)

  /* Determine the absolute intersection points. */
  const intersectionPoint1_x = point2_x + rx
  const intersectionPoint2_x = point2_x - rx
  const intersectionPoint1_y = point2_y + ry
  const intersectionPoint2_y = point2_y - ry

  /* Lets determine if circle 3 intersects at either of the above intersection points. */
  dx = intersectionPoint1_x - x2
  dy = intersectionPoint1_y - y2
  const d1 = Math.sqrt(dy * dy + dx * dx)

  dx = intersectionPoint2_x - x2
  dy = intersectionPoint2_y - y2
  const d2 = Math.sqrt(dy * dy + dx * dx)

  if (Math.abs(d1 - r2) < EPSILON) {
    return {
      x: intersectionPoint1_x,
      y: intersectionPoint1_y
    }
  } else if (Math.abs(d2 - r2) < EPSILON) {
    return {
      x: intersectionPoint2_x,
      y: intersectionPoint2_y
    }
  }
  return null
}
