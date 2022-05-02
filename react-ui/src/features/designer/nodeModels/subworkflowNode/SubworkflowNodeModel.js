import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { getWfInputsRegex } from 'features/designer/builderHandler'
import { hash } from 'utils/functions'
import { anyInOneOut } from '../validations'

export default class SubworkflowNodeModel extends DefaultNodeModel {
  constructor(wf) {
    const { name, type, color } = nodeConfig.SUB_WORKFLOW
    super({ name: wf?.name ?? name, color, type })
    this.type = type

    this.inputs = {
      name: wf?.name ?? name,
      inputParameters: wf?.inputParameters ?? getWfInputsRegex(wf),
      taskReferenceName: wf?.taskReferenceName ?? wf?.name?.toLowerCase()?.trim() + '_ref_' + hash(),
      subWorkflowParam: wf?.subWorkflowParam ?? {
        name: wf?.name,
        version: wf?.version
      },
      type: wf?.type ?? type,
      description: wf?.description,
      optional: wf?.optional ?? false,
      startDelay: wf?.startDelay ?? 0
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    this.addPort(new DefaultPortModel({ in: false, name: 'out' }))
  }

  validate() {
    const inputLinks = Object.values(this.ports.in.links)
    const outputLinks = Object.values(this.ports.out.links)

    return anyInOneOut(inputLinks, outputLinks, nodeConfig.SUB_WORKFLOW.type)
  }
}
