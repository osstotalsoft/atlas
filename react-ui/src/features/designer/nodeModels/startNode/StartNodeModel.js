import { DefaultPortModel } from '@projectstorm/react-diagrams'
import { NodeModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { oneOut } from '../validations'
export default class StartNodeModel extends NodeModel {
  constructor() {
    const type = nodeConfig.START.type
    super({ type })

    this.type = type
    this.addPort(new DefaultPortModel({ in: false, name: 'out', type }))
  }

  validate() {
    return oneOut(Object.values(this.ports.out.links), nodeConfig.START.type)
  }
}
