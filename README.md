# Specification-driven REST API testing

[![Build Status](https://travis-ci.org/earldouglas/swagger-test.svg?branch=master)](https://travis-ci.org/earldouglas/swagger-test) [![Coverage Status](https://coveralls.io/repos/github/earldouglas/swagger-test/badge.svg?branch=master)](https://coveralls.io/github/earldouglas/swagger-test?branch=master)

## Quick start

To run swagger-test without writing any JavaScript, install the CLI:

```
$ npm install -g swagger-test
```

Then, start your server under test, and pipe your Swagger specification
to `swagger-test`:

```
$ cat swagger.json | swagger-test
response did not match specification
the specification is:
{
  "status": 200,
  "headers": {
    "content-type": "application/json; charset=utf-8"
  },
  "body": {
    "greeting": "Hello, world!"
  }
}
the response was:
{
  "status": 200,
  "headers": {
    "content-type": "text/html; charset=utf-8"
  },
  "body": "Hello, world!"
}
```

## Usage

Load the npm module:

```javascript
var swaggerTest = require('swagger-test');
```

Parse a Swagger specification (e.g. from a Web URL, or the local file
system):

```javascript
var swaggerSpec = // load a Swagger specification as a JavaScript object
var xamples = swaggerTest.parse(swaggerSpec);
```

The `xamples` array contains a sequence of request/response pairs.  Test
them against your service:

```javascript
var preq = require('preq');

describe('specification-driven tests', function () {
  xamples.forEach(function (xample) {
    it(xample.description, function() {
      return preq[xample.request.method](xample.request)
      .then(function (response) {
        assert.deepEqual(response, xample.response);
      });
    });
  });
});
```

## Test generation

Tests are generated in one of two ways:

1. Directly from the the `x-amples` extension to the Swagger
   specification
1. Indirectly by inferring examples from the Swagger specification

### Direct test specification

The `x-amples` extension allows explicit specification of
request/response pairs:

```javascript
"/pets/{id}": {
  "get": {
  ...
  "x-amples": [
    {
      "description": "short description of example; it's used as testcase description"
      "request": {
        "params": {
          "id": "fido4"
        }
      },
      "responses": {
        "200": {
          "headers": {
            "content-type": "application/json"
          }
        }
      }
    }
  ]
}
```

These can be specified for any operation.

### Indirect test inference

For cases where an explicit examples don't need to be specified, they
are inferred directly from the Swagger operation's specification.

```javascript
"get": {
  "produces": [ "application/json" ],
  "responses": {
    "200": {
      "description": "Returns all the pets"
    }
  }
}
```

To enable indirect test inference, set `inferXamples` to `true` in the
`options` argument to `parse()`:

```javascript
var xamples = swaggerTest.parse(spec, { inferXamples: true });
```
