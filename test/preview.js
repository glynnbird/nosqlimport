var assert = require('assert'),
  fs = require('fs');

var nosqlimport = require('../index.js');

describe('Preview mode', function() { 

  it('preview csv', function(done) {
    nosqlimport.previewFile("./test/test.csv", function(err,data, delimiter) {
      assert.equal(err, null);
      assert.equal(typeof data, 'object');
      assert.equal(typeof delimiter, 'string');
      assert.equal(delimiter, ',');
      done();
    });
  });

  it('preview tsv', function(done) {
    nosqlimport.previewFile("./test/guitars.tsv", function(err,data, delimiter) {
      assert.equal(err, null);
      assert.equal(typeof data, 'object');
      assert.equal(typeof delimiter, 'string');
      assert.equal(delimiter, '\t');
      done();
    });
  })

  it('preview nonsense', function(done) {
    nosqlimport.previewFile("./test/nonsense.txt", function(err,data, delimiter) {
      console.log(err, data, delimiter);
      assert.equal(err, null);
      assert.equal(typeof delimiter, 'string');
      assert.equal(delimiter, '?');
      done();
    });
  });

});