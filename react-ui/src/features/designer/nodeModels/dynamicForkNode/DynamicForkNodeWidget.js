import * as React from 'react'
import PropTypes from 'prop-types'
import DynamicForkNode from './DynamicForkNode'
import { PortWidget } from '@projectstorm/react-diagrams'
import '../../styles/classes.css'
import dynamicForkNodeStyle from './dynamicForkNodeStyle'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(dynamicForkNodeStyle)

const DynamicForkNodeWidget = ({ engine, node }) => {
  const classes = useStyles()

  return (
    <>
      <DynamicForkNode node={node} />
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

DynamicForkNodeWidget.propTypes = {
  node: PropTypes.object,
  engine: PropTypes.object
}

export default DynamicForkNodeWidget
