import { LinkModel, NodeModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'utils/functions'
import { equals, not, keys, clone, includes } from 'ramda'
import { isJsonString } from 'utils/functions'
import { WORKFLOW_LIST_QUERY } from '../list/queries/WorkflowListQuery'
import { emptyArray } from 'utils/constants'

export const updateCacheList = (cache, newItem) => {
  const existingWorkflows = cache.readQuery({
    query: WORKFLOW_LIST_QUERY
  })

  const newCollection = [newItem, ...(existingWorkflows?.getWorkflowList || emptyArray)]
  cache.writeQuery({
    query: WORKFLOW_LIST_QUERY,
    data: {
      getWorkflowList: newCollection
    }
  })
}

export const deleteFromCacheList = (cache, deleteName) => {
  const existingWorkflows = cache.readQuery({
    query: WORKFLOW_LIST_QUERY
  })

  const newCollection = existingWorkflows?.getWorkflowList.filter(x => x.name !== deleteName)
  cache.writeQuery({
    query: WORKFLOW_LIST_QUERY,
    data: {
      getWorkflowList: newCollection
    }
  })
}

export const cloneSelection = (engine, selectedItems) => {
  let offset = { x: 100, y: 100 }
  const model = engine.getModel()

  let itemMap = {}
  const itemsCloned = []
  selectedItems
    ?.filter(x => not(equals(nodeConfig.END.type, x?.type) || equals(nodeConfig.START.type, x?.type)))
    .forEach(item => {
      let newItem = item.clone(itemMap)
      itemsCloned.push(newItem)

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
  engine.fireEvent({ itemsCloned }, 'selectionCloned')
  engine.repaintCanvas()
}

export const parseObjectParameters = (inputs, skipList = []) => {
  let inputParameters = clone(inputs?.inputParameters)
  for (const key of keys(inputParameters)) {
    if (includes(key, skipList)) continue
    const value = inputParameters[key]
    inputParameters[key] = isJsonString(value) ? JSON.parse(value) : value
  }
  inputs.inputParameters = inputParameters
}

export const validateEngineWorkflow = engine => {
  let validationResults = []

  const nodes = engine.model.getNodes()
  nodes.map(node => validationResults.push(node.validate()))

  //no floating links
  engine.model.getLinks().forEach(link => {
    if (!link?.sourcePort || !link.targetPort) {
      validationResults.push([false, 'There are links that are not connected properly.'])
    }
  })

  //at least one task
  const tasks = nodes.filter(node => node.type !== nodeConfig.START.type && node.type !== nodeConfig.END.type)
  if (!tasks?.length > 0) {
    validationResults.push([false, 'The workflow must contain at least one task'])
  }

  return validationResults
}
