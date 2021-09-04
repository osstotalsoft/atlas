import styles from 'assets/jss/styles'

const helperStyles = theme => {
  const { dangerColor } = styles(theme)

  return {
    title: {
      textTransform: 'none'
    },
    paper: {
      padding: theme.spacing(2)
    },
    marginBottom: {
      marginBottom: '10px'
    },
    primaryText: {
      padding: '1px 16px'
    },
    secondaryText: {
      padding: '1px 16px',
      color: theme.palette.text.darkGrey
    },
    bold: {
      fontWeight: 'bold'
    },
    italic: {
      fontWeight: 'italic'
    },
    red: {
      color: dangerColor
    },
    yellow: {
      backgroundColor: 'yellow'
    }
  }
}
export default helperStyles
