import React from 'react'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import AssignmentIcon from '@material-ui/icons/Assignment'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MenuIcon from '@material-ui/icons/Menu'


const menuItems = [
  { icon: <AccountTreeIcon />, text: 'NavBar.Workflows', path: '/workflows', name: 'Workflows' },
  { icon: <PlayCircleFilledIcon />, text: 'NavBar.Executions', path: '/executions', name: 'Executions' },
  {
    icon: <MenuIcon />,
    text: 'NavBar.Configurations',
    name: 'Configurations',
    children: [
      { icon: <NotificationsIcon />, text: 'NavBar.EventHandlers', path: '/eventHandlers', name: 'EventHandlers' },
      { icon: <AssignmentIcon />, text: 'NavBar.Tasks', path: '/tasks', name: 'Tasks' }
    ]
  }
]

export default menuItems
