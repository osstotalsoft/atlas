import { Point } from '@projectstorm/geometry'

const getRelativePoint = (point, model) => {
  const zoomLevelPercentage = model.getZoomLevel() / 100
  const engineOffsetX = model.getOffsetX() / zoomLevelPercentage
  const engineOffsetY = model.getOffsetY() / zoomLevelPercentage

  return new Point(point.x - engineOffsetX, point.y - engineOffsetY)
}

const nextLinkPosition = (event, model, initialRelative, sourcePosition) => {
  const point = getRelativePoint(sourcePosition, model)

  const zoomLevelPercentage = model.getZoomLevel() / 100
  const initialXRelative = initialRelative.x / zoomLevelPercentage
  const initialYRelative = initialRelative.y / zoomLevelPercentage

  const linkNextX = point.x + (initialXRelative - sourcePosition.x) + event.virtualDisplacementX
  const linkNextY = point.y + (initialYRelative - sourcePosition.y) + event.virtualDisplacementY

  return new Point(linkNextX, linkNextY)
}

export default function handleLinkDrag(event, link) {
  const first = link.getFirstPoint().getPosition()
  const next = nextLinkPosition(event, this.engine.getModel(), { x: this.initialXRelative, y: this.initialYRelative }, first)

  link.getLastPoint().setPosition(next.x, next.y)

  this.engine.repaintCanvas()
}
