import { Command, flags } from '@oclif/command'
import fetch from 'node-fetch';

export type ModelExecutions = {
  execution: Execution[]
}
export interface Execution {
    id?: string
    results: any[] // Chosen results after completed run
}

async function fetchPokemon(start_date: string, end_date: string): Promise<ModelExecutions> {
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
query executions_for_parameter_values($start_date:String!, $end_date: String!, $modelType: String!) {
      execution( 
        limit: 100
        offset: 0
        where: {
          status: {_eq: "SUCCESS"}, 
          thread_model_executions: {
            thread_model: {
              model: {
                id: {_eq: $modelType}
              }, 
            }
          }, 
          parameter_bindings: {
            _or: [
              {
                model_parameter: {
                  name: {_eq: "end_date"}
                },
           			parameter_value: {_eq: $end_date }
              },
              {
                model_parameter: {
                  name: {_eq: "start_date"}
                },
           			parameter_value: {_eq: $start_date }
              }
            ]

          },
          
          _and: []
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

export default class Hello extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ mint2dojo hello
hello world from ./src/hello.ts!
`,
  ]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Hello)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from ./src/commands/hello.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
    this.log("hi")
    let executions: ModelExecutions = await fetchPokemon("2015-01-01", "2018-01-01")
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
