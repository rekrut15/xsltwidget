'use strict'; 
function getWindow(){
	
	if (typeof window !== 'undefined') { // Browser window
    return window;
    } else if (typeof self !== 'undefined') { // Web Worker
    self;
    } else { // Other environments
    return this;
    }
}
function repairProtocol(src){
	var ruth=getWindow();	
	
	var res=['http',src];
	if(ruth.location.protocol=='http'){
	   var query = src.match(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
	   if(typeof query[2]!='undefined'){
	       res[0]=query[2];
	   }
	}else{
		res[0]='https';
		src=src.replace(/^http\:/,"https:");
	}
	return res;
}
function getXHR1() {
  //if (window.ActiveXObject)
  if (window.ActiveXObject)
  {
  var xhttp = new ActiveXObject("Msxml2.XMLHTTP");
  }
  else
  {
  var xhttp = new XMLHttpRequest();
  }
  return xhttp;
  /*
  if (ruth.XMLHttpRequest
      && (!ruth.location || 'file:' != ruth.location.protocol
          || !ruth.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  return false;
  */
}
var XMlRequest={
    getWind:function(){
		return getWindow();
	},
	getXslt:function(xsltSrc,fnSaccess,fnError){
	    var xmlLoader = getXHR1();		
		var ret=repairProtocol(xsltSrc);
		var src=ret[1];
		
	    try{
		if(ret[0]=='https')
		//xmlLoader.withCredentials = true;
		xmlLoader.timeout=9000;}catch(e){}
		xmlLoader.open("GET", src,true);
		try {xmlLoader.responseType = "msxml-document"} catch(err) {} // Helping IE11
        xmlLoader.onreadystatechange = function (event) {
		if(xmlLoader.readyState==4 && xmlLoader.status == 200){
			fnSaccess(xmlLoader.responseXML,xmlLoader.responseType);
		    } 
		}
		xmlLoader.ontimeout = function (e) {
          return errorFn({status: "timeout |"+encodeURIComponent(src)+"| ", code: 100, errno: 103});
        };
		xmlLoader.send(null);
		console.log(['xmlLoader',xmlLoader,ret]);
	}, 
	getJson:function(xsltSrc,fnSaccess,fnError){
	    var xmlLoader = getXHR1();		
		var ret=repairProtocol(xsltSrc);
		var src=ret[1];
		
	    try{
		if(ret[0]=='https')
		//xmlLoader.withCredentials = true;
		xmlLoader.timeout=5000;}catch(e){}
		xmlLoader.open("GET", src,true);
		try {xmlLoader.responseType = "msxml-document"} catch(err) {} // Helping IE11
		 xmlLoader.onreadystatechange = function (event) {
		if(xmlLoader.readyState==4 && xmlLoader.status == 200){
			fnSaccess(xmlLoader.responseText);
		    } 
		}
		xmlLoader.ontimeout = function (e) {
          return errorFn({status: "timeout |"+encodeURIComponent(src)+"| ", code: 100, errno: 103});
        };
		xmlLoader.send(null);
		
	}	
}
module.exports = XMlRequest;      