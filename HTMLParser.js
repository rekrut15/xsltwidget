'use strict'; 
var HTMLParser={
    selectors:{},
    getSelector:function(css){
		css = css.toLowerCase();
		if(this.selectors.hasOwnProperty(css)) return;
		if(css=="keywords"){
			//this.selectors[css]=this.documentMeta('title');
		}else{
		this.selectors[css]=this.parseTags(css);
		console.log(["11112",this.selectors[css]]);
		}
		
    },documentMeta: function (teg) {
        var twords = '';
        var metas = document.getElementsByTagName('meta');
		
        if (metas) {
            for (var x = 0, y = metas.length; x < y; x++) {
				
                if (metas[x].name.toLowerCase() == teg) {
                    twords += metas[x].content;
                }
            }
        }
        twords = twords.replace(/^\s+|\s+$/g, '');
        return (twords != '') ? [twords] : false;
    },parseTags: function (tag) {
            var arr = document.querySelectorAll(tag);
			console.log(["1111",tag,arr]);
            if (arr && arr.length) {}else{ return;}
		    var str = this.sanitize(arr[0].innerHTML);
			return str;
    },sanitize: function (str, repl) {
        var entities = [
            ['apos', '\''],
            ['amp', '&'],
            ['lt', '<'],
            ['nbsp', ' '],
            ['gt', '>']

        ];
        repl = repl || " ";
        for (var i = 0, max = entities.length; i < max; ++i)
            str = str.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
        str = str.replace(/<\/?[^>]+(>|$)/g, repl);
        str = str.replace(/^[\s\t\r]+|[\s\t\r]+$/g, '');
        return str;
	},getData:function(css){
		var res={};
		css = css.toLowerCase();
		var arr= css.split(/\,/g);
		for (var x = 0, y = arr.length; x < y; x++) {
			var c=arr[x].replace(/^\s+|\s+$/,'');
			if(c && this.selectors.hasOwnProperty(c)){
			res[c]=	this.selectors[c];
			console.log(['teg',c,this.selectors[c]]);
			}
		}
		return res;
	}
}
module.exports = HTMLParser;      