import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@bit/totalsoft_oss.react-mui.kit.core'
import SearchIcon from '@mui/icons-material/Search'
import WorkflowPresentationDialog from './modals/WorkflowPresentationDialog'

const PresentationDiagramButton = ({ subworkflowName, subworkflowVersion, iconSize }) => {
  const [dialog, showDialog] = useState(false)
  const handleToggleDialog = useCallback(() => showDialog(current => !current), [])

  return (
    <>
      <IconButton size={iconSize} className='help' onClick={handleToggleDialog} color='themeNoBackground'>
        <SearchIcon />
      </IconButton>
      <WorkflowPresentationDialog
        open={dialog}
        subworkflowName={subworkflowName}
        subworkflowVersion={subworkflowVersion}
        onClose={handleToggleDialog}
      />
    </>
  )
}

PresentationDiagramButton.propTypes = {
  subworkflowName: PropTypes.string.isRequired,
  subworkflowVersion: PropTypes.number.isRequired,
  iconSize: PropTypes.oneOf(['small', 'medium'])
}

export default PresentationDiagramButton
