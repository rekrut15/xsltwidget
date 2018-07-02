'use strict'; 
var MpXMlRequest = require('./XMLRequest');
var HTMLParser = require('./HTMLParser');
var Cookie = require('./MyCookie');

function MPWidgetLib(data){
	//this.typyka={xslt:0,xml:0,rtype:0,container:0};
	this.GlobalMyGUITemp='';
	this.containers={};
	this.Divs=[];
	this.cookiesIds={};
	var tmp=Cookie.getCookie('my_un_shows');
	console.log(['predveria',tmp]);
	if(tmp){
		this.cookiesIds=JSON.parse(tmp);
		
	}
		
	
}
MPWidgetLib.prototype.countXml=function(widget,path,t1){
	var cnt=0;
	if (widget.xml.evaluate) {
        var nodes = widget.xml.evaluate(path, widget.xml, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();
        while (result) {
		            result = nodes.iterateNext();
					cnt++;
		
				
        } 
    // Code For Internet Explorer
    } else if (window.ActiveXObject || widget.rtype == "msxml-document") {
        widget.xml.setProperty("SelectionLanguage", "XPath");
        nodes = widget.xml.selectNodes(path);
        for (var i = 0; i < nodes.length; i++) {
            txt = nodes[i].childNodes[0].nodeValue + "";
			cnt++;	
			    
        }
    }
	return cnt;
}
/* 5 создание дополнительных параметров */
MPWidgetLib.prototype.readXml=function(widget,path,t1){
	t1=t1||'string'
    var txt = "";
    var rez=[];
    if (widget.xml.evaluate) {
        var nodes = widget.xml.evaluate(path, widget.xml, null, XPathResult.ANY_TYPE, null);
        var result = nodes.iterateNext();
        while (result) {
            txt = result.childNodes[0].nodeValue + "";
			if(t1!='string')
			    rez.push(txt);
			
            result = nodes.iterateNext();
				
        } 
    // Code For Internet Explorer
    } else if (window.ActiveXObject || widget.rtype == "msxml-document") {
        widget.xml.setProperty("SelectionLanguage", "XPath");
        nodes = widget.xml.selectNodes(path);
        for (var i = 0; i < nodes.length; i++) {
            txt = nodes[i].childNodes[0].nodeValue + "";
				if(t1!='string')
			    rez.push(txt);
        }
    }
	if(t1=='string')
	    return txt;
    else
		return rez;
}
/* 4 если все данные пришли - рисует виджет */
MPWidgetLib.prototype.checkContainer=function(widget){
	if(widget.xslt && widget.xml && !widget.loaded){
		if(!widget.container.contentWindow){
			return;
		}
		
	    if (window.ActiveXObject || widget.rtype == "msxml-document"){
            var ex = widget.xml.transformNode(widget.xslt);
			widget.container.contentWindow.document.body.innerHTML=ex;
	    }else if (document.implementation && document.implementation.createDocument)
        {
            var xsltProcessor = new XSLTProcessor(); 
            xsltProcessor.importStylesheet(widget.xslt);
            var resultDocument = xsltProcessor.transformToFragment(widget.xml, widget.container.contentWindow.document);
            widget.container.contentWindow.document.body.appendChild(resultDocument);
        }	
		widget.loaded=0;
		var kts=this.countXml(widget,"/catalog/cd/name");
		   console.log(["--->",kts,widget.div]);
		if(kts==0){
			widget.div.innerHTML='';
			return ;
		}
		var width=this.readXml(widget,"/catalog/style/width");
		var height=this.readXml(widget,"/catalog/style/height");
        var maxWidth=this.readXml(widget,"/catalog/style/max-width");		
		if(width)	widget.container.style.setProperty("width", width, "important");
		if(maxWidth)  widget.container.style.setProperty("max-width", maxWidth, "important");
		if(height)	widget.container.style.setProperty("height", height, "important");
		var showIds=this.readXml(widget,"/catalog/cd/id",'a');		
		for(var i=0,j=showIds.length;i<j;i++){
			this.cookiesIds[showIds[i]]=1;
		}
		Cookie.setCookie('my_un_shows',JSON.stringify(this.cookiesIds),10);
		console.log(['vorota',showIds]);
		var iso=this.readXml(widget,"/catalog/params/iso");		
		var city_name=this.readXml(widget,"/catalog/params/city_name");		
		var hash=this.readXml(widget,"/catalog/params/hash");		
		var referData={idps:showIds, 
		wid:widget.wid,
		iso:iso,
		city_name:city_name,
		hash:hash,
		url:window.location.href
		};
		
		var src=widget.domain+'/st_/g_p?p='+Math.random()+'&et_='+encodeURIComponent(JSON.stringify(referData));
	    var img = new Image();
        img.src = src;
		var links = widget.container.contentWindow.document.querySelectorAll('.mp-offers a');
		for (var i = 0, j = links.length; i < j; i++) {
			var linkh = links[i].href;
		}
	}	
}
/* 3 составляет пакет данных и xsl шаблона, синхронизирует данные*/
MPWidgetLib.prototype.dispatchContainer=function(widget,xtype,data,resptype){
		if(!widget.hasOwnProperty(xtype)) return;
		widget[xtype]=data;
		widget.rtype=resptype;
		this.checkContainer(widget);
		
}
/* 1 получение информации со страницы поиск контейнеров и текста */
MPWidgetLib.prototype.create=function(id,cssSelector,domainSourse,wid,css_){
	css_=css_ || "h1,Title,H2"
	css_ = css_.toLowerCase();
		var arr= css_.split(/\,/g);
		for (var x = 0, y = arr.length; x < y; x++) {
			var c=arr[x].replace(/^\s+|\s+$/,'');
			if(c)
	        HTMLParser.getSelector(c);		
		}
	var lui = document.querySelectorAll(cssSelector); 
	if(!lui.length) return;
	for(var i=0,j=lui.length;i<j;i++){
	    lui[i].innerHTML='';	
		var widget={domain:domainSourse,
		div:lui[i],
		xslt:null,
		xml:null,
		rtype:null,
		container:null,
		wid:wid,
		css_:css_,
		t_name:id,
		loaded:0
		};
		if(lui[i].dataset && lui[i].dataset.hasOwnProperty('template')){
			widget.t_name=lui[i].dataset.template;
		}
		this.createTemplate(widget);
	}
}
/* 2 создаёт iframe для загрузки XSLT виджета*/
MPWidgetLib.prototype.createTemplate=function(widget){
    	widget.container =widget.div.appendChild(document.createElement("iframe"));
        widget.container.style.width = "100%";
		widget.container.style.background = "100%";
        widget.container.style.height = "100%";
        widget.container.style.border = "0";
		widget.container.scrolling = "no";
		widget.container.style.boxSizing = "content-box"; 
		widget.container.contentWindow.document.open();
		widget.container.contentWindow.document.close();
		widget.container.contentWindow.document.body.style.position = "relative";
		widget.container.contentWindow.document.body.style.padding = "0";
		widget.container.contentWindow.document.body.style.margin = "0";
			var matches = /\.xsl$/.exec(widget.t_name);
		   	if(matches){
			var xsltSrc='//storage.market-place.su/nt_/'+widget.t_name; 
			}
			else{
	        var xsltSrc=widget.domain+'/nt_/'+widget.wid+'.xsl'; 
			}
			console.log(["111111-->",this.cookiesIds]);
	var css_=HTMLParser.getData(widget.css_);
	
	var referData={css_:css_,url:window.location.href,idsh:this.cookiesIds};
	console.log(['sended',JSON.stringify(this.cookiesIds)]);
	if(widget.div.dataset){
		referData.set={};
	    var datakey;
	    for(datakey in widget.div.dataset){
			referData.set[datakey]=widget.div.dataset[datakey];
	    }  
	}
	var xmlSrc=widget.domain+'/api/v1/index.php?p='+Math.random()+'&id='+widget.wid+'&et_='+encodeURIComponent(JSON.stringify(referData));
	MpXMlRequest.getXslt(xsltSrc,function(dataXML,typeXML){
		this.dispatchContainer(widget,'xslt',dataXML,typeXML);
    }.bind(this),function(dataError){
	    console.log(['dataError',widget,dataError]);
	}.bind(this));
	MpXMlRequest.getXslt(xmlSrc,function(dataXML,typeXML){
	    this.dispatchContainer(widget,'xml',dataXML,typeXML);
    }.bind(this),function(dataError){
	    console.log(['dataError',widget,dataError]);
	}.bind(this));
	
}
module.exports = MPWidgetLib;      
