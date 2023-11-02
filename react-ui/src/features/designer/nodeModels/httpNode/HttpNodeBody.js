import Editor from '@monaco-editor/react'
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
                <IconButton size='tiny' variant='text' color='secondary' tooltip={t('General.Buttons.Beautify')} onClick={handleBeautify}>
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
            <Editor
              setOptions={{ useWorker: false }}
              language='json'
              width='100%'
              theme='vs-light'
              height='100%'
              autoIndent={true}
              options={{
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                selectOnLineNumbers: true,
                minimap: {
                  enabled: false
                }
              }}
              value={body}
              onChange={httpRequestLens.body |> set}
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
