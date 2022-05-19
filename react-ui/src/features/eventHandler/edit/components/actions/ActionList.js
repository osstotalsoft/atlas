import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, makeStyles } from '@material-ui/core'
import styles from '../../styles/styles'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import Action from './Action'
import { sequence } from '@totalsoft/rules-algebra-react'
import { map, addIndex, remove } from 'ramda'
import { useTranslation } from 'react-i18next'
import ActionDetails from './ActionDetails'
import Card from '@bit/totalsoft_oss.react-mui.card'
import { set, get, over } from '@totalsoft/change-tracking-react'
import { Typography } from '@bit/totalsoft_oss.react-mui.kit.core'
import { isValid, getErrors } from '@totalsoft/pure-validations-react'

const useStyles = makeStyles(styles)

const ActionList = ({ handlerLens, editInProgress, validation }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const [saveDisabled, disableSave] = useState(false)
  const [initialAction, setInitialAction] = useState()
  const dataIsValid = isValid(validation)

  const handleEditAction = useCallback(action => setInitialAction(action), [])

  const handleCancelEdit = useCallback(
    (actionLens, index) => () => {
      if (!initialAction) {
        over(handlerLens?.actions, remove(index, 1))
        return
      }
      set(actionLens, initialAction)
      setInitialAction(null)
    },
    [handlerLens?.actions, initialAction]
  )

  const handleSaveAction = useCallback(
    actionLens => () => {
      set(actionLens?.editMode, false)
      setInitialAction(null)
    },
    []
  )

  const handleDeleteAction = useCallback(index => () => over(handlerLens?.actions, remove(index, 1)), [handlerLens])

  return (
    <>
      <Grid className={classes.enableScrollX}>
        <Table className={classes.table} style={{ marginBottom: '30px' }}>
          <Thead>
            <Tr>
              <Th className={classes.tableHeader}>{t('EventHandler.Action')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {handlerLens?.actions
              |> sequence
              |> addIndex(map)((actionLens, index) => (
                <Action
                  key={index}
                  actionLens={actionLens}
                  onEditAction={handleEditAction}
                  onDeleteAction={handleDeleteAction(index)}
                  onCancelEdit={handleCancelEdit(actionLens, index)}
                  onSaveAction={handleSaveAction(actionLens)}
                  editInProgress={editInProgress}
                  validation={validation[index]}
                  saveDisabled={saveDisabled}
                />
              ))}
          </Tbody>
        </Table>
        {!dataIsValid && (
          <Typography style={{ display: 'flex' }} color={'error'} variant={'caption'}>
            {getErrors(validation)}
          </Typography>
        )}
      </Grid>
      {handlerLens?.actions
        |> sequence
        |> addIndex(map)((actionLens, index) => {
          const action = actionLens |> get
          return (
            action?.editMode &&
            action?.action && (
              <Card key={index}>
                <ActionDetails key={index} actionLens={actionLens} disableSave={disableSave} />
              </Card>
            )
          )
        })}
    </>
  )
}

ActionList.propTypes = {
  handlerLens: PropTypes.object.isRequired,
  editInProgress: PropTypes.bool,
  validation: PropTypes.object.isRequired
}

export default ActionList
