var app = angular.module('GymLeadersApp', []);


// With better dependency injection.
app.controller('GymLeadersCtrl', ['$scope', function($scope) {
    var kantoGymLeaders = [
        {name: 'Brock', pokemon: ['Geodude', 'Onyx']},
        {name: 'Misty', pokemon: ['Staryu', 'Starmie']},
        {name: 'Lt. Surge', pokemon: ['Voltorb', 'Magnemite', 'Raichu']},
        {name: 'Erika', pokemon: ['Weepinbell', 'Tangela', 'Vileplume']},
        {name: 'Sabrina', pokemon: ['Kadabra', 'Mr. Mime', 'Venomoth', 'Alakazam']},
        {name: 'Koga', pokemon: ['Koffing', 'Muk', 'Koffing', 'Weezing']},
        {name: 'Blaine', pokemon: ['Growlithe', 'Ponyta', 'Rapidash', 'Arcanine']},
        {name: 'Giovanni', pokemon: ['Rhyhorn', 'Dugtrio', 'Nidoqueen', 'Nidoking', 'Rhydon']}
    ];

    var johtoGymLeaders = [
        {name: 'Falkner', pokemon: ['Pidgey', 'Pidgeotto']},
        {name: 'Bugsy', pokemon: ['Metapod', 'Kakuna', 'Scyther']},
        {name: 'Whitney', pokemon: ['Clefairy', 'Miltank']},
        {name: 'Morty', pokemon: ['Gastly', 'Haunter', 'Haunter', 'Gengar']},
        {name: 'Chuck', pokemon: ['Primeape', 'Polywrath']},
        {name: 'Jasmine', pokemon: ['Magnemite', 'Magnemite', 'Steelix']},
        {name: 'Pryce', pokemon: ['Seel', 'Dewgong', 'Piloswine']},
        {name: 'Clair', pokemon: ['Dragonair', 'Dragonair', 'Dragonair', 'Kingdra']}
    ];

    $scope.gymLeaders = kantoGymLeaders;
    $scope.kanto = function() {
        $scope.gymLeaders = kantoGymLeaders;
    };
    $scope.johto = function() {
        $scope.gymLeaders = johtoGymLeaders;
    };
}]);
