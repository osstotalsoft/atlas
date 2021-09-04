import { StartNodeWidget } from './StartNodeWidget'
import * as React from 'react'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import { StartNodeModel } from './StartNodeModel'
import { nodeConfig } from 'features/designer/constants/NodeConfig'

export class StartNodeFactory extends AbstractReactFactory {
  constructor() {
    super(nodeConfig.START.type)
  }

  generateReactWidget(event) {
    return <StartNodeWidget engine={this.engine} size={50} node={event.model} />
  }

  generateModel() {
    return new StartNodeModel()
  }
}
