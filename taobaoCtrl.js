angular
    .module('taobaoList')
    .controller('taobaoCtrl', taobaoCtrl);
    
    function taobaoCtrl(taobaoSrvc, $scope){
        
        vm = this;
        
        vm.testdata = ['default','foo', 'bar', 'banana'];
        vm.currentList = 'default';
        
        vm.fetchItems = function(){
            
            vm.productList = [];
            
            taobaoSrvc.getProducts(function(response){
                
                for (var i = 0; i < response.length; i++){
                    
                    if (response[i].listName == vm.currentList) {
                        vm.productList.push(response[i]); 
                    }
                }
                
                //after receiving the callback apply it to the scope
                $scope.$apply();   
                
            });
        };
        
         vm.fetchLists = function(){
            
            console.log('getting lists from the service');
            vm.listNames = [];
            
            taobaoSrvc.getListNames(function(response){
                
                for (var i = 0; i < response.length; i++){
                    console.log(response[i]);
                    vm.listNames.push(response[i]);
                }
                
                //after receiving the callback apply it to the scope
                $scope.$apply();   
                
            });
        };
        
        vm.switchList = function() {
            vm.fetchItems();
            
        }
        
        vm.createNewList = function(){
            console.log(vm.newList);
            taobaoSrvc.addNewList(vm.newList);
        }
        
        vm.addProduct = function(listName){
            
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
     
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "catch_item"}, function(response) {
                
                    console.log(tabs[0].id);
                    console.log(response);
                    
                    if (response){
                        
                        var url = tabs[0].url;
                        response[0].url = url;
                        taobaoSrvc.addProduct(response[0], listName);
                        vm.fetchItems();
                        
                    } else {
                        console.log('returned nothing');
                    }
                    
                });
                
        });

            
        }
        
        vm.removeProduct = function(id) {
            taobaoSrvc.removeProduct(id);
            vm.fetchItems();
        }
        
        vm.fetchItems();
        vm.fetchLists();
    }