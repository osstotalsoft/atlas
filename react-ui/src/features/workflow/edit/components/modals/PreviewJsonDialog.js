import React from 'react'
import PropTypes from 'prop-types'
import CustomDialog from '@bit/totalsoft_oss.react-mui.custom-dialog'
import { useTranslation } from 'react-i18next'
import JsonViewer from 'features/common/components/JsonViewer'

function PreviewJsonDialog({ workflow, open, onClose }) {
  const { t } = useTranslation()
  return (
    <CustomDialog
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
