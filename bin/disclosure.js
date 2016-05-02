#!/usr/bin/env node

var archy = require('archy')
var chalk = require('chalk')

var async = require('async')
var charm = require('charm')()
var pkg = require('../package.json')
var program = require('commander')
var ora = require('ora')

// Exec flow deps
var getDeps = require('../lib/get-deps')
var getPkg = require('../lib/get-pkg')
var parseDeps = require('../lib/parse-deps')
var rankDeps = require('../lib/rank-deps')

// Describe program
program
  .version(pkg.version)
  .option('-d, --depth [depth]', 'Max display depth of the dependency tree')
  .parse(process.argv)

// Handle stdout and clean terminal
charm.pipe(process.stdout)
charm.reset()

// Create loading spinner
var spinner = ora({
  text: 'Loading dependencies',
  spinner: 'circleHalves',
  color: 'yellow'
})

async.waterfall([
  // Get project package.json
  getPkg,

  // Get dependencies of project
  getDeps(program.depth),

  parseDeps,

  rankDeps
], function (err, archyObj) {
  spinner.stop()

  if (err) {
    charm
      .write(err.stack)
      .write('\n')
  } else {
    charm.write(archy(deps.archyObj))
  }
})
