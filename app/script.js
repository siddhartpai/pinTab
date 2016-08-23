function saveURL(url) {
  var storageArea = chrome.storage.sync;

  storageArea.get('urlSet',function(data){
    if(data.length===0||data===undefined){
      urlSet = [];
    }
    data.urlSet.push(url);
    storageArea.set({'urlSet': data.urlSet}, function() {
    });
  });
}

function getURL(callback){
  var storageArea = chrome.storage.sync;
  storageArea.get('urlSet',function(urlSet){
    callback(urlSet);
  })
}

var app=angular.module('workEX',[]);
app.controller('mainCtrl',['$scope','$timeout',function($scope,$timeout){
  debugger;
  $scope.savedURLS  = [];
  $scope.onSubmit = function(){
    $scope.savedURLS.push($scope.url);
    saveURL($scope.url);
  }
  getURL(function(data){
    $timeout(function(){
      $scope.savedURLS = data.urlSet;
    },0);
  });
  $scope.openPinTabs = function(){
    angular.forEach($scope.savedURLS,function(value,key){
      if(value.split('http://').length===1){
        value = "http://"+value;
      }
      chrome.tabs.create({ url: value,pinned:true });
    });
  }
}]);
