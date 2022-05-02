import { Action, InputType } from '@projectstorm/react-canvas-core'

import { NodeModel } from '@projectstorm/react-diagrams'
import { DefaultLinkModel, DefaultNodeModel } from '@projectstorm/react-diagrams-defaults'
import { emptyArray } from 'utils/constants'
import { getLinksArray } from '../builderHandler'

/**
 * Handles delete actions.
 */
export default class DeleteAction extends Action {
  constructor() {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (this.engine.getModel().isLocked()) return
        if (this.matchesInput(event)) {
          event.preventDefault()
          this.handleAction()
        }
      }
    })
  }

  matchesInput = event => event.code === 'Delete'

  handleAction = () => {
    const entities = this.engine.getModel().getSelectedEntities()

    this.fireEvent(entities)

    entities.forEach(model => model.remove())

    this.engine.repaintCanvas()
  }

  /**
   * Event is fired to be on the command manager, so the user can undo
   * and redo it.
   */
  fireEvent = entities => {
    // All selected nodes
    const nodes = entities.filter(model => model instanceof DefaultNodeModel || model instanceof NodeModel)
    // All selected links
    const selectedLinks = entities.filter(model => model instanceof DefaultLinkModel)
    // All links from selected nodes
    const nodesLinks = nodes?.flatMap(n => getLinksArray('all', n)) || emptyArray

    //All links to be removed
    const links = [...nodesLinks, ...selectedLinks]
    this.engine.fireEvent({ nodes, links }, 'entitiesRemoved')
  }
}
