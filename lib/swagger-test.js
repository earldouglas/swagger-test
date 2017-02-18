'use strict';

var template = require('url-template');

function getUriScheme(spec) {
    var defaultScheme='https';
    if(spec.schemes == undefined || !(spec.schemes instanceof Array) || spec.schemes.length < 1) {
      return defaultScheme;
    }
    return spec.schemes[0];
}

function parseXample(spec, uri, method, xample) {
    var uriTemplate = template.parse(uri);
    var expandedUri = uriTemplate.expand(xample.request.params);
    xample.request.method = method;
    xample.request.uri = getUriScheme(spec) + '://' + spec.host + spec.basePath + expandedUri;
    return {
        description: xample.description || method + ' ' + uri,
        request: xample.request,
        responses: xample.responses
    };
}

function inferXample(spec, uri, method, operation, statusString) {
    var request = {
        method: method,
        uri: getUriScheme(spec) + '://' + spec.host + spec.basePath + uri
    };
    var responses = {};
    if (operation.produces && operation.produces[0]) {
        responses[statusString] = {
          headers: {
            'content-type':  operation.produces[0]
          }
        };
    }
    return {
        description: method + ' ' + uri,
        request: request,
        responses: responses
    };
}

function parse(spec, options) {

    options = options || {};

    var xamples = [];

    Object.keys(spec.paths || {}).forEach(function (uri) {
        var path = spec.paths[uri];
        Object.keys(path).forEach(function (method) {
            var operation = path[method];
            if (operation['x-amples']) {
                operation['x-amples'].forEach(function (xample) {
                    xamples.push(parseXample(spec, uri, method, xample));
                });
            } else if (options.inferXamples) {
                Object.keys(operation.responses || {}).forEach(function (statusString) {
                    xamples.push(inferXample(spec, uri, method, operation, statusString));
                });
            }
        });
    });

    return xamples;
}

module.exports.parse = parse;
