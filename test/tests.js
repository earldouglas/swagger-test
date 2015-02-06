'use strict';

/* global describe, it, before, beforeEach, after, afterEach */

var fs = require('fs');
var swaggerTest = require('../lib/swagger-test');
var assert = require('chai').assert;

describe('test generation with inference', function () {

  var testDir = __dirname;
  var buffer  = fs.readFileSync(testDir + '/swagger.json');
  var spec    = JSON.parse(buffer);

  var xamples = swaggerTest.parse(spec, { inferXamples: true });

  it('should contain three test cases', function () {
    assert.equal(xamples.length, 3);
  });

  it('should first test GET /pets', function () {
      assert.deepEqual(xamples[0], {
          "description": "get /pets",
          "request": {
              "method": "get",
              "uri": "localhost/v1/pets"
          },
          "response": {
              "status": 200,
              "headers": {
                  "content-type": "application/json"
              }
          }
      });
  });

  it ('should next test GET /pets/fido4', function () {
      assert.deepEqual(xamples[1], {
          "description": "get /pets/{id}",
          "request": {
              "params": {
                  "id": "fido4"
              },
              "method": "get",
              "uri": "localhost/v1/pets/fido4"
          },
          "response": {
              "status": 200,
              "headers": {
                  "content-type": "application/json"
              }
          }
      });
  });

  it ('should next test GET /pets/fido7', function () {
      assert.deepEqual(xamples[2], {
        "description": "get /pets/{id}",
        "request": {
            "params": {
                "id": "fido7"
            },
            "method": "get",
            "uri": "localhost/v1/pets/fido7"
        },
        "response": {
            "status": 200,
            "headers": {
                "content-type": "application/json"
            }
        }
      });
  });

});
