import { Point } from '@projectstorm/geometry'
import { Action, InputType, AbstractDisplacementState } from '@projectstorm/react-canvas-core'
import { NodeModel } from '@projectstorm/react-diagrams'
import { DefaultNodeModel } from '@projectstorm/react-diagrams-defaults'

function getMainLink(port) {
  const links = Object.values(port.getLinks())
  return links.length > 0 ? links[0] : null
}

function getAllLinks(node) {
  return Object.values(node.getPorts())
    .map(getMainLink)
    .filter(link => !!link)
}

/**
 * This State handles node moving.
 *
 * When nodes are moved, all of its links need to be rearranged.
 */
export default class MoveItemsState extends AbstractDisplacementState {
  constructor() {
    super({
      name: 'move-items'
    })

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          this.lastDisplacement = new Point(0, 0)

          if (this.engine.getModel().isLocked()) return
          this.element = this.engine.getActionEventBus().getModelForEvent(event)

          if (!this.element) {
            this.eject()
            return
          }

          if (!this.element.isSelected()) {
            this.engine.getModel().clearSelection()
          }

          this.element.setSelected(true)
          this.engine.repaintCanvas()

          this.nodesBefore = this.getNodesPositions()
          this.linksBefore = this.getLinksPoints()
        }
      })
    )

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: () => {
          if (this.lastDisplacement.x === 0 && this.lastDisplacement.y === 0) {
            return
          }

          this.fireEvent()
        }
      })
    )
  }

  getNodesPositions = () =>
    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(model => Object.getPrototypeOf(model) instanceof NodeModel || Object.getPrototypeOf(model) instanceof DefaultNodeModel)
      .map(node => ({
        id: node.getID(),
        position: node.getPosition()
      }))

  getLinksPoints = () =>
    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(model => Object.getPrototypeOf(model) instanceof NodeModel || Object.getPrototypeOf(model) instanceof DefaultNodeModel)
      .map(getAllLinks)
      .flat()
      .map(link => ({
        id: link.getID(),
        points: link.getPoints().map(point => point.getPosition())
      }))
  /**
   * Event is fired to be on the command manager, so the user can undo
   * and redo it.
   */
  fireEvent() {
    this.engine.fireEvent(
      {
        nodes: {
          before: this.nodesBefore,
          after: this.getNodesPositions()
        },
        links: {
          before: this.linksBefore,
          after: this.getLinksPoints()
        }
      },
      'entitiesMoved'
    )
  }

  activated(previous) {
    super.activated(previous)
    this.initialPositions = {}
  }

  /**
   * Gets all links from a given node.
   */
  getLinksFromNode(node) {
    if (!(Object.getPrototypeOf(node) instanceof NodeModel || Object.getPrototypeOf(node) instanceof DefaultNodeModel)) return []

    return Object.values(node.getPorts())
      .map(p => Object.entries(p.getLinks()))
      .filter(entry => entry.length > 0)
      .flat()
  }

  fireMouseMoved(event) {
    // Allow moving only with left clicks
    if (event.event.nativeEvent.which !== 1) return

    const currentDisplacement = new Point(event.virtualDisplacementX, event.virtualDisplacementY)
    this.lastDisplacement = currentDisplacement

    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(entity => Object.getPrototypeOf(entity) instanceof NodeModel || Object.getPrototypeOf(entity) instanceof DefaultNodeModel)
      .forEach(entity => this.moveEntity(entity, event))

    this.engine.repaintCanvas()
  }

  moveEntity(entity, event) {
    if (!this.initialPositions[entity.getID()]) {
      this.initialPositions[entity.getID()] = {
        point: entity.getPosition(),
        item: entity
      }
    }

    const initial = this.initialPositions[entity.getID()].point
    const model = this.engine.getModel()

    entity.setPosition(
      model.getGridPosition(initial.x + event.virtualDisplacementX),
      model.getGridPosition(initial.y + event.virtualDisplacementY)
    )
  }
}
