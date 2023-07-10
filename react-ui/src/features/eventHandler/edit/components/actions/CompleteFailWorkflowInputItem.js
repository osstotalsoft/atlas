import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { TextField, IconButton } from '@totalsoft/rocket-ui'
import { get, over, set, useChangeTrackingLens } from '@totalsoft/change-tracking-react'
import { onTextBoxChange } from 'utils/propertyChangeAdapters'
import { filter, head, isEmpty, map } from 'ramda'
import { useTranslation } from 'react-i18next'
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
        <TextField fullWidth value={itemLens[0] |> get} onChange={itemLens[0] |> set |> onTextBoxChange} debounceBy={100} />
      </Td>
      <Td className={classes.tableContent}>
        <TextField fullWidth value={itemLens[1] |> get} onChange={itemLens[1] |> set |> onTextBoxChange} debounceBy={100} />
      </Td>
      <Td className={classes.tableContent}>
        <IconButton
          size='tiny'
          color='secondary'
          type='save'
          variant='text'
          title={t('General.Buttons.Save')}
          onClick={handleSaveItem}
          disabled={!dirtyInfo}
        />
        <IconButton
          size='tiny'
          color='secondary'
          type='cancel'
          variant='text'
          title={t('General.Buttons.Cancel')}
          onClick={handleCancelHeaderItem}
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
        <IconButton
          size='tiny'
          color='secondary'
          type='edit'
          variant='text'
          title={t('General.Buttons.Edit')}
          onClick={handleEditHeaderItem}
        />
        <IconButton
          size='tiny'
          color='secondary'
          type='delete'
          variant='text'
          title={t('General.Buttons.Delete')}
          onClick={handleRemoveItem}
        />
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
