import React from 'react'
import PropTypes from 'prop-types'
import ReactJson from 'react-json-view'

const DiagramTaskJson = ({ selectedTask }) => {
  return <ReactJson src={selectedTask} name={false} displayDataTypes={false} enableClipboard={false} style={{ wordBreak: 'break-word' }} />
}

DiagramTaskJson.propTypes = {
  selectedTask: PropTypes.object.isRequired
}

export default DiagramTaskJson
