var app = angular.module('SupWorldApp', []);


app.controller('SupWorldCtrl', function($scope) {
    $scope.targetOfSalutation = 'World';
});

// With better dependency injection.
app.controller('SupWorldCtrl', ['$scope', function(scope) {
    scope.targetOfSalutation = 'World';
}]);
