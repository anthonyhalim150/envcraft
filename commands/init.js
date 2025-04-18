import fs from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { __dirname } from '../utils/paths.js';

const LOCAL_CONFIG = path.join(process.cwd(), '.envcraft.json');
const GLOBAL_CONFIG = path.join(os.homedir(), '.envcraft.json');

function readJsonFile(filePath, originLabel) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch {
    console.log(chalk.red(`⚠️  Invalid JSON in ${originLabel}. Deleting.`));
    try {
      fs.unlinkSync(filePath);
      console.log(chalk.yellow(`🧹 Removed corrupted ${originLabel}`));
    } catch (err) {
      console.log(chalk.red(`❌ Failed to remove ${originLabel}: ${err.message}`));
    }
  }
  return {};
}

function loadConfig() {
  const local = readJsonFile(LOCAL_CONFIG, 'local .envcraft.json');
  if (Object.keys(local).length > 0) return local;

  const global = readJsonFile(GLOBAL_CONFIG, 'global ~/.envcraft.json');
  if (Object.keys(global).length > 0) {
    console.log(chalk.gray('📁 Using global config from ~/.envcraft.json'));
    return global;
  }

  return {};
}

function saveConfigFile(config, force) {
  const targetPath = LOCAL_CONFIG;

  if (fs.existsSync(targetPath) && !force) {
    console.log(chalk.yellow(`⚠️  ${path.basename(targetPath)} already exists. Use --force with --save to overwrite.`));
    return;
  }

  try {
    fs.writeFileSync(targetPath, JSON.stringify(config, null, 2));
    console.log(chalk.green(`✅ Saved configuration to ${path.basename(targetPath)}`));
  } catch (err) {
    console.log(chalk.red(`❌ Failed to write config file: ${err.message}`));
  }
}

export function registerInit(program) {
  program
    .command('init')
    .description('Initialize standard config files')
    .option('--lang <language>', 'Language to init (js, python, go)')
    .option('--force', 'Overwrite existing files and allow saving config')
    .option('--only <files>', 'Comma-separated list of specific files to create')
    .option('--dry-run', 'Preview what would happen without making changes')
    .option('--verbose', 'Show detailed output including file paths')
    .option('--preset <name>', 'Use a named preset from /presets. Files will be copied based on the preset config')
    .option('--save', 'Write current options into .envcraft.json')
    .action((cliOptions) => {
      const supported = ['js', 'python', 'go'];
      const configFile = loadConfig();

      const globalConfig = readJsonFile(GLOBAL_CONFIG, 'global ~/.envcraft.json');
      const sources = {};

      const lang =
        (sources.lang = 'CLI', cliOptions.lang) ??
        (sources.lang = 'local', configFile.lang) ??
        (sources.lang = 'global', globalConfig.lang) ??
        (sources.lang = 'default', 'js');

      const force =
        (sources.force = 'CLI', cliOptions.force) ??
        (sources.force = 'local', configFile.force) ??
        (sources.force = 'global', globalConfig.force) ??
        (sources.force = 'default', false);

      const dryRun =
        (sources.dryRun = 'CLI', cliOptions.dryRun) ??
        (sources.dryRun = 'local', configFile.dryRun) ??
        (sources.dryRun = 'global', globalConfig.dryRun) ??
        (sources.dryRun = 'default', false);

      const verbose =
        (sources.verbose = 'CLI', cliOptions.verbose) ??
        (sources.verbose = 'local', configFile.verbose) ??
        (sources.verbose = 'global', globalConfig.verbose) ??
        (sources.verbose = 'default', false);

      const only =
        (sources.only = 'CLI', cliOptions.only && cliOptions.only.split(',')) ??
        (sources.only = 'local', configFile.only) ??
        (sources.only = 'global', globalConfig.only) ??
        (sources.only = 'default', null);

      if (!supported.includes(lang)) {
        console.log(chalk.red(`❌ Unsupported language: ${lang}`));
        return;
      }

      if (cliOptions.save) {
        const configToSave = { lang, force, dryRun, verbose };
        if (only) configToSave.only = only;
        saveConfigFile(configToSave, force);
      }

      const templateDir = path.join(__dirname, '..', 'templates', lang);
      if (!fs.existsSync(templateDir)) {
        console.log(chalk.red(`❌ No templates found for language: ${lang}`));
        return;
      }

      const filesToCreate = fs.readdirSync(templateDir);
      const selectedFiles = only || filesToCreate;

      console.log(chalk.gray(`📄 Using config: lang=${lang}, force=${force}, dryRun=${dryRun}, only=${only || 'all'}, verbose=${verbose}`));

      selectedFiles.forEach(file => {
        const src = path.join(templateDir, file);
        const dest = path.join(process.cwd(), file);

        if (!fs.existsSync(src)) {
          console.log(chalk.red(`⚠️  Template for ${file} not found, skipping.`));
          return;
        }

        if (fs.existsSync(dest) && !force) {
          const msg = `⚠️  Skipping ${file} — already exists`;
          dryRun
            ? console.log(chalk.yellow(`🔍 Would skip: ${msg}`))
            : console.log(chalk.yellow(msg));
          return;
        }

        if (dryRun) {
          console.log(chalk.cyan(`🔍 Would create ${file}`));
          if (verbose) console.log(`   from: ${src}\n   to:   ${dest}`);
        } else {
          fs.copyFileSync(src, dest);
          console.log(chalk.green(`✅ Created ${file}`));
          if (verbose) console.log(`   from: ${src}\n   to:   ${dest}`);
        }
      });

      console.log(
        dryRun
          ? chalk.blue(`✨ Dry run complete. No files were modified.`)
          : chalk.blue(`🎉 Environment setup complete for ${lang}`)
      );
    });
}
