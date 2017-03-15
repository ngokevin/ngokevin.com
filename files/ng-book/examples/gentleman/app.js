function GentlemanCtrl($scope) {
    var timeout;

    $scope.$watch('mother', function(newVal, oldVal) {
        if (newVal && $scope.father) {
            motherfather();
        } else if (!newVal) {
            clearTimeout(timeout);
        }
    });

    $scope.$watch('father', function(newVal, oldVal) {
        if (newVal && $scope.mother) {
            motherfather();
        } else if (!newVal) {
            clearTimeout(timeout);
        }
    });

    function motherfather() {
        timeout = setInterval(function() {
            $('img').toggleClass('show');
        }, 500);
    }
}