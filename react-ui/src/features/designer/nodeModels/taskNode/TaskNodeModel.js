import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { getTaskInputsRegex } from 'features/designer/builderHandler'
import { hash } from 'utils/functions'
import { anyInOneOut } from '../validations'

export default class TaskNodeModel extends DefaultNodeModel {
  constructor(task) {
    const { name, type, color } = nodeConfig.TASK
    super({ name: task?.taskReferenceName ?? name, color })
    this.type = type

    this.inputs = {
      name: task?.name ?? name,
      inputParameters: task?.inputParameters ?? getTaskInputsRegex(task),
      taskReferenceName: task?.taskReferenceName ?? task?.name?.toLowerCase()?.trim() + '_ref_' + hash(),
      type: task?.type ?? type,
      description: task?.description,
      optional: task?.optional ?? false,
      startDelay: task?.startDelay ?? 0
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    this.addPort(new DefaultPortModel({ in: false, name: 'out' }))
  }

  validate() {
    const inputLinks = Object.values(this.ports.in.links)
    const outputLinks = Object.values(this.ports.out.links)

    return anyInOneOut(inputLinks, outputLinks, nodeConfig.TASK.type)
  }
}
