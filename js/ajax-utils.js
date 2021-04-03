(function (global) {

// Set up a namespace for our utility
var ajaxUtils = {};


// Returns an HTTP request object
// XMLHttpRequest interacts with the server to retrieve data from 
// a URL without having to do a full page refresh. This enables a 
// web page to update just part of a page without disrupting what 
// the user is doing.
function getRequestObject() {
  if (global.XMLHttpRequest) {
    return (new XMLHttpRequest());
  } 
  else if (global.ActiveXObject) {
    // For very old IE browsers (optional)
    return (new ActiveXObject("Microsoft.XMLHTTP"));
  } 
  else {
    global.alert("Ajax is not supported!");
    return(null); 
  }
}


// Makes an Ajax GET request to 'requestUrl'
// XMLHttpRequest.onreadystatechange is an EventHandler that is called 
// whenever the readyState attribute changes. Whenever the readyState 
// attribute changes, the readystatechange event is fired. The 
// XMLHttpRequest.readyState property returns the state an 
// XMLHttpRequest client is in.
// Status 4 = operation is complete (data is available from the server)

ajaxUtils.sendGetRequest = 
  function(requestUrl, responseHandler, isJsonResponse) {
    var request = getRequestObject(); // This is the XMLHttpRequest.
    request.onreadystatechange = 
      function() { 
        handleResponse(request, 
                       responseHandler,
                       isJsonResponse); 
      };
    request.open("GET", requestUrl, true);
    request.send(null); // for POST only
  };


// Only calls user provided 'responseHandler' function if response is 
// ready and not an error
// responseHandler argument has to be a function with 1 input arg
// which will return the innerHTML of a query selector
function handleResponse(request,
                        responseHandler,
                        isJsonResponse) {
  if ((request.readyState == 4) &&
     (request.status == 200)) {

    // Default to isJsonResponse = true
    if (isJsonResponse == undefined) {
      isJsonResponse = true;
    }

    if (isJsonResponse) {
      responseHandler(JSON.parse(request.responseText));
    }
    else {
      responseHandler(request.responseText);
    }
  }
}


// Expose utility to the global object
global.$ajaxUtils = ajaxUtils;


})(window);

