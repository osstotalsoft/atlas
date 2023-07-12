import React from 'react'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import CodeIcon from '@mui/icons-material/Code'

const menuConfig = [
  { icon: <CodeIcon />, text: 'NavBar.SystemTasks', name: 'SystemTasks' },
  { icon: <FormatListBulletedIcon />, text: 'NavBar.Tasks', name: 'Tasks' },
  { icon: <AccountTreeIcon />, text: 'NavBar.Workflows', name: 'Workflows' }
]

export default menuConfig
