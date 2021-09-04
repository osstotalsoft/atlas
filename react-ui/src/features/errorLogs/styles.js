import styles from 'assets/jss/styles'

const logCardStyles = theme => {
  const { defaultFont } = styles(theme)

  return {
    primaryText: {
      ...defaultFont,
      marginBottom: '6px',
      fontWeight: 'bold'
    },
    paper: {
      height: '100%',
      padding: '10px'
    },
    container: {
      marginTop: '10px'
    }
  }
}

export default logCardStyles
