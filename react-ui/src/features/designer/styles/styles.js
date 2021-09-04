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
      lineHeight: '2.6em',
      marginTop: '0'
    },
    buttonsColumn: {
      width: '100px'
    },
    utilitiesBar: {
      border: '1px solid ',
      borderColor: 'lightblue',
      position: 'fixed',
      right: '5%',
      top: '100px',
      zIndex: '1'
    }
  }
}

export default styles
