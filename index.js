#!/usr/bin/env node
import { Command } from 'commander';
import { registerInit } from './commands/init.js';
import { registerValidate } from './commands/validate.js';
import { registerAutofix } from './commands/autofix.js';
import { registerConfig } from './commands/config.js';
import { registerSync } from './commands/sync.js';
import { registerList } from './commands/list.js';
import { registerPresets } from './commands/presets.js';
import { registerScaffold } from './commands/scaffold.js';
import { registerUninstall } from './commands/uninstall.js';
import { registerCompare } from './commands/compare.js';
import { registerCI } from './commands/ci.js';
import { registerDoctor } from './commands/doctor.js';


const program = new Command();

program
  .name('envcraft')
  .version('1.0.0')
  .description(`
A powerful CLI to standardize development environments across your projects.

You can quickly scaffold files like:
  - .editorconfig
  - .prettierrc
  - .eslintrc
  - .nvmrc
  - .python-version

✨ Supports local/global config, dry runs, remote syncing, and more!

Examples:
  $ envcraft init --lang js
  $ envcraft validate --lang python
  $ envcraft config show
  $ envcraft sync --from https://github.com/my-org/config-templates
  $ envcraft presets
`.trim());

registerInit(program);
registerValidate(program);
registerAutofix(program);
registerConfig(program);
registerSync(program);
registerList(program);
registerPresets(program);
registerScaffold(program); 
registerUninstall(program);
registerCompare(program);
registerCI(program);
registerDoctor(program);


program.parse(process.argv);
