import { DiagramModel } from '@projectstorm/react-diagrams-core'
import { isEmpty, toArray } from 'lodash'
import StartNodeModel from './nodeModels/startNode/StartNodeModel'
import EndNodeModel from './nodeModels/endNode/EndNodeModel'
import { last, values } from 'ramda'
import { nodeConfig } from './constants/NodeConfig'
import WorkflowDAG from './diagram/WorkflowDAG'

export const clearDiagram = engine => {
  engine.model = new DiagramModel()
}

export const drawDiagram = (workflow, engine, locked, tasks) => {
  clearDiagram(engine)
  workflow.tasks.map(x => createNode(engine, x, tasks))
  appendStartAnd(engine, workflow)
  linkAllNodes(engine, workflow)

  engine.getModel().setLocked(locked)
}

const getMatchingTaskRefNode = (engine, taskRefName) => {
  return toArray(engine.model.getNodes()).find(x => x.inputs.taskReferenceName === taskRefName)
}

const getGraphState = definition => {
  const dag = new WorkflowDAG(null, definition)

  return {
    edges: dag.graph.edges(),
    vertices: dag.graph.nodes()
  }
}

// Links two nodes together ( out -> in )
const linkNodes = (node1, node2) => {
  if (node1.type === 'DECISION') {
    const decisionCase = Object.keys(node1.inputs.decisionCases).filter(a =>
      node1.inputs.decisionCases[a].some(a => a.taskReferenceName === node2.inputs.taskReferenceName)
    )[0]
    if (!decisionCase) {
      if (node1.ports['default']) {
        const defaultPort = node1.ports['default']
        return defaultPort.link(node2.getPort('in'))
      }
      return
    }
    const outPort = node1.ports[decisionCase]
    return outPort.link(node2.getPort('in'))
  }
  const outPort = node1.getPort('out')
  return outPort.link(node2.getPort('in'))
  /*
  if (
    node1.type === 'FORK_JOIN' ||
    node1.type === 'JOIN' ||
    node1.type === 'START' ||
    node1.type === 'FORK_JOIN_DYNAMIC' ||
    node1.type === 'while' ||
    node1.type === 'while_end'
  ) {
    const fork_join_start_outPort = node1.getPort('out')

    if (isDefault(node2.type)) {
      return fork_join_start_outPort.link(node2.getInPorts()[0])
    }
    if (node2.type === nodeConfig.DECISION.type) {
      return fork_join_start_outPort.link(node2.getPort('in'))
    }
    if (['FORK_JOIN', 'JOIN', 'END', 'FORK_JOIN_DYNAMIC', 'while', 'while_end'].includes(node2.type)) {
      return fork_join_start_outPort.link(node2.getPort('in'))
    }
  } else if (isDefault(node1.type)) {
    const defaultOutPort = node1.getOutPorts()[0]

    if (isDefault(node2.type)) {
      return defaultOutPort.link(node2.getInPorts()[0])
    }
    if (node2.type === nodeConfig.DECISION.type) {
      return defaultOutPort.link(node2.getPort('in'))
    }
    if (['FORK_JOIN', 'JOIN', 'END', 'FORK_JOIN_DYNAMIC', 'while', 'while_end'].includes(node2.type)) {
      return defaultOutPort.link(node2.getPort('in'))
    }
  } else if (node1.type === nodeConfig.DECISION.type) {
    const currentPort = node1.getPort(whichPort?.options?.name ?? whichPort)

    if (isDefault(node2.type)) {
      return currentPort.link(node2.getInPorts()[0])
    }
    if (node2.type === nodeConfig.DECISION.type) {
      return currentPort.link(node2.getPort('in'))
    }
    if (['FORK_JOIN', 'JOIN', 'END', 'FORK_JOIN_DYNAMIC', 'while', 'while_end'].includes(node2.type)) {
      return currentPort.link(node2.getPort('in'))
    }
  }*/
}

