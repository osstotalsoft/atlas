import { DefaultNodeModel, DefaultPortModel } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import { hash } from 'utils/functions'
import { anyInOneOut } from '../validations'

export default class HttpNodeModel extends DefaultNodeModel {
  constructor(task) {
    const { name, type, color } = nodeConfig.HTTP
    super({ name: task?.name ?? name, color })
    this.type = type

    this.inputs = {
      type: task?.type ?? type,
      name: task?.name ?? 'HTTP_task',
      description: task?.description,
      taskReferenceName: task?.taskReferenceName ?? 'httpRequestTaskRef_' + hash(),
      inputParameters: task?.inputParameters ?? {
        http_request: {
          uri: '${workflow.input.uri}',
          method: 'GET',
          accept: 'application/json',
          contentType: 'application/json',
          headers: {},
          body: '',
          vipAddress: '',
          asyncComplete: false,
          oauthConsumerKey: '',
          oauthConsumerSecret: '',
          connectionTimeOut: 100,
          readTimeOut: 150
        }
      },
      asyncComplete: task?.asyncComplete ?? false,
      startDelay: task?.startDelay ?? 0,
      optional: task?.optional ?? false
    }

    this.addPort(new DefaultPortModel({ in: true, name: 'in' }))
    this.addPort(new DefaultPortModel({ in: false, name: 'out' }))
  }

  validate() {
    const inputLinks = Object.values(this.ports.in.links)
    const outputLinks = Object.values(this.ports.out.links)

    return anyInOneOut(inputLinks, outputLinks, nodeConfig.HTTP.type)
  }
}
