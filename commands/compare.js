import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { __dirname } from '../utils/paths.js';

export function registerCompare(program) {
  program
    .command('compare')
    .description('Compare local config files with templates')
    .option('--lang <language>', 'Language to compare (js, python, go)', 'js')
    .action(({ lang }) => {
      const templateDir = path.join(__dirname, '..', 'templates', lang);
      if (!fs.existsSync(templateDir)) {
        console.log(chalk.red(`❌ No templates found for language: ${lang}`));
        return;
      }

      const files = fs.readdirSync(templateDir);
      console.log(chalk.gray(`🔍 Comparing files for ${lang}...`));

      files.forEach(file => {
        const src = fs.readFileSync(path.join(templateDir, file), 'utf-8');
        const destPath = path.join(process.cwd(), file);
        if (!fs.existsSync(destPath)) {
          console.log(chalk.yellow(`⚠️  ${file} missing locally`));
        } else {
          const local = fs.readFileSync(destPath, 'utf-8');
          if (local !== src) {
            console.log(chalk.red(`❌ ${file} differs from template`));
          } else {
            console.log(chalk.green(`✅ ${file} matches`));
          }
        }
      });

      console.log(chalk.blue(`🔍 Compare finished for ${lang}`));
    });
}
