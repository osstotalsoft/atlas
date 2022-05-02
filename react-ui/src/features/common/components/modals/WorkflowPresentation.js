import React, { useState } from 'react'
import PropTypes from 'prop-types'
import BodyWidget from 'features/designer/components/BodyWidget'
import { getApplicationDiagram } from 'features/designer/diagram/getApplicationDiagram'
import LoadingFakeText from 'components/LoadingFakeText'
import { WORKFLOW_QUERY } from 'features/workflow/edit/queries/WorkflowQuery'
import { emptyObject } from 'utils/constants'
import { useQuery } from '@apollo/client'

const WorkflowPresentation = ({ name, version }) => {
  const [diagram] = useState(getApplicationDiagram())
  const { engine } = diagram

  const { data, loading } = useQuery(WORKFLOW_QUERY, {
    variables: { name, version, skip: false }
  })

  if (loading) return <LoadingFakeText lines={8} />

  return <BodyWidget canvasClass={'dataflow-canvas-popover'} workflow={data?.getWorkflow || emptyObject} engine={engine} locked={true} />
}

WorkflowPresentation.propTypes = {
  name: PropTypes.string.isRequired,
  version: PropTypes.number.isRequired
}

export default WorkflowPresentation
