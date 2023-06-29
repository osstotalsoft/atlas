import React from 'react'
import PropTypes from 'prop-types'
import forkNodeStyle from './forkNodeStyle'
import { makeStyles } from '@mui/styles'
import { nodeConfig } from 'features/designer/constants/NodeConfig'

const useStyles = makeStyles(forkNodeStyle)

const ForkNode = ({ node }) => {
  const classes = useStyles()

  return (
    <svg
      id={node.options.id}
      className={`${classes.forkSvg} ${node.type}`}
      dangerouslySetInnerHTML={{
        __html: `
          <g id="Layer_2">
            <polygon fill="${node?.color}" points="35 65,80 65,80 15,35 15,15 40 " stroke=${
          node.isSelected() ? 'rgb(0,192,255)' : 'rgb(20,20,20)'
        } stroke-width="2px" />
                <text x="35" y="45" fill="white" font-size="13px" >${nodeConfig.FORK_JOIN.name}</text>
          </g>
        `
      }}
    />
  )
}

ForkNode.propTypes = {
  node: PropTypes.object
}

export default ForkNode
