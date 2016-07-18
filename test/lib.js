var assert = require('assert'),
  fs = require('fs');

var nosqlimport = require('../index.js');

describe('runtime options', function() {

  it('should error with no url or db', function(done) {
    var rs = fs.createReadStream('./test/guitars.tsv', { encoding: 'utf8'});
    var ws = fs.createWriteStream('/dev/null');
    nosqlimport.importStream(rs, ws, {nosql: 'couchdb'}, function(err, data) {
      assert.equal(data, null);
      assert.equal(typeof err, 'string');   
      done();   
    });
  });

  it('should error with no url', function(done) {
    var rs = fs.createReadStream('./test/guitars.tsv', { encoding: 'utf8'});
    var ws = fs.createWriteStream('/dev/null');
    nosqlimport.importStream(rs, ws, {nosql: 'couchdb', 'db': 'mydb'}, function(err, data) {
      assert.equal(data, null);
      assert.equal(typeof err, 'string');   
      done();   
    });
  });

  it('should error with no db', function(done) {
    var rs = fs.createReadStream('./test/guitars.tsv', { encoding: 'utf8'});
    var ws = fs.createWriteStream('/dev/null');
    nosqlimport.importStream(rs, ws, {nosql: 'couchdb', 'url': 'http://localhost:5984'}, function(err, data) {
      assert.equal(data, null);
      assert.equal(typeof err, 'string');     
      done(); 
    });
  });

  it('should be fine with stdout writer', function(done) {
    var rs = fs.createReadStream('./test/guitars.tsv', { encoding: 'utf8'});
    var ws = fs.createWriteStream('/dev/null');
    nosqlimport.importStream(rs, ws, { }, function(err, data) {
      assert.equal(typeof data, 'object');
      assert.equal(data.total, 26)
      assert.equal(data.totalfailed, 0)
      assert.equal(err, null);     
      done(); 
    });
  });

  it('should be fine with no opts', function(done) {
    var rs = fs.createReadStream('./test/guitars.tsv', { encoding: 'utf8'});
    var ws = fs.createWriteStream('/dev/null');
    nosqlimport.importStream(rs, ws, function(err, data) {
      assert.equal(typeof data, 'object');
      assert.equal(data.total, 26)
      assert.equal(data.totalfailed, 0)
      assert.equal(err, null);     
      done(); 
    });
  });


  it('should be fine with null writestream', function(done) {
    var rs = fs.createReadStream('./test/guitars.tsv', { encoding: 'utf8'});
    nosqlimport.importStream(rs, null, function(err, data) {
      assert.equal(typeof data, 'object');
      assert.equal(data.total, 26)
      assert.equal(data.totalfailed, 0)
      assert.equal(err, null);     
      done(); 
    });
  });

});