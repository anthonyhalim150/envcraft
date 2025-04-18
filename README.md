# envcraft

![npm](https://img.shields.io/npm/v/envcraft)
![downloads](https://img.shields.io/npm/dm/envcraft)
![license](https://img.shields.io/npm/l/envcraft)
![node](https://img.shields.io/node/v/envcraft)

> 🛠️ A powerful CLI to standardize development environments across your projects.

---

## ✨ Features

- Scaffold essential config files (`.editorconfig`, `.eslintrc`, `.prettierrc`, etc.)
- Use smart presets like `react`, `nestjs`, `python-fastapi`
- Auto-fix and validate missing config
- Generate GitHub Actions CI workflows
- Scaffold starter code (`main.py`, `main.go`, `src/index.ts`)
- Sync templates from a remote repo
- Works with `npx` or global install

---

## 📦 Installation

### Run instantly (no install):
```bash
npx envcraft init --lang js
```

### Or install globally:
```bash
npm install -g envcraft
```

---

## 🚀 Usage

### 🧱 Initialize Environment
```bash
envcraft init --lang js
envcraft init --preset react
envcraft init --lang python --only .editorconfig,.python-version
```

### 🔍 Validate Config
```bash
envcraft validate --lang js
```

### 🛠️ Auto-Fix
```bash
envcraft autofix --lang js
envcraft autofix --lang python --verbose --skip-scaffold
```

### 📁 Scaffold Starter Code
```bash
envcraft scaffold --lang python
```

### 🔁 Sync Templates from Remote
```bash
envcraft sync --from https://github.com/my-org/env-templates
```

### 📋 List Available Templates and Presets
```bash
envcraft list --lang js
envcraft presets
```

### 🩺 Project Health Check
```bash
envcraft doctor --lang js
envcraft doctor --lang python --fix
```

### 🔄 Uninstall All Config Files
```bash
envcraft uninstall --lang go
```

### 📊 Compare Local Files to Templates
```bash
envcraft compare --lang js
```

### 🧪 Generate CI Workflow
```bash
envcraft ci --lang js
```

---

## 📁 File Structure

```
.envcraft.json          # optional project config
/templates/<lang>/        # config templates
/templates/<lang>/scaffold/ # starter code
/presets/                 # JSON presets
/commands/                # CLI command modules
```

---

## 🧠 Example Presets

```bash
envcraft init --preset react
```

Presets are stored in `/presets/` and include:

- react
- nestjs
- python-fastapi
- go-api

---

## 🧪 Roadmap

- `envcraft doctor --fix`
- `envcraft upgrade` from remote
- VS Code workspace generator
- Exportable config GUI (optional)

---

## 🪪 License

MIT
