import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { makeStyles } from '@material-ui/core'
import styles from '../../styles/styles'
import AddButton from '@bit/totalsoft_oss.react-mui.add-button'
import { useTranslation } from 'react-i18next'
import { get, over, promap } from '@totalsoft/react-state-lens'
import { append, fromPairs, head, last, toPairs } from 'ramda'
import StartWorkflowInputItem from './StartWorkflowInputItem'

const useStyles = makeStyles(styles)

const StartWorkflowInputList = ({ inputLens, disableSave }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const specialInput = inputLens |> promap(toPairs, fromPairs)
  const pairs = specialInput |> get

  const handleAddNewItem = useCallback(() => {
    over(specialInput, append(['', '']))
    disableSave(true)
  }, [disableSave, specialInput])

  return (
    <Table className={classes.table}>
      <Thead>
        <Tr>
          <Th className={`${classes.tableHeader} ${classes.parametersColumn}`}>{t('EventHandler.InputParameter')}</Th>
          <Th className={`${classes.tableHeader} ${classes.valuesColumn}`}>{t('EventHandler.InputValue')}</Th>
          <Th className={`${classes.tableHeader} ${classes.buttonsColumn}`}>
            <AddButton
              key='addButton'
              size='small'
              fontSize='medium'
              title={t('General.Buttons.Add')}
              onClick={handleAddNewItem}
              color='themeNoBackground'
            />
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {pairs?.map(pair => (
          <StartWorkflowInputItem
            key={head(pair)}
            inputItemKey={head(pair)}
            inputItemValue={last(pair)}
            inputLens={specialInput}
            disableSave={disableSave}
          />
        ))}
      </Tbody>
    </Table>
  )
}

StartWorkflowInputList.propTypes = {
  inputLens: PropTypes.object.isRequired,
  disableSave: PropTypes.func.isRequired
}

export default StartWorkflowInputList
