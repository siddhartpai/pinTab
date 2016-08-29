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

var app=angular.module('workEX',['ui','ui.filters']);

app.controller('mainCtrl',['$scope','$timeout',function($scope,$timeout){
  $scope.savedURLS  = [];
  var initialize = function(){
    loadURLs();
  }

  function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  }
  $scope.onSubmit = function(){
    var randomId = guidGenerator();
    var urlObject = {'groupId':0,'id':randomId,'url':$scope.url,'tags':[]};
    $scope.savedURLS.push(urlObject);
    saveURL(urlObject);
  }

 var loadURLs = function(){
   getURL(function(data){
     $timeout(function(){
       $scope.savedURLS = data;
     },0);
   });
 }

  $scope.openPinTabs = function(){
    angular.forEach($scope.savedURLS,function(value,key){
      if(value['url'].split('http://').length===1){
        url = "http://"+value.url;
      }
      chrome.tabs.create({ 'url': url,pinned:true });
    });
  }

  initialize();
}]);
