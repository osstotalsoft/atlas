import * as React from 'react'
import JoinNodeWidget from './JoinNodeWidget'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import { JoinNodeModel } from './JoinNodeModel'
import { nodeConfig } from 'features/designer/constants/NodeConfig'

export class JoinNodeFactory extends AbstractReactFactory {
  constructor() {
    super(nodeConfig.JOIN.type)
  }

  generateReactWidget(event) {
    return <JoinNodeWidget engine={this.engine} node={event.model} />
  }

  generateModel() {
    return new JoinNodeModel()
  }
}
