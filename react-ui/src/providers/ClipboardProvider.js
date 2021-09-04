import React, { createContext, useState } from 'react'
import PropTypes from 'prop-types'
import { emptyArray } from 'utils/constants'

export const ClipboardContext = createContext()
export const ClipboardProvider = ({ children }) => (
  <ClipboardContext.Provider value={useState(emptyArray)}>{children}</ClipboardContext.Provider>
)
ClipboardProvider.propTypes = { children: PropTypes.element.isRequired }
