import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { getWfInputsRegex } from 'features/designer/builderHandler'
import { hash } from 'features/designer/constants/SystemTasksConfig'

export class SubworkflowNodeModel extends DefaultNodeModel {
  constructor(wf) {
    const { name, type, color } = nodeConfig.SUB_WORKFLOW
    super({ name: wf?.name ?? name, color })
    this.type = type

    this.inputs = {
      name: wf?.name ?? name,
      inputParameters: wf?.inputParameters ?? getWfInputsRegex(wf),
      taskReferenceName: wf?.taskReferenceName ?? wf.name.toLowerCase().trim() + '_ref_' + hash(),
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
}
