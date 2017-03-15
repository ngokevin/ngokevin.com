var app = angular.module('NoChurchInTheWildApp', []);


app.controller('NonBelieverCtrl', ['$scope', function($scope) {
    $scope.alpha = 'Non-Believer';
}]);


app.controller('GodCtrl', ['$scope', function($scope) {
    $scope.alpha = 'God';
}]);


app.controller('KingCtrl', ['$scope', function($scope) {
    $scope.alpha = 'King';
}]);


app.controller('MobCtrl', ['$scope', function($scope) {
    $scope.alpha = 'Mob';
}]);
