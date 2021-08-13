export type ModelExecutions = {
    execution: Execution[]
  }
  export interface Execution {
      id?: string
      results: any[] // Chosen results after completed run
  }