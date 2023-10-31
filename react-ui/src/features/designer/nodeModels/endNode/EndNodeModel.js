import { DefaultPortModel } from '@projectstorm/react-diagrams'
import { NodeModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { anyIn } from '../validations'
export default class EndNodeModel extends NodeModel {
  constructor() {
    const type = nodeConfig.END.type
    super({ type })
    this.inputs = { taskReferenceName: type }
    this.type = type
    this.addPort(new DefaultPortModel({ in: true, name: 'in', type }))
  }

  validate() {
    return anyIn(Object.values(this.ports.in.links), nodeConfig.END.type)
  }
}
