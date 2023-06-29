import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
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

const CompleteFailWorkflowInputItem = ({ outputItemKey, outputItemValue, outputLens, disableSave }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [editMode, setEditMode] = useState(outputItemKey ? false : true)

  const [itemLens, dirtyInfo, resetItem] = useChangeTrackingLens([outputItemKey, outputItemValue])

  const handleSaveItem = useCallback(() => {
    over(
      outputLens,
      map(item => (head(item) === outputItemKey ? itemLens |> get : item))
    )
    disableSave(false)
    setEditMode(false)
  }, [itemLens, outputItemKey, outputLens, disableSave])

  const handleRemoveItem = useCallback(() => {
    over(
      outputLens,
      filter(item => head(item) !== outputItemKey)
    )
  }, [outputItemKey, outputLens])

  const handleEditHeaderItem = useCallback(() => {
    setEditMode(true)
    disableSave(true)
  }, [disableSave])

  const handleCancelHeaderItem = useCallback(() => {
    resetItem()
    if (isEmpty(outputItemKey)) {
      over(
        outputLens,
        filter(header => head(header) !== outputItemKey)
      )
    }
    disableSave(false)
    setEditMode(false)
  }, [outputItemKey, outputLens, resetItem, disableSave])

  return editMode ? (
    <Tr>
      <Td className={classes.tableContent}>
        <CustomTextField fullWidth value={itemLens[0] |> get} onChange={itemLens[0] |> set |> onTextBoxChange} debounceBy={100} />
      </Td>
      <Td className={classes.tableContent}>
        <CustomTextField fullWidth value={itemLens[1] |> get} onChange={itemLens[1] |> set |> onTextBoxChange} debounceBy={100} />
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
        <Typography variant='caption'> {outputItemKey}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        <Typography variant='caption'> {outputItemValue}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        <DeleteButton size='small' color={'themeNoBackground'} title={t('General.Buttons.Delete')} onClick={handleRemoveItem} />
        <EditButton size='small' color={'themeNoBackground'} title={t('General.Buttons.Edit')} onClick={handleEditHeaderItem} />
      </Td>
    </Tr>
  )
}

CompleteFailWorkflowInputItem.propTypes = {
  outputItemKey: PropTypes.string.isRequired,
  outputItemValue: PropTypes.any,
  outputLens: PropTypes.object.isRequired,
  disableSave: PropTypes.func.isRequired
}

export default CompleteFailWorkflowInputItem
