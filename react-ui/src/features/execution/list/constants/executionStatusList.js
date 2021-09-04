export const executionStatus = {
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  TIMED_OUT: 'TIMED_OUT',
  TERMINATED: 'TERMINATED',
  PAUSED: 'PAUSED'
}

export const executionStatusList = [
  { name: executionStatus.RUNNING },
  { name: executionStatus.COMPLETED },
  { name: executionStatus.FAILED },
  { name: executionStatus.TIMED_OUT },
  { name: executionStatus.TERMINATED },
  { name: executionStatus.PAUSED }
]
