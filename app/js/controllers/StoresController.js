/**
 * login controller
 * @author Andreas
 * @date   2014-04-11
 */
var moment = require('moment');
var lodash = require('lodash');
module.exports = function($scope, $q, StoresService, CamerasService, PosService, PeopleService, $routeParams, $location) {
  'use strict';
  var $parent = $scope.$parent; // shorthand

  //bindables
  $scope.store = null;
  $scope.cameras = null;
  $scope.activeTab = Number($routeParams.activeTab) || 1;
  $scope.selectTab = selectTab; // function
  $scope.selectCamera = selectCamera; //function
  $scope.charts = {
    options : {
      range : [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    },
    BarOptions : {
      axisX :{
        labelOffset : {
          x : '50%'
        }
      }
    }
  };

  // setup
  document.title = 'Sentia - Store';
  updateUrl();
  init($routeParams);// get the store and build the $scope

  function init (params) {
    return $q.when(params.storeId)
      .then(getStore)
      .then(getCameras)
      .then(watch)
      .then(function () {
        mixpanel.track('page viewed', {
          'page': document.title,
          'url': window.location.pathname,
          controller: 'StoreController',
          store : $scope.store._id
        });
      });
  }

  function updateUrl () {
    $location.replace();
    $location.search('activeTab', $scope.activeTab);
    $location.search('date', moment($scope.$parent.date).format('YYYY-MM-DDTHH:mm:ss.00Z'));
  }

  function getStore (id) {
    return StoresService.getSelectedStore(id)
      .then(function (store) {
        $scope.store = store;
        return store;
      });
  }

  function getCameras (store) {
    return CamerasService.get({where : {store : store._id}})
      .then(function(cameras) {
        $scope.cameras = cameras;
        return cameras;
      });
  }
  // initiate watchers for the controller
  function watch () {
    $parent.$watch('date', function() {
      updateUrl();
      updateDashboard();
      mixpanel.track('date changed', {
        page : document.title,
        controller : 'StoreCtrl',
        store : $scope.store._id,
        date : $parent.date
      });
    });
  }

  // function definitions
  function selectTab (tab) {
    $location.search('activeTab', tab);
    $scope.activeTab = tab;
    mixpanel.track('switched tab', {
      page : document.title,
      controller: 'StoreCtrl',
      store : $scope.store._id,
      tab : $scope.activeTab
    });
  }


  function selectCamera (cam) {
    $parent.camera = cam;
    $scope.$root.go('/store/camera/' + cam._id, 'animate-scale');
  }


  function updateDashboard () {
    var promises = [];
    // reset
    $scope.charts = {};
    // if no store object is present, return;
    if (!$scope.store) {
      return;
    }
    promises.push(updatePosCharts());
    promises.push(updatePeopleCharts());
    $q.all(promises)
      .then(updateConversionCharts);




  }
  function updatePosCharts() {
     return PosService.getPosCharts($scope.store._id, $parent.date)
     .then(function (data) {
       $scope.charts.revenue = data.revenue;
       $scope.charts.transactions = data.transactions;
       $scope.charts.basketSize = {
         total : data.revenue.total / data.transactions.total
       };
     });
  }
  function updatePeopleCharts () {
    var cameraQuery = {
      where : {
        store : $scope.store._id,
        counter: 'entrance'
      }
    };

    return $q.when(cameraQuery)
      .then(getEntranceCameras)
      .then(getLineChartData)
      .then(function (data) {
        $scope.charts.people = data;
      });

    function getEntranceCameras (query) {
      return CamerasService.get(query)
        .then(function (cameras) {
          return lodash.pluck(cameras, '_id');
        });
    }

    function getLineChartData (cameras) {
      return PeopleService.getLineChart(cameras, $parent.date)
        .then(function (data) {
          if (!data) {
            return;
          }


         var total = data
          .series[0]
          .reduce(function (sum, val) {
            return sum + val;
          },0);

         return {
           total : total,
           data : data
         };
       });
    }
  }

  function updateConversionCharts () {
    if (!$scope.charts.transactions || !$scope.charts.people) {
      return;
    }
    var data = $scope.charts.transactions.data.series[0].map(function (val, i) {
      if (val && $scope.charts.people.data.series[0][i]) {
        return Math.round(val / $scope.charts.people.data.series[0][i]* 10000)/ 100;
      }
      return 0;
    });
    $scope.charts.conversion = {
      total : Math.round(($scope.charts.transactions.total / $scope.charts.people.total) * 10000) / 100,
      data :  {
        labels : $scope.charts.transactions.data.labels,
        series : [data]
      }
    };
  }
};
