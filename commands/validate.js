import { validateEnv } from '../validate.js';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { __dirname } from '../utils/paths.js';

export function registerValidate(program) {
  program
    .command('validate')
    .description('Check for missing config files')
    .option('--lang <language>', 'Language to validate (js, python, go)', 'js')
    .action(({ lang }) => {
      const missing = validateEnv(lang);
      if (missing.length === 0) {
        console.log(chalk.green('✅ All required config files are present.'));
      } else {
        console.log(chalk.red('❌ Missing config files:'));
        missing.forEach(file => console.log(`- ${file}`));

   
        const templateDir = path.join(__dirname, '..', 'templates', lang);
        if (fs.existsSync(templateDir)) {
          const available = fs.readdirSync(templateDir);
          console.log('\n🔍 Available files in templates:');
          available.forEach(file => console.log(`  • ${file}`));
        }
      }
    });
}
