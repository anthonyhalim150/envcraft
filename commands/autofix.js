import { autoFix } from '../validate.js';

export function registerAutofix(program) {
  program
    .command('autofix')
    .description('Create any missing config files automatically')
    .option('--lang <language>', 'Language to autofix (js, python, go)', 'js')
    .option('--verbose', 'Show detailed output for created files')
    .action(({ lang, verbose }) => {
      autoFix(lang, verbose);
    });
}
