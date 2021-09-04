import React from 'react'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import AssignmentIcon from '@material-ui/icons/Assignment'
import Settings from '@material-ui/icons/Settings'
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled'
import NotificationsIcon from '@material-ui/icons/Notifications'

const menuItems = [
  { icon: <AccountTreeIcon />, text: 'NavBar.Workflows', path: '/workflows', name: 'Workflows' },
  { icon: <PlayCircleFilledIcon />, text: 'NavBar.Executions', path: '/executions', name: 'Executions' },
  { icon: <NotificationsIcon />, text: 'NavBar.EventHandlers', path: '/eventHandlers', name: 'EventHandlers' },
  { icon: <AssignmentIcon />, text: 'NavBar.Tasks', path: '/tasks', name: 'Tasks' },
  { icon: <Settings />, text: 'NavBar.Settings', path: '/settings', name: 'Settings' }
]

export default menuItems
