angular
    .module('taobaoList')
    .controller('taobaoCtrl', taobaoCtrl);
    
    function taobaoCtrl(taobaoSrvc, $scope){
        
        vm = this;
        
        vm.currentList = 'default';
        
        vm.debugRemoveAll = function(){
            chrome.storage.sync.remove('taobaoList');
            chrome.storage.sync.remove('taobaoListNames');
            console.log('everything removed');
        }
        
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
            
            taobaoSrvc.getListNames( function(response){
                
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
        
        vm.createNewList = function(listName){
            console.log(listName);
            console.log(vm.listNames);
            
            var dubs = false;
            
            //check for duplicates
            for (var i = 0; i < vm.listNames.length; i++){
                if (listName == vm.listNames[i]){
                    dubs = true;
                }
            }
            
            if (!listName){
                alert('Please enter list name.')
            } 
            else if (dubs) {
                alert('This list already exists.');
            }
            else {
                taobaoSrvc.addNewList(vm.newList);
                //vm.newList = null;
                //vm.fetchLists();
                alert('New list created.');
                location.reload();
            }
        }
        
        vm.addProduct = function(listName){
            
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                
            if (tabs[0].url.indexOf("tmall") > -1){ 
                    var fetchMessage = 'catch_item_tmall'
                } else {
                    var fetchMessage = 'catch_item'
                }
     
            chrome.tabs.sendMessage(tabs[0].id, {greeting: fetchMessage}, function(response) {
                
                    console.log(tabs[0].id);
                    console.log(response);
                    
                    if (response){
                        
                        var url = tabs[0].url;
                        response[0].url = url;
                        
                        //Because some taobao prices are set up with a price range, i.e. two prices,
                        //since it might have different style items in the same listing,
                        //we need to make a sanity check since the user might just add the listing
                        //to the shopping list without picking the exact item with the exact price.
                        // This will pick up the lowest price in the range. So it's better to send 
                        // the price as an array anyway.
                        
                        var price = response[0].price;
                    
                        if (price.indexOf("-") > -1){
                                console.log('splitting price');
                                price = price.split("-");
                                console.log(price);
                                response[0].price = price;
                            } else {
                                var priceArray = [];
                                priceArray.push(price);
                                response[0].price = priceArray;
                            }
                        
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
        
        vm.clearList = function(listName){
            
           var c = confirm('Clear this list?');
            
            if (c == true){
                taobaoSrvc.clearList(vm.productList, listName);
                vm.fetchItems();
                //vm.fetchLists();
            } else {
                
            }
            
        }
        
        vm.deleteList = function(listName){
            
            var c = confirm('Delete this list?');
            
            if (c == true){
                taobaoSrvc.deleteList(listName);
                location.reload();
              /*  vm.currentList = 'default';
                vm.fetchLists();*/
            } else {
                
            }
        }
        
        vm.fetchItems();
        vm.fetchLists();
    }