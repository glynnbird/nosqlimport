var stream = require('stream'),
  debug = require('debug')('nosqlimport');

debug('Using stdout writer');

var writer = function() {
  var written = 0;
  var totalfailed = 0;
  var writer = new stream.Transform( { objectMode: true } );

  // transformation function
  writer._transform = function (obj, encoding, done) {
    // pass object to next stream as a string
    this.push( JSON.stringify(obj) + '\n');
    written++;
    writer.emit('written', { documents: 1, failed: 0, total: written, totalfailed: totalfailed})
    done();
  };

  // called when we need to flush everything
  writer._flush = function(done) {
    writer.emit("writecomplete", { total: written , totalfailed: totalfailed});
    done();
  };

  return writer;
};

module.exports = {
  writer:writer
};