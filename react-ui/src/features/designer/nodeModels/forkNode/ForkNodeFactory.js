import * as React from 'react'
import ForkNodeWidget from './ForkNodeWidget'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import { ForkNodeModel } from './ForkNodeModel'
import { nodeConfig } from 'features/designer/constants/NodeConfig'

export class ForkNodeFactory extends AbstractReactFactory {
  constructor() {
    super(nodeConfig.FORK_JOIN.type)
  }

  generateReactWidget(event) {
    return <ForkNodeWidget engine={this.engine} node={event.model} />
  }

  generateModel() {
    return new ForkNodeModel()
  }
}
