import React, { useEffect, useState, useCallback } from 'react'
import dagreD3 from 'dagre-d3'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import workflowToGraph from '../workflowToGraph'
import { Card, Grid } from '@mui/material'
import SubGrapher from './SubGrapher'
import { useTranslation } from 'react-i18next'
import { Dialog } from '@totalsoft/rocket-ui'
import { emptyObject, emptyString } from 'utils/constants'
import DiagramTaskModal from './DiagramTaskModal'
import { executionStatus } from 'features/execution/list/constants/executionStatusList'
import Legend from './Legend'

const Grapher = ({ workflow, layout }) => {
  const { t } = useTranslation()
  const [taskDialog, setTaskDialog] = useState({ open: false, selectedTask: null })

  const errorStyle = {
    color: '#802B2B',
    backgroundColor: '#FFE6E6',
    padding: '15px',
    textAlign: 'left',
    overflowX: 'auto',
    whiteSpace: 'normal',
    wordBreak: 'break-word'
  }
  var svgElem = null
  const [subflow, setSubflow] = useState(null)

  const svgContainer = React.createRef()
  const grapher = new dagreD3.render()
  var edges = []
  var vertices = {}
  const flowCardRef = React.createRef()

  const setSvgRef = elem => {
    svgElem = elem
  }

  const initGrahper = useCallback(() => {
    const wfe2graph = new workflowToGraph()
    const businessFlow = Object.assign({}, workflow)
    const businessFlowDefinition = Object.assign({}, workflow.workflowDefinition)

    const { edges: _edges, vertices: _vertices } = wfe2graph.convert(businessFlow, businessFlowDefinition)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    edges = _edges
    // eslint-disable-next-line react-hooks/exhaustive-deps
    vertices = _vertices

    const starPoints = function (outerRadius, innerRadius) {
      var results = ''
      const angle = Math.PI / 8
      for (let i = 0; i < 2 * 8; i++) {
        // Use outer or inner radius depending on what iteration we are in.
        const r = (i & 1) === 0 ? outerRadius : innerRadius
        const currX = 0 + Math.cos(i * angle) * r
        const currY = 0 + Math.sin(i * angle) * r
        if (i === 0) {
          results = currX + ',' + currY
        } else {
          results += ', ' + currX + ',' + currY
        }
      }
      return results
    }

    grapher.shapes().house = function (parent, bbox, node) {
      const w = bbox.width,
        h = bbox.height,
        points = [
          { x: 0, y: 0 },
          { x: w, y: 0 },
          { x: w, y: -h },
          { x: w / 2, y: (-h * 3) / 2 },
          { x: 0, y: -h }
        ]
      const shapeSvg = parent
        .insert('polygon', ':first-child')
        .attr(
          'points',
          points
            .map(function (d) {
              return d.x + ',' + d.y
            })
            .join(' ')
        )
        .attr('transform', 'translate(' + -w / 2 + ',' + (h * 3) / 4 + ')')

      node.intersect = function (point) {
        return dagreD3.intersect.polygon(node, points, point)
      }

      return shapeSvg
    }

    grapher.shapes().star = function (parent, bbox, node) {
      const w = bbox.width,
        h = bbox.height,
        points = [
          { x: 0, y: 0 },
          { x: w, y: 0 },
          { x: w, y: -h },
          { x: w / 2, y: (-h * 3) / 2 },
          { x: 0, y: -h }
        ]
      const shapeSvg = parent.insert('polygon', ':first-child').attr('points', starPoints(w, h))
      node.intersect = function (point) {
        return dagreD3.intersect.polygon(node, points, point)
      }

      return shapeSvg
    }
  }, [workflow])

  useEffect(() => {
    initGrahper()
  }, [initGrahper])

  useEffect(() => {
    initGrahper()
    if (subflow && subflow.props && subflow.props.workflow) {
      const task = workflow.tasks.find(a => a.inputData.subWorkflowId === subflow.props.workflow.workflowId)
      if (task) {
        showSubFlow(task.referenceTaskName)
      }
    }

    const g = new dagreD3.graphlib.Graph().setGraph({ rankdir: layout })

    for (let vk in vertices) {
      const v = vertices[vk]
      const label = v.label || v.ref

      g.setNode(v.ref, {
        label,
        shape: v.shape,
        style: v.style,
        labelStyle: v.labelStyle + '; font-weight:normal; font-size: 11px'
      })
    }

    edges.forEach(e => {
      g.setEdge(e.from, e.to, { label: e.label, lineInterpolate: 'basis', style: e.style })
    })

    g.nodes().forEach(function (v) {
      var node = g.node(v)
      if (node == null) {
        console.log('NO node found ' + v)
      }
      node.rx = node.ry = 5
    })

    const svg = d3.select(svgElem)
    const inner = svg.select('g')
    inner.attr('transform', 'translate(20,20)')
    grapher(inner, g)
    const w = g.graph().width + 50
    const h = g.graph().height + 50

    svg.attr('width', w + 'px').attr('height', h + 'px')

    inner.selectAll('g.node').on('click', function (v) {
      showSubFlow(v)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflow])

  const GetSubFlow = (flows, flowId) => {
    const flow = flows.find(a => a.workflowId === flowId)
    const subFlows = flows.map(a => a.subWorkFlows).flat()
    if (!flow && subFlows.length) {
      return GetSubFlow(subFlows, flowId)
    }

    return flow
  }

  const showSubFlow = parentTask => {
    //reset subflow
    resetSubFlow()
    const task = workflow.tasks.find(a => a.referenceTaskName === parentTask)
    if (!task) {
      return
    }

    setTaskDialog({ open: true, selectedTask: task })

    if (task.inputData && task.inputData.subWorkflowId) {
      const subFlow = GetSubFlow(workflow.subWorkFlows, task.inputData.subWorkflowId)
      if (subFlow) {
        setSubflow(<SubGrapher parent={task} layout={layout} t={t} workflow={subFlow} />)
        return
      }
    }
    if (task.outputData && task.outputData.code) {
      setSubflow(
        <React.Fragment>
          <pre style={errorStyle}>{task.outputData.code}</pre>
        </React.Fragment>
      )
      return
    }
    if (task.outputData && task.outputData.payload && task.outputData.payload.Message) {
      setSubflow(
        <React.Fragment>
          <pre style={errorStyle}>{task.outputData.payload.Message}</pre>
        </React.Fragment>
      )
    }
  }

  const failedTaskError = wf => (wf?.status === executionStatus.FAILED ? wf?.reasonForIncompletion : emptyString)

  const resetSubFlow = () => {
    setSubflow(<React.Fragment></React.Fragment>)
  }

  const moreInfo =
    'For additional information, please open the task information dialog by clicking on the failed task from the diagram below!'
  const error = failedTaskError(workflow)

  const handleDialogClose = useCallback(() => {
    setTaskDialog({ open: false, selectedTask: null })
  }, [])

  return (
    <>
      <Card ref={flowCardRef} style={{ whiteSpace: 'nowrap', overflowX: 'auto' }}>
        <Grid container>
          <Grid item sm={12}>
            {error && <pre style={errorStyle}>{error}</pre>}
            {error && <pre style={errorStyle}>{moreInfo}</pre>}
          </Grid>
          <Grid item sm={10}>
            <div style={{ marginTop: '10px', textAlign: 'center', verticalAlign: 'top' }}>
              <div style={{ overflowX: 'auto', width: '100%', textAlign: 'center' }}>
                <div style={{ overflowX: 'auto' /*, float: "left"*/ }}>
                  <div>{workflow?.workflowDefinition?.description}</div>
                  <div ref={svgContainer}>
                    <svg ref={setSvgRef}>
                      <g transform='translate(20,20)' />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item sm={2}>
            <Legend />
          </Grid>
        </Grid>

        <div style={{ overflowX: 'auto', display: 'inline-block' }}>{subflow}</div>
      </Card>
      <Dialog
        id='taskDetails'
        open={taskDialog?.open}
        onClose={handleDialogClose}
        maxWidth='lg'
        content={<DiagramTaskModal selectedTask={taskDialog?.selectedTask || emptyObject} />}
      />
    </>
  )
}

Grapher.propTypes = {
  layout: PropTypes.string.isRequired,
  workflow: PropTypes.object.isRequired
}

export default Grapher
