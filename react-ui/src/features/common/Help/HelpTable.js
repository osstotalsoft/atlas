import React from 'react'
import PropTypes from 'prop-types'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core'
import styles from 'assets/jss/components/tableStyle'

const useStyles = makeStyles(styles)

const HelpTable = ({ columns, rows, hasTranslations }) => {
  const { t } = useTranslation()
  const classes = useStyles()

  return (
    <Table className={classes.table}>
      <Thead>
        <Tr>
          {columns.map(c => (
            <Th key={c.field} className={classes.tableHeader}>
              {hasTranslations ? t(c.headerName) : c.headerName}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((r, index) => (
          <Tr key={index}>
            {columns.map(c => (
              <Td key={c.field} className={classes.tableContent}>
                {hasTranslations ? t(r[c.field]) : r[c.field]}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

HelpTable.propTypes = {
  hasTranslations: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired
    })
  ),
  rows: PropTypes.arrayOf(PropTypes.object)
}

export default HelpTable
