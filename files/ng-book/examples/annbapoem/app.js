var app = angular.module('HelloWorldApp', []);

app.controller('HelloWorldCtrl', function($scope) {
    $scope.targetOfSalutation = 'World';
});

// With better dependency injection.
app.controller('HelloWorldCtrl', ['$scope', function(scope) {
    scope.targetOfSalutation = 'World';
}]);
