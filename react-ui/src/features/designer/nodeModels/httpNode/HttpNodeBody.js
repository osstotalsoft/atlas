import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import React from 'react'
import styles from '../../styles/styles'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { get, set } from '@totalsoft/react-state-lens'
import { makeStyles } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(styles)

const HttpNodeBody = ({ httpRequestLens }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Table className={classes.table} style={{ height: '100%', minHeight: '200px' }}>
      <Thead>
        <Tr>
          <Th className={classes.tableHeader}>{t('WorkflowTask.Http.Body')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>
            <AceEditor
              mode={'javascript'}
              width='100%'
              theme='tomorrow'
              height='100%'
              fontSize={16}
              value={httpRequestLens?.body |> get}
              onChange={httpRequestLens.body |> set}
              wrapEnabled={true}
            />
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
}

HttpNodeBody.propTypes = {
  httpRequestLens: PropTypes.object.isRequired
}

export default HttpNodeBody
