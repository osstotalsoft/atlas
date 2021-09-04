import { EndNodeWidget } from './EndNodeWidget'
import { EndNodeModel } from './EndNodeModel'
import * as React from 'react'
import { nodeConfig } from '../../constants/NodeConfig'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'

export class EndNodeFactory extends AbstractReactFactory {
  constructor() {
    super(nodeConfig.END.type)
  }

  generateReactWidget(event) {
    return <EndNodeWidget engine={this.engine} size={50} node={event.model} />
  }

  generateModel() {
    return new EndNodeModel()
  }
}
