angular
    .module('taobaoList')
    .service('taobaoSrvc', taobaoSrvc);
    
   function taobaoSrvc() {
       
       _this = this;
       //Create empty array to populate with storage objects
       this.data = [];
       var listNames = [];
       
       //Get all the data from the storage
       this.getProducts = function(callback) {
           
            chrome.storage.sync.get('taobaoList', function(keys) {
                
                if (keys.taobaoList != null) {
                    console.log(keys.taobaoList);
                    _this.data = keys.taobaoList;
                    
                    for (var i = 0; i < _this.data.length; i++) {
                        _this.data[i]['id'] = i + 1;
                    }
                    
                    console.log(_this.data);
                    //create callback for returning storage objects to the controller
                    callback(_this.data);
                    
                } 
                
            });
        }
       
       //Call this every time when making changes to the storage
       this.syncStorage = function() {
           
            chrome.storage.sync.set({
                taobaoList: this.data
                    }, function() {
                        console.log('Data is stored in Chrome storage');
                    });
        }
        
       //Remove one object
       this.removeProduct = function(item) {
            this.data.splice(this.data.indexOf(item), 1);
            this.syncStorage();
        }
       
       this.addProduct = function(item, listName){
           
           var id = this.data.length + 1;
           item.id = id;
           item.price = item.price.substring(2);
           item.listName = listName;
           
           this.data.push(item);
           this.syncStorage();
           
           console.log('added new product');
       }
       
       this.addNewList = function(listName){
           
           console.log('starting new list addition');
           
            chrome.storage.sync.get('taobaoListNames', function(keys) {
                
                if (keys.taobaoListNames != null) {
                    
                    console.log(keys.taobaoListNames);
                    listNames = keys.taobaoListNames;
                    
                    console.log(listNames);
                    listNames.push(listName);
                    
               chrome.storage.sync.set({
                taobaoListNames: listNames
                    }, function() {
                        console.log('listNames added');
                    });
                } else {
                    console.log('no lists found...');
                }
                
            });
           
       }
       
       _this.initializeList = function(){
               
               console.log('no lists found, creating the initial one'); 
                    
               listNames.push('default');
               
               console.log(listNames);
                   
                   chrome.storage.sync.set({
                        taobaoListNames: listNames
                            }, function() {
                                console.log('listNames added');
                            });
       };
       
       this.getListNames = function(callback){
              
           console.log('get all Lists');
           
            chrome.storage.sync.get('taobaoListNames', function(keys) {
                
                if (keys.taobaoListNames != null) {
                    
                    console.log(keys.taobaoListNames);
                    listNames = keys.taobaoListNames;
                    callback(listNames);
                    
                } else {
                    
                   _this.initializeList();
                   
                }
                
            });
       }
       

       
   }