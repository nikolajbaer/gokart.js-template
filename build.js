const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['src/app.jsx'],
  bundle: true,
  outfile: 'dist/out.js',
  sourcemap: true,
  external: ['require', 'fs', 'path'],
}).catch(() => process.exit(1)) 


console.log("launching server at http://0.0.0.0:8080/")
esbuild.serve({
    servedir: './dist', 
    port: 8080, 
    host: '0.0.0.0',
    onRequest: args => console.log(args)
}, {})

