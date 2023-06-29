import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { CustomTextField, IconCard, Autocomplete, Button } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Search } from '@mui/icons-material'
import { Grid } from '@mui/material'
import { curry } from 'ramda'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { emptyObject, emptyString } from 'utils/constants'
import { executionStatusList } from '../constants/executionStatusList'

const ExecutionListFilter = ({ filters, onApplyFilters, onResetFilters }) => {
  const { t } = useTranslation()
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterPropertyChange = curry((prop, value) => setLocalFilters(prevFilters => ({ ...prevFilters, [prop]: value })))

  const handleApplyFilters = useCallback(() => onApplyFilters(localFilters), [localFilters, onApplyFilters])

  const handleResetFilters = useCallback(() => {
    setLocalFilters(emptyObject)
    onResetFilters()
  }, [onResetFilters])

  const keyPressed = useCallback(({ keyCode }) => keyCode === 13 && handleApplyFilters(), [handleApplyFilters])

  return (
    <>
      <IconCard
        icon={Search}
        content={
          <div onKeyDown={keyPressed} tabIndex='0'>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <CustomTextField
                  fullWidth
                  label={t('Execution.Name')}
                  value={filters.workflowType || emptyString}
                  onChange={handleFilterPropertyChange('workflowType') |> onTextBoxChange}
                  debounceBy={100}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <CustomTextField
                  fullWidth
                  label={t('Execution.WorkflowId')}
                  value={filters.workflowId || emptyString}
                  onChange={handleFilterPropertyChange('workflowId') |> onTextBoxChange}
                  debounceBy={100}
                />
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <Autocomplete
                  label={t('Execution.Status')}
                  simpleValue
                  isClearable
                  valueKey={'name'}
                  options={executionStatusList}
                  value={localFilters?.status || emptyString}
                  onChange={handleFilterPropertyChange('status')}
                />
              </Grid>
            </Grid>
          </div>
        }
      />
      <Button size={'sm'} color={'primary'} right={true} onClick={handleResetFilters}>
        {t('General.Buttons.ResetFilters')}
      </Button>
      <Button size={'sm'} color={'primary'} right={true} onClick={handleApplyFilters}>
        {t('General.Buttons.ApplyFilters')}
      </Button>
    </>
  )
}

ExecutionListFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired
}

export default ExecutionListFilter
