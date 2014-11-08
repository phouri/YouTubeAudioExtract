
var app = angular.module('app',[]);

app.controller('Main', ['$scope', '$http', function($scope, $http) {
    $scope.startDownload = function() {
        $http.get('fetch?url='+encodeURIComponent($scope.url)).success(function(data) {
            $scope.msg = data;
        });
        $scope.msg = 'Attempting download... check your console, I am too lazy to do it here as well';
    };
}]);