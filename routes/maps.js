// # Maps
// Endpoints for getting map data
//
'use strict';
var MapsService = require('../services/maps.service'),
  lo = require('lodash'),
  middleware = require('../middleware');

// ## Read
//

exports.get = {
  handler : function (req) {
    return MapsService.find(req.query);
  },
  middleware : [middleware.company],
  query : {
    additionalProperties : false,
    required : ['camera', 'from', 'to'],
    properties : {
      camera : {
        type : 'string'
      },
      from : {
        type : 'string'
      },
      to : {
        type : 'string'
      }
    }
  }
};