const getTaskRefName = name => {
  if (name === '__start') return 'START'
  if (name === '__final') return 'END'

  return name
}
export const linkAllNodes = (engine, definition) => {
  const { edges } = getGraphState(definition)

  edges.forEach(edge => {
    const fromNode = getMatchingTaskRefNode(engine, getTaskRefName(edge.v))
    const toNode = getMatchingTaskRefNode(engine, getTaskRefName(edge.w))
    const link = linkNodes(fromNode, toNode)
    if (link) {
      engine.model.addLink(link)
    }
  })
  /*
  let fromPortIndex = []
  edges.forEach(edge => {
    if (edge.from !== 'START' && edge.to !== 'END') {
      switch (edge.type) {
        case 'simple': {
          const fromNode = getMatchingTaskRefNode(engine, edge.from)
          const toNode = getMatchingTaskRefNode(engine, edge.to)
          engine.model.addLink(linkNodes(fromNode, toNode))
          break
        }
        case nodeConfig.FORK_JOIN.type: {
          const fromNode = getMatchingTaskRefNode(engine, edge.from)
          const toNode = getMatchingTaskRefNode(engine, edge.to)

          engine.model.addLink(linkNodes(fromNode, toNode))
          break
        }
        case nodeConfig.DECISION.type: {
          if (!fromPortIndex[edge.from]) {
            fromPortIndex[edge.from] = 0
          }
          const fromNode = getMatchingTaskRefNode(engine, edge.from)
          const toNode = getMatchingTaskRefNode(engine, edge.to)
          let whichPort = fromNode.portsOut[fromPortIndex[edge.from]]
          if (whichPort == last(fromNode.portsOut)) {
            fromPortIndex[edge.from] = 0
          } else {
            fromPortIndex[edge.from]++
          }

          engine.model.addLink(linkNodes(fromNode, toNode, whichPort))

          break
        }
        default:
          break
      }
    }
  })*/
}

const getMostRightNodeX = engine => {
  let max = 0
  engine.model.getNodes().forEach(node => {
    if (node.position.x > max) {
      max = node.position.x
    }
  })
  return max
}

const getNodeWidth = node => {
  if (node.options.name.length > 6) {
    return node.options.name.length * 8
  }
  return node.options.name.length * 12
}

const calculatePosition = (engine, branchX, branchY) => {
  const isPopover = engine?.canvas?.className?.includes('dataflow-canvas-popover')
  const initialX = isPopover ? engine?.canvas?.clientWidth * 0.2 : engine?.canvas?.clientWidth * 0.25
  const initialY = engine?.canvas?.clientHeight * 0.3

  const startPos = { x: initialX, y: initialY }
  let x = 0
  let y = 0

  const nodes = engine.model.getNodes()

  if (isEmpty(nodes)) {
    x = startPos.x
    y = startPos.y
  } else {
    x = getMostRightNodeX(engine) + getNodeWidth(nodes[nodes.length - 1]) + 100
    y = startPos.y
  }

  if (branchX) {
    x = branchX
  }
  if (branchY) {
    y = branchY - 100
  }

  return { x, y }
}

