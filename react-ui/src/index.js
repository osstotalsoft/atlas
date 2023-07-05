import React from 'react'
import ReactDOM from "react-dom/client";
import routes from './routes'
import { BrowserRouter } from 'react-router-dom'
import * as serviceWorker from './serviceWorker'
import { theme } from 'utils/theme'
import { ThemeProvider } from '@mui/material/styles'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import 'utils/i18n'
import './assets/css/index.css'
import 'moment/locale/ro'
import { AreasWrapper } from './providers/AreasProvider'

import AuthApolloProvider from 'apollo/AuthApolloProvider'
import AuthProvider from 'providers/TenantAuthenticationProvider'
import { SidebarProvider } from 'providers/SidebarProvider'
import { ClipboardProvider } from 'providers/ClipboardProvider'
import { StyledEngineProvider } from '@mui/material/styles'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <StyledEngineProvider injectFirst>
    <AreasWrapper>
      <AuthProvider>
        <AuthApolloProvider>
          <ThemeProvider theme={theme}>
            <SidebarProvider>
              <ClipboardProvider>
                <BrowserRouter>{routes}</BrowserRouter>
              </ClipboardProvider>
            </SidebarProvider>
          </ThemeProvider>
        </AuthApolloProvider>
      </AuthProvider>
    </AreasWrapper>
  </StyledEngineProvider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
