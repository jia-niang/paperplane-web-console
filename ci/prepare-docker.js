const fs = require('fs')
const path = require('path')

const outputDir = '.deps'
const subModuleDir = 'packages'
const copyFiles = ['package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', '.npmrc']

function extraDependencyDefinition() {
  fs.rmSync(outputDir, { recursive: true, force: true })
  fs.mkdirSync(outputDir, { recursive: true })

  for (const file of copyFiles) {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(outputDir, file))
    }
  }

  const subModuleNames = fs.readdirSync(subModuleDir)
  for (const subModuleName of subModuleNames) {
    const subModulePath = path.join(subModuleDir, subModuleName)
    const subModuleOutputDir = path.join(outputDir, subModulePath)
    for (const file of copyFiles) {
      if (fs.existsSync(path.join(subModulePath, file))) {
        fs.mkdirSync(subModuleOutputDir, { recursive: true })
        fs.copyFileSync(path.join(subModulePath, file), path.join(subModuleOutputDir, file))
      }
    }
  }
}

function prepareDocker() {
  extraDependencyDefinition()
}

prepareDocker()
