'use strict';

var template = require('url-template');

function parseXample(spec, uri, method, xample) {
    var uriTemplate = template.parse(uri);
    var expandedUri = uriTemplate.expand(xample.request.params);
    xample.request.method = method;
    xample.request.uri = spec.host + spec.basePath + expandedUri;
    return {
        description: method + ' ' + uri,
        request: xample.request,
        response: xample.response
    };
}

function inferXample(spec, uri, method, operation, statusString) {
    var request = {
        method: method,
        uri: spec.host + spec.basePath + uri
    };
    var response = {
        status: parseInt(statusString)
    };
    if (operation.produces && operation.produces[0]) {
        response.headers = {
            'content-type':  operation.produces[0]
        };
    }
    return {
        description: method + ' ' + uri,
        request: request,
        response: response
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
