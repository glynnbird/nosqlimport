#!/usr/bin/env node

process.env.DEBUG=(process.env.DEBUG)?process.env.DEBUG+',nosqlimport':'nosqlimport';

var path = require('path'),
  debug = require('debug')('nosqlimport'),
  nosqlimport = require('../index.js'),
  cloptions = require('commander');

var exit = function(str) {
  console.error('ERROR:' + str);
  process.exit(1);
};

cloptions
  .version(require('../package.json').version)
  .option('-n, --nosql [db type]', 'Database type')
  .option('-t, --transform [filename]', 'Transformation function')
  .option('-d, --delimiter [character]', 'Delimiter (default TAB)')
  .option('--db, --database [db name]', 'Database/Collection name')
  .option('-u, --url [url]', 'URL of database')
  .parse(process.argv);

cloptions.url = cloptions.url || process.env.NOSQL_URL;
cloptions.database = cloptions.database || process.env.NOSQL_DATABASE;

nosqlimport.importStream(process.stdin, process.stdout, cloptions, function(err, data) {
  if (err) {
    debug('error', err);
  } else {
    debug('writecomplete', data);
  }
  process.exit();
});