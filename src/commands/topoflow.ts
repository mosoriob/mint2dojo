import { Command, flags } from '@oclif/command'
import {ModelExecutions} from '../types'
import { fetchTopoflowExecution } from '../queries/topoflow'

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
    let executions: ModelExecutions = await fetchTopoflowExecution(start_date, end_date)
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
