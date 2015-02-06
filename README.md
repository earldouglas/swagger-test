# Specification-driven REST API testing

[![Build Status](https://travis-ci.org/earldouglas/swagger-test.svg?branch=master)](https://travis-ci.org/earldouglas/swagger-test) [![Coverage Status](https://coveralls.io/repos/earldouglas/swagger-test/badge.svg)](https://coveralls.io/r/earldouglas/swagger-test)

## Usage

```javascript
var swaggerTest = require('swagger-test');
```

```javascript
var swaggerSpec = // load a Swagger spec as a JavaScript object
var xamples = swaggerTest.parse(swaggerSpec);
```

The `xamples` array contains a sequence of request/response pairs that can be used to test your service.

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
