import * as React from 'react'
import PropTypes from 'prop-types'
import JoinNode from './JoinNode'
import { PortWidget } from '@projectstorm/react-diagrams'
import '../../styles/classes.css'
import joinNodeStyle from './joinNodeStyle'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(joinNodeStyle)

const JoinNodeWidget = ({ engine, node }) => {
  const classes = useStyles()

  return (
    <>
      <JoinNode node={node} />
      <div className={classes.inPort}>
        <PortWidget engine={engine} port={node?.getPort('in')}>
          <div className='srd-port' />
        </PortWidget>
      </div>
      <div className={classes.outPort}>
        <PortWidget engine={engine} port={node?.getPort('out')}>
          <div className='srd-port' />
        </PortWidget>
      </div>
    </>
  )
}

JoinNodeWidget.propTypes = {
  node: PropTypes.object,
  engine: PropTypes.object
}

export default JoinNodeWidget
