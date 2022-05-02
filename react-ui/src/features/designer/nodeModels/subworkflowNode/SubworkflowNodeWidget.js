import React from 'react'
import PropTypes from 'prop-types'
import { PortWidget } from '@projectstorm/react-diagrams'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import WorkflowPresentationDialog from 'features/common/components/modals/WorkflowPresentationDialog'
import SearchIcon from '@material-ui/icons/Search'

export class SubworkflowNodeWidget extends React.Component {
  state = {
    previewOpen: false
  }

  openPreview = () => this.setState({ previewOpen: true })

  closePreview = () => this.setState({ previewOpen: false })

  render() {
    const { node, engine } = this.props
    const { color } = nodeConfig.SUB_WORKFLOW
    const { name, subWorkflowParam } = node.inputs

    const style = {}
    if (color) {
      style.background = color
    }

    return (
      <>
        <div className='basic-node' style={style}>
          <div className='node-title'>
            <div className='node-name'>{name}</div>
            <SearchIcon className='preview-icon' style={{ width: '17px', height: '17px' }} onClick={this.openPreview} />
          </div>
          <div className='ports'>
            <div className='in-port'>
              <PortWidget engine={engine} port={node?.getPort('in')}>
                <div className='in' />
              </PortWidget>
              <div className='in-port-name'>{'in'}</div>
            </div>
            <div className='out-port'>
              <div className='out-port-name'>{'out'}</div>
              <PortWidget engine={engine} port={node?.getPort('out')}>
                <div className='out' />
              </PortWidget>
            </div>
          </div>
        </div>
        <WorkflowPresentationDialog
          open={this.state.previewOpen}
          onClose={this.closePreview}
          subworkflowName={subWorkflowParam?.name}
          subworkflowVersion={subWorkflowParam?.version}
        />
      </>
    )
  }
}

SubworkflowNodeWidget.propTypes = {
  node: PropTypes.object,
  engine: PropTypes.object
}

export default SubworkflowNodeWidget
