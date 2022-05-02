import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'utils/functions'
import { anyInOneOut } from '../validations'

export default class LambdaNodeModel extends DefaultNodeModel {
  constructor(task) {
    const { name, type, color } = nodeConfig.LAMBDA
    super({ name: task?.name ?? name, color })
    this.type = type

    this.inputs = {
      name: task?.name ?? name,
      type: task?.type ?? type,
      description: task?.description,
      taskReferenceName: task?.taskReferenceName ?? 'lambdaTaskRef_' + hash(),
      inputParameters: task?.inputParameters ?? {
        lambdaValue: '${workflow.input.lambdaValue}',
        scriptExpression: 'if ($.lambdaValue == 1) {\n  return {testvalue: true} \n} else { \n  return {testvalue: false}\n}'
      },
      optional: task?.optional ?? false,
      startDelay: task?.startDelay ?? 0
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    this.addPort(new DefaultPortModel({ in: false, name: 'out' }))
  }

  validate() {
    const inputLinks = Object.values(this.ports.in.links)
    const outputLinks = Object.values(this.ports.out.links)

    return anyInOneOut(inputLinks, outputLinks, nodeConfig.LAMBDA.type)
  }
}
