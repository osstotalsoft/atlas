import { DefaultPortModel } from '@projectstorm/react-diagrams'
import { NodeModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
export class StartNodeModel extends NodeModel {
  constructor() {
    const type = nodeConfig.START.type
    super({ type })

    this.type = type
    this.addPort(new DefaultPortModel({ in: false, name: 'out', type }))
  }
}
