import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@totalsoft/rocket-ui'
import HttpNodeHeaderItem from './HttpNodeHeaderItem'
import { Table, Thead, Tbody, Tr, Th } from 'react-super-responsive-table'
import { makeStyles } from '@mui/styles'
import styles from '../../styles/styles'
import { append, head, toPairs } from 'ramda'
import { get, over, promap } from '@totalsoft/react-state-lens'
import { useTranslation } from 'react-i18next'
import { fromPairs, last } from 'lodash'

const useStyles = makeStyles(styles)

const HttpNodeHeaderList = ({ httpRequestLens }) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const specialHeaders = httpRequestLens?.headers |> promap(toPairs, fromPairs)
  const pairs = specialHeaders |> get

  const handleAddNewItem = useCallback(() => {
    over(specialHeaders, append(['', '']))
  }, [specialHeaders])

  return (
    <Table className={classes.table}>
      <Thead>
        <Tr>
          <Th className={classes.tableHeader}>{t('WorkflowTask.Http.Headers')}</Th>
          <Th className={`${classes.tableHeader} ${classes.buttonsColumn}`}>
            <IconButton
              key='addButton'
              type='add'
              size='tiny'
              variant='text'
              fontSize='medium'
              title={t('General.Buttons.Add')}
              onClick={handleAddNewItem}
              color='secondary'
            />
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {pairs.map(pair => (
          <HttpNodeHeaderItem key={head(pair)} headerItemKey={head(pair)} headerItemValue={last(pair)} headersLens={specialHeaders} />
        ))}
      </Tbody>
    </Table>
  )
}

HttpNodeHeaderList.propTypes = {
  httpRequestLens: PropTypes.object.isRequired
}

export default HttpNodeHeaderList
