import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import CustomTextField from '@bit/totalsoft_oss.react-mui.custom-text-field'
import DeleteButton from '@bit/totalsoft_oss.react-mui.delete-button'
import { get, over, set, useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { filter, head, isEmpty, map } from 'ramda'
import EditButton from '@bit/totalsoft_oss.react-mui.edit-button'
import { useTranslation } from 'react-i18next'
import CancelButton from '@bit/totalsoft_oss.react-mui.cancel-button'
import SaveButton from '@bit/totalsoft_oss.react-mui.save-button'
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
            <CustomTextField
              fullWidth
              multiline
              value={itemLens[0] |> get}
              onChange={itemLens[0] |> set |> onTextBoxChange}
              debounceBy={100}
            />
          </Grid>
          <Grid item xs={5}>
            <CustomTextField
              fullWidth
              multiline
              value={itemLens[1] |> get}
              onChange={itemLens[1] |> set |> onTextBoxChange}
              debounceBy={100}
            />
          </Grid>
        </Grid>
      </Td>
      <Td className={classes.tableContent}>
        <CancelButton size='small' color={'themeNoBackground'} title={t('General.Buttons.Cancel')} onClick={handleCancelHeaderItem} />
        <SaveButton
          size='small'
          color={'themeNoBackground'}
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
        <DeleteButton size='small' color={'themeNoBackground'} title={t('General.Buttons.Delete')} onClick={handleRemoveItem} />
        <EditButton size='small' color={'themeNoBackground'} title={t('General.Buttons.Edit')} onClick={handleEditHeaderItem} />
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
