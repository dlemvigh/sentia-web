// #Cameras
// Endpoints for Managing camera objects

'use strict';
var middleware = require('../middleware'),
  lodash = require('lodash'),
  CameraService = require('../services/cameras.service');

// ## Read
// get a specific camera by id
exports.read = {
  url : ':_id',
  handler : function (req, res, next) {
    return CameraService.read(lodash.merge(req.params, req.query));
  },
  middleware : [middleware.company],
  params : {
    required : ['_id'],
    properties : {
      id : {
        type : 'integer'
      }
    }
  }
};

// ## Find
// get a list of cameras based on the supplied queries
exports.get = {
  handler : function (req, res, next) {
    return CameraService.find(req.query);
  },
  middleware : [middleware.company],
  query : {
    additionalProperties : false,
    properties : {
      fields : {
        type : 'object'
      },
      where : {
        type : 'object'
      },
      groupBy : {
        type : 'array'
      },
      orderBy : {
        type : 'object'
      }
    }
  }
};
