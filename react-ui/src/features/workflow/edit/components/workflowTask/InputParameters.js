import React from 'react'
import PropTypes from 'prop-types'
import { get } from '@totalsoft/rules-algebra-react'
import InputParametersList from './InputParametersList'
import { nodeConfig } from 'features/designer/constants/NodeConfig'
import LambdaNodeInputParameters from 'features/designer/nodeModels/lambdaNode/LambdaNodeInputParameters'
import HttpNodeInputParameters from 'features/designer/nodeModels/httpNode/HttpNodeInputParameters'
import InputParametersHeader from './InputParametersHeader'
import { Divider } from '@mui/material'
import EventNodeInputParameters from 'features/designer/nodeModels/eventNode/EventNodeInputParameters'

const InputParameters = ({ inputParametersLens, inputTemplate, nodeType, onPayloadChange }) => {
  const renderInputParameters = type => {
    switch (type) {
      case nodeConfig.HTTP.type:
        return (
          <HttpNodeInputParameters
            httpRequestLens={
              inputParametersLens?.http_request |> get ? inputParametersLens?.http_request : inputParametersLens?.httpRequest
            }
          />
        )
      case nodeConfig.LAMBDA.type:
        return (
          <>
            <InputParametersHeader inputParametersLens={inputParametersLens} />
            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
            <InputParametersList inputParametersLens={inputParametersLens} />
            <LambdaNodeInputParameters inputParametersLens={inputParametersLens} />
          </>
        )
      case nodeConfig.EVENT.type:
        return <EventNodeInputParameters inputParametersLens={inputParametersLens} onPayloadChange={onPayloadChange} />
      default:
        return (
          <>
            <InputParametersHeader inputParametersLens={inputParametersLens} />
            <Divider style={{ marginTop: '10px', marginBottom: '10px' }} />
            <InputParametersList inputParametersLens={inputParametersLens} inputTemplate={inputTemplate} />
          </>
        )
    }
  }
  return renderInputParameters(nodeType)
}

InputParameters.propTypes = {
  inputParametersLens: PropTypes.object.isRequired,
  inputTemplate: PropTypes.object,
  nodeType: PropTypes.string.isRequired,
  onPayloadChange: PropTypes.func.isRequired
}

export default InputParameters
