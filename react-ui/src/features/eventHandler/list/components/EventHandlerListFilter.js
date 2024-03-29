import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { TextField, Card, FakeText } from '@totalsoft/rocket-ui'
import { Search } from '@mui/icons-material'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { emptyString } from 'utils/constants'
import { curry } from 'ramda'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'

const EventHandlerListFilter = ({ loading, filters, onChangeFilters }) => {
  const { t } = useTranslation()

  const handleFilterPropertyChange = curry((prop, value) => onChangeFilters(prop, value))
  const handleNameChange = useCallback(onTextBoxChange(handleFilterPropertyChange('name')), [handleFilterPropertyChange]) // eslint-disable-line react-hooks/exhaustive-deps
  const handleSinkChange = useCallback(onTextBoxChange(handleFilterPropertyChange('event')), [handleFilterPropertyChange]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return <FakeText lines={3} />
  }

  return (
    <Card icon={Search}>
      <Grid container spacing={3}>
        <Grid item lg={3} xs={12}>
          <TextField
            fullWidth
            label={t('EventHandler.Name')}
            value={filters.name || emptyString}
            onChange={handleNameChange}
            debounceBy={500}
          />
        </Grid>
        <Grid item lg={3} xs={12}>
          <TextField
            fullWidth
            label={t('EventHandler.Sink')}
            value={filters.event || emptyString}
            onChange={handleSinkChange}
            debounceBy={500}
          />
        </Grid>
      </Grid>
    </Card>
  )
}

EventHandlerListFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChangeFilters: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default EventHandlerListFilter
