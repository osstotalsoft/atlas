import tableStyle from 'assets/jss/components/tableStyle'

const styles = theme => ({
  ...tableStyle(theme),
  table: {
    ...theme.table.main,
    lineHeight: '2em',
    marginTop: '0px'
  },
  bodyContent: {
    overflowWrap: 'anywhere'
  }
})

export default styles
