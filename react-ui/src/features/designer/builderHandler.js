import { DefaultPortModel } from '@projectstorm/react-diagrams-defaults'
import { includes, keys, values } from 'ramda'
import { nodeConfig } from './constants/NodeConfig'
import workflowConfig from './constants/WorkflowConfig'

export const getStartNode = links => {
  const start = nodeConfig.START.type
  const startLink = links.find(x => x.sourcePort.options.type === start)
  return startLink?.sourcePort?.parent
}

export const getEndNode = links => {
  const end = nodeConfig.END.type
  const lastLink = links.find(x => x.targetPort.options.type === end)
  return lastLink?.targetPort?.parent
}

export const getLinksArray = (type, node) => {
  let linksArray = []

  if (node.type === nodeConfig.START.type) {
    if (type === 'in') return []
    return [Object.values(node.getPorts().out.links)[0]]
  } else if (node.type === nodeConfig.END.type) {
    if (type === 'out') return []
    return [Object.values(node.getPorts().in.links)[0]]
  }

  const inPorts = node.getInPorts()
  const outPorts = node.getOutPorts()

  if (includes(type, ['in', 'all'])) {
    inPorts.forEach(port => {
      keys(port.links).forEach(key => {
        linksArray.push(port.links[key])
      })
    })
  }

  if (includes(type, ['out', 'all'])) {
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
      let outputLinks = getLinksArray('out', currentNode)

      while ((inputLinks.length === 1 || currentNode.type === nodeConfig.JOIN.type) && outputLinks.length > 0) {
        if (currentNode.type === nodeConfig.END.type) {
          return
        } else if (currentNode.type === nodeConfig.FORK_JOIN.type) {
          const { forkNode, joinNode } = handleForkNode(currentNode)
          branchArray.push(forkNode.inputs)
          branchArray.push(joinNode.inputs)
          let outputLink = getLinksArray('out', joinNode)[0]
          currentNode = outputLink.targetPort.getNode()

          inputLinks = getLinksArray('in', currentNode)
          outputLinks = getLinksArray('out', currentNode)
        } else if (currentNode.type === nodeConfig.DECISION.type) {
          const { decideNode, firstNeutralNode } = handleDecideNode(currentNode)
          branchArray.push(decideNode.inputs)
          currentNode = firstNeutralNode

          inputLinks = getLinksArray('in', currentNode)
          outputLinks = getLinksArray('out', currentNode)
        } else {
          branchArray.push(currentNode.inputs)
          currentNode = outputLinks[0].targetPort.getNode()

          inputLinks = getLinksArray('in', currentNode)
          outputLinks = getLinksArray('out', currentNode)
        }
      }

      firstNeutralNode = currentNode
    }

    const casesValues = keys(decideNode.inputs.decisionCases)
    if (index >= casesValues.length) {
      const newInputs = { ...decideNode.inputs, hasDefaultCase: undefined, defaultCase: branchArray }
      decideNode.inputs = newInputs
    } else {
      const newDecisionCases = { ...decideNode.inputs.decisionCases, [casesValues[index]]: branchArray }
      const newInputs = { ...decideNode.inputs, decisionCases: newDecisionCases }
      decideNode.inputs = newInputs
    }
  })

  if (decideNode.inputs.hasDefaultCase === false) {
    decideNode.inputs = { ...decideNode.inputs, hasDefaultCase: undefined, defaultCase: [] }
  }
  return { decideNode, firstNeutralNode }
}

const handleForkNode = forkNode => {
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
        case nodeConfig.END.type:
          throw new Error('Please add the corresponding JOIN task!')
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
  const { END } = nodeConfig
  let tasks = []
  let finalWorkflow = workflowConfig

  while (parentNode.type !== END.type) {
    for (let i = 0; i < links.length; i++) {
      const link = links[i]
      parentNode = parseTaskToJSON(link, parentNode, tasks)
    }
  }

  finalWorkflow.tasks = tasks
  return finalWorkflow
}

export const decisionCasesToPorts = (node, decisionCases) => {
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
  if (node?.inputs?.hasDefaultCase) {
    node.addPort(new DefaultPortModel({ in: false, name: 'default' }))
  }
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
  if (t?.inputKeys) {
    t.inputKeys.forEach(el => {
      inputParameters[el] = '${workflow.input.' + el + '}'
    })
  }

  return inputParameters
}
