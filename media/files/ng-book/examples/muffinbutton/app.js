var app = angular.module('MuffinButtonApp', []);

app.directive('englishMuffins', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function(val) {
                var stringVal = val.toString().toLowerCase();
                if (stringVal() == 'one') {
                    cleanedVal = 1;
                } else if (stringVal() == 'two') {
                    cleanedVal = 2;
                } else if (stringVal() == 'three') {
                    cleanedVal = 3;
                } else if (stringVal() == 'four') {
                    cleanedVal = 4;
                } else if (stringVal() == 'five') {
                    cleanedVal = 5;
                } else {
                    cleanedVal = val;
                }

                ctrl.$setValidity('integer', true);
                return cleanedVal;
            });
        }
    };
});


app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total, 10);
        for (var i=0; i < total; i++) {
            input.push(i);
        }
        return input;
    };
});
