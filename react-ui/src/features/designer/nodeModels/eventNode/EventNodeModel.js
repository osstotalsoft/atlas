import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'utils/functions'
import { anyInOneOut } from '../validations'
import { getDefaultEventMessage } from './functions'

export default class EventNodeModel extends DefaultNodeModel {
  constructor(task) {
    const { name, type, color } = nodeConfig.EVENT
    super({ name: task?.name ?? name, color })
    this.type = type

    this.inputs = {
      type: task?.type ?? type,
      name: task?.name ?? name,
      description: task?.description,
      taskReferenceName: task?.taskReferenceName ?? 'eventTaskRef' + hash(),
      inputParameters: task?.inputParameters ?? getDefaultEventMessage(),
      optional: task?.optional ?? false,
      startDelay: task?.startDelay ?? 0,
      sink: task?.sink ?? 'conductor',
      asyncComplete: task?.asyncComplete ?? false,
      asyncHandler: ""
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    this.addPort(new DefaultPortModel({ in: false, name: 'out' }))
  }

  validate() {
    const inputLinks = Object.values(this.ports.in.links)
    const outputLinks = Object.values(this.ports.out.links)

    return anyInOneOut(inputLinks, outputLinks, nodeConfig.EVENT.type)
  }
}