const calculateNestedPosition = (engine, branchTask, parentNode, k, branchSpread, branchMargin, branchNum, forkDepth) => {
  let yOffset = branchTask?.type === 'FORK_JOIN' ? 25 - k * 11 : 100
  yOffset = branchTask?.type === 'JOIN' ? 25 - (k - 1) * 11 : yOffset
  yOffset = branchTask?.type === nodeConfig.DECISION.type ? 25 - k * 11 : yOffset

  const branchPosY = parentNode.position.y + yOffset - branchSpread / 2 + ((branchMargin + 50) * branchNum) / forkDepth
  let lastNode = engine.model.getNodes()[engine.model.getNodes().length - 1]

  if (branchNum && k === 0) {
    lastNode = parentNode
  }

  const branchPosX = lastNode.position.x + 70 + (getNodeWidth(lastNode) + 50)

  return { branchPosX, branchPosY }
}
//Creates new node based on the task definition
export const createNode = (engine, task, taskList, branchX = null, branchY = null, forkDepth = 1) => {
  switch (task.type) {
    case nodeConfig.DECISION.type: {
      const { x, y } = calculatePosition(engine, branchX, branchY)
      const caseCount = [...values(task.decisionCases)].length + 1 + (task?.defaultCase?.length > 0 ? 1 : 0)
      const branchMargin = 120
      const nodeHeight = 47
      const node = nodeConfig[task.type]?.getInstance(task)
      if (task?.defaultCase?.length > 0) {
        node.inputs.defaultCase = task.defaultCase
      }
      node.setPosition(x, y)
      engine.model.addNode(node)

      // branches size in parallel - the deeper the fork node, the smaller the spread and margin is
      const branchSpread = (caseCount * nodeHeight + (caseCount - 1) * branchMargin) / forkDepth

      let branches = [...values(task.decisionCases), task.defaultCase].map(el => {
        return el === undefined ? [] : el
      })

      branches.forEach((caseBranch, caseNum) => {
        caseBranch?.forEach((branchTask, k) => {
          const { branchPosX, branchPosY } = calculateNestedPosition(
            engine,
            branchTask,
            node,
            k,
            branchSpread,
            branchMargin,
            caseNum,
            forkDepth
          )
          createNode(engine, branchTask, taskList, branchPosX, branchPosY, forkDepth + 1)
        })
      })
      break
    }
    case nodeConfig.FORK_JOIN.type: {
      const { x, y } = calculatePosition(engine, branchX, branchY)
      const branchCount = task.forkTasks.length
      const branchMargin = 120
      const nodeHeight = 130

      const node = nodeConfig[task.type]?.getInstance(task)
      node.setPosition(x, y)
      engine.model.addNode(node)

      // branches size in parallel - the deeper the fork node, the smaller the spread and margin is
      const branchSpread = (branchCount * nodeHeight + (branchCount - 1) * branchMargin) / forkDepth

      task.forkTasks.forEach((branch, branchNum) => {
        branch.forEach((branchTask, k) => {
          const { branchPosX, branchPosY } = calculateNestedPosition(
            engine,
            branchTask,
            node,
            k,
            branchSpread,
            branchMargin,
            branchNum,
            forkDepth
          )
          createNode(engine, branchTask, taskList, branchPosX, branchPosY, forkDepth + 1)
        })
      })
      break
    }
    default: {
      const { x, y } = calculatePosition(engine, branchX, branchY)
      const node = nodeConfig[task.type]?.getInstance(task)
      node.setPosition(x, y)
      var taskDef = taskList?.find(a => a.name === node.inputs.name)
      if (taskDef && taskDef.inputTemplate) {
        node.inputs.inputTemplate = taskDef.inputTemplate
      }
      engine.model.addNode(node)
      break
    }
  }
}

export const placeStartNode = (engine, x, y) => {
  if (engine.model.getNode(nodeConfig.START.type)) {
    return null
  }
  const node = new StartNodeModel()
  node.setPosition(x, y)
  return node
}

export const placeEndNode = (engine, x, y) => {
  if (engine.model.getNode(nodeConfig.END.type)) {
    return null
  }
  const node = new EndNodeModel()
  node.setPosition(x, y)
  return node
}

// Appends diagram with Start and End node
export const appendStartAnd = (engine, definition) => {
  const firstNode = engine.model.getNodes()[0]
  const lastNode = last(engine.model.getNodes())

  const { edges } = getGraphState(definition)
  const lastNodes = edges.filter(a => a.to === '__end')
  let max = 0
  let lastLinks = []
  if (lastNodes.length > 0) {
    lastNodes.forEach(node => {
      const eNode = getMatchingTaskRefNode(engine, node.v)
      if (eNode.position.x > max) {
        max = eNode.position.x
      }
      lastLinks.push(eNode)
    })
  } else {
    max = lastNode.position.x
    lastLinks.push(lastNode)
  }

  const startNode = placeStartNode(engine, firstNode.position.x - 200, firstNode.position.y)
  const endNode = placeEndNode(engine, max + getNodeWidth(lastNode) + 170, firstNode.position.y)

  //const firstLink = linkNodes(startNode, firstNode)

  engine.model.addAll(startNode, endNode) //, firstLink, ...lastLinks)
  //lastLinks.forEach(node => engine.model.addAll(linkNodes(node, endNode)))
}
