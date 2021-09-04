import { LinkModel, NodeModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'features/designer/constants/SystemTasksConfig'
import { equals, not } from 'ramda'
import { WORKFLOW_QUERY } from '../edit/queries/WorkflowQuery'
import { WORKFLOW_LIST_QUERY } from '../list/queries/WorkflowListQuery'

export const updateCacheList = (cache, variables, newList) => {
  cache.writeQuery({
    query: WORKFLOW_LIST_QUERY,
    data: {
      getAll: newList
    },
    variables
  })
}

export const updateCacheDetail = (cache, variables, newItem) => {
  cache.writeQuery({
    query: WORKFLOW_QUERY,
    data: {
      getWorkflow: newItem
    },
    variables
  })
}

export const cloneSelection = (engine, selectedItems) => {
  let offset = { x: 100, y: 100 }
  let model = engine.getModel()

  let itemMap = {}
  selectedItems
    ?.filter(x => not(equals(nodeConfig.END.type, x?.type) || equals(nodeConfig.START.type, x?.type)))
    .forEach(item => {
      let newItem = item.clone(itemMap)

      // offset the nodes slightly
      if (newItem instanceof NodeModel) {
        newItem.inputs.taskReferenceName = 'Copy_' + hash()
        newItem.setPosition(newItem.getX() + offset.x, newItem.getY() + offset.y)
        model.addNode(newItem)
      } else if (newItem instanceof LinkModel) {
        // offset the link points
        newItem.getPoints().forEach(p => {
          p.setPosition(p.getX() + offset.x, p.getY() + offset.y)
        })
        model.addLink(newItem)
      }
      newItem.setSelected(false)
    })
  engine.repaintCanvas()
}
