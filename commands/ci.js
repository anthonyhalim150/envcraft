import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export function registerCI(program) {
  program
    .command('ci')
    .description('Generate a GitHub Actions CI workflow (lint.yml)')
    .option('--lang <language>', 'Language to generate CI for (js, python, go)', 'js')
    .action(({ lang }) => {
      const workflowDir = path.join(process.cwd(), '.github', 'workflows');
      const outputPath = path.join(workflowDir, 'lint.yml');

      fs.mkdirSync(workflowDir, { recursive: true });

      const templates = {
        js: `name: Lint JS

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npx eslint . --ext .js,.ts
`,
        python: `name: Lint Python

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pip install flake8
      - run: flake8 .
`,
        go: `name: Lint Go

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
      - run: golangci-lint run
`
      };

      const content = templates[lang];
      if (!content) {
        console.log(chalk.red(`❌ Unsupported language: ${lang}`));
        return;
      }

      fs.writeFileSync(outputPath, content);
      console.log(chalk.green(`✅ GitHub Actions workflow created at: ${outputPath}`));
    });
}
