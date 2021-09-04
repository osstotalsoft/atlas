import * as React from 'react'
import { PortWidget } from '@projectstorm/react-diagrams'
import PropTypes from 'prop-types'

export class StartNodeWidget extends React.Component {
  render() {
    return (
      <div className='srd-circle-node'>
        <React.Fragment key={this.props.node.id}>
          <svg width='80' height='80'>
            <g>
              <circle
                cx='40'
                cy='40'
                r='30'
                fill='white'
                stroke={this.props.node.isSelected() ? 'rgb(0,192,255)' : 'rgb(20,20,20)'}
                strokeWidth='2px'
              />
              <text x='25' y='45'>
                Start
              </text>
            </g>
          </svg>
        </React.Fragment>
        <div style={{ position: 'absolute', zIndex: 10, left: 58, top: 28 }}>
          <PortWidget port={this.props.node.getPort('out')} engine={this.props.engine}>
            <div className='circle-port' />
          </PortWidget>
        </div>
      </div>
    )
  }
}
StartNodeWidget.propTypes = {
  node: PropTypes.object,
  engine: PropTypes.object
}
