import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { __dirname } from '../utils/paths.js';

function copyRecursive(src, dest, verbose) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child), verbose);
    });
  } else {
    fs.copyFileSync(src, dest);
    console.log(chalk.green(`✅ Created ${dest}`));
    if (verbose) {
      console.log(`   from: ${src}\n   to:   ${dest}`);
    }
  }
}

export function registerScaffold(program) {
  program
    .command('scaffold')
    .description('Add starter scaffold files like main.py or index.ts')
    .option('--lang <language>', 'Language to scaffold (js, python, go)', 'js')
    .option('--verbose', 'Show file paths being copied')
    .action(({ lang, verbose }) => {
      const supported = ['js', 'python', 'go'];
      if (!supported.includes(lang)) {
        console.log(chalk.red(`❌ Unsupported language: ${lang}`));
        return;
      }

      const scaffoldPath = path.join(__dirname, '..', 'templates', lang, 'scaffold');
      if (!fs.existsSync(scaffoldPath)) {
        console.log(chalk.red(`❌ No scaffold folder found for ${lang}`));
        return;
      }

      console.log(chalk.gray(`📁 Copying scaffold files for ${lang}...`));
      copyRecursive(scaffoldPath, process.cwd(), verbose);
      console.log(chalk.blue(`🚀 Scaffold setup complete for ${lang}`));
    });
}