chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      
    if (request.greeting == "catch_item") {
    
        responseArr = [];
        
        var price = document.getElementsByClassName('tb-rmb-num')[0].innerText;
        var name = document.getElementsByClassName('t-title')[0].innerText;
        
        responseArr.push(
            {
                "name" : name,
                "price" : price
            }
        );
        
      sendResponse(responseArr);
      
    };
    
   if (request.greeting == "catch_item_tmall") {
    
        responseArr = [];
        
        //var price = document.getElementsByClassName('tm-price')[0].innerText;
        
        //Check if there's a promotion price
        if (document.getElementsByClassName('tm-promo-price').length > 0){
                var price = document.querySelectorAll('.tm-price')[1].innerText;
        } else {
            var price = document.getElementsByClassName('tm-price')[0].innerText;
        }
        
        var name = document.getElementsByClassName('tb-detail-hd')[0].innerText;
        
        responseArr.push(
            {
                "name" : name,
                "price" : price
            }
        );
        
      sendResponse(responseArr);
      
    };
    
  });
