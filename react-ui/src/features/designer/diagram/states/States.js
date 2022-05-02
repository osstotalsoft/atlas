import { State, Action, InputType } from '@projectstorm/react-canvas-core'
import { PointModel } from '@projectstorm/react-diagrams-core'
import { DefaultPortModel } from '@projectstorm/react-diagrams-defaults'
import { samePosition } from './common'
import DragCanvasState from './DragCanvasState'
import DragNewLinkState from './DragNewLinkState'
import MoveItemsState from './MoveItemsState'
import SelectingState from './SelectingState'

/**
 * This class defines custom handlers (called states) to respond to
 * clicking events on certain elements.
 */

function isLastPoint(element) {
  const points = element.getParent().getPoints()
  return samePosition(points[points?.length - 1].position, element?.position)
}
export default class States extends State {
  constructor() {
    super({
      name: 'diagram-states'
    })

    this.childStates = [new SelectingState()]
    this.dragCanvas = new DragCanvasState()
    this.dragNewLink = new DragNewLinkState()
    this.dragItems = new MoveItemsState()

    // Determine what was clicked on
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          const element = this.engine.getActionEventBus().getModelForEvent(event)
          // The canvas was clicked on, transition to the dragging canvas state
          if (!element) {
            this.transitionWithEvent(this.dragCanvas, event)
          }
          // Initiate dragging a new link
          else if (element instanceof DefaultPortModel || (element instanceof PointModel && element.getParent() && isLastPoint(element))) {
            this.transitionWithEvent(this.dragNewLink, event)
          }
          // Move items
          else {
            this.transitionWithEvent(this.dragItems, event)
          }
        }
      })
    )
  }
}
