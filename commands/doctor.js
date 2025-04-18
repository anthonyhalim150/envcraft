import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { autoFix } from '../validate.js';
import { __dirname } from '../utils/paths.js';

export function registerDoctor(program) {
  program
    .command('doctor')
    .description('Check project health: missing config + scaffold files + key packages')
    .option('--lang <language>', 'Language to check (js, python, go)', 'js')
    .option('--fix', 'Automatically fix missing config + scaffold files')
    .option('--verbose', 'Show detailed output')
    .action(({ lang, fix, verbose }) => {
      const templateDir = path.join(__dirname, '..', 'templates', lang);
      const scaffoldDir = path.join(templateDir, 'scaffold');

      if (!fs.existsSync(templateDir)) {
        console.log(chalk.red(`❌ No templates found for language: ${lang}`));
        return;
      }

      console.log(chalk.gray(`🩺 Running environment check for ${lang}...`));

      const templateFiles = fs.readdirSync(templateDir).filter(f => f !== 'scaffold');
      let missingFiles = 0;

      templateFiles.forEach(file => {
        const destPath = path.join(process.cwd(), file);
        if (!fs.existsSync(destPath)) {
          console.log(chalk.red(`❌ Missing: ${file}`));
          missingFiles++;
        } else {
          console.log(chalk.green(`✅ Found: ${file}`));
        }
      });

      if (fs.existsSync(scaffoldDir)) {
        console.log(chalk.gray(`📁 Checking scaffold files...`));
        const checkScaffold = (src, relPath = '') => {
          fs.readdirSync(src).forEach(file => {
            const srcPath = path.join(src, file);
            const destPath = path.join(process.cwd(), relPath, file);
            const stat = fs.statSync(srcPath);

            if (stat.isDirectory()) {
              checkScaffold(srcPath, path.join(relPath, file));
            } else {
              if (fs.existsSync(destPath)) {
                console.log(chalk.green(`✅ Scaffold present: ${path.join(relPath, file)}`));
              } else {
                console.log(chalk.yellow(`⚠️  Missing scaffold file: ${path.join(relPath, file)}`));
              }
            }
          });
        };
        checkScaffold(scaffoldDir);
      }

      console.log(chalk.blue(`🔍 Doctor check complete (${missingFiles} missing config files)`));

      if (fix) {
        console.log(chalk.cyan(`💡 Running autofix to patch missing files...`));
        autoFix(lang, verbose, false);
      }
    });
}
