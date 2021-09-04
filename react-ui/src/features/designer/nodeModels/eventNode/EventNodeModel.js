import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'features/designer/constants/SystemTasksConfig'

export class EventNodeModel extends DefaultNodeModel {
  constructor(task) {
    const { name, type, color } = nodeConfig.EVENT
    super({ name: task?.name ?? name, color })
    this.type = type

    this.inputs = {
      type: task?.type ?? type,
      name: task?.name ?? name,
      taskReferenceName: task?.taskReferenceName ?? 'eventTaskRef' + hash(),
      inputParameters: task?.inputParameters ?? {
        Payload: {
          DocumentId: '${workflow.input.DocumentId}',
          SiteId: '${workflow.input.SiteId}'
        },
        Headers: '${workflow.input.Headers}',
        action: 'complete_task',
        completeSink: ''
      },
      optional: task?.optional ?? false,
      startDelay: task?.startDelay ?? 0,
      sink: task?.sink ?? 'conductor',
      asyncComplete: task?.asyncComplete ?? false
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    this.addPort(new DefaultPortModel({ in: false, name: 'out' }))
  }
}
