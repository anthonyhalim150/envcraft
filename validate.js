import fs from 'fs';
import path from 'path';
import { __dirname } from './utils/paths.js';

export function validateEnv(lang) {
  const templateDir = path.join(__dirname, 'templates', lang);
  if (!fs.existsSync(templateDir)) return [];

  return fs.readdirSync(templateDir)
    .filter(file => file !== 'scaffold')
    .filter(file => !fs.existsSync(path.join(process.cwd(), file)));
}

export function autoFix(lang, verbose = false, skipScaffold = false) {
  const templateDir = path.join(__dirname, 'templates', lang);
  const scaffoldDir = path.join(templateDir, 'scaffold');
  const missing = validateEnv(lang);

  if (!fs.existsSync(templateDir)) {
    console.log(`❌ No templates found for language: ${lang}`);
    return;
  }

  if (missing.length === 0 && (skipScaffold || !fs.existsSync(scaffoldDir))) {
    console.log('✅ Nothing to fix. All config files already exist.');
    return;
  }

  console.log(`🛠️  Fixing config files for ${lang}...`);

  // Core config files
  missing.forEach(file => {
    const src = path.join(templateDir, file);
    const dest = path.join(process.cwd(), file);

    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Created ${file}`);
      if (verbose) console.log(`   from: ${src}\n   to:   ${dest}`);
    } else {
      console.log(`⚠️  Template for ${file} not found, skipping.`);
    }
  });

  // Scaffold files
  if (!skipScaffold && fs.existsSync(scaffoldDir)) {
    console.log(`📁 Adding scaffold files...`);
    const walk = (src, relPath = '') => {
      const items = fs.readdirSync(src);
      items.forEach(item => {
        const srcItem = path.join(src, item);
        const destItem = path.join(process.cwd(), relPath, item);
        const stat = fs.statSync(srcItem);

        if (stat.isDirectory()) {
          fs.mkdirSync(destItem, { recursive: true });
          walk(srcItem, path.join(relPath, item));
        } else {
          fs.copyFileSync(srcItem, destItem);
          console.log(`✅ Scaffolded ${path.join(relPath, item)}`);
          if (verbose) console.log(`   from: ${srcItem}\n   to:   ${destItem}`);
        }
      });
    };

    walk(scaffoldDir);
  }

  console.log(`🎉 Autofix complete for ${lang}`);
}
