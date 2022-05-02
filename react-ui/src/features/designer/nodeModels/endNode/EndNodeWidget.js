import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { PortWidget } from '@projectstorm/react-diagrams'

export default class EndNodeWidget extends React.Component {
  render() {
    return (
      <div className='srd-circle-node'>
        <Fragment key={this.props.node}>
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
              <text x='28' y='45'>
                End
              </text>
            </g>
          </svg>
        </Fragment>
        <div style={{ position: 'absolute', zIndex: 10, left: -2, top: 28 }}>
          <PortWidget port={this.props.node.getPort('in')} engine={this.props.engine}>
            <div className='circle-port' />
          </PortWidget>
        </div>
      </div>
    )
  }
}

EndNodeWidget.propTypes = {
  node: PropTypes.object,
  engine: PropTypes.object
}
