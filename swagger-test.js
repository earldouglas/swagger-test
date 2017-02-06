#!/usr/bin/env node

var preq        = require('preq');
var assert      = require('assert');
var readline    = require('readline');
var swaggerTest = require('./lib/swagger-test.js');

var source = [];

var rl = readline.createInterface({
  terminal: false,
  input: process.stdin,
});

rl.on('line', function (line) {
  source.push(line);
});

rl.on('close', function () {
  var swaggerSpec = JSON.parse(source.join('\n'));
  var xamples = swaggerTest.parse(swaggerSpec);
    xamples.forEach(function (xample) {
    preq[xample.request.method](xample.request).then(function (response) {
      if (response.status && xample.responses[response.status] {
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
        } catch (e) {
          console.error('response did not match specification');
          console.error('the specification is:');
          console.error(JSON.stringify(e.expected, null, 2));
          console.error('the response was:')
          console.error(JSON.stringify(e.actual, null, 2));
        }
      } else {
        console.error('no x-ample response found');
      }
    });
  });
});
