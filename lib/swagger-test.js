'use strict';

var template = require('url-template');

function parse(spec) {

    var xamples = [];
    if (spec.paths) {
        for (var uri in spec.paths) {
            var path = spec.paths[uri];
            for (var method in path) {
                var operation = path[method];
                if (operation['x-amples']) {
                    operation['x-amples'].forEach(function (xample) {
                        var uriTemplate = template.parse(uri);
                        var expandedUri = uriTemplate.expand(xample.request.params);
                        xample.request.method = method;
                        xample.request.uri = spec.host + spec.basePath + expandedUri;
                        xamples.push({
                            description: method + ' ' + uri,
                            request: xample.request,
                            response: xample.response
                        });
                    });
                }
            }
        }
    }
    return xamples;
}

module.exports.parse = parse;
