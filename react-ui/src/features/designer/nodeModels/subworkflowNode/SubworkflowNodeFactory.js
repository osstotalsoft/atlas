import * as React from 'react'
import SubworkflowNodeWidget from './SubworkflowNodeWidget'
import { AbstractReactFactory } from '@projectstorm/react-canvas-core'
import SubworkflowNodeModel from './SubworkflowNodeModel'
import { nodeConfig } from 'features/designer/constants/NodeConfig'

export default class SubworkflowNodeFactory extends AbstractReactFactory {
  constructor() {
    super(nodeConfig.SUB_WORKFLOW.type)
  }

  generateReactWidget(event) {
    return <SubworkflowNodeWidget engine={this.engine} node={event.model} />
  }

  generateModel() {
    return new SubworkflowNodeModel()
  }
}
