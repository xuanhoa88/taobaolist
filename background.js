
function derp(tabid){

   chrome.tabs.sendMessage(tabid, {text: 'report_back'}, doStuffWithDom);
   
    function doStuffWithDom(domContent) {
        console.log('I received the following DOM content:\n' + domContent);
        var theDom = domContent;
    }
   

}