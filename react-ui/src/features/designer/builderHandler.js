import { DefaultPortModel } from '@projectstorm/react-diagrams-defaults'
import { keys, values } from 'ramda'
import { nodeConfig } from './constants/NodeConfig'
import workflowConfig from './constants/WorkflowConfig'

const getStartNode = links => {
  const start = nodeConfig.START.type
  const startLink = links.find(x => x.sourcePort.options.type === start)
  return startLink?.sourcePort?.parent
}

const getEndNode = links => {
  const end = nodeConfig.END.type
  const lastLink = links.find(x => x.targetPort.options.type === end)
  return lastLink?.targetPort?.parent
}
const getLinksArray = (type, node) => {
  let linksArray = []

  if (node.type === nodeConfig.START.type) {
    return node.getPorts().out.links
  } else if (node.type === nodeConfig.END.type) return node.getPorts().in.links

  const inPorts = node.getInPorts()
  const outPorts = node.getOutPorts()

  if (type === 'in') {
    inPorts.forEach(port => {
      keys(port.links).forEach(key => {
        linksArray.push(port.links[key])
      })
    })
  } else if (type.includes('out')) {
    outPorts.forEach(port => {
      keys(port.links).forEach(key => {
        linksArray.push(port.links[key])
      })
    })
  }
  return linksArray
}

const handleDecideNode = decideNode => {
  const outputLinks = getLinksArray('out', decideNode)
  let firstNeutralNode = null

  outputLinks.forEach((branch, index) => {
    let branchArray = []
    if (branch) {
      let currentNode = branch.targetPort.getNode()
      let inputLinks = getLinksArray('in', currentNode)
      let outputLink = getLinksArray('out', currentNode)[0]

      while ((inputLinks.length === 1 || currentNode.type === 'join' || currentNode.type === 'fork') && outputLink) {
        branchArray.push(currentNode.inputs)
        currentNode = outputLink.targetPort.getNode()

        inputLinks = getLinksArray('in', currentNode)
        outputLink = getLinksArray('out', currentNode)[0]
      }

      firstNeutralNode = currentNode
    }

    const casesValues = keys(decideNode.inputs.decisionCases)
    const newDecisionCases = { ...decideNode.inputs.decisionCases, [casesValues[index]]: branchArray }
    const newInputs = { ...decideNode.inputs, decisionCases: newDecisionCases }

    decideNode.inputs = newInputs
  })

  return { decideNode, firstNeutralNode }
}

export const handleForkNode = forkNode => {
  let joinNode = null
  let forkTasks = []
  let joinOn = []
  let forkBranches = forkNode.ports.out.links

  //for each branch chain tasks
  values(forkBranches).forEach(link => {
    let tmpBranch = []
    let parent = link.targetPort.getNode()
    let current = link.targetPort.getNode()

    //iterate trough tasks in each branch till join node
    while (current) {
      const outputLinks = getLinksArray('out', current)
      switch (current.type) {
        case nodeConfig.JOIN.type:
          joinOn.push(parent.inputs.taskReferenceName)
          joinNode = current
          current = null
          break
        case nodeConfig.FORK_JOIN.type: {
          let innerForkNode = handleForkNode(current).forkNode
          let innerJoinNode = handleForkNode(current).joinNode
          let innerJoinOutLinks = getLinksArray('out', innerJoinNode)
          tmpBranch.push(innerForkNode.inputs, innerJoinNode.inputs)
          parent = innerJoinNode
          current = innerJoinOutLinks[0].targetPort.getNode()
          break
        }
        case nodeConfig.DECISION.type: {
          let { decideNode, firstNeutralNode } = handleDecideNode(current)
          tmpBranch.push(decideNode.inputs)
          current = firstNeutralNode
          break
        }
        default:
          tmpBranch.push(current.inputs)
          parent = current
          if (outputLinks.length > 0) {
            current = outputLinks[0].targetPort.getNode()
          } else {
            current = null
          }
          break
      }
    }
    forkTasks.push(tmpBranch)
  })

  forkNode.inputs.forkTasks = forkTasks
  joinNode.inputs.joinOn = joinOn

  return { forkNode, joinNode }
}

const parseTaskToJSON = (link, parentNode, tasks) => {
  if (link.sourcePort.parent === parentNode) {
    switch (link.targetPort.parent.type) {
      case nodeConfig.END.type:
        parentNode = link.targetPort.parent
        break
      case nodeConfig.DECISION.type: {
        const { decideNode, firstNeutralNode } = handleDecideNode(link.targetPort.getNode())
        tasks.push(decideNode.inputs)
        if (firstNeutralNode) {
          if (firstNeutralNode.inputs) {
            tasks.push(firstNeutralNode.inputs)
          }
          parentNode = firstNeutralNode
        }
        break
      }
      case nodeConfig.FORK_JOIN.type: {
        const { forkNode, joinNode } = handleForkNode(link.targetPort.getNode())
        tasks.push(forkNode.inputs, joinNode.inputs)
        parentNode = joinNode
        break
      }
      default:
        parentNode = link.targetPort.parent
        tasks.push(parentNode.inputs)
        break
    }
  }
  return parentNode
}

export const parseDiagramToJSON = engine => {
  const links = engine.model.getLinks()
  let parentNode = getStartNode(links)
  const endNode = getEndNode(links)
  const { END } = nodeConfig
  let tasks = []
  let finalWorkflow = workflowConfig

  if (!parentNode) {
    throw new Error('Start node is not connected.')
  }
  if (!endNode) {
    throw new Error('End node is not connected.')
  }

  while (parentNode.type !== END.type) {
    for (let i = 0; i < links.length; i++) {
      const link = links[i]
      parentNode = parseTaskToJSON(link, parentNode, tasks)
    }
  }
  finalWorkflow.tasks = tasks
  return finalWorkflow
}

export const updateNodeWithDecisionCases = (node, decisionCases) => {
  const outPorts = node.getOutPorts()

  var i = outPorts.length
  while (i--) {
    const port = outPorts[i]
    const links = port.getLinks()
    for (const link in links) {
      links[link].remove()
    }
    node.removePort(port)
  }
  decisionCases.forEach(decision => {
    node.addPort(new DefaultPortModel({ in: false, name: decision }))
  })
}

export const getWfInputsRegex = wf => {
  let def = JSON.stringify(wf)
  let inputCaptureRegex = /workflow\.input\.([a-zA-Z0-9-_]+)\}/gim
  let match = inputCaptureRegex.exec(def)
  let inputsArray = []

  while (match != null) {
    inputsArray.push(match[1])
    match = inputCaptureRegex.exec(def)
  }

  inputsArray = [...new Set(inputsArray)]

  let inputParameters = {}

  inputsArray.forEach(el => {
    inputParameters[el] = '${workflow.input.' + el + '}'
  })

  return inputParameters
}

export const getTaskInputsRegex = t => {
  let inputParameters = {}
  if (t.inputKeys) {
    t.inputKeys.forEach(el => {
      inputParameters[el] = '${workflow.input.' + el + '}'
    })
  }

  return inputParameters
}
