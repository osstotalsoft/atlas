import React from 'react'
import PropTypes from 'prop-types'
import dynamicForkNodeStyle from './dynamicForkNodeStyle'
import { makeStyles } from '@material-ui/core'

const useStyles = makeStyles(dynamicForkNodeStyle)

const DynamicForkNode = ({ node }) => {
  const classes = useStyles()

  return (
    <svg
      className={`${classes.dynamicFork} ${node.type}`}
      dangerouslySetInnerHTML={{
        __html: `
      <g id="Layer_2">
      <polygon fill="${node?.color}" points="21.5,79.5 0.2,50 21.5,20.5 89,20.5 109.8,50 89,79.5" stroke=${
          node.isSelected() ? 'rgb(0,192,255)' : 'rgb(20,20,20)'
        } stroke-width="2px" />
      <text x="30" y="45" fill="white" font-size="12px">DYNAMIC</text>
      <text x="40" y="65" fill="white" font-size="12px">FORK</text>
      </g> 
      `
      }}
    />
  )
}

DynamicForkNode.propTypes = {
  node: PropTypes.object
}

export default DynamicForkNode
