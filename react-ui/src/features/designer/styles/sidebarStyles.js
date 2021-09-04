// ##############################
// // // Sidebar styles
// #############################

import styles from 'assets/jss/styles'

const sidebarStyle = theme => {
  const { defaultFont, menuActiveColor, menuActiveBkColor } = styles(theme)

  return {
    paper: {
      position: 'sticky',
      top: '69px',
      bottom: '0',
      left: '0',
      zIndex: '9998',
      width: '80px',
      background: '#333333',
      boxShadow: '5px 0px 15px -10px #ffffff'
    },
    menuList: {
      marginTop: '15px',
      paddingLeft: '0',
      paddingTop: '0',
      paddingBottom: '0',
      marginBottom: '0',
      listStyle: 'none',
      color: 'inherit'
    },
    menuItem: {
      color: 'inherit',
      position: 'relative',
      display: 'block',
      zIndex: '9999',
      paddingLeft: '10px',
      paddingRight: '10px',
      margin: '10px 15px 0',
      borderRadius: '3px',
      padding: '10px 15px',
      backgroundColor: 'transparent',
      ...defaultFont,
      width: 'auto',
      '&:hover': {
        outline: 'none',
        backgroundColor: theme.palette.sideMenu.hoverBgColor,
        boxShadow: 'none'
      },
      '&:focus': {
        outline: 'none',
        backgroundColor: theme.palette.sideMenu.focusBgColor,
        boxShadow: 'none'
      },
      '&,&:hover,&:focus': {
        color: 'inherit'
      }
    },
    menuItemIcon: {
      color: 'inherit',
      width: '30px',
      height: '24px',
      float: 'left',
      position: 'inherit',
      top: '3px',
      textAlign: 'center',
      verticalAlign: 'middle',
      opacity: '0.8'
    },
    menuItemText: {
      ...defaultFont,
      color: 'inherit',
      margin: '0',
      lineHeight: '30px',
      opacity: '0',
      position: 'relative',
      display: 'block',
      height: 'auto',
      whiteSpace: 'nowrap',
      fontWeight: 'bold'
    },
    menuActiveColor: {
      '&,&:hover,&:focus': {
        color: menuActiveColor,
        backgroundColor: menuActiveBkColor
      }
    },
    filterMenu: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '30px',
      color: 'black'
    }
  }
}

export default sidebarStyle
