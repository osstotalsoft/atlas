import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'features/designer/constants/SystemTasksConfig'
import { keys } from 'ramda'

export class DecisionNodeModel extends DefaultNodeModel {
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
        param: 'true'
      },
      caseValueParam: task?.caseValueParam ?? 'param',
      caseExpression: task?.caseExpression ?? '',
      decisionCases: task?.decisionCases ?? {},
      defaultCase: [],
      optional: task?.optional ?? false,
      startDelay: task?.startDelay ?? 0
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    task?.decisionCases &&
      keys(task?.decisionCases).forEach(decision => {
        this.addPort(new DefaultPortModel({ in: false, name: decision }))
      })
  }
}
