import fetch from 'node-fetch';
import { ModelExecutions } from '../types'

export  async function fetchTopoflowExecution(start_date: string, end_date: string, model_config_id: string): Promise<ModelExecutions> {
    const topoflowQuery = `
  fragment emulator_execution_info on execution {
    id
    results {
      model_output {
        name
        __typename
      }
      resource {
        id
        name
        url
        __typename
      }
      __typename
    }
    __typename
  }
  query executions_for_parameter_values(
    $start_date: String!
    $end_date: String!
    $modelType: String!
  ) {
    execution(
      limit: 100
      offset: 0
      where: {
        status: { _eq: "SUCCESS" }
        thread_model_executions: {
          thread_model: { model: { id: { _eq: $modelType } } }
        }
        _and: [
          {
            _or: [
              {
                parameter_bindings: {
                  model_parameter: { name: { _eq: "start_date" } }
                  parameter_value: { _in: [$start_date] }
                }
              }
            ]
          }
          {
            _or: [
              {
                parameter_bindings: {
                  model_parameter: { name: { _eq: "end_date" } }
                  parameter_value: { _in: [$end_date] }
                }
              }
            ]
          }
        ]
      }
    ) {
      ...emulator_execution_info
      __typename
    }
  }
  
  
    `
    const response = await fetch('https://graphql.dev.mint.isi.edu/v1/graphql', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },

        body: JSON.stringify({
            query: topoflowQuery,
            variables: {
                start_date: start_date,
                end_date: end_date,
                modelType: model_config_id,
            },
        }),
    })

    const { data, errors } = await response.json()
    type JSONResponse = {
        data?: {
            executions: ModelExecutions
        }
    }
    if (response.ok) {
        if (data) {
            return data
        } else {
            return Promise.reject(new Error(`No pokemon with the name`))
        }
    } else {
        return Promise.reject(new Error(`No pokemon with the nam}"`))
    }

}
