import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import React, { useCallback } from 'react'
import styles from '../../styles/styles'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { get, set } from '@totalsoft/react-state-lens'
import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@totalsoft/rocket-ui'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import beautify from 'js-beautify'

const useStyles = makeStyles(styles)

const HttpNodeBody = ({ httpRequestLens }) => {
  const { t } = useTranslation()
  const classes = useStyles()
  const body = httpRequestLens?.body |> get

  const handleBeautify = useCallback(() => {
    set(httpRequestLens?.body, beautify(body))
  }, [body, httpRequestLens?.body])

  return (
    <Table className={classes.table} style={{ height: '100%', minHeight: '200px' }}>
      <Thead>
        <Tr>
          <Th className={classes.tableHeader}>
            <Grid container justifyContent='space-between'>
              <Grid item>{t('WorkflowTask.Http.Body')}</Grid>
              <Grid item>
                <IconButton size='tiny' variant="text" color='secondary' tooltip={t('General.Buttons.Beautify')} onClick={handleBeautify}>
                  <LocalFloristIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Th>
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
              value={body}
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
