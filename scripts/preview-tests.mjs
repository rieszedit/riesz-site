import { spawn, spawnSync } from 'node:child_process'

for (const args of [
  ['node_modules/typescript/bin/tsc', '-b'],
  ['node_modules/vite/bin/vite.js', 'build', '--logLevel', 'warn'],
]) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}
const server = spawn(
  process.execPath,
  [
    'node_modules/vite/bin/vite.js',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '41983',
    '--strictPort',
  ],
  { stdio: 'inherit' },
)
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => server.kill())
server.on('exit', (code) => process.exit(code ?? 0))
