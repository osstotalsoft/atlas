import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'utils/functions'
import { anyInOneOut } from '../validations'

export default class DynamicForkNodeModel extends DefaultNodeModel {
  constructor(task) {
    const { name, type, color } = nodeConfig.FORK_JOIN_DYNAMIC
    super({ type, name: task?.name ?? name })
    this.type = type

    this.color = color
    this.inputs = {
      name: task?.name ?? name,
      type: task?.type ?? type,
      taskReferenceName: task?.taskReferenceName ?? 'dynamicForkTaskRef_' + hash(),
      description: task?.description,
      dynamicForkTasksInputParamName: 'input',
      dynamicForkTasksParam: 'dynamicTasks',
      inputParameters: task?.inputParameters ?? {
        dynamicTasks: '${workflow.input.dynamic_tasks}',
        input: '${workflow.input.dynamic_tasks_input}'
      },
      startDelay: 0
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    this.addPort(new DefaultPortModel({ in: false, name: 'out' }))
  }

  validate() {
    const inputLinks = Object.values(this.ports.in.links)
    const outputLinks = Object.values(this.ports.out.links)

    return anyInOneOut(inputLinks, outputLinks, nodeConfig.FORK_JOIN_DYNAMIC.type)
  }
}
