angular.module('my-app',["onsen"])
.controller('tempCtrl', function($scope) {


    /*
    $scope.tab1 = function(){
        location.href = "./index.html";
    };

    $scope.tab2 = function() {
        location.href = "./index2.html";
    };
    */

    $scope.title = 'PREMO';

    /*
    $scope.showAlert = function(message) {
         ons.notification.alert(message);
    };
    $scope.login = function(){
      console.log(this.username);
      console.log(this.password);
    };
    */
});