import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { __dirname } from '../utils/paths.js';

export function registerList(program) {
  program
    .command('list')
    .description('List available template files for a language')
    .option('--lang <language>', 'Language to list (js, python, go)', 'js')
    .action(({ lang }) => {
      const templateDir = path.join(__dirname, '..', 'templates', lang);
      if (!fs.existsSync(templateDir)) {
        console.log(chalk.red(`❌ No templates found for language: ${lang}`));
        return;
      }

      const files = fs.readdirSync(templateDir);
      if (files.length === 0) {
        console.log(chalk.gray(`(No templates found in ${lang})`));
        return;
      }

      console.log(chalk.blue(`📁 Available ${lang} templates:`));
      files.forEach(file => console.log(`  • ${file}`));
    });
}
