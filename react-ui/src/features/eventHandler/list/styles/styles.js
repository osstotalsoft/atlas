import tableStyle from 'assets/jss/components/tableStyle'

const styles = theme => ({
  ...tableStyle(theme),
  buttonBox: {
    minWidth: '90px'
  },
  breakWordSpan: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' }
})

export default styles
