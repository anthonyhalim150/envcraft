import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { __dirname } from '../utils/paths.js';

const knownFiles = {
  js: ['.editorconfig', '.prettierrc', '.eslintrc', '.nvmrc', '.env.example', '.gitignore', 'tsconfig.json', 'babel.config.js'],
  python: ['.editorconfig', '.python-version', 'requirements.txt', '.gitignore', '.env.example', 'pyproject.toml', '.pylintrc', 'mypy.ini'],
  go: ['.editorconfig', 'go.mod', '.gitignore', '.env.example', '.golangci.yml']
};

export function registerUninstall(program) {
  program
    .command('uninstall')
    .description('Remove all known generated config files for a given language')
    .option('--lang <language>', 'Language to clean (js, python, go)', 'js')
    .action(({ lang }) => {
      const files = knownFiles[lang];
      if (!files) {
        console.log(chalk.red(`❌ Unsupported language: ${lang}`));
        return;
      }

      console.log(chalk.gray(`🧹 Uninstalling config files for ${lang}...`));
      files.forEach(file => {
        const target = path.join(process.cwd(), file);
        if (fs.existsSync(target)) {
          fs.rmSync(target, { recursive: true, force: true });
          console.log(chalk.green(`❌ Removed ${file}`));
        } else {
          console.log(chalk.yellow(`⚠️  ${file} not found`));
        }
      });
      console.log(chalk.blue(`✅ Uninstall complete for ${lang}`));
    });
}
