import React from 'react'
import { useQueryWithErrorHandling } from 'hooks/errorHandling'
import { EXECUTION_HISTORY_QUERY } from '../queries/HistoryQuery'
import { FakeText } from '@totalsoft/rocket-ui'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useTranslation } from 'react-i18next'

const ExecutionHistoryContainer = () => {
    const { t } = useTranslation()
  const { loading, data } = useQueryWithErrorHandling(EXECUTION_HISTORY_QUERY, { variables: {} })

  const flows = data?.allExecutionHistory
    ? Object.keys(data?.allExecutionHistory).map(a => ({ name: a, value: data?.allExecutionHistory[a] }))
    : []

  if (loading) return <FakeText lines={8} />

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size='small' aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>{t("History.Flow")}</TableCell>
            <TableCell align='right'>{t("History.ExecutionCount")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flows.map((flow, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component='th' scope='row'>
                {flow.name}
              </TableCell>
              <TableCell align='right'>{flow.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ExecutionHistoryContainer
