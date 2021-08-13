import { Command, flags } from '@oclif/command'
import { string } from '@oclif/command/lib/flags';
import fetch from 'node-fetch';
import { start } from 'repl';

export type ModelExecutions = {
  execution: Execution[]
}
export interface Execution {
    id?: string
    results: any[] // Chosen results after completed run
}

async function fechTopoflowExecution(start_date: string, end_date: string): Promise<ModelExecutions> {
  const pokemonQuery = `
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
      query: pokemonQuery,
      variables: { 
        start_date: start_date,
        end_date: end_date,
        modelType: "https://w3id.org/okn/i/mint/b93ea0b1-1715-4178-9354-ada679d1d140",
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

export default class Topoflow extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ mint2dojo hello
hello world from ./src/hello.ts!
`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    start_date: flags.string({ char: 's', description: 'The start date 2015-01-01'}),
    end_date: flags.string({ char: 'e', description: 'The end date 2015-01-01'}),
    name: flags.string({ char: 'n', description: 'name to print' }),
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Topoflow)

    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
    let start_date : string = flags.start_date
    let end_date : string = flags.end_date
    let executions: ModelExecutions = await fechTopoflowExecution(start_date, end_date)
    let files = executions.execution.map((execution => {
      return execution.results.map(result => {
        return result.resource.url
      })
    }))
    if (files.length > 0){
      console.log(files[0])
    }
  }
}
