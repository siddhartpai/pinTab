var STORAGE_AREA = 'urlSet'

function saveURL(url) {
  var storageArea = chrome.storage.sync;
  var urlSet = [];
  storageArea.get(STORAGE_AREA,function(data){
    if(data[STORAGE_AREA]===undefined){
      urlSet = [];
    }
    else{
      urlSet = data[STORAGE_AREA];
    }
    urlSet.push(url);
    var toBeStored = {};
    toBeStored[STORAGE_AREA] = urlSet;
    storageArea.set(toBeStored, function(data) {
      console.log('What happen\'d on saving ? ',data);
    });
  });
}

function getURL(callback){
  var storageArea = chrome.storage.sync;
  storageArea.get(STORAGE_AREA,function(data){
    if(data[STORAGE_AREA] !== undefined){
      callback(data[STORAGE_AREA]);
      }
      else{
        callback([]);
      }
  })
}

var app=angular.module('workEX',[]);

app.controller('mainCtrl',['$scope','$timeout',function($scope,$timeout){
  $scope.savedURLS  = [];

  $scope.onSubmit = function(){
    $scope.savedURLS.push($scope.url);
    saveURL($scope.url);
  }
  console.log('gonna get URLS');
  getURL(function(data){
      $timeout(function(){
        $scope.savedURLS = data;
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
