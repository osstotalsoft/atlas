import React, { useState } from 'react'
import PropTypes from 'prop-types'
import BodyWidget from 'features/designer/components/BodyWidget'
import { getApplicationDiagram } from 'features/designer/diagram/getApplicationDiagram'
import LoadingFakeText from 'components/LoadingFakeText'
import { WORKFLOW_QUERY } from 'features/workflow/edit/queries/WorkflowQuery'
import { emptyObject } from 'utils/constants'
import { useQuery } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import magnifyingGlass from 'assets/img/magnifyingGlass.png'
import { Box } from '@material-ui/core'
import Typography from '@bit/totalsoft_oss.react-mui.typography'

const WorkflowPresentation = ({ name, version }) => {
  const { t } = useTranslation()
  const [diagram] = useState(getApplicationDiagram())
  const { engine } = diagram

  const { data, loading } = useQuery(WORKFLOW_QUERY, {
    variables: { name, version, skip: false }
  })

  const workflow = data?.getWorkflow

  if (loading) return <LoadingFakeText lines={8} />

  return workflow ? (
    <BodyWidget canvasClass={'dataflow-canvas-popover'} workflow={workflow || emptyObject} engine={engine} locked={true} />
  ) : (
    <Box textAlign={'center'}>
      <img height={250} src={magnifyingGlass}></img>
      <Typography variant='h6'>{t('Workflow.WorkflowNotFound')}</Typography>
    </Box>
  )
}

WorkflowPresentation.propTypes = {
  name: PropTypes.string.isRequired,
  version: PropTypes.number.isRequired
}

export default WorkflowPresentation
