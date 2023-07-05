import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import { emptyString } from 'utils/constants'
import { TextField, IconButton } from '@totalsoft/rocket-ui'
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
        <TextField
          fullWidth
          label={`${t('WorkflowTask.Decision.Case')} ${index + 1}`}
          onChange={handleChange}
          value={caseItem || emptyString}
          variant='outlined'
        />
      </Grid>
      <Grid item xs={2}>
        <IconButton type='delete' key='deleteButton' color='primary' title={t('General.Buttons.Delete')} onClick={onRemove} />
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
