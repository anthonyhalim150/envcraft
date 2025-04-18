import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { __dirname } from '../utils/paths.js';

const PRESET_DIR = path.join(__dirname, '..', 'presets');

export function registerPresets(program) {
  program
    .command('presets')
    .description('List available configuration presets')
    .action(() => {
      if (!fs.existsSync(PRESET_DIR)) {
        console.log(chalk.gray('No presets folder found.'));
        return;
      }

      const files = fs.readdirSync(PRESET_DIR).filter(f => f.endsWith('.json'));

      if (files.length === 0) {
        console.log(chalk.gray('No presets available.'));
        return;
      }

      console.log(chalk.blue('📦 Available presets:\n'));
      files.forEach(file => {
        const name = file.replace('.json', '');
        console.log(`  • ${name}`);
      });
    });
}
