  /**
 * Flowmap directive
 * @author  Andreas Møller
 * 2014
 */
var moment = require('moment');
var $ = require('jquery');
require('../../bower_components/pickadate/lib/picker.js');
require('../../bower_components/pickadate/lib/picker.date.js');
angular.module('pickadate', [])
  .directive('pickadate', function() {
    'use strict';
    return {
      template: '<div class="btn-group"><button class="btn btn-primary icon-chevron-left hidden-xs" ng-click="controls.prev()"></button><input class="btn btn-primary hidden-xs"><button class="btn btn-primary hidden-xs icon-chevron-right" ng-click="controls.next()"></button></div><button class="hidden-sm hidden-md hidden-lg btn btn-primary btn-icon" ng-click="open($event)" style="border-radius:4px;"><i class="icon-calendar" ></i></button>',
      restrict: 'E',
      scope: {
        date: '=date',
        show : '=show'
      },
      link: function postLink(scope, element) {
        var $input, picker;
        $input = $(element.find('input')).pickadate({
          today:false,
          clear : false,
          close: false,
          format : 'd mmm, yyyy',
          // editable: false,
          max: true,
          min : false

        });

        picker = $input.pickadate('picker');
        picker.set('select', scope.date);
        picker.on('set', function (value) {
          if(!value.select) {
            return;
          }
          scope.$apply(function () {
            scope.date = moment(picker.get()).toDate();
          });
        });
        scope.controls = {
          next : function () {
            var date = moment(scope.date).add(1, 'day');
            if (!date.isAfter(moment(), 'day')) {
              scope.date = date.toDate();
            }
          },
          prev : function () {
            var date = moment(scope.date).subtract(1, 'day');
            scope.date = date.toDate();
          }
        };

        scope.open = function () {
          setTimeout(function () {
              picker.open();
          },0);
        };
        scope.$watch('date', function (newDate) {
          if (!moment(newDate).isSame(moment(picker.get()))) {
            picker.set('select', newDate, {muted : true});
          }
        });


      }

    };
  });
