import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { TextField } from '@totalsoft/rocket-ui'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import SearchIcon from '@mui/icons-material/Search'
import Help from 'features/common/Help/Help'
import { emptyString } from 'utils/constants'
import styles from '../styles/sidebarStyles'

const S = {
  Tray: styled.div`
    color: white;
    font-family: Helvetica, Arial;
    font-size: 18px;
    padding: 5px;
    margin: 10px 10px;
  `
}

const useStyles = makeStyles(styles)

const TrayWidgetFilter = ({ filters, setFilters, activeTask }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const handleFilterChange = useCallback(
    event => {
      setFilters(event?.target?.value)
    },
    [setFilters]
  )

  const handleKeyDown = useCallback(event => {
    event.stopPropagation()
  }, [])

  return (
    <S.Tray onKeyDown={handleKeyDown}>
      <Grid container>
        <Grid item container xs={12} alignItems='center' spacing={1} className={classes.filterMenu}>
          <Grid item>{activeTask?.name}</Grid>
          <Grid item>{activeTask?.helpConfig && <Help iconSize='small' helpConfig={activeTask?.helpConfig} hasTranslations={true} />}</Grid>
        </Grid>
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <TextField
            fullWidth
            label={t('General.Search')}
            value={filters || emptyString}
            onChange={handleFilterChange}
            debounceBy={200}
            endAdornment={<SearchIcon />}
          />
        </Grid>
      </Grid>
    </S.Tray>
  )
}

TrayWidgetFilter.propTypes = {
  filters: PropTypes.string.isRequired,
  setFilters: PropTypes.func.isRequired,
  activeTask: PropTypes.object.isRequired
}

export default TrayWidgetFilter
