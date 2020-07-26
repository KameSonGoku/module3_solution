( function (){
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('NarrowItDownService', NarrowItDownService)
  .constant('ApiBasePath',"https://davids-restaurant.herokuapp.com")
  .directive('foundItems', FoundItems);

  function FoundItems () {
    var ddo = {
      restrict: 'E',
      templateUrl: 'foundItems.html',
      scope: {
        foundItems: '<',
        onEmpty: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'menu',
      bindToController: true
    };
    return ddo;
  }

  NarrowItDownController.$inject = ['NarrowItDownService'];
  function NarrowItDownController (NarrowItDownService) {
    var menu = this;
    menu.shortName = "";

    menu.matchedMenuItems = function (searchTerm) {
      var promise = NarrowItDownService.getMatchedMenuItems(searchTerm);
      promise.then( function (items) {
        if(items && items.length>0){
          menu.message = '';
          menu.found = items;
        }
        else {
          menu.message = 'Nothing Found';
          menu.found = [];
        }
      });
    };

    menu.removeMenuItem = function (index) {
      menu.found.splice(index,1);
    }
  }

  NarrowItDownService.$inject = ['$http','ApiBasePath'];
  function NarrowItDownService ($http,ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath+"/menu_items.json")
      }).then( function (response) {
        var foundItems = [];
        for(var i=0;i<response.data['menu_items'].length;i++){
          if(searchTerm.length>0 && response.data['menu_items'][i]['description'].toLowerCase().indexOf(searchTerm)!==-1){
            foundItems.push(response.data['menu_items'][i]);
          }
        }
        return foundItems;
      });
    };
  }
})();
