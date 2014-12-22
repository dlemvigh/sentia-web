/*global Morris:false,jQuery:false*/
/**
 * Flowmap directive
 * @author  Andreas Møller
 * 2014
 */
var $ = require('jquery');
var chartist = require('chartist');
angular.module('linechart', [])
  .directive('linechart', function() {
    'use strict';
    var defaults = {
      height: 250,
      showArea: true,
      // low : 0,
      lineSmooth: false,
      axisX: {
        showGrid: false
      }
    };
    return {
      template: '',
      restrict: 'E',
      scope: {
        data: '=',
        options: '=',
        trigger: '='
      },
      link: function postLink($scope, element) {
        var chart;
        $scope.$watch('data', update);
        $scope.$watch('trigger', update);
        element.addClass('ct-chart');
        draw();

        function draw() {
          var data = {
            // A labels array that can contain any sort of values
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            // Our series array that contains series objects or in this case series data arrays
            series: [
              [5, 2, 4, 2, 0]
            ]
          };
          var easeOutQuad = function (x, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
          };
          var options = angular.extend($scope.options || {}, defaults);
          element.find('*').remove();

          chart = chartist.Bar(element[0], data, options);
          var $toolTip = $(element[0])
            .append('<div class="ct-tooltip"></div>')
            .find('.ct-tooltip')
            .hide();
          element.on('mouseenter', '.ct-point', function() {
            var $point = $(this),
              value = $point.attr('ct:value');

            $point.animate({
              'stroke-width': '17px'
            }, 200, easeOutQuad);
            $toolTip.html(value).show();
          });

          element.on('mouseleave', '.ct-point', function() {
            var $point = $(this);
            $point.animate({
              'stroke-width': '10px'
            }, 200, easeOutQuad);
            $toolTip.hide();
          });

          element.on('mousemove', function(event) {
            
            $toolTip.css({
              left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 + 1,
              top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 18
            });
          });
        }

        function update() {
          if (chart) {
            chart.update($scope.data);
          }
        }
      }
    };
  });
