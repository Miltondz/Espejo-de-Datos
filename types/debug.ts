export interface ToolCallTrace {
  round:         number
  tool:          string
  inputSummary:  string
  outputSummary: string
  elapsedMs:     number
  status:        'ok' | 'error'
}

export interface AgentTraceResponse {
  model:        string
  demoId:       string
  totalMs:      number
  rounds:       number
  trace:        ToolCallTrace[]
  finalSignals: Array<{ id: string; tipo: string; titulo: string }>
  success:      boolean
  error?:       string
}
