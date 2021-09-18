const esbuild = require('esbuild')
const fs = require('fs')
esbuild.build({
  entryPoints: ['src/app.jsx'],
  bundle: true,
  outfile: 'dist/out.js',
  sourcemap: true,
  external: ['require', 'fs', 'path'],
  watch: {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error)
      else console.error('watch build succeeded:', result)
      fs.copyFile('src/index.html','dist/index.html', () => console.log("index.html updated")) // todo figure out how to move this file automatically
    } 
  }
}).catch(() => process.exit(1))


console.log("launching server at http://0.0.0.0:8080/")
esbuild.serve({
    servedir: './dist', 
    port: 8080, 
    host: '0.0.0.0',
    onRequest: args => console.log(args)
}, {})

