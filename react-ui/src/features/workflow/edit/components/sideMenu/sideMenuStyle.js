import styles from 'assets/jss/styles'

const infoSideMenuStyle = theme => {
  const drawerWidth = 350
  const { whiteColor } = styles(theme)

  return {
    drawerPaper: {
      width: drawerWidth,
      marginTop: '80px'
    },
    button: {
      color: whiteColor
    },
    buttonContainerClose: {
      position: 'fixed',
      bottom: '0px',
      width: '50px',
      height: '50px',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '0 8px 8px 0'
    },
    buttonContainerOpen: {
      position: 'fixed',
      top: '80px',
      right: 0,
      width: '50px',
      height: '50px',
      background: 'rgba(0, 0, 0, 0.4)',
      borderRadius: '8px 0 0 8px'
    }
  }
}

export default infoSideMenuStyle
