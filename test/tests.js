'use strict';

/* global describe, it, before, beforeEach, after, afterEach */

var fs = require('fs');
var swaggerTest = require('../lib/swagger-test');
var assert = require('chai').assert;

describe('test generation with inference', function () {

  var testDir = __dirname;
  var buffer  = fs.readFileSync(testDir + '/swagger.json');
  var spec    = JSON.parse(buffer);

  var xamples = swaggerTest.parse(spec, {
    inferXamples: true,
  });

  it('should contain four test cases', function () {
    assert.equal(xamples.length, 4);
  });

  it('should start with x-ample test: get /pets', function () {
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

  function expectedPetIdXample(id) {
      return {
        description: 'get /pets/{id}',
        request: {
          method: 'get',
          uri: 'localhost/v1/pets/' + id
        },
        response: {
          status: 200,
          headers: {
            'content-type': 'application/json'
          }
        }
      };
  }

  it('should follow with two x-ample tests', function () {
      assert.deepEqual(xamples[1], expectedPetIdXample('fido4'));
      assert.deepEqual(xamples[2], expectedPetIdXample('fido7'));
  });

  it('should follow with one inferred test', function () {
      assert.deepEqual(xamples[3], expectedPetIdXample('{id}'));
  });

});
