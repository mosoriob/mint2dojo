import fetch from 'node-fetch';
import { ModelExecutions } from '../types'

export  async function fetchCyclesExecution(
  start_year: string,
  end_year: string,
  model_config_id: string,
  crop_name: string,
  start_planting_day: string,
  fertilizer_rate: string,
  weed_fraction: string,
  ): Promise<ModelExecutions> {
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
    $start_year: String!
    $end_year: String!
    $modelType: String!
    $crop_name: String!
    $fertilizer_rate: String!
		$start_planting_day: String!
    $weed_fraction: String!
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
                  model_parameter: { name: { _eq: "start_year" } }
                  parameter_value: { _in: [$start_year] }
                }
              }
            ]
          }
          {
            _or: [
              {
                parameter_bindings: {
                  model_parameter: { name: { _eq: "end_year" } }
                  parameter_value: { _in: [$end_year] }
                }
              }
                ]
          }
          {
            _or: [
              {
                parameter_bindings: {
                  model_parameter: { name: { _eq: "crop_name" } }
                  parameter_value: { _in: [$crop_name] }
                }
              }
                ]
          }
          {
            _or: [
              {
                parameter_bindings: {
                  model_parameter: { name: { _eq: "fertilizer_rate" } }
                  parameter_value: { _in: [$fertilizer_rate] }
                }
              }
                ]
          }
          {
            _or: [
              {
                parameter_bindings: {
                  model_parameter: { name: { _eq: "start_planting_day" } }
                  parameter_value: { _in: [$start_planting_day] }
                }
              }
                ]
          }
          {
            _or: [
              {
                parameter_bindings: {
                  model_parameter: { name: { _eq: "weed_fraction" } }
                  parameter_value: { _in: [$weed_fraction] }
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
                start_year: start_year,
                end_year: end_year,
                modelType: model_config_id,
                crop_name: crop_name,
                start_planting_day: start_planting_day,
                fertilizer_rate: fertilizer_rate,
                weed_fraction: weed_fraction
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
