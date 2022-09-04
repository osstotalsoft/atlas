import tableStyle from 'assets/jss/components/tableStyle'

const styles = theme => ({
  ...tableStyle(theme),
  table: {
    ...theme.table.main,
    lineHeight: '2em',
    marginTop: '0px'
  },
  tabLabel: {
    fontWeight: 'bold'
  },
  primaryText: {
    fontWeight: 'bold'
  },
  paper: {
    height: '100%',
    padding: '8px'
  },
  pre: {
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word'
  }
})

export default styles
