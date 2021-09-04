import { DefaultPortModel } from '@projectstorm/react-diagrams'
import { NodeModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
export class EndNodeModel extends NodeModel {
  constructor() {
    const type = nodeConfig.END.type
    super({ type })

    this.type = type
    this.addPort(new DefaultPortModel({ in: true, name: 'in', type }))
  }
}
