import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { TextField, IconButton } from '@totalsoft/rocket-ui'
import { get, over, set, useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { filter, head, isEmpty, map } from 'ramda'
import { useTranslation } from 'react-i18next'
import { Td, Tr } from 'react-super-responsive-table'
import tableStyle from 'assets/jss/components/tableStyle'

const useStyles = makeStyles(tableStyle)

const HttpNodeHeaderItem = ({ headerItemKey, headerItemValue, headersLens }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const [editMode, setEditMode] = useState(headerItemKey ? false : true)

  const [itemLens, dirtyInfo, resetItem] = useChangeTrackingLens([headerItemKey, headerItemValue])

  const handleSaveItem = useCallback(() => {
    over(
      headersLens,
      map(header => (head(header) === headerItemKey ? itemLens |> get : header))
    )

    setEditMode(false)
  }, [headerItemKey, headersLens, itemLens])

  const handleRemoveItem = useCallback(() => {
    over(
      headersLens,
      filter(header => head(header) !== headerItemKey)
    )
  }, [headerItemKey, headersLens])

  const handleEditHeaderItem = useCallback(() => {
    setEditMode(true)
  }, [])

  const handleCancelHeaderItem = useCallback(() => {
    resetItem()
    if (isEmpty(headerItemKey)) {
      over(
        headersLens,
        filter(header => head(header) !== headerItemKey)
      )
    }
    setEditMode(false)
  }, [headerItemKey, headersLens, resetItem])

  return editMode ? (
    <Tr>
      <Td className={classes.tableContent}>
        <Grid container spacing={2}>
          <Grid item xs={5}>
            <TextField fullWidth multiline value={itemLens[0] |> get} onChange={itemLens[0] |> set |> onTextBoxChange} debounceBy={100} />
          </Grid>
          <Grid item xs={5}>
            <TextField fullWidth multiline value={itemLens[1] |> get} onChange={itemLens[1] |> set |> onTextBoxChange} debounceBy={100} />
          </Grid>
        </Grid>
      </Td>
      <Td className={classes.tableContent}>
        <IconButton size='tiny' color='secondary' type="cancel" variant="text" title={t('General.Buttons.Cancel')} onClick={handleCancelHeaderItem} />
        <IconButton
          size='tiny' color='secondary' type="save" variant="text"
          title={t('General.Buttons.Save')}
          onClick={handleSaveItem}
          disabled={!dirtyInfo}
        />
      </Td>
    </Tr>
  ) : (
    <Tr>
      <Td className={classes.tableContent}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography style={{ overflowWrap: 'anywhere' }}> {headerItemKey}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{ overflowWrap: 'anywhere' }}> {headerItemValue}</Typography>
          </Grid>
        </Grid>
      </Td>
      <Td className={classes.tableContent}>
        <IconButton size='tiny' color='secondary' type="delete" variant="text" title={t('General.Buttons.Delete')} onClick={handleRemoveItem} />
        <IconButton size='tiny' color='secondary' type="edit" variant="text" title={t('General.Buttons.Edit')} onClick={handleEditHeaderItem} />
      </Td>
    </Tr>
  )
}

HttpNodeHeaderItem.propTypes = {
  headerItemKey: PropTypes.string.isRequired,
  headerItemValue: PropTypes.any,
  headersLens: PropTypes.object.isRequired
}

export default HttpNodeHeaderItem
