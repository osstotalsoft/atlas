import tableStyle from 'assets/jss/components/tableStyle'

const styles = theme => {
  return {
    ...tableStyle(theme),
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
      },
      lineHeight: '2.6em'
    },
    parametersColumn: {
      width: '50%'
    },
    valuesColumn: {
      width: '42%'
    },
    buttonsColumn: {
      width: '100px'
    }
  }
}

export default styles
