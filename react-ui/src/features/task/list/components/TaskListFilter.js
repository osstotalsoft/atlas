import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { TextField, Card, FakeText } from '@totalsoft/rocket-ui'
import { Search } from '@mui/icons-material'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { curry } from 'ramda'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'

const TaskListFilter = ({ loading, filters, onChangeFilters }) => {
  const { t } = useTranslation()

  const handleFilterPropertyChange = curry((prop, value) => onChangeFilters(prop, value))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleNameChange = useCallback(onTextBoxChange(handleFilterPropertyChange('name')), [handleFilterPropertyChange])

  if (loading) {
    return <FakeText lines={3} />
  }

  return (
    <Card icon={Search}>
      <div tabIndex='0'>
        <Grid container spacing={3}>
          <Grid item lg={3} xs={12}>
            <TextField fullWidth label={t('Task.Name')} value={filters.name || emptyString} onChange={handleNameChange} debounceBy={200} />
          </Grid>
        </Grid>
      </div>
    </Card>
  )
}

TaskListFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChangeFilters: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default TaskListFilter
