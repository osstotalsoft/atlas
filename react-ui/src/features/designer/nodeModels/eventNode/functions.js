export const getDefaultEventMessage = () => {
  if (process.env.REACT_APP_USE_NBB_MESSAGE === 'true')
    return {
      Payload: {
        DocumentId: '${workflow.input.DocumentId}',
        SiteId: '${workflow.input.SiteId}'
      },
      Headers: '${workflow.input.Headers}'
    }
  else return {}
}
