chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
     
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "catch_item"}, function(response) {
            
                console.log(tabs[0].id);
                console.log(response);
                
                if (response){
                    var url = tabs[0].url;
                    response[0].url = url;
                    
                    var price = response[0].price;
                    
                    if (price.indexOf("-") > -1){
                            console.log('splitting price');
                            price = price.split("-");
                            console.log(price);
                            response[0].price = price;
                        }
                    
                } else {
                    console.log('returned nothing');
                }
                
                console.log(response);
            });
        
});

