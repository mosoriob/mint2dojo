mint2dojo
=========

A tool to integrate MINT with Dojo

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mint2dojo.svg)](https://npmjs.org/package/mint2dojo)
[![Downloads/week](https://img.shields.io/npm/dw/mint2dojo.svg)](https://npmjs.org/package/mint2dojo)
[![License](https://img.shields.io/npm/l/mint2dojo.svg)](https://github.com/mosoriob/mint2dojo/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mint2dojo
$ mint2dojo COMMAND
running command...
$ mint2dojo (-v|--version|version)
mint2dojo/0.0.0 linux-x64 node-v14.15.0
$ mint2dojo --help [COMMAND]
USAGE
  $ mint2dojo COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mint2dojo help [COMMAND]`](#mint2dojo-help-command)
* [`mint2dojo topoflow [FILE]`](#mint2dojo-topoflow-file)

## `mint2dojo help [COMMAND]`

display help for mint2dojo

```
USAGE
  $ mint2dojo help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_

## `mint2dojo topoflow [FILE]`

describe the command here

```
USAGE
  $ mint2dojo topoflow [FILE]

OPTIONS
  -b, --basin=basin            [default: tana] The basin to run
  -e, --end_date=end_date      [default: 2016-01-01] The end date 2015-01-01
  -f, --force
  -h, --help                   show CLI help
  -n, --name=name              name to print
  -s, --start_date=start_date  [default: 2015-01-01] The start date 2015-01-01

EXAMPLE
  $ mint2dojo hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/topoflow.ts](https://github.com/mosoriob/mint2dojo/blob/v0.0.0/src/commands/topoflow.ts)_
<!-- commandsstop -->
