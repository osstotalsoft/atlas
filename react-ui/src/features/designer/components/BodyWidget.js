import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'
import { CanvasWidget } from '@projectstorm/react-canvas-core'
import { nodeConfig } from '../constants/NodeConfig'
import { anyPass, both, compose, equals, isNil, prop } from 'ramda'
import { drawDiagram } from '../drawingHandler'

const S = {
  Layer: styled.div`
    flex-grow: 1;
  `
}

const BodyWidget = ({ canvasClass, workflow, engine, setIsDirty, locked }) => {
  //create diagram from workflow definition
  useEffect(() => {
    if (workflow && workflow.tasks) {
      drawDiagram(workflow, engine, workflow?.readOnly || locked)
    }
  }, [engine, locked, workflow])

  const handleOnDrop = useCallback(
    event => {
      if (event?.dataTransfer) {
        setIsDirty(true)
        const data = JSON.parse(event?.dataTransfer?.getData('storm-diagram-node'))

        const eqStart = equals(nodeConfig.START.type)
        const eqEnd = equals(nodeConfig.END.type)
        const eqType = equals(data.type)
        const startOrEnd = anyPass([eqStart, eqEnd])
        const checkTypeStartOrEnd = both(eqType, startOrEnd)
        const lookForStartOrEnd = compose(checkTypeStartOrEnd, prop('type'))

        if (engine.model.getNodes().find(lookForStartOrEnd)) {
          return
        }

        const node = nodeConfig[data.type]?.getInstance(data?.workflow)
        if (isNil(node)) return
        const point = engine.getRelativeMousePoint(event)
        node.setPosition(point)
        engine.getModel().addNode(node)
        engine.fireEvent({ nodes: [node] }, 'nodesAdded')
        engine.repaintCanvas()
      }
    },
    [engine, setIsDirty]
  )

  const handleOnDragOver = useCallback(event => {
    event?.preventDefault()
  }, [])

  return (
    <S.Layer onDrop={handleOnDrop} onDragOver={handleOnDragOver}>
      <CanvasWidget className={canvasClass} engine={engine} />
    </S.Layer>
  )
}
BodyWidget.propTypes = {
  canvasClass: PropTypes.string.isRequired,
  engine: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
  setIsDirty: PropTypes.func,
  locked: PropTypes.bool.isRequired
}

export default BodyWidget
