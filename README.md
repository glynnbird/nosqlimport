# nosqplimport

A command-line tool and Node.js library that allows CSV/TSV data to be imported into a variety of NoSQL databases

![schematic](https://raw.githubusercontent.com/glynnbird/nosqlimport/master/img/nosqlimport-schematic.png "Schematic Diagram") 

## Installing

### Command-line tool

Install with npm:

```sh
> npm install -g nosqlimport
```

You'll probably want one of the NoSQL plugins [nosqlimport-couchdb](https://www.npmjs.com/package/nosqlimport-couchdb) [nosqlimport-mongodb](https://www.npmjs.com/package/nosqlimport-mongodb) and/or [nosqlimport-elasticsearch](https://www.npmjs.com/package/nosqlimport-elasticsearch) too e.g.

```sh
> npm install -g nosqlimport-couchdb
```

Then import data like so:

```sh
> cat mydatafile.tsv | nosqlimport --nosql couchdb --url http://localhost:5984 --db mydb
nosqlimport Using couchdb nosqlimport writer +0ms
nosqlimport CouchDB URL: http://localhost:5984 +388ms
nosqlimport CouchDB Database: mydb +2ms
nosqlimport { documents: 26, failed: 0, total: 26, totalfailed: 0 } +153ms
nosqlimport writecomplete +0ms { total: 26, totalfailed: 0 }
```

Environment variables can be used to save typing:

```sh
> export NOSQL_URL=http://localhost:5984
> export NOSQL_DATABASE=mydb
> cat mydatafile.tsv | nosqlimport --nosql couchdb
```

### Using within your own application

Use npm install the library

```sh
> npm install --save nosqlimport
```

You'll probably want one of the NoSQL plugins too e.g.

```sh
> npm install --save nosqlimport-couchdb
```

And import data in your code:

```js
    var rs = fs.createReadStream('./guitars.tsv', { encoding: 'utf8'});
    var opts = {
      url: 'http://localhost:5984',
      nosql: 'couchdb',
      db: 'mydb'
    }
    nosqlimport.importStream(rs, null, opts, function(err, data) {
      assert.equal(typeof data, 'object');
      assert.equal(data.total, 26)
      assert.equal(data.totalfailed, 0)
      assert.equal(err, null);     
      done(); 
    });
```

## Nomenclature

Different NoSQL databases have different names for things. CouchDB stores documents in "databases". MongoDB in "collections" that live in databases. Elasticseach in "types" that live in "indexes".

When using *nosqlimport* with CouchDB/Cloudant the `url` parameter defines the URL of the CouchDB instance and the `database` parameter means the database to be written to e.g.:

```sh
  cat test.txt | nosqlimport --nosql couchdb --url https://myusername:mypassword@myhost.cloudant.com --db mydb
```

When using *nosqlimport* with MongoDB, the `url` parameter defines the URL of the MongoDB instance including the database and the `database` parameter means the MongoDB *collection* to writer to e.g.:

```sh
 cat test.txt | nosqlimport --nosql mongodb --url mongodb://localhost:27017/mydatabase --database mycollection
```

When using *nosqlimport* with Elasticsearch, the `url` parameter defines the URL of the Elastic instance including the index and the `database` parameter means the Elasticsearch *type* to writer to e.g.:

```sh
 cat test.txt | nosqlimport --nosql elasticsearch --urlhttp://localhost:9200/mydatabase --database mycollection
```

## Transform functions

You can supply your own JavaScript function into the document processing stream for casting types, filtering documents or any other purpose. Your JavaScript function must be synchronous, taking a single `doc` parameter which it must return e.g

```js
module.exports = function(doc) {
  // your code codes here
  return doc;
};
```

Save your JavaScript to a file and then run `nosqlimport` passing in the `-t` parameter:

```sh
cat test.csv | nosqlimport -t './mytransform.js' -n 'couchdb'
```

### Transform - Casting

```js
module.exports = function(doc) {
  doc.price = parseFloat(doc.price);
  return doc;
};
```

### Transform - Filtering

```js
module.exports = function(doc) {
  if (doc.instock === 'true') {
    doc.instock = true;
    return doc;
  } else {
    // nothing is written to the database
    return {}
  }
};
```

## Command-line parameters

* -n --nosql [db type] - the type of NoSQL database to write to (default stdout)
* -t --transform [filename] - the filename containing the JavaScript transform function (default none)
* -d --delimiter [character] - the delimiter character to use (default '\t')
* --db --database [db name] - the name of the database to write to
* -u --url [url] - the url of the database to write to


## Environment variables

* NOSQL_URL - same as --url
* NOSQL_DATABASE - same as --database
* DEBUG - set to 'nosqlimport' to output debug messages

## Function reference

### importStream(rs, ws, opts, callback)

Parameters

- rs - the read stream to read data from
- ws - the write stream to send data to
- opts - an object containing configuration options
- callback - calls back with (err, data) on completion

### importFile(filename, ws, opts, callback)

Parameters

- rs - the filename to read data from 
- ws - the write stream to send data to
- opts - an object containing configuration options
- callback - calls back with (err, data) on completion

### previewFile(filename, callback) 

Parameters

- filename - the name of the file to preview
- callback - calls back with (err, data, delimiter)

### previewFile(filename, callback) 

Parameters

- filename - the name of the file to preview
- callback - calls back with (err, data, delimiter)

### previewURL(url, callback) 

Parameters

- url - the url to preview
- callback - calls back with (err, data, delimiter)


### previewStream(rs, callback) 

Parameters

- rs - the read stream
- callback - calls back with (err, data, delimiter)


## Origins of nosqlimport

This project is a refactor of my [couchimport](https://www.npmjs.com/package/couchimport) importer script for CouchDB/Cloudant. This codebase is simpler, more modular and makes more sense.

## Contributing

The projected is released under the Apache-2.0 license so forks, issues and pull requests are very welcome.



