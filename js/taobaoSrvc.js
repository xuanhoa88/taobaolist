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
                    
                    /*for (var i = 0; i < _this.data.length; i++) {
                        _this.data[i]['id'] = i + 1;
                    }*/
                    
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
           
           for (var i = 0; i < this.data.length; i++){
               if (this.data[i].id == item){
                   
                   this.data.splice(this.data.indexOf(this.data[i]), 1);
                   this.syncStorage();
                   
               }
           } 
           
           /* this.data.splice(this.data.indexOf(item), 1);
            this.syncStorage();*/
            
        }
       
       this.addProduct = function(item, listName){
           
           var lastId = 1;
           var lastIdIndex = (this.data.length) - 1; //Returns -1 on first run
           
           //If adding first item:
           if (lastIdIndex >= 0){
               lastId = this.data[lastIdIndex].id +1;
           } else {
              // item.id = lastId + 1; //Returns 1 on first run
           }
           
           item.id = lastId;
           item.price = item.price[0];
           //item.notes = 'Click to add notes';
           
           var dirtyPrice = item.price;
           item.price = Number(dirtyPrice.replace(/[^0-9\.]+/g,""));
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
       
       this.addProductNotes = function(id, notes){
           
           console.log('begin adding ' + notes);
           
            _this.data.forEach(function(ent, i) { 
                  if (ent.id == id){
                                ent.notes = notes;
                                _this.syncStorage();
                            }
                      });
           
       }
       
       this.initializeList = function(){
               
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
       
       _this.clearList = function(newList, listName){
           
           console.log("clearing list " + listName);
           console.log(this.data);
           
           var toBeDeleted = [];
           var cleanedList = [];
           
              _this.data.forEach(function(ent, i) { 
                  if (ent.listName !== listName){
                                cleanedList.push(ent);
                            }
                      });
                   
             _this.data = cleanedList;
             _this.syncStorage();
           
           /*
           this.data.forEach(function(ent, i){
               
               toBeDeleted.forEach(function(id, x){
                   if (ent.id == id){
                       console.log('found a match, its ' + ent.id + 'and matches ' + id);
                       _this.data.splice(_this.data.indexOf(ent), 1);
                       _this.syncStorage();
                   }
               })
               
           });
           */
           
       }
       
       this.deleteList = function(listName){
           
          _this.clearList(listName);
           
          chrome.storage.sync.get('taobaoListNames', function(keys) {
              
               listNames.splice(listNames.indexOf(listName), 1);
                    
               chrome.storage.sync.set({
                taobaoListNames: listNames
                    }, function() {
                        console.log('list removed');
                    });
                    
                });
       }
       

       
   }