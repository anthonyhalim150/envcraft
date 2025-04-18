import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

const LOCAL_CONFIG = path.join(process.cwd(), '.envcraft.json');
const GLOBAL_CONFIG = path.join(os.homedir(), '.envcraft.json');

function readJsonSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    return { __error: true };
  }
  return {};
}

function deleteConfig(filePath, label) {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(chalk.green(`🧹 Removed ${label} config (${filePath})`));
    } catch (err) {
      console.log(chalk.red(`❌ Failed to delete ${label} config: ${err.message}`));
    }
  } else {
    console.log(chalk.gray(`⚠️ No ${label} config to delete.`));
  }
}

export function registerConfig(program) {
  const config = program.command('config').description('Manage CLI config files');

  config
    .command('show')
    .description('Show local and global configuration')
    .action(() => {
      const local = readJsonSafe(LOCAL_CONFIG);
      const global = readJsonSafe(GLOBAL_CONFIG);

      if (local.__error) {
        console.log(chalk.red(`❌ Failed to read .envcraft.json (local)`));
      } else if (Object.keys(local).length > 0) {
        console.log(chalk.blue(`📁 Local Config (.envcraft.json)`));
        console.log(local);
      } else {
        console.log(chalk.gray(`⚠️ No local config found.`));
      }

      console.log('');

      if (global.__error) {
        console.log(chalk.red(`❌ Failed to read ~/.envcraft.json (global)`));
      } else if (Object.keys(global).length > 0) {
        console.log(chalk.magenta(`🏠 Global Config (~/.envcraft.json)`));
        console.log(global);
      } else {
        console.log(chalk.gray(`⚠️ No global config found.`));
      }

      console.log('\nℹ️ Use `envcraft init --save` to write local config.');
    });

  config
    .command('clear')
    .description('Clear one or both config files')
    .option('--local', 'Delete project .envcraft.json')
    .option('--global', 'Delete ~/.envcraft.json')
    .action(({ local, global }) => {
      if (!local && !global) {
        console.log(chalk.red('⚠️ Specify --local or --global to clear config.'));
        return;
      }

      if (local) deleteConfig(LOCAL_CONFIG, 'local');
      if (global) deleteConfig(GLOBAL_CONFIG, 'global');
    });
}
