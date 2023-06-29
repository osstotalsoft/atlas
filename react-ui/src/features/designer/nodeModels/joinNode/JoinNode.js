import React from 'react'
import PropTypes from 'prop-types'
import joinNodeStyle from './joinNodeStyle'
import { makeStyles } from '@mui/styles'
import { nodeConfig } from 'features/designer/constants/NodeConfig'

const useStyles = makeStyles(joinNodeStyle)

const JoinNode = ({ node }) => {
  const classes = useStyles()

  return (
    <svg
      className={classes.joinSvg}
      dangerouslySetInnerHTML={{
        __html: `
          <g id="Layer_1" />
          <g id="Layer_2">
          <polygon fill="${node?.color}" points="60 15,15 15,15 65,60 65,80 40" stroke=${
          node.isSelected() ? 'rgb(0,192,255)' : 'rgb(20,20,20)'
        }
          stroke-width="2px" />
                <text x="32" y="45" fill="white" font-size="13px" >${nodeConfig.JOIN.name}</text>
          </g>
          `
      }}
    />
  )
}

JoinNode.propTypes = {
  node: PropTypes.object
}

export default JoinNode
