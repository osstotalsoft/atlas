import React from 'react'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MenuIcon from '@mui/icons-material/Menu'
import HistoryIcon from '@mui/icons-material/History';
import SummarizeIcon from '@mui/icons-material/Summarize';

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
  },
  { icon: <HistoryIcon />, text: 'NavBar.History', path: '/history', name: 'History' },
  { icon: <SummarizeIcon />, text: 'NavBar.ExecutionHistory', path: '/execution-history', name: 'ExecutionHistory' },
]

export default menuItems
