import tableStyle from 'assets/jss/components/tableStyle'

const styles = theme => {
  return {
    ...tableStyle(theme),
    executeColumn: {
      width: '50px'
    }
  }
}

export default styles
