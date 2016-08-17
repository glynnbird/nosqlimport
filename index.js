var parse = require('csv-parse'),
  fs = require('fs'),
  path = require('path'),
  preview = require('./lib/preview'),
  defaults = {
    delimiter: '\t',
    parallelism: 5
  };

var nullfunc = function() {

};

var importStream = function(rs, ws, opts, callback) {

  if (!callback && typeof opts === 'function') {
    callback = opts;
    opts = {};
  }

  if (!callback) {
    callback = nullfunc;
  }

  if (ws === null) {
    ws = fs.createWriteStream('/dev/null');
  }

  if (opts.nosql) {
    if (!opts.url) {
      return callback('no url supplied', null);
    }
    if (!opts.database) {
      return callback('no database name supplied', null);
    }

    switch(opts.nosql) {
      case 'couchdb':
      case 'nosqlimport-couchdb':
        opts.writer = require('nosqlimport-couchdb').writer;
      break;
      case 'mongodb':
      case 'nosqlimport-mongodb':
        opts.writer = require('nosqlimport-mongodb').writer;
      break;
      case 'elasticsearch':
      case 'nosqlimport-elasticsearch':
        opts.writer = require('nosqlimport-elasticsearch').writer;
      break;
    }  
  } else {
    opts.writer = require('./lib/stdout.js').writer;
  }
  
  if (opts.transform) {
    opts.transform = require(path.resolve(process.cwd(), opts.transform))
  }

  // ensure we have reasonable defaults
  opts.delimiter = opts.delimiter || defaults.delimiter; 

  // transformation processor
  var transformer = require('./lib/transformer.js')(opts.transform || null);

  // csv parser
  var objectifier = parse({delimiter: opts.delimiter, columns: true, skip_empty_lines: true, relax: true});

  // set off stream processing
  var writer = opts.writer(opts);
  rs.pipe(objectifier)  // turn each line into an object
    .pipe(transformer)  // process each object
    .pipe(writer) // write each object to the database
    .pipe(ws); // write the data

  writer.on('writecomplete', function(data) {
    callback(null, data);
  });

  return writer;
};

var importFile = function(filename, ws, opts, callback) {
  var rs = fs.createReadStream(filename, {encoding: 'utf8'});
  return importStream(rs, ws, opts, callback);
};

module.exports = {
  importStream: importStream,
  importFile: importFile,
  previewStream: preview.stream,
  previewURL: preview.url,
  previewFile: preview.file
}