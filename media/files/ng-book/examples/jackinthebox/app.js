var app = angular.module('JackInTheBoxApp', []);


app.controller('JackInTheBoxCtrl', ['$scope', function($scope) {
    $scope.crank = function() {
        if (Math.random() < 0.3) {
            $scope.pop = 'Pop Goes the Weasel!';
        }
    };
}]);
