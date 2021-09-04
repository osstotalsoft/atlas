import React from 'react'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted'
import CodeIcon from '@material-ui/icons/Code'

const menuConfig = [
  { icon: <CodeIcon />, text: 'NavBar.SystemTasks', name: 'SystemTasks' },
  { icon: <FormatListBulletedIcon />, text: 'NavBar.Tasks', name: 'Tasks' },
  { icon: <AccountTreeIcon />, text: 'NavBar.Workflows', name: 'Workflows' }
]

export default menuConfig
