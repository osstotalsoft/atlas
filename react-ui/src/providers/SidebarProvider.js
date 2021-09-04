import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'

export const SidebarContext = createContext()
export const SidebarProvider = ({ children }) => {
  const isWeb = () => window.matchMedia('(min-width: 480px)')?.matches
  return <SidebarContext.Provider value={useState(isWeb)}>{children}</SidebarContext.Provider>
}
SidebarProvider.propTypes = { children: PropTypes.element.isRequired }
