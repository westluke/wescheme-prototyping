var $jscomp=$jscomp||{};$jscomp.scope={};$jscomp.ASSUME_ES5=!1;$jscomp.ASSUME_NO_NATIVE_MAP=!1;$jscomp.ASSUME_NO_NATIVE_SET=!1;$jscomp.SIMPLE_FROUND_POLYFILL=!1;$jscomp.defineProperty=$jscomp.ASSUME_ES5||"function"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};
$jscomp.getGlobal=function(a){a=["object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof global&&global,a];for(var b=0;b<a.length;++b){var c=a[b];if(c&&c.Math==Math)return c}throw Error("Cannot find global object");};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.polyfill=function(a,b,c,d){if(b){c=$jscomp.global;a=a.split(".");for(d=0;d<a.length-1;d++){var e=a[d];e in c||(c[e]={});c=c[e]}a=a[a.length-1];d=c[a];b=b(d);b!=d&&null!=b&&$jscomp.defineProperty(c,a,{configurable:!0,writable:!0,value:b})}};$jscomp.arrayIteratorImpl=function(a){var b=0;return function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}}};$jscomp.arrayIterator=function(a){return{next:$jscomp.arrayIteratorImpl(a)}};$jscomp.SYMBOL_PREFIX="jscomp_symbol_";
$jscomp.initSymbol=function(){$jscomp.initSymbol=function(){};$jscomp.global.Symbol||($jscomp.global.Symbol=$jscomp.Symbol)};$jscomp.SymbolClass=function(a,b){this.$jscomp$symbol$id_=a;$jscomp.defineProperty(this,"description",{configurable:!0,writable:!0,value:b})};$jscomp.SymbolClass.prototype.toString=function(){return this.$jscomp$symbol$id_};
$jscomp.Symbol=function(){function a(c){if(this instanceof a)throw new TypeError("Symbol is not a constructor");return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX+(c||"")+"_"+b++,c)}var b=0;return a}();
$jscomp.initSymbolIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.iterator;a||(a=$jscomp.global.Symbol.iterator=$jscomp.global.Symbol("Symbol.iterator"));"function"!=typeof Array.prototype[a]&&$jscomp.defineProperty(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))}});$jscomp.initSymbolIterator=function(){}};
$jscomp.initSymbolAsyncIterator=function(){$jscomp.initSymbol();var a=$jscomp.global.Symbol.asyncIterator;a||(a=$jscomp.global.Symbol.asyncIterator=$jscomp.global.Symbol("Symbol.asyncIterator"));$jscomp.initSymbolAsyncIterator=function(){}};$jscomp.iteratorPrototype=function(a){$jscomp.initSymbolIterator();a={next:a};a[$jscomp.global.Symbol.iterator]=function(){return this};return a};
$jscomp.iteratorFromArray=function(a,b){$jscomp.initSymbolIterator();a instanceof String&&(a+="");var c=0,d={next:function(){if(c<a.length){var e=c++;return{value:b(e,a[e]),done:!1}}d.next=function(){return{done:!0,value:void 0}};return d.next()}};d[Symbol.iterator]=function(){return d};return d};$jscomp.polyfill("Array.prototype.entries",function(a){return a?a:function(){return $jscomp.iteratorFromArray(this,function(a,c){return[a,c]})}},"es6","es3");var COMPILED=!0,goog=goog||{};goog.global=this;
goog.DEBUG=!0;goog.LOCALE="en";goog.provide=function(a){if(!COMPILED){if(goog.isProvided_(a))throw Error('Namespace "'+a+'" already declared.');delete goog.implicitNamespaces_[a];for(var b=a;(b=b.substring(0,b.lastIndexOf(".")))&&!goog.getObjectByName(b);)goog.implicitNamespaces_[b]=!0}goog.exportPath_(a)};goog.setTestOnly=function(a){if(COMPILED&&!goog.DEBUG)throw a=a||"",Error("Importing test-only code into non-debug environment"+a?": "+a:".");};
COMPILED||(goog.isProvided_=function(a){return!goog.implicitNamespaces_[a]&&!!goog.getObjectByName(a)},goog.implicitNamespaces_={});goog.exportPath_=function(a,b,c){a=a.split(".");c=c||goog.global;a[0]in c||!c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)!a.length&&goog.isDef(b)?c[d]=b:c=c[d]?c[d]:c[d]={}};goog.getObjectByName=function(a,b){a=a.split(".");b=b||goog.global;for(var c;c=a.shift();)if(goog.isDefAndNotNull(b[c]))b=b[c];else return null;return b};
goog.globalize=function(a,b){b=b||goog.global;for(var c in a)b[c]=a[c]};goog.addDependency=function(a,b,c){if(!COMPILED){var d;a=a.replace(/\\/g,"/");for(var e=goog.dependencies_,f=0;d=b[f];f++)e.nameToPath[d]=a,a in e.pathToNames||(e.pathToNames[a]={}),e.pathToNames[a][d]=!0;for(d=0;b=c[d];d++)a in e.requires||(e.requires[a]={}),e.requires[a][b]=!0}};goog.ENABLE_DEBUG_LOADER=!0;
goog.require=function(a){if(!COMPILED&&!goog.isProvided_(a)){if(goog.ENABLE_DEBUG_LOADER){var b=goog.getPathFromDeps_(a);if(b){goog.included_[b]=!0;goog.writeScripts_();return}}a="goog.require could not find: "+a;goog.global.console&&goog.global.console.error(a);throw Error(a);}};goog.basePath="";goog.nullFunction=function(){};goog.identityFunction=function(a){return a};goog.abstractMethod=function(){throw Error("unimplemented abstract method");};
goog.addSingletonGetter=function(a){a.getInstance=function(){return a.instance_||(a.instance_=new a)}};
!COMPILED&&goog.ENABLE_DEBUG_LOADER&&(goog.included_={},goog.dependencies_={pathToNames:{},nameToPath:{},requires:{},visited:{},written:{}},goog.inHtmlDocument_=function(){var a=goog.global.document;return"undefined"!=typeof a&&"write"in a},goog.findBasePath_=function(){if(goog.global.CLOSURE_BASE_PATH)goog.basePath=goog.global.CLOSURE_BASE_PATH;else if(goog.inHtmlDocument_())for(var a=goog.global.document.getElementsByTagName("script"),b=a.length-1;0<=b;--b){var c=a[b].src,d=c.lastIndexOf("?");d=
-1==d?c.length:d;if("base.js"==c.substr(d-7,7)){goog.basePath=c.substr(0,d-7);break}}},goog.importScript_=function(a){var b=goog.global.CLOSURE_IMPORT_SCRIPT||goog.writeScriptTag_;!goog.dependencies_.written[a]&&b(a)&&(goog.dependencies_.written[a]=!0)},goog.writeScriptTag_=function(a){return goog.inHtmlDocument_()?(goog.global.document.write('<script type="text/javascript" src="'+a+'">\x3c/script>'),!0):!1},goog.writeScripts_=function(){function a(e){if(!(e in d.written)){if(!(e in d.visited)&&(d.visited[e]=
!0,e in d.requires))for(var g in d.requires[e])if(!goog.isProvided_(g))if(g in d.nameToPath)a(d.nameToPath[g]);else throw Error("Undefined nameToPath for "+g);e in c||(c[e]=!0,b.push(e))}}var b=[],c={},d=goog.dependencies_,e;for(e in goog.included_)d.written[e]||a(e);for(e=0;e<b.length;e++)if(b[e])goog.importScript_(goog.basePath+b[e]);else throw Error("Undefined script input");},goog.getPathFromDeps_=function(a){return a in goog.dependencies_.nameToPath?goog.dependencies_.nameToPath[a]:null},goog.findBasePath_(),
goog.global.CLOSURE_NO_DEPS||goog.importScript_(goog.basePath+"deps.js"));
goog.typeOf=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b};goog.propertyIsEnumerableCustom_=function(a,b){if(b in a)for(var c in a)if(c==b&&Object.prototype.hasOwnProperty.call(a,b))return!0;return!1};goog.propertyIsEnumerable_=function(a,b){return a instanceof Object?Object.prototype.propertyIsEnumerable.call(a,b):goog.propertyIsEnumerableCustom_(a,b)};goog.isDef=function(a){return void 0!==a};goog.isNull=function(a){return null===a};
goog.isDefAndNotNull=function(a){return null!=a};goog.isArray=function(a){return"array"==goog.typeOf(a)};goog.isArrayLike=function(a){var b=goog.typeOf(a);return"array"==b||"object"==b&&"number"==typeof a.length};goog.isDateLike=function(a){return goog.isObject(a)&&"function"==typeof a.getFullYear};goog.isString=function(a){return"string"==typeof a};goog.isBoolean=function(a){return"boolean"==typeof a};goog.isNumber=function(a){return"number"==typeof a};
goog.isFunction=function(a){return"function"==goog.typeOf(a)};goog.isObject=function(a){a=goog.typeOf(a);return"object"==a||"array"==a||"function"==a};goog.getUid=function(a){return a[goog.UID_PROPERTY_]||(a[goog.UID_PROPERTY_]=++goog.uidCounter_)};goog.removeUid=function(a){"removeAttribute"in a&&a.removeAttribute(goog.UID_PROPERTY_);try{delete a[goog.UID_PROPERTY_]}catch(b){}};goog.UID_PROPERTY_="closure_uid_"+Math.floor(2147483648*Math.random()).toString(36);goog.uidCounter_=0;
goog.getHashCode=goog.getUid;goog.removeHashCode=goog.removeUid;goog.cloneObject=function(a){var b=goog.typeOf(a);if("object"==b||"array"==b){if(a.clone)return a.clone();b="array"==b?[]:{};for(var c in a)b[c]=goog.cloneObject(a[c]);return b}return a};goog.bindNative_=function(a,b,c){return a.call.apply(a.bind,arguments)};
goog.bindJs_=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}};goog.bind=function(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?goog.bind=goog.bindNative_:goog.bind=goog.bindJs_;return goog.bind.apply(null,arguments)};
goog.partial=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=Array.prototype.slice.call(arguments);b.unshift.apply(b,c);return a.apply(this,b)}};goog.mixin=function(a,b){for(var c in b)a[c]=b[c]};goog.now=Date.now||function(){return+new Date};
goog.globalEval=function(a){if(goog.global.execScript)goog.global.execScript(a,"JavaScript");else if(goog.global.eval)if(null==goog.evalWorksForGlobals_&&(goog.global.eval("var _et_ = 1;"),"undefined"!=typeof goog.global._et_?(delete goog.global._et_,goog.evalWorksForGlobals_=!0):goog.evalWorksForGlobals_=!1),goog.evalWorksForGlobals_)goog.global.eval(a);else{var b=goog.global.document,c=b.createElement("script");c.type="text/javascript";c.defer=!1;c.appendChild(b.createTextNode(a));b.body.appendChild(c);
b.body.removeChild(c)}else throw Error("goog.globalEval not available");};goog.evalWorksForGlobals_=null;goog.getCssName=function(a,b){var c=function(a){return goog.cssNameMapping_[a]||a},d=function(a){a=a.split("-");for(var b=[],d=0;d<a.length;d++)b.push(c(a[d]));return b.join("-")};d=goog.cssNameMapping_?"BY_WHOLE"==goog.cssNameMappingStyle_?c:d:function(a){return a};return b?a+"-"+d(b):d(a)};goog.setCssNameMapping=function(a,b){goog.cssNameMapping_=a;goog.cssNameMappingStyle_=b};
!COMPILED&&goog.global.CLOSURE_CSS_NAME_MAPPING&&(goog.cssNameMapping_=goog.global.CLOSURE_CSS_NAME_MAPPING);goog.getMsg=function(a,b){b=b||{};for(var c in b){var d=(""+b[c]).replace(/\$/g,"$$$$");a=a.replace(new RegExp("\\{\\$"+c+"\\}","gi"),d)}return a};goog.exportSymbol=function(a,b,c){goog.exportPath_(a,b,c)};goog.exportProperty=function(a,b,c){a[b]=c};goog.inherits=function(a,b){function c(){}c.prototype=b.prototype;a.superClass_=b.prototype;a.prototype=new c;a.prototype.constructor=a};
goog.base=function(a,b,c){var d=arguments.callee.caller;if(d.superClass_)return d.superClass_.constructor.apply(a,Array.prototype.slice.call(arguments,1));for(var e=Array.prototype.slice.call(arguments,2),f=!1,g=a.constructor;g;g=g.superClass_&&g.superClass_.constructor)if(g.prototype[b]===d)f=!0;else if(f)return g.prototype[b].apply(a,e);if(a[b]===d)return a.constructor.prototype[b].apply(a,e);throw Error("goog.base called from a method of one name to a method of a different name");};
goog.scope=function(a){a.call(goog.global)};var plt={wescheme:{}};plt.wescheme.helpers={};
(function(){plt.wescheme.helpers.makeShareUrl=function(a){var b=document.createElement("a");b.href="/view?publicId="+encodeURIComponent(a);return b.href};plt.wescheme.helpers.urlToAnchor=function(a){var b=document.createElement("a");b.appendChild(document.createTextNode(a));b.href=a;return b};plt.wescheme.helpers.trimWhitespace=function(a){a=a.replace(/^\s+/,"");return a=a.replace(/\s+$/,"")};plt.wescheme.helpers.generateSocialBookmarks=function(a,b){var c=document.createElement("ul");c.className=
"socialBookmarks";var d=function(a,b,d){var e=document.createElement("a"),g=document.createElement("img"),f=document.createElement("li");e.className="socialBookmarklet";e.title="Share via "+a;g.src=b;g.alt="Share via "+a;g.className="socialBookmarklet";e.appendChild(g);e.href=d;e.target="_blank";f.appendChild(e);c.appendChild(f)},e=function(a){var b,c=[];for(b in a)Object.hasOwnProperty.call(a,b)&&c.push(b+"="+encodeURIComponent(a[b]));return c.join("&")};d("email","/static/img/icon_email.png","https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1"+
e({su:a,body:b}));d("Facebook","/static/img/icon_facebook.png","http://www.facebook.com/sharer.php?"+e({u:b,t:a}));d("Twitter","/static/img/icon_twitter.png","http://twitter.com/home?"+e({status:b}));d("Pinterest","/static/img/icon_pinterest.png","http://pinterest.com/pin/create/button/?"+e({url:b,description:a}));d("Reddit","/static/img/icon_reddit.png","http://www.reddit.com/submit?"+e({url:b,title:a}));d("Barcode","/static/img/icon_qrcode.png","http://qrcode.kaywa.com/img.php?"+e({s:8,d:b}));return c};plt.wescheme.helpers.prettyPrintDate=
function(a){var b=new Date;b.setTime(parseInt(a));a=b.getUTCDate();var c=b.getUTCMonth()+1,d=b.getFullYear(),e=(0==b.getHours()%12?12:b.getHours()%12)+":";var f=b.getMinutes();f=1==(f+"").length?"0"+f:f;b=e+f+(12<=b.getHours()?"pm":"am");return a+"/"+c+"/"+d+", "+b}})();plt.wescheme.SharedAs=function(a){this.entries=a};
plt.wescheme.SharedAs.fromDom=function(a){var b=[];jQuery(a).children("Entry").each(function(){var a=jQuery(this).children("publicId").text(),d=jQuery(this).children("title").text(),e=parseInt(jQuery(this).children("modified").text());b.push({publicId:a,title:d,modified:e})});return new plt.wescheme.SharedAs(b)};plt.wescheme.SharedAs.prototype.getEntries=function(){return this.entries};plt.wescheme.WeSchemeProperties={};plt.wescheme.WeSchemeProperties.wescheme_server_base="http://www.wescheme.org";
plt.wescheme.base64={};
(function(){plt.wescheme.base64.encode=function(a){var b=0,c=0,d=[];if(!a)return a;do{var e=a.charCodeAt(b++);var f=a.charCodeAt(b++);var g=a.charCodeAt(b++);var h=e<<16|f<<8|g;e=h>>18&63;f=h>>12&63;g=h>>6&63;h&=63;d[c++]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(e)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(f)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(g)+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(h)}while(b<a.length);
b=d.join("");a=a.length%3;return(a?b.slice(0,a-3):b)+"===".slice(a||3)};plt.wescheme.base64.decode=function(a){var b=0,c=0,d=[];if(!a)return a;a+="";do{var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(b++));var f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(b++));var g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(b++));var h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(b++));
var k=e<<18|f<<12|g<<6|h;e=k>>16&255;f=k>>8&255;k&=255;64==g?d[c++]=String.fromCharCode(e):64==h?d[c++]=String.fromCharCode(e,f):d[c++]=String.fromCharCode(e,f,k)}while(b<a.length);return d.join("")}})();plt.wescheme.Program={};
(function(){plt.wescheme.Program=function(a){this.json=a};plt.wescheme.Program.prototype.getId=function(){return this.json.id};plt.wescheme.Program.prototype.hasSharingUrls=function(){return 0<this.getSharedAsEntries().length};plt.wescheme.Program.prototype.getSharedAsEntries=function(){return new plt.wescheme.SharedAs(this.json.sharedAs)};plt.wescheme.Program.prototype.isPublished=function(){return this.json.published};plt.wescheme.Program.prototype.getTitle=function(){return this.json.title};plt.wescheme.Program.prototype.getOwner=
function(){return this.json.owner};plt.wescheme.Program.prototype.getPublicId=function(){return this.json.publicId};plt.wescheme.Program.prototype.getNotes=function(){return this.json.notes};plt.wescheme.Program.prototype.getSourceCode=function(){return this.json.source.src};plt.wescheme.Program.prototype.getPermissions=function(){return this.json.permissions};plt.wescheme.Program.prototype.getProvides=function(){return this.json.provides};plt.wescheme.Program.prototype.isSourcePublic=function(){return this.json.isSourcePublic};
plt.wescheme.Program.prototype.getObjectCode=function(){return this.json.object.obj};plt.wescheme.Program.prototype.isAndroidPackageBuilt=function(){return!1};plt.wescheme.Program.prototype.getAndroidPackageUrl=function(){return""};plt.wescheme.Program.prototype.getPublicEditingUrl=function(){return plt.wescheme.WeSchemeProperties.wescheme_server_base+"/openEditor?publicId="+encodeURIComponent(this.getPublicId())}})();plt.wescheme.AjaxActions={};
(function(){plt.wescheme.AjaxActions=function(){};plt.wescheme.AjaxActions.prototype.loadProject=function(a,b,c,d){data=a?{pid:a}:{publicId:b};data.gensym=Math.random();jQuery.ajax({cache:!1,data:data,dataType:"json",type:"GET",url:"/loadProject",success:function(a){c(new plt.wescheme.Program(a))},error:function(a){d(a.statusText)},xhr:function(a){return new XMLHttpRequest(a)}})};plt.wescheme.AjaxActions.prototype.listProjects=function(a,b){var c={};c.gensym=Math.random();jQuery.ajax({cache:!1,data:c,
dataType:"xml",type:"GET",url:"/listProjects",success:function(b){b=jQuery(b);a(b)},error:function(a){b(a.statusText)},xhr:function(a){return new XMLHttpRequest(a)}})};plt.wescheme.AjaxActions.prototype.makeAClone=function(a,b,c,d){jQuery.ajax({cache:!1,data:null===b?{pid:a}:{pid:a,code:b},dataType:"text",type:"POST",url:"/cloneProject",success:function(a){a=parseInt(a);c(a)},error:function(a){d(a.statusText)},xhr:function(a){return new XMLHttpRequest(a)}})};plt.wescheme.AjaxActions.prototype.share=
function(a,b,c,d){jQuery.ajax({cache:!1,data:{pid:a,isPublic:b},dataType:"xml",type:"POST",url:"/shareProject",success:function(a){c(jQuery(a))},error:function(a){d(a.statusText)},xhr:function(a){return new XMLHttpRequest(a)}})};plt.wescheme.AjaxActions.prototype.deleteProject=function(a,b,c){jQuery.ajax({cache:!1,data:{pid:a},dataType:"xml",type:"POST",url:"/deleteProject",success:function(a){b(jQuery(a))},error:function(a){c(a.statusText)},xhr:function(a){return new XMLHttpRequest(a)}})};plt.wescheme.AjaxActions.prototype.save=
function(a,b,c){var d,e={},f=["title","code","notes"];a.pid&&(e.pid=a.pid);for(d=0;d<f.length;d++)Object.hasOwnProperty.call(a,f[d])&&(e[f[d]]=a[f[d]]);jQuery.ajax({cache:!1,data:e,dataType:"text",type:"POST",url:"/saveProject",success:function(a){a=parseInt(a);b(a)},error:function(a){c(a.statusText)},xhr:function(a){return new XMLHttpRequest(a)}})};plt.wescheme.AjaxActions.prototype.sendFeedback=function(a,b,c,d){jQuery.ajax({cache:!1,data:{author:a,type:b,feedbackText:c},datatype:"text",type:"POST",
url:"/addFeedback",success:function(a){d()},error:function(a){d()},xhr:function(a){return new XMLHttpRequest(a)}})}})();$(document).ready(function(){var a=$("title").text(),b=$("#publicId").text();$("#socialBookmarks").append($(plt.wescheme.helpers.generateSocialBookmarks(a,plt.wescheme.helpers.makeShareUrl(b))));$("#bottomMessage").show()});
