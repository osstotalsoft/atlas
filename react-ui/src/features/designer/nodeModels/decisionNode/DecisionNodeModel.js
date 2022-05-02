import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { errorMessages } from 'features/designer/constants/ErrorMessages'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { isEmpty, keys } from 'ramda'
import { emptyArray, emptyObject, emptyString } from 'utils/constants'
import { hash } from 'utils/functions'
import { oneOut, anyIn } from '../validations'

export default class DecisionNodeModel extends DefaultNodeModel {
  constructor(task) {
    const { name, type, color } = nodeConfig.DECISION
    super({ name: task?.name ?? name, color })
    this.type = type

    this.inputs = {
      name: task?.name ?? name,
      type: task?.type ?? type,
      description: task?.description,
      taskReferenceName: task?.taskReferenceName ?? 'decisionTaskRef_' + hash(),
      inputParameters: task?.inputParameters ?? {
        param: '${workflow.input.param}'
      },
      caseValueParam: task?.caseValueParam ?? emptyString,
      caseExpression: task?.caseExpression ?? emptyString,
      decisionCases: task?.decisionCases ?? emptyObject,
      defaultCase: emptyArray,
      hasDefaultCase: task?.defaultCase?.length > 0,
      optional: task?.optional ?? false,
      startDelay: task?.startDelay ?? 0
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    task?.decisionCases &&
      keys(task?.decisionCases).forEach(decision => {
        this.addPort(new DefaultPortModel({ out: true, name: decision }))
      })
    if (this.inputs.hasDefaultCase) {
      this.addPort(new DefaultPortModel({ out: true, name: 'default' }))
    }
  }

  validate() {
    if (isEmpty(this.portsOut)) {
      return [false, `${nodeConfig.DECISION.type} ${errorMessages.atLeastOneCase}.`]
    }

    const inResult = anyIn(Object.values(this.ports.in.links), nodeConfig.DECISION.type)
    if (!inResult[0]) return inResult

    for (const port of this.portsOut) {
      const [isValid, message] = oneOut(Object.values(port?.links), nodeConfig.DECISION.type)
      if (!isValid) return [isValid, message]
    }

    return [true]
  }
}
