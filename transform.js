var path = require('path')
var xtend = require('xtend')
var through = require('through2')
var staticModule = require('static-module')
var enoki = require('.')

module.exports = enokiDirectoryTransform

function enokiDirectoryTransform (filename) {
  if (/\.json$/.test(filename)) return through()

  var vars = {
    __filename: filename,
    __dirname: path.dirname(filename)
  }

  var sm = staticModule({
    enoki: readDir
  }, {
    vars: vars,
    varModules: { path: path }
  })

  return sm

  function readDir (opts) {
    var site = enoki(xtend({
      directory: vars.__dirname,
      onFile: function (path) {
        sm.emit('file', path)
      }
    }, opts))

    var stream = through()
    stream.push(JSON.stringify(site, { }, 2))
    stream.push(null)
    return stream
  }
}
