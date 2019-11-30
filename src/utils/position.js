exports.getDistance = (pos1, pos2) => {
  const diffX = pos1.x - pos2.x
  const diffY = pos1.y - pos2.y
  return Math.sqrt(diffX * diffX + diffY * diffY)
}
