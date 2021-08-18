import { Command, flags } from '@oclif/command'
import {ModelExecutions} from '../types'
import { fetchTopoflowExecution } from '../queries/topoflow'
import { linkDownloader } from '../utils'

const galana_model: string = "https://w3id.org/okn/i/mint/5f98775c-0e2e-4da7-bf24-5b1125a4268b"
const tana_model: string = "https://w3id.org/okn/i/mint/f5d67b8d-e70a-45f2-a5f9-11eeadf741ad"
const mapping:  { [id: string] : string; } = {'tana': tana_model, 'galana': galana_model}



export default class Topoflow extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ mint2dojo hello
hello world from ./src/hello.ts!
`,
  ]
  static flags = {
    help: flags.help({ char: 'h' }),
    start_date: flags.string({ char: 's', description: 'The start date 2015-01-01', default: '2015-01-01'}),
    end_date: flags.string({ char: 'e', description: 'The end date 2015-01-01', default: '2016-01-01'}),
    basin: flags.string({ char: 'b', description: 'The basin to run', default: "tana"}),
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
    let model_config_id: string = mapping[flags.basin]
    let executions: ModelExecutions = await fetchTopoflowExecution(start_date, end_date, model_config_id)
    let urls = executions.execution.map((execution => {
      return execution.results.map(result => {
        return result.resource.url
        //linkDownloader(result.resource.url)
      })
    })
    )
    console.log(urls)
    for (let url of urls[0]){
      await linkDownloader(url)
    }
  }
}
