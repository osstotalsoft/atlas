import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { makeStyles } from '@material-ui/core'
import styles from '../../styles/styles'
import AddButton from '@bit/totalsoft_oss.react-mui.add-button'
import { useTranslation } from 'react-i18next'
import { get, over, promap } from '@totalsoft/react-state-lens'
import { append, fromPairs, head, last, toPairs } from 'ramda'
import CompleteFailWorkflowInputItem from './CompleteFailWorkflowInputItem'

const useStyles = makeStyles(styles)

const CompleteFailWorkflowInputList = ({ outputLens, disableSave }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  const specialOutput = outputLens |> promap(toPairs, fromPairs)
  const pairs = specialOutput |> get

  const handleAddNewItem = useCallback(() => {
    over(specialOutput, append(['', '']))
    disableSave(true)
  }, [disableSave, specialOutput])

  return (
    <Table className={classes.table}>
      <Thead>
        <Tr>
          <Th className={`${classes.tableHeader} ${classes.parametersColumn}`}>{t('EventHandler.OutputParameter')}</Th>
          <Th className={`${classes.tableHeader} ${classes.valuesColumn}`}>{t('EventHandler.OutputValue')}</Th>
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
          <CompleteFailWorkflowInputItem
            key={head(pair)}
            outputItemKey={head(pair)}
            outputItemValue={last(pair)}
            outputLens={specialOutput}
            disableSave={disableSave}
          />
        ))}
      </Tbody>
    </Table>
  )
}

CompleteFailWorkflowInputList.propTypes = {
  outputLens: PropTypes.object.isRequired,
  disableSave: PropTypes.func.isRequired
}

export default CompleteFailWorkflowInputList
