import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'features/designer/constants/SystemTasksConfig'

export class JoinNodeModel extends DefaultNodeModel {
  constructor(task) {
    const { name, type, color } = nodeConfig.JOIN
    super({ type, name: task?.name ?? name })
    this.type = type

    this.color = color
    this.inputs = {
      name: task?.name ?? name,
      type: task?.type ?? type,
      taskReferenceName: task?.taskReferenceName ?? 'joinTaskRef_' + hash(),
      description: task?.description
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    this.addPort(new DefaultPortModel({ in: false, name: 'out' }))
  }
}
