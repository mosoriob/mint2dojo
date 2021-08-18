import { Command, flags } from '@oclif/command'
import {ModelExecutions} from '../types'
import { fetchCyclesExecution } from '../queries/cycles'
import { linkDownloader } from '../utils'

const galana_model: string = "https://w3id.org/okn/i/mint/5f98775c-0e2e-4da7-bf24-5b1125a4268b"
const tana_model: string = "https://w3id.org/okn/i/mint/f5d67b8d-e70a-45f2-a5f9-11eeadf741ad"
const mapping:  { [id: string] : string; } = {'tana': tana_model, 'galana': galana_model}



export default class Cycles extends Command {
  static description = 'describe the command here'

  static examples = [
    `$ mint2dojo hello
hello world from ./src/hello.ts!
`,
  ]
  static flags = {
    help: flags.help({ char: 'h' }),
    start_year: flags.string({ char: 's', description: 'The start date 2000', default: '2000'}),
    end_year: flags.string({ char: 'e', description: 'The end date 2017', default: '2020'}),
    force: flags.boolean({ char: 'f' }),
    crop_name: flags.string({ char: 's', description: 'The start date 2000', default: 'Sorghum'}),
    start_planting_day: flags.string({ char: 's', description: 'The start date 2000', default: '103'}),
    weed_fraction: flags.string({ char: 's', description: 'The start date 2000', default: '0.001'}),
    fertilizer_rate: flags.string({ char: 'e', description: 'The end date 2017', default: '0'}),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Cycles)

    
    
    
    
    let start_year : string = flags.start_year
    let end_year : string = flags.end_year
    let crop_name : string = flags.crop_name
    let fertilizer_rate : string = flags.fertilizer_rate
    let start_planting_day : string = flags.start_planting_day
    let weed_fraction : string = flags.weed_fraction

    let model_config_id: string = "https://w3id.org/okn/i/mint/b05d1d22-5f67-4d11-bbcc-b015c9a447de"
    let executions: ModelExecutions = await fetchCyclesExecution( 
      start_year, 
      end_year,
      model_config_id,
      crop_name,
      start_planting_day,
      fertilizer_rate,
      weed_fraction
    )
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
