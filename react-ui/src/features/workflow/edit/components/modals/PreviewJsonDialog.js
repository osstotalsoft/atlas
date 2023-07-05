import React from 'react'
import PropTypes from 'prop-types'
import { Dialog } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import JsonViewer from 'features/common/components/JsonViewer'

function PreviewJsonDialog({ workflow, open, onClose }) {
  const { t } = useTranslation()
  return (
    <Dialog
      id='previewJson'
      open={open}
      showActions={false}
      onClose={onClose}
      title={t('Workflow.Dialog.PreviewJson')}
      content={<JsonViewer workflow={workflow} />}
    />
  )
}

PreviewJsonDialog.propTypes = {
  workflow: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default PreviewJsonDialog
