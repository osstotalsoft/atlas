import React from 'react'
import PropTypes from 'prop-types'
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer'
import omitDeep from 'omit-deep-lodash'
import { useTranslation } from 'react-i18next'
import { Typography } from '@totalsoft/rocket-ui'
import sortobject from 'deep-sort-object'
import { fieldsToBeRemoved } from 'features/common/constants'

const CompareDefinition = ({ definition, currentDefinition , showDates}) => {
  const { t } = useTranslation()

  const old = sortobject({ ...omitDeep(definition, fieldsToBeRemoved) })
  const current = sortobject(omitDeep(currentDefinition, fieldsToBeRemoved))

  return (
    <ReactDiffViewer
      styles={{ diffContainer: { wordBreak: 'break-all' } }}
      oldValue={JSON.stringify(old, null, 2)}
      newValue={JSON.stringify(current, null, 2)}
      extraLinesSurroundingDiff={0}
      showDiffOnly={false}
      optimizeSelection={true}
      viewType='split'
      splitView={true}
      compareMethod={DiffMethod.WORDS}
      leftTitle={
        <Typography variant='h5' align='center'>
          {t('WorkflowHistory.Dialog.Compare.OldDefinition')} {showDates && `(${new Date(definition?.updateTime).toLocaleString()})`}
        </Typography>
      }
      rightTitle={
        <Typography variant='h5' align='center'>
          {t('WorkflowHistory.Dialog.Compare.CurrentDefinition')} {showDates && `(${new Date(currentDefinition?.updateTime).toLocaleString()})`}
        </Typography>
      }
    />
  )
}

CompareDefinition.propTypes = {
  definition: PropTypes.object.isRequired,
  currentDefinition: PropTypes.object,
  showDates: PropTypes.bool
}

export default CompareDefinition
