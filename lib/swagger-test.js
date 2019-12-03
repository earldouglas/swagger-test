'use strict';

var template = require('url-template');

function getUriScheme(spec) {
    return ((spec.schemes || []).concat(['https']))[0];
}

function getParams(spec, uri, method, xample, _in) {
  var paramNames =
    spec.paths[uri][method]
        .parameters
        .filter(function(x) { return x['in'] === _in; })
        .map(function(x) { return x.name; });

  var allParams = xample.request.params || {};
  var namedParams = {};
  for (var i = 0; i < paramNames.length; i++) {
    var name = paramNames[i];
    var value = allParams[name];
    if (value) {
      namedParams[name] = value;
    }
  }
  return namedParams;
}

function toUriPairs(x) {
  var uriPairs = [];
  for (var k in x) {
    if (x.hasOwnProperty(k)) {
      uriPairs.push(encodeURIComponent(k) + '=' + encodeURIComponent(x[k]));
    }
  }
  return uriPairs;
}

function parseXample(spec, uri, method, xample) {

    var pathParams = getParams(spec, uri, method, xample, 'path');
    var expandedUri = template.parse(uri).expand(pathParams);

    var queryParams = getParams(spec, uri, method, xample, 'query');
    var queryParamsArray = toUriPairs(queryParams);
    var query = (queryParamsArray.length === 0) ? '' : '?' + queryParamsArray.join('&');

    xample.request.method = method;
    xample.request.uri = getUriScheme(spec) + '://' + spec.host + spec.basePath + expandedUri + query;
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
