const fs = require('fs')
const path = require('path')

const outputDir = '.deps'
const subModuleDir = 'packages'
const copyFiles = ['package.json', '.npmrc', 'pnpm-lock.yaml', 'pnpm-workspace.yaml']

function extraDependencyDefinition() {
  fs.rmSync(outputDir, { recursive: true, force: true })
  fs.mkdirSync(outputDir, { recursive: true })
  console.log(`${outputDir}`)

  const subModuleNames = fs.readdirSync(subModuleDir)
  for (const subModuleName of subModuleNames) {
    const subModulePath = path.join(subModuleDir, subModuleName)
    const subModuleOutputDir = path.join(outputDir, subModulePath)

    console.log(` ├── ${subModuleName}`)

    const fileList = copyFiles.filter(f => fs.existsSync(path.resolve(subModulePath, f)))
    for (const file of fileList) {
      fs.mkdirSync(subModuleOutputDir, { recursive: true })
      if (fs.existsSync(path.join(subModulePath, file))) {
        fs.copyFileSync(path.join(subModulePath, file), path.join(subModuleOutputDir, file))

        const isLastFile = fileList.indexOf(file) >= fileList.length - 1
        console.log(isLastFile ? ` │   └── ${file}` : ` │   ├── ${file}`)
      }
    }
  }

  const fileList = copyFiles.filter(f => fs.existsSync(f))
  for (const file of fileList) {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(outputDir, file))

      const isLast = fileList.indexOf(file) >= fileList.length - 1
      console.log(isLast ? ` └── ${file}` : ` ├── ${file}`)
    }
  }

  console.log(`\nDone.`)
}

function prepareDocker() {
  extraDependencyDefinition()
}

prepareDocker()
