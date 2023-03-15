var page_query_string=location.search.substring(1),page_args=function(){if(!page_query_string)return[];for(var b=page_query_string.split(/[&;]/),a=0;a<b.length;a++){var c=b[a],d=c.indexOf("=");b[a]=0<=d?[c.substring(0,d),c.substring(d+1)]:[c,!1]}return b}();function GetPageArg(b,a){for(var c=0;c<page_args.length;c++)if(page_args[c][0]==b)return decodeURIComponent(page_args[c][1]);return a}
function MergePageArgsIntoLink(b){0==page_args.length||!b.attributes["data-pltdoc"]||""==b.attributes["data-pltdoc"].value||(b.href=MergePageArgsIntoUrl(b.href))}
function MergePageArgsIntoUrl(b){var a=b.match(/^([^?#]*)(?:\?([^#]*))?(#.*)?$/);if(void 0==a)return"?"+page_query_string;if(!a[2])return a[1]+"?"+page_query_string+(a[3]||"");for(var c,b=a[1],d=a[2]||"",f=a[3]||"",e=d.split(/[&;]/),a=0;a<e.length;a++)(c=e[a].indexOf("="))&&(e[a]=e[a].substring(0,c));for(a=0;a<page_args.length;a++){var g=!1;for(c=0;c<e.length;c++)if(e[c]==page_args[a][0]){g=!0;break}g||(d+="&"+page_args[a][0]+"="+page_args[a][1])}return b+"?"+d+f}
function GetCookie(b,a){try{var c=localStorage[b];c||(c=a);return c}catch(d){var f;try{if(0>=document.cookie.length)return a;f=document.cookie.split(/; */)}catch(e){return a}for(c=0;c<f.length;c++){var g=f[c],h=g.indexOf("=");if(0<=h&&g.substring(0,h)==b)return unescape(g.substring(h+1))}return a}}function SetCookie(b,a){try{localStorage[b]=a}catch(c){var d=new Date;d.setTime(d.getTime()+31536E6);try{document.cookie=b+"="+escape(a)+"; expires="+d.toGMTString()+"; path=/"}catch(f){}}}
function SetPLTRoot(b,a){var c=location.protocol+"//"+location.host+NormalizePath(location.pathname.replace(/[^\/]*$/,a));SetCookie("PLT_Root."+b,c)}function GotoPLTRoot(b,a){var c=GetCookie("PLT_Root."+b,null);if(null==c)return!0;a||(a="index.html");location=c+a;return!1}var normalize_rxs=[/\/\/+/g,/\/\.(\/|$)/,/\/[^\/]*\/\.\.(\/|$)/];function NormalizePath(b){var a,c;for(c=0;c<normalize_rxs.length;c++)for(;(a=b.replace(normalize_rxs[c],"/"))!=b;)b=a;return b}
function DoSearchKey(b,a,c,d){a=a.value;return b&&13==b.keyCode?(b=GetCookie("PLT_Root."+c,null),null==b&&(b=d),b+="search/index.html?q="+encodeURIComponent(a),location=b=MergePageArgsIntoUrl(b),!1):!0}function TocviewToggle(b,a){var c=document.getElementById(a).style,d="none"==c.display;c.display=d?"block":"none";b.innerHTML=d?"&#9660;":"&#9658;"}var on_load_funcs=[];function AddOnLoad(b){on_load_funcs.push(b)}window.onload=function(){for(var b=0;b<on_load_funcs.length;b++)on_load_funcs[b]()};
AddOnLoad(function(){for(var b=document.getElementsByTagName("a"),a=0;a<b.length;a++)MergePageArgsIntoLink(b[a]);if(b=GetPageArg("ctxtname",!1))if(a=document.getElementById("contextindicator"))a.innerHTML=b,a.style.display="block"});