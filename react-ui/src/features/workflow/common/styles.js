import tableStyle from 'assets/jss/components/tableStyle'

const styles = theme => ({
  ...tableStyle(theme),
  paper: {
    minWidth: '30%',
    overflowY: 'visible'
  }
})

export default styles
