'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

//
// Plugin for vue-resource to convert request params to snake case
// and response params to camel case
//

function camelCase(string) {
  var find = /(\_\w)/g;
  var convert = function convert(matches) {
    return matches[1].toUpperCase();
  };
  return string.replace(find, convert);
}

function snakeCase(string) {
  var find = /([A-Z])/g;
  var convert = function convert(matches) {
    return '_' + matches.toLowerCase();
  };
  return string.replace(find, convert);
}

function getClass(obj) {
  // Workaround for detecting native classes.
  // Examples:
  // getClass({}) === 'Object'
  // getClass([]) === 'Array'
  // getClass(function () {}) === 'Function'
  // getClass(new Date) === 'Date'
  // getClass(null) === 'Null'

  // Here we get a string like '[object XYZ]'
  var typeWithBrackets = Object.prototype.toString.call(obj);
  // and we extract 'XYZ' from it
  return typeWithBrackets.match(/\[object (.+)\]/)[1];
}
function convertObjectKeys(obj, keyConversionFun) {
  // Creates a new object mimicking the old one with keys changed using the keyConversionFun.
  // Does a deep conversion.
  // Taken from https://github.com/ZupIT/angular-http-case-converter
  if (getClass(obj) !== 'Object' && getClass(obj) !== 'Array') {
    return obj; // Primitives are returned unchanged.
  }
  return Object.keys(obj).reduce(function (newObj, key) {
    newObj[keyConversionFun(key)] = convertObjectKeys(obj[key], keyConversionFun);
    return newObj;
  }, Array.isArray(obj) ? [] : {}); // preserve "arrayness"
}

var VueResourceCaseConverter = {

  install: function install(Vue, options) {
    var requestUrlFilter = function requestUrlFilter() {
      return true;
    };

    var responseUrlFilter = function responseUrlFilter() {
      return true;
    };

    if (options != null && options.requestUrlFilter) {
      requestUrlFilter = options.requestUrlFilter;
    }
    if (options != null && options.responseUrlFilter) {
      responseUrlFilter = options.responseUrlFilter;
    }

    if (Vue.http == null) {
      undefined.$log('Please add http-resource plugin to your Vue instance');
      return;
    }

    Vue.http.interceptors.push(function (request, next) {
      if (requestUrlFilter(request.url)) {
        request.params = convertObjectKeys(request.params, snakeCase);
        request.body = convertObjectKeys(request.body, snakeCase);
      }

      next(function (response) {
        if (!responseUrlFilter(response.url)) {
          return response;
        }

        var convertedBody = convertObjectKeys(response.body, camelCase);
        response.body = convertedBody;
        return response;
      });
    });
  }
};

if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
  module.exports = VueResourceCaseConverter;
}