var moment = require('moment');
module.exports = function($http) {
  'use strict';
  this.getPos = function (data) {
    var query = {
      store : data.store,
      from : moment(data.date)
      .hours(0)
      .minutes(0)
      .seconds(0)
      .format('YYYY-MM-DD HH:mm:ss'),
      to : moment(data.date)
      .add(1, 'day')
      .hours(0)
      .minutes(0)
      .seconds(0)
      .format('YYYY-MM-DD HH:mm:ss')
    };
    return $http.get('/api/pos?store=' +query.store+ '&from=' + query.from + '&to=' + query.to)
    .then(function(response) {
      return response.data || undefined;
    })
    .
    catch (function(error) {
      console.log(error);
      return error;
    });
  };
};