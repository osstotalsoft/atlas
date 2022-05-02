import { AbstractDisplacementState, Action, InputType } from '@projectstorm/react-canvas-core'
import { DefaultPortModel, DefaultNodeModel } from '@projectstorm/react-diagrams-defaults'
import { NodeModel, PointModel } from '@projectstorm/react-diagrams'
import { nearby } from './common'
import handleLinkDrag from './handleLinkDrag'

export default class DragNewLinkState extends AbstractDisplacementState {
  constructor() {
    super({ name: 'drag-new-link' })

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          if (this.engine.getModel().isLocked()) return
          this.moveDirection = undefined
          this.hasStartedMoving = false

          this.element = this.engine.getMouseElement(event.event)

          if (this.element instanceof PointModel) {
            this.link = this.element.getParent()
            this.port = this.link.sourcePort
          } else {
            this.port = this.element
            this.link = this.port.createLinkModel()
          }

          if (!this.link) {
            this.eject()
            return
          }

          this.link.setSelected(true)
          this.link.setSourcePort(this.port)
          this.port.addLink(this.link)
          this.engine.getModel().clearSelection()
          this.engine.getModel().addLink(this.link)
          this.port.reportPosition()
        }
      })
    )

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: event => {
          if (this.engine.getModel().isLocked()) return
          const model = this.engine.getMouseElement(event.event)
          // Disallows creation under nodes
          if (
            Object.getPrototypeOf(model) instanceof NodeModel ||
            Object.getPrototypeOf(model) instanceof DefaultNodeModel ||
            this.isNearbySourcePort(event.event)
          ) {
            this.link.remove()
            this.engine.repaintCanvas()
          }

          // Link connecting to port
          if (model instanceof DefaultPortModel && this.port.canLinkToPort(model)) {
            this.link.setTargetPort(model)
            model.reportPosition()
            this.engine.repaintCanvas()
            this.fireEvent()
            return
          }

          this.fireEvent()
        }
      })
    )
  }

  fireEvent = () => {
    this.engine.fireEvent({ link: this.link }, 'linkAdded')
  }

  isNearbySourcePort(event) {
    if (this.engine.getModel().isLocked()) return
    const point = this.engine.getRelativeMousePoint(event)

    const sourcePort = this.link.getSourcePort()
    const sourcePortSize = sourcePort.width
    const sourcePortPosition = sourcePort.getPosition()

    return nearby(point, sourcePortPosition, sourcePortSize)
  }

  /**
   * Updates link's points upon mouse move.
   */
  fireMouseMoved(event) {
    if (this.engine.getModel().isLocked()) return
    handleLinkDrag.call(this, event, this.link)
  }
}
