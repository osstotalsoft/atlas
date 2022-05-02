import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'components/dialog/Dialog'
import WorkflowPresentation from 'features/common/components/modals/WorkflowPresentation'

const WorkflowPresentationDialog = ({ open, onClose, subworkflowName, subworkflowVersion }) => {
  const handleMouseDown = useCallback(event => {
    event.stopPropagation()
  }, [])

  return (
    <Dialog
      id='previewWorkflow'
      onMouseDown={handleMouseDown}
      open={open}
      title={<div style={{ textAlign: 'center' }}>{subworkflowName}</div>}
      onClose={onClose}
      content={<WorkflowPresentation name={subworkflowName} version={subworkflowVersion} />}
      fullWidth
    />
  )
}

WorkflowPresentationDialog.propTypes = {
  subworkflowName: PropTypes.string.isRequired,
  subworkflowVersion: PropTypes.number.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool
}

export default WorkflowPresentationDialog
