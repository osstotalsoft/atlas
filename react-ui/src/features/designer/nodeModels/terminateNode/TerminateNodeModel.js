import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'utils/functions'
import { anyInOneOut } from '../validations'
export default class TerminateNodeModel extends DefaultNodeModel {
  constructor(task) {
    const { name, type, color } = nodeConfig.TERMINATE
    super({ name: task?.name ?? name, color })
    this.type = type

    this.inputs = {
      name: task?.name ?? name,
      type: task?.type ?? type,
      taskReferenceName: task?.taskReferenceName ?? 'terminateTaskRef_' + hash(),
      description: task?.description,
      inputParameters: task?.inputParameters ?? {
        terminationStatus: 'COMPLETED',
        workflowOutput: 'False'
      },
      startDelay: task?.startDelay ?? 0,
      optional: task?.optional ?? false
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    this.addPort(new DefaultPortModel({ in: false, name: 'out' }))
  }

  validate() {
    const inputLinks = Object.values(this.ports.in.links)
    const outputLinks = Object.values(this.ports.out.links)

    return anyInOneOut(inputLinks, outputLinks, nodeConfig.TERMINATE.type)
  }
}
