# Specification-driven REST API testing

## Usage

```javascript
var swaggerTest = require('swagger-test');
```

```javascript
var swaggerSpec = // load a Swagger spec as a JavaScript object
var tests = swaggerTest.parse(swaggerSpec);
```

The `tests` array contains a sequence of request/response pairs that can be used to test your service.

```javascript
var preq = require('preq');

describe('specification-driven tests', function () {
    tests.forEach(function (test) {
        it(test.description, function() {
            return preq[test.request.method](test.request)
            .then(function (response) {
                assert.deepEqual(response, test.response);
            });
        });
    });
});
```
