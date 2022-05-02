const defaultConfiguration = {
  retryCount: 1,
  timeoutSeconds: 60,
  timeoutPolicy: 'TIME_OUT_WF',
  retryLogic: 'FIXED',
  retryDelaySeconds: 1,
  responseTimeoutSeconds: 10,
  rateLimitPerFrequency: 1,
  rateLimitFrequencyInSeconds: 1
}

export default defaultConfiguration
