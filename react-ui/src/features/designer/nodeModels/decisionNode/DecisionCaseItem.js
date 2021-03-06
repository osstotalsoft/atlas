import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import { emptyString } from 'utils/constants'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import DeleteButton from '@bit/totalsoft_oss.react-mui.delete-button'
import { useTranslation } from 'react-i18next'

const DecisionCaseItem = ({ caseItem, index, onChange, onRemove }) => {
  const { t } = useTranslation()

  const handleChange = useCallback(
    event => {
      onChange(caseItem, event.target.value)
    },
    [caseItem, onChange]
  )
  return (
    <>
      <Grid item xs={10}>
        <CustomTextField
          fullWidth
          label={`${t('WorkflowTask.Decision.Case')} ${index + 1}`}
          onChange={handleChange}
          value={caseItem || emptyString}
          variant='outlined'
        />
      </Grid>
      <Grid item xs={2}>
        <DeleteButton key='addButton' color={'themeNoBackground'} title={t('General.Buttons.Delete')} onClick={onRemove} />
      </Grid>
    </>
  )
}

DecisionCaseItem.propTypes = {
  caseItem: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

export default DecisionCaseItem
