import * as React from 'react'
import DynamicForkNodeWidget from './DynamicForkNodeWidget'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import { DynamicForkNodeModel } from './DynamicForkNodeModel'
import { nodeConfig } from 'features/designer/constants/NodeConfig'

export class DynamicForkNodeFactory extends AbstractReactFactory {
  constructor() {
    super(nodeConfig.FORK_JOIN_DYNAMIC.type)
  }

  generateReactWidget(event) {
    return <DynamicForkNodeWidget engine={this.engine} node={event.model} />
  }

  generateModel() {
    return new DynamicForkNodeModel()
  }
}
