import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { __dirname } from '../utils/paths.js';

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  for (const file of fs.readdirSync(src)) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const stat = fs.statSync(srcFile);

    if (stat.isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

export function registerSync(program) {
  program
    .command('sync')
    .description('Sync template files from a remote repo')
    .requiredOption('--from <url>', 'GitHub repo or Gist URL')
    .option('--branch <name>', 'Branch to clone (default: main)', 'main')
    .option('--subdir <folder>', 'Subdirectory to copy templates from', 'templates')
    .option('--force', 'Overwrite existing templates if they exist')
    .action(({ from, branch, subdir, force }) => {
      const tempDir = path.join(os.tmpdir(), `envcraft-sync-${Date.now()}`);
      console.log(chalk.gray(`⏳ Cloning from ${from} (branch: ${branch})...`));

      try {
        execSync(`git clone --depth 1 --branch ${branch} ${from} "${tempDir}"`, { stdio: 'ignore' });
      } catch (err) {
        console.log(chalk.red(`❌ Failed to clone repo: ${err.message}`));
        return;
      }

      const sourcePath = path.join(tempDir, subdir);
      const destPath = path.join(__dirname, '..', 'templates');

      if (!fs.existsSync(sourcePath)) {
        console.log(chalk.red(`❌ Subdirectory "${subdir}" not found in repo.`));
        return;
      }

      if (fs.existsSync(destPath) && !force) {
        console.log(chalk.yellow(`⚠️ Templates already exist. Use --force to overwrite.`));
        return;
      }

      copyDir(sourcePath, destPath);
      console.log(chalk.green(`✅ Synced templates to: ${destPath}`));
    });
}
