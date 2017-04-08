#!/usr/bin/env node

var preq        = require('preq');
var assert      = require('assert');
var readline    = require('readline');
var swaggerTest = require('./lib/swagger-test.js');
var jsonDiff    = require('json-diff');

var source = [];

var rl = readline.createInterface({
  terminal: false,
  input: process.stdin,
});

rl.on('line', function (line) {
  source.push(line);
});

rl.on('close', function () {
  var passed = [];
  var failed = [];
  var requests = [];
  var swaggerSpec = JSON.parse(source.join('\n'));
  var xamples = swaggerTest.parse(swaggerSpec);
  xamples.forEach(function (xample) {
    requests.push(
      preq[xample.request.method](xample.request).then(function (response) {
        if (response.status && xample.responses[response.status]) {
          var xampleResponse = xample.responses[response.status];
          if (response.headers && xampleResponse.headers) {
            for (var h in response.headers) {
              if (response.headers.hasOwnProperty(h)) {
                if (!(h in xampleResponse.headers)) {
                  delete response.headers[h];
                }
              }
            }
          }
          try {
            assert.deepEqual(response, xampleResponse);
            passed.push({
              description: xample.description,
            });
          } catch (e) {
            failed.push({
              description: xample.description,
              expected: e.expected,
              actual: e.actual,
            });
          }
        }
      })
    );
  });
  Promise.all(requests).then(function () {

    console.log(passed.length.toString(), 'tests passed:');
    passed.forEach(function (x) {
      console.log('\n  -', x.description);
    });
    console.log();

    console.error(failed.length.toString(), 'tests failed:');
    failed.forEach(function (x) {
      console.error('\n  -', x.description);
      console.error();
      var diff = jsonDiff.diff(x.actual, x.expected);
      JSON.stringify(diff, null, 2).split('\n').forEach(function (x) {
        console.error('   ', x.replace(/"__old":/g, '"expected":')
                              .replace(/"__new":/g, '"received":'));
      });
    });

    if (failed.length > 0) {
      process.exit(1);
    }
  });
});
