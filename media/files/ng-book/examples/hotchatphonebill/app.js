var app = angular.module('HotChatPhoneBillApp', []);


app.controller('HotChatPhoneBillCtrl', ['$scope', function($scope) {
    $scope.billDate = new Date();
    $scope.calls = [
        {'operator': 'Rainbow', 'minutes': 80},
        {'operator': 'Pinkie', 'minutes': 30},
        {'operator': 'Twilight', 'minutes': 40},
        {'operator': 'Flutter', 'minutes': 15},
        {'operator': 'Rarity', 'minutes': 5}
    ];
}]);
