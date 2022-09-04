import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Typography, makeStyles } from '@material-ui/core'
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

const ScheduleContextData = ({ inputItemKey, inputItemValue, inputLens, disableSave }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [editMode, setEditMode] = useState(inputItemKey ? false : true)

  const [itemLens, dirtyInfo, resetItem] = useChangeTrackingLens([inputItemKey, inputItemValue])

  const handleSaveItem = useCallback(() => {
    over(
      inputLens,
      map(item => (head(item) === inputItemKey ? itemLens |> get : item))
    )
    disableSave(false)
    setEditMode(false)
  }, [inputItemKey, inputLens, itemLens, disableSave])

  const handleRemoveItem = useCallback(() => {
    over(
      inputLens,
      filter(item => head(item) !== inputItemKey)
    )
  }, [inputItemKey, inputLens])

  const handleEditHeaderItem = useCallback(() => {
    setEditMode(true)
    disableSave(true)
  }, [disableSave])

  const handleCancelHeaderItem = useCallback(() => {
    resetItem()
    if (isEmpty(inputItemKey)) {
      over(
        inputLens,
        filter(header => head(header) !== inputItemKey)
      )
    }
    disableSave(false)
    setEditMode(false)
  }, [inputItemKey, inputLens, resetItem, disableSave])

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
        <Typography variant='caption'> {inputItemKey}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        <Typography variant='caption'> {inputItemValue}</Typography>
      </Td>
      <Td className={classes.tableContent}>
        <DeleteButton size='small' color={'themeNoBackground'} title={t('General.Buttons.Delete')} onClick={handleRemoveItem} />
        <EditButton size='small' color={'themeNoBackground'} title={t('General.Buttons.Edit')} onClick={handleEditHeaderItem} />
      </Td>
    </Tr>
  )
}

ScheduleContextData.propTypes = {
  inputItemKey: PropTypes.string.isRequired,
  inputItemValue: PropTypes.any,
  inputLens: PropTypes.object.isRequired,
  disableSave: PropTypes.func.isRequired
}

export default ScheduleContextData
