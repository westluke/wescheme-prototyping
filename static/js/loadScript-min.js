var loadScript=function(c,b,f){var e=arguments.callee;"queue"in e||(e.queue={});var d=e.queue;if(c in d)b&&(d[c]?d[c].push(b):b());else{d[c]=b?[b]:[];var a=document.createElement("script");a.type="text/javascript";a.onload=a.onreadystatechange=function(){if(!a.readyState||!("loaded"!=a.readyState&&"complete"!=a.readyState)){a.onreadystatechange=a.onload=null;document.getElementsByTagName("head")[0].removeChild(a);var b=d[c];for(delete d[c];b.length;)b.shift()()}};a.onerror=function(){a.onreadystatechange=
a.onload=null;document.getElementsByTagName("head")[0].removeChild(a);f()};a.src=c;document.getElementsByTagName("head")[0].appendChild(a)}};