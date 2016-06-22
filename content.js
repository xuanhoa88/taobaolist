chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      
    if (request.greeting == "catch_item") {
    
        responseArr = [];
        
        var priceElement = document.getElementsByClassName('tb-rmb-num');
        
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
    
  });
