import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { CustomTextField, IconCard, LoadingFakeText } from '@bit/totalsoft_oss.react-mui.kit.core'
import { Search } from '@material-ui/icons'
import { Grid } from '@material-ui/core'
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
    return <LoadingFakeText lines={3} />
  }

  return (
    <IconCard
      icon={Search}
      content={
        <Grid container spacing={3}>
          <Grid item lg={3} xs={12}>
            <CustomTextField
              fullWidth
              label={t('EventHandler.Name')}
              value={filters.name || emptyString}
              onChange={handleNameChange}
              debounceBy={200}
            />
          </Grid>
          <Grid item lg={3} xs={12}>
            <CustomTextField
              fullWidth
              label={t('EventHandler.Sink')}
              value={filters.event || emptyString}
              onChange={handleSinkChange}
              debounceBy={200}
            />
          </Grid>
        </Grid>
      }
    />
  )
}

EventHandlerListFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChangeFilters: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
}

export default EventHandlerListFilter
