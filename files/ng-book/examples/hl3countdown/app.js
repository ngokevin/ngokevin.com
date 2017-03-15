function HL3CountdownCtrl($rootScope, $scope) {
    $rootScope.countdown = 9999;

    setInterval(function() {
        $rootScope.$apply(function() {
            $rootScope.countdown--;
        });
    }, 1000);
}
