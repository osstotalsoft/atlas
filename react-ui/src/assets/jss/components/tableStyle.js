const tableStyles = theme => ({
  table: {
    ...theme.table.main,
    width: '-webkit-fill-available',
    '&.responsiveTable ': {
      '@media (max-width: 40em)': {
        '&tr': {
          border: 0,
          borderBottom: theme.table.tableContent.borderBottom
        }
      }
    }
  },
  tableHeader: {
    ...theme.table.tableHeader,
    backgroundColor: '#f0fbff',
    color: "#555555",
    whiteSpace: 'nowrap'
  },
  tableContent: {
    ...theme.table.tableContent,
    cursor: 'pointer'
  },
  itemSelected: {
    ...theme.table.itemSelected
  },
  enableScrollX: {
    overflowX: 'auto',
    width: '100%'
  }
})

export default tableStyles
