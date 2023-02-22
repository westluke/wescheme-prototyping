// browser-specific hooks and definitions
var sys = {};

sys.print = function(str) {
	var s = str.toString().replace(new RegExp('\n', 'g'), '<br />');
	document.write(s);
};

sys.error = function(e) {
    if (typeof(console) !== 'undefined' && console.log) {
		if (e.stack) {
			console.log(e.stack);
		}
		else {
			console.log("Error: " + str);
		}
	}
	else {
		var s = e.toString().replace(new RegExp('\n', 'g'), '<br />');
		s = "<br />Error: " + s + "<br />";
		document.write(s);
	}
};


sys.inspect = function(x) {
    // FIXME: add more helpful inspect function that'll show
    // us what's really inside.  Perhaps use toString()?
    return x + '';
};


var DEBUG_ON = false;

var setDebug = function(v) {
    DEBUG_ON = v;
}

var debug = function(s) {
    if (DEBUG_ON) {
	sys.print(s);
    }
}

var debugF = function(f_s) {
    if (DEBUG_ON) {
	sys.print(f_s());
    }
}


var hasOwnProperty = {}.hasOwnProperty;

var deepEqual = function (obj1, obj2) {
    if (obj1 === obj2) {
	return true;
    }

    var i;
    if (obj1 instanceof Array) {
        if (obj2 instanceof Array) {
            for (i = 0; i < obj1.length; i++) {
                if (! deepEqual(obj1[i], obj2[i])) { return false; }
            }
            return true;
        } else {
            return false;
        }        
    }

    if (typeof(obj1) === 'string' || typeof(obj1) === 'number') {
        return obj1 === obj2;
    }

    for (var i in obj1) {
	if ( hasOwnProperty.call(obj1, i) && i !== '_eqHashCode' && i !== '_isList') {
	    if ( !(hasOwnProperty.call(obj2, i) && deepEqual(obj1[i], obj2[i])) )
		return false;
	}
    }
    for (var i in obj2) {
	if ( hasOwnProperty.call(obj2, i) && i !== '_eqHashCode' && i !== '_isList') {
	    if ( !(hasOwnProperty.call(obj1, i) && deepEqual(obj1[i], obj2[i])) )
		return false;
	}
    }
    return true;
}


var assert = {};

assert.equal = function(x, y) {
    if (x !== y) {
	throw new Error('AssertError: ' + x + ' equal ' + y);
    }
}

assert.deepEqual = function(x, y) {
	if ( !deepEqual(x, y) ) {
	    throw new Error('AssertError: ' + x + ' deepEqual ' + y);
	}
}


assert.ok = function(x) {
	if (!x) {
		throw new Error('AssertError: not ok: ' + x );
	}
}


assert.throwsExn = function(f) {
	try {
		f.apply(null, []);
	} catch (e) {
		return;
	}
	throw new Error('AssertError: Throw expected, none received.');
}
/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

//////////////////////////////////////////////////////////////

// File of helper functions for primitives and world.

var helpers = {};

(function() {

	var format = function(formatStr, args, functionName) {
		var throwFormatError = function() {
			functionName = functionName || '#<function>';
			var matches = formatStr.match(new RegExp('~[sSaA]', 'g'));
			var expectedNumberOfArgs = matches == null ? 0 : matches.length;
			var errorStrBuffer = [functionName + ': format string requires ' + expectedNumberOfArgs
						+ ' arguments, but given ' + args.length + '; arguments were:',
					      types.toWrittenString(formatStr)];
			for (var i = 0; i < args.length; i++) {
				errorStrBuffer.push( types.toWrittenString(args[i]) );
			}

			raise( types.incompleteExn(types.exnFailContract, errorStrBuffer.join(' '), []) );
		}

		var pattern = new RegExp("~[sSaAn%~]", "g");
		var buffer = args.slice(0);;
		function f(s) {
			if (s == "~~") {
				return "~";
			} else if (s == '~n' || s == '~%') {
				return "\n";
			} else if (s == '~s' || s == "~S") {
				if (buffer.length == 0) {
					throwFormatError();
				}
				return types.toWrittenString(buffer.shift());
			} else if (s == '~a' || s == "~A") {
				if (buffer.length == 0) {
					throwFormatError();
				}
				return types.toDisplayedString(buffer.shift());
			} else {
				throw types.internalError('format: string.replace matched invalid regexp', false);
			}
		}
		var result = formatStr.replace(pattern, f);
		if (buffer.length > 0) {
			throwFormatError();
		}
		return result;
	};


	// forEachK: CPS( array CPS(array -> void) (error -> void) -> void )
	// Iterates through an array and applies f to each element using CPS
	// If an error is thrown, it catches the error and calls f_error on it
	var forEachK = function(a, f, f_error, k) {
		var forEachHelp = function(i) {
			if( i >= a.length ) {
				if (k) { k(); }
				return;
			}

			try {
				f(a[i], function() { forEachHelp(i+1); });
			} catch (e) {
				f_error(e);
			}
		};
		forEachHelp(0);
	};


	// reportError: (or exception string) -> void
	// Reports an error to the user, either at the console
	// if the console exists, or as alerts otherwise.
	var reportError = function(e) {
		var reporter;
		if (typeof(console) != 'undefined' && 
			typeof(console.log) != 'undefined') {
			reporter = (function(x) { console.log(x); });
		} else {
			reporter = (function(x) { alert(x); });
		}
		if (typeof e == 'string') {
			reporter(e);
		} else if ( types.isSchemeError(e) ) {
			if ( types.isExn(e.val) ) {
				reporter( ''+types.exnMessage(e.val) );
			}
			else {
				reporter(e.val);
			}
		} else if (e.message) {
			reporter(e.message);
		} else {
			reporter(e.toString());
		}
//		if (plt.Kernel.lastLoc) {
//			var loc = plt.Kernel.lastLoc;
//			if (typeof(loc) === 'string') {
//			reporter("Error was raised around " + loc);
//			} else if (typeof(loc) !== 'undefined' &&
//				   typeof(loc.line) !== 'undefined') {
//			reporter("Error was raised around: "
//				 + plt.Kernel.locToString(loc));
//			}
//		}
	};


	var raise = function(v) {
		throw types.schemeError(v);
	};


	var procArityContains = function(n) {
		return function(proc) {
			var singleCase = function(aCase) {
				if ( aCase instanceof types.ContinuationClosureValue ) {
					return true;
				}
				return (aCase.numParams == n ||
					(aCase.isRest && aCase.numParams <= n));
			};

			var cases = [];
			if ( proc instanceof types.ContinuationClosureValue ||
			     proc instanceof types.ClosureValue ||
			     proc instanceof types.PrimProc ) {
				return singleCase(proc);
			}
			else if (proc instanceof types.CasePrimitive) {
				cases = proc.cases;
			}
			else if (proc instanceof types.CaseLambdaValue) {
				cases = proc.closures;
			}

			for (var i = 0; i < cases.length; i++) {
				if ( singleCase(cases[i]) )
					return true;
			}
			return false;
		}
	};

	var throwUncoloredCheckError = function(aState, details, pos, args){
			var errorFormatStr;
			if (args && args.length > 1) {
				var errorFormatStrBuffer = ['~a: expects type ~a as ~a arguments, but given: ~s; other arguments were:'];
				for (var i = 0; i < args.length; i++) {
					if ( i != pos-1 ) {
						errorFormatStrBuffer.push( types.toWrittenString(args[i]) );
					}
				}
				errorFormatStr = errorFormatStrBuffer.join(' ');

				raise( types.incompleteExn(types.exnFailContract,
						   helpers.format(errorFormatStr, [details.functionName, details.typeName, details.ordinalPosition, details.actualValue]),
						   []) );
			}
			else {
				errorFormatStr = "~a: expects argument of type ~a, but given: ~s";
				raise( types.incompleteExn(types.exnFailContract,
						   helpers.format(errorFormatStr, [details.functionName, details.typeName , details.actualValue]),
						   []));

			}
	};

	var throwColoredCheckError = function(aState, details, pos, args){


		var positionStack = 
        		state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
        
       		var locationList = positionStack[positionStack.length - 1];

       		//locations -> array
			var getArgColoredParts = function(locations) {
				var coloredParts = [];
				var locs = locations;
				var i;

				//getting the actual arguments from args
				var actualArgs = [];
				for(i = 0; i < args.length; i++) {
					if((! (state.isState(args[i])))
					   && 
					   (!((args[i].name !== undefined) && args[i].name === ""))) {
						actualArgs.push(args[i]);
					} 
				}
				window.wtf = args[2];
				for(i = 0; i < actualArgs.length; i++){
					if(! (locs.isEmpty())){
						if(i != (pos -1)) {
							//coloredParts.push(new types.ColoredPart(types.toWrittenString(actualArgs[i])+(i < actualArgs.length -1 ? " " : ""), locs.first()));\
							coloredParts.push(new types.ColoredPart(types.toWrittenString(actualArgs[i])+" ", locs.first()));
						}
						locs = locs.rest();
					}
				}
				if(coloredParts.length > 0){
					//removing the last space
					var lastEltText = coloredParts[coloredParts.length-1].text;
					lastEltText = lastEltText.substring(0, lastEltText.length - 1);
					coloredParts[coloredParts.length - 1] = new types.ColoredPart(lastEltText, 
																					coloredParts[coloredParts.length-1].location);
				}
				return coloredParts;
			}

			// listRef for locationList.
			var getLocation = function(pos) {
				var locs = locationList;
				var i;
				for(i = 0; i < pos; i++){
					locs = locs.rest();
				}
				return locs.first();
			}

			var typeName = details.typeName+'';
			var fL = typeName.substring(0,1);   //first letter of type name


			if(args) { 
				var argColoredParts = getArgColoredParts(locationList.rest()); 
				if(argColoredParts.length > 0){
				raise( types.incompleteExn(types.exnFailContract,
							   new types.Message([
							   		new types.ColoredPart(details.functionName, locationList.first()),
							   		": expects ",
							   		((fL === "a" || fL === "e" || fL === "i" || fL === "o" || fL === "u") ? "an " : "a "),
							   		typeName,
							   		" as ",
							   		details.ordinalPosition, 
							   		" argument, but given: ",
							   		new types.ColoredPart(types.toWrittenString(details.actualValue), getLocation(pos)),
							   		"; other arguments were: ",
							   		new types.GradientPart(argColoredParts)
							   	]),
							   []) );
				}
			}
			raise( types.incompleteExn(types.exnFailContract,
						   new types.Message([
						   		new types.ColoredPart(details.functionName, locationList.first()),
						   		": expects ",
						   		((fL === "a" || fL === "e" || fL === "i" || fL === "o" || fL === "u") ? "an " : "a "),
						   		typeName,
						   		" as ",
						   		details.ordinalPosition, 
						   		" argument, but given: ",
						   		new types.ColoredPart(types.toWrittenString(details.actualValue), getLocation(pos))
						   	]),
						   []) );

	};

	var throwCheckError = function(aState, details, pos, args) {
		
		if(aState instanceof state.State){
			//if it's defined and a State, can inspect position stack
			var positionStack = 
			state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');

			//if the positionStack at the correct position is defined, we can throw a colored error
			if (positionStack[positionStack.length - 1] !== undefined) {
				throwColoredCheckError(aState, details, pos, args);
			}
		}
		//otherwise, throw an uncolored error
		throwUncoloredCheckError(aState, details, pos, args);
	};

	var check = function(aState, x, f, functionName, typeName, position, args) {
		if ( !f(x) ) {
			throwCheckError(aState, 
					{ functionName: functionName,
					  typeName: typeName,
					  ordinalPosition: helpers.ordinalize(position),
					  actualValue: x },
					position,
					args);
		}
	};

	var checkVarArity = function(aState, x, f, functionName, typeName, position, args) {
		//check to ensure last thing is an array
		if(args.length > 0 && (args[args.length - 1] instanceof Array)) {
			var flattenedArgs = [];
			var i;
			for(i = 0; i < (args.length - 1); i++) {
				flattenedArgs.push(args[i]);
			}
			//the angry variable names are because flattenedArgs = flattenedArgs.concat(args[args.length - 1]) doesn't work
			var wtf1 = flattenedArgs;
			var wtf2 = args[args.length -1];
			var passOn = wtf1.concat(wtf2);

			check(aState, x, f, functionName, typeName, position, passOn);
		}
		else {
			check(aState, x, f, functionName, typeName, position, args);
		}
	};
    var isList = function(x) {
        var tortoise, hare;
        tortoise = hare = x;
        if (hare === types.EMPTY) { 
            return true; 
        }
        while (true) {
            if (!(types.isPair(hare))) { return false; }
            if (types.isPair(tortoise)) { 
                // optimization to get amortized linear time isList.
                if (tortoise._isList === true) { return true; } 
                tortoise = tortoise.rest(); 
            }
            hare = hare.rest();
            if (types.isPair(hare)) { 
                if (hare._isList) { tortoise._isList = true; return true; }
                hare = hare.rest(); 
                if (types.isPair(hare) && hare._isList) { tortoise._isList = true; return true; }
            }
            if (hare === types.EMPTY) { 
                // optimization to get amortized linear time isList.
                tortoise._isList = true;
                return true; 
            }
            if (tortoise === hare) { return false; }
        }
    };


	var isListOf = function(x, f) {
            if (! isList(x)) { return false; }
	    while (types.isPair(x)) {
		if (! f(x.first())) { return false; }
		x = x.rest();
	    }
	    return (x === types.EMPTY);
	};

	var checkListOf = function(aState, lst, f, functionName, typeName, position, args) {
		if ( !isListOf(lst, f) ) {
			helpers.throwCheckError(aState,
						{functionName: functionName,
						 typeName: 'list of ' + typeName,
						 ordinalPosition: helpers.ordinalize(position),
						 actualValue: lst},
						position,
						args);
		}
	};


//	// remove: array any -> array
//	// removes the first instance of v in a
//	// or returns a copy of a if v does not exist
//	var remove = function(a, v) {
//		for (var i = 0; i < a.length; i++) {
//			if (a[i] === v) {
//				return a.slice(0, i).concat( a.slice(i+1, a.length) );
//			}
//		}
//		return a.slice(0);
//	};

	// map: array (any -> any) -> array
	// applies f to each element of a and returns the result
	// as a new array
	var map = function(f, a) {
		var b = new Array(a.length);
		for (var i = 0; i < a.length; i++) {
			b[i] = f(a[i]);
		}
		return b;
	};


	var schemeListToArray = function(lst) {
		var result = [];
		while ( !lst.isEmpty() ) {
			result.push(lst.first());
			lst = lst.rest();
		}
		return result;
	}

	// deepListToArray: any -> any
	// Converts list structure to array structure.
	var deepListToArray = function(x) {
		var thing = x;
		if (thing === types.EMPTY) {
			return [];
		} else if (types.isPair(thing)) {
			var result = [];
			while (!thing.isEmpty()) {
				result.push(deepListToArray(thing.first()));
				thing = thing.rest();
			}
			return result;
		} else {
			return x;
		}
	}


	var flattenSchemeListToArray = function(x) {
		if ( !isList(x) ) {
			return [x];
		}

		var ret = [];
		while ( !x.isEmpty() ) {
			ret = ret.concat( flattenSchemeListToArray(x.first()) );
			x = x.rest();
		}
		return ret;
	};


	// assocListToHash: (listof (list X Y)) -> (hashof X Y)
	var assocListToHash = function(lst) {
		var result = {};
		while ( !lst.isEmpty() ) {
			var key = lst.first().first();
			var val = lst.first().rest().first();
			result[key] = val;
			lst = lst.rest();
		}
		return result;
	};


	var ordinalize = function(n) {
		// special case for 11th:
		if ( n % 100 == 11 ) {
			return n + 'th';
		}
		var res = n;
		switch( n % 10 ) {
			case 1: res += 'st'; break;
			case 2: res += 'nd'; break;
			case 3: res += 'rd'; break;
			default: res += 'th'; break;
		}
		return res;
	}


	var wrapJsObject = function(x) {
		if (x === undefined) {
			return types.jsObject('undefined', x);
		}
		else if (x === null) {
			return types.jsObject('null', x);
		}
		else if (typeof(x) == 'function') {
			return types.jsObject('function', x);
		}
		else if ( x instanceof Array ) {
			return types.jsObject('array', x);
		}
		else if ( typeof(x) == 'string' ) {
			return types.jsObject("'" + x.toString() + "'", x);
		}
		else {
			return types.jsObject(x.toString(), x);
		}
	};


	var getKeyCodeName = function(e) {
	    var code = e.charCode || e.keyCode;
	    var keyname;
	    switch(code) {
    case 8:  keyname = "\b"; break;
		case 16: keyname = "shift"; break;
		case 17: keyname = "control"; break;
		case 19: keyname = "pause"; break;
		case 27: keyname = "escape"; break;
		case 33: keyname = "prior"; break;
		case 34: keyname = "next"; break;
		case 35: keyname = "end"; break;
		case 36: keyname = "home"; break;
		case 37: keyname = "left"; break;
		case 38: keyname = "up"; break;
		case 39: keyname = "right"; break;
		case 40: keyname = "down"; break;
		case 42: keyname = "print"; break;
		case 45: keyname = "insert"; break;
		case 46: keyname = String.fromCharCode(127); break;
		case 144: keyname = "numlock"; break;
		case 145: keyname = "scroll"; break;
		default:
      if (code >= 112 && code <= 123){  // fn keys
				 keyname = "f" + (code - 111);
      } else {
				 keyname = "";
      }
      break;
    }
    return keyname;
	};





        // maybeCallAfterAttach: dom-node -> void
        // walk the tree rooted at aNode, and call afterAttach if the element has
        // such a method.
        var maybeCallAfterAttach = function(aNode) {
	    var stack = [aNode];
	    while (stack.length !== 0) {
		var nextNode = stack.pop();
		if (nextNode.afterAttach) {
		    nextNode.afterAttach(nextNode);
		}
		if (nextNode.hasChildNodes && nextNode.hasChildNodes()) {
		    var children = nextNode.childNodes;
		    for (var i = 0; i < children.length; i++) {
			stack.push(children[i]);
		    }
		}
	    }
	};








    // makeLocationDom: location -> dom
    // Dom type that has special support in the editor through the print hook.
    // The print hook is expected to look at the printing of dom values with
    // this particular structure.  In the context of WeScheme, the environment
    // will rewrite these to be clickable links.
    var makeLocationDom = function(aLocation) {
	var locationSpan = document.createElement("span");
	var idSpan = document.createElement("span");
	var offsetSpan = document.createElement("span");
	var lineSpan = document.createElement("span");
	var columnSpan = document.createElement("span");
	var spanSpan = document.createElement("span");

	locationSpan['className'] = 'location-reference';
	idSpan['className'] = 'location-id';
	offsetSpan['className'] = 'location-offset';
	lineSpan['className'] = 'location-line';
	columnSpan['className'] = 'location-column';
	spanSpan['className'] = 'location-span';

	idSpan.appendChild(document.createTextNode(aLocation.id + ''));
	offsetSpan.appendChild(document.createTextNode(aLocation.offset + ''));
	lineSpan.appendChild(document.createTextNode(aLocation.line + ''));
	columnSpan.appendChild(document.createTextNode(aLocation.column + ''));
	spanSpan.appendChild(document.createTextNode(aLocation.span + ''));

	locationSpan.appendChild(idSpan);
	locationSpan.appendChild(offsetSpan);
	locationSpan.appendChild(lineSpan);
	locationSpan.appendChild(columnSpan);   
	locationSpan.appendChild(spanSpan);

	return locationSpan;
    };


    var isLocationDom = function(thing) {
	return (thing
		&&
		(thing.nodeType === Node.TEXT_NODE ||
		 thing.nodeType === Node.ELEMENT_NODE)
		&&
		thing['className'] === 'location-reference');
    };





	////////////////////////////////////////////////

	helpers.format = format;
	helpers.forEachK = forEachK;
	helpers.reportError = reportError;
	helpers.raise = raise;

	helpers.procArityContains = procArityContains;
	helpers.throwCheckError = throwCheckError;
	helpers.isList = isList;
	helpers.isListOf = isListOf;
	helpers.check = check;
	helpers.checkVarArity = checkVarArity;
	helpers.checkListOf = checkListOf;
	
//	helpers.remove = remove;
	helpers.map = map;
	helpers.schemeListToArray = schemeListToArray;
	helpers.deepListToArray = deepListToArray;
	helpers.flattenSchemeListToArray = flattenSchemeListToArray;
	helpers.assocListToHash = assocListToHash;

	helpers.ordinalize = ordinalize;
	helpers.wrapJsObject = wrapJsObject;

	helpers.getKeyCodeName = getKeyCodeName;

  helpers.maybeCallAfterAttach = maybeCallAfterAttach;

  helpers.makeLocationDom = makeLocationDom;
  helpers.isLocationDom = isLocationDom;

})();

/////////////////////////////////////////////////////////////////

/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

//////////////////////////////////////////////////////////////

// File of helper functions for primitives and world.

var helpers = {};

(function() {

	var format = function(formatStr, args, functionName) {
		var throwFormatError = function() {
			functionName = functionName || '#<function>';
			var matches = formatStr.match(new RegExp('~[sSaA]', 'g'));
			var expectedNumberOfArgs = matches == null ? 0 : matches.length;
			var errorStrBuffer = [functionName + ': format string requires ' + expectedNumberOfArgs
						+ ' arguments, but given ' + args.length + '; arguments were:',
					      types.toWrittenString(formatStr)];
			for (var i = 0; i < args.length; i++) {
				errorStrBuffer.push( types.toWrittenString(args[i]) );
			}

			raise( types.incompleteExn(types.exnFailContract, errorStrBuffer.join(' '), []) );
		}

		var pattern = new RegExp("~[sSaAn%~]", "g");
		var buffer = args.slice(0);;
		function f(s) {
			if (s == "~~") {
				return "~";
			} else if (s == '~n' || s == '~%') {
				return "\n";
			} else if (s == '~s' || s == "~S") {
				if (buffer.length == 0) {
					throwFormatError();
				}
				return types.toWrittenString(buffer.shift());
			} else if (s == '~a' || s == "~A") {
				if (buffer.length == 0) {
					throwFormatError();
				}
				return types.toDisplayedString(buffer.shift());
			} else {
				throw types.internalError('format: string.replace matched invalid regexp', false);
			}
		}
		var result = formatStr.replace(pattern, f);
		if (buffer.length > 0) {
			throwFormatError();
		}
		return result;
	};


	// forEachK: CPS( array CPS(array -> void) (error -> void) -> void )
	// Iterates through an array and applies f to each element using CPS
	// If an error is thrown, it catches the error and calls f_error on it
	var forEachK = function(a, f, f_error, k) {
		var forEachHelp = function(i) {
			if( i >= a.length ) {
				if (k) { k(); }
				return;
			}

			try {
				f(a[i], function() { forEachHelp(i+1); });
			} catch (e) {
				f_error(e);
			}
		};
		forEachHelp(0);
	};


	// reportError: (or exception string) -> void
	// Reports an error to the user, either at the console
	// if the console exists, or as alerts otherwise.
	var reportError = function(e) {
		var reporter;
		if (typeof(console) != 'undefined' && 
			typeof(console.log) != 'undefined') {
			reporter = (function(x) { console.log(x); });
		} else {
			reporter = (function(x) { alert(x); });
		}
		if (typeof e == 'string') {
			reporter(e);
		} else if ( types.isSchemeError(e) ) {
			if ( types.isExn(e.val) ) {
				reporter( ''+types.exnMessage(e.val) );
			}
			else {
				reporter(e.val);
			}
		} else if (e.message) {
			reporter(e.message);
		} else {
			reporter(e.toString());
		}
//		if (plt.Kernel.lastLoc) {
//			var loc = plt.Kernel.lastLoc;
//			if (typeof(loc) === 'string') {
//			reporter("Error was raised around " + loc);
//			} else if (typeof(loc) !== 'undefined' &&
//				   typeof(loc.line) !== 'undefined') {
//			reporter("Error was raised around: "
//				 + plt.Kernel.locToString(loc));
//			}
//		}
	};


	var raise = function(v) {
		throw types.schemeError(v);
	};


	var procArityContains = function(n) {
		return function(proc) {
			var singleCase = function(aCase) {
				if ( aCase instanceof types.ContinuationClosureValue ) {
					return true;
				}
				return (aCase.numParams == n ||
					(aCase.isRest && aCase.numParams <= n));
			};

			var cases = [];
			if ( proc instanceof types.ContinuationClosureValue ||
			     proc instanceof types.ClosureValue ||
			     proc instanceof types.PrimProc ) {
				return singleCase(proc);
			}
			else if (proc instanceof types.CasePrimitive) {
				cases = proc.cases;
			}
			else if (proc instanceof types.CaseLambdaValue) {
				cases = proc.closures;
			}

			for (var i = 0; i < cases.length; i++) {
				if ( singleCase(cases[i]) )
					return true;
			}
			return false;
		}
	};

	var throwUncoloredCheckError = function(aState, details, pos, args){
			var errorFormatStr;
			if (args && args.length > 1) {
				var errorFormatStrBuffer = ['~a: expects type ~a as ~a arguments, but given: ~s; other arguments were:'];
				for (var i = 0; i < args.length; i++) {
					if ( i != pos-1 ) {
						errorFormatStrBuffer.push( types.toWrittenString(args[i]) );
					}
				}
				errorFormatStr = errorFormatStrBuffer.join(' ');

				raise( types.incompleteExn(types.exnFailContract,
						   helpers.format(errorFormatStr, [details.functionName, details.typeName, details.ordinalPosition, details.actualValue]),
						   []) );
			}
			else {
				errorFormatStr = "~a: expects argument of type ~a, but given: ~s";
				raise( types.incompleteExn(types.exnFailContract,
						   helpers.format(errorFormatStr, [details.functionName, details.typeName , details.actualValue]),
						   []));

			}
	};

	var throwColoredCheckError = function(aState, details, pos, args){


		var positionStack = 
        		state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
        
       		var locationList = positionStack[positionStack.length - 1];

       		//locations -> array
			var getArgColoredParts = function(locations) {
				var coloredParts = [];
				var locs = locations;
				var i;

				//getting the actual arguments from args
				var actualArgs = [];
				for(i = 0; i < args.length; i++) {
					if((! (state.isState(args[i])))
					   && 
					   (!((args[i].name !== undefined) && args[i].name === ""))) {
						actualArgs.push(args[i]);
					} 
				}
				window.wtf = args[2];
				for(i = 0; i < actualArgs.length; i++){
					if(! (locs.isEmpty())){
						if(i != (pos -1)) {
							//coloredParts.push(new types.ColoredPart(types.toWrittenString(actualArgs[i])+(i < actualArgs.length -1 ? " " : ""), locs.first()));\
							coloredParts.push(new types.ColoredPart(types.toWrittenString(actualArgs[i])+" ", locs.first()));
						}
						locs = locs.rest();
					}
				}
				if(coloredParts.length > 0){
					//removing the last space
					var lastEltText = coloredParts[coloredParts.length-1].text;
					lastEltText = lastEltText.substring(0, lastEltText.length - 1);
					coloredParts[coloredParts.length - 1] = new types.ColoredPart(lastEltText, 
																					coloredParts[coloredParts.length-1].location);
				}
				return coloredParts;
			}

			// listRef for locationList.
			var getLocation = function(pos) {
				var locs = locationList;
				var i;
				for(i = 0; i < pos; i++){
					locs = locs.rest();
				}
				return locs.first();
			}

			var typeName = details.typeName+'';
			var fL = typeName.substring(0,1);   //first letter of type name


			if(args) { 
				var argColoredParts = getArgColoredParts(locationList.rest()); 
				if(argColoredParts.length > 0){
				raise( types.incompleteExn(types.exnFailContract,
							   new types.Message([
							   		new types.ColoredPart(details.functionName, locationList.first()),
							   		": expects ",
							   		((fL === "a" || fL === "e" || fL === "i" || fL === "o" || fL === "u") ? "an " : "a "),
							   		typeName,
							   		" as ",
							   		details.ordinalPosition, 
							   		" argument, but given: ",
							   		new types.ColoredPart(types.toWrittenString(details.actualValue), getLocation(pos)),
							   		"; other arguments were: ",
							   		new types.GradientPart(argColoredParts)
							   	]),
							   []) );
				}
			}
			raise( types.incompleteExn(types.exnFailContract,
						   new types.Message([
						   		new types.ColoredPart(details.functionName, locationList.first()),
						   		": expects ",
						   		((fL === "a" || fL === "e" || fL === "i" || fL === "o" || fL === "u") ? "an " : "a "),
						   		typeName,
						   		" as ",
						   		details.ordinalPosition, 
						   		" argument, but given: ",
						   		new types.ColoredPart(types.toWrittenString(details.actualValue), getLocation(pos))
						   	]),
						   []) );

	};

	var throwCheckError = function(aState, details, pos, args) {
		
		if(aState instanceof state.State){
			//if it's defined and a State, can inspect position stack
			var positionStack = 
			state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');

			//if the positionStack at the correct position is defined, we can throw a colored error
			if (positionStack[positionStack.length - 1] !== undefined) {
				throwColoredCheckError(aState, details, pos, args);
			}
		}
		//otherwise, throw an uncolored error
		throwUncoloredCheckError(aState, details, pos, args);
	};

	var check = function(aState, x, f, functionName, typeName, position, args) {
		if ( !f(x) ) {
			throwCheckError(aState, 
					{ functionName: functionName,
					  typeName: typeName,
					  ordinalPosition: helpers.ordinalize(position),
					  actualValue: x },
					position,
					args);
		}
	};

	var checkVarArity = function(aState, x, f, functionName, typeName, position, args) {
		//check to ensure last thing is an array
		if(args.length > 0 && (args[args.length - 1] instanceof Array)) {
			var flattenedArgs = [];
			var i;
			for(i = 0; i < (args.length - 1); i++) {
				flattenedArgs.push(args[i]);
			}
			//the angry variable names are because flattenedArgs = flattenedArgs.concat(args[args.length - 1]) doesn't work
			var wtf1 = flattenedArgs;
			var wtf2 = args[args.length -1];
			var passOn = wtf1.concat(wtf2);

			check(aState, x, f, functionName, typeName, position, passOn);
		}
		else {
			check(aState, x, f, functionName, typeName, position, args);
		}
	};
    var isList = function(x) {
        var tortoise, hare;
        tortoise = hare = x;
        if (hare === types.EMPTY) { 
            return true; 
        }
        while (true) {
            if (!(types.isPair(hare))) { return false; }
            if (types.isPair(tortoise)) { 
                // optimization to get amortized linear time isList.
                if (tortoise._isList === true) { return true; } 
                tortoise = tortoise.rest(); 
            }
            hare = hare.rest();
            if (types.isPair(hare)) { 
                if (hare._isList) { tortoise._isList = true; return true; }
                hare = hare.rest(); 
                if (types.isPair(hare) && hare._isList) { tortoise._isList = true; return true; }
            }
            if (hare === types.EMPTY) { 
                // optimization to get amortized linear time isList.
                tortoise._isList = true;
                return true; 
            }
            if (tortoise === hare) { return false; }
        }
    };


	var isListOf = function(x, f) {
            if (! isList(x)) { return false; }
	    while (types.isPair(x)) {
		if (! f(x.first())) { return false; }
		x = x.rest();
	    }
	    return (x === types.EMPTY);
	};

	var checkListOf = function(aState, lst, f, functionName, typeName, position, args) {
		if ( !isListOf(lst, f) ) {
			helpers.throwCheckError(aState,
						{functionName: functionName,
						 typeName: 'list of ' + typeName,
						 ordinalPosition: helpers.ordinalize(position),
						 actualValue: lst},
						position,
						args);
		}
	};


//	// remove: array any -> array
//	// removes the first instance of v in a
//	// or returns a copy of a if v does not exist
//	var remove = function(a, v) {
//		for (var i = 0; i < a.length; i++) {
//			if (a[i] === v) {
//				return a.slice(0, i).concat( a.slice(i+1, a.length) );
//			}
//		}
//		return a.slice(0);
//	};

	// map: array (any -> any) -> array
	// applies f to each element of a and returns the result
	// as a new array
	var map = function(f, a) {
		var b = new Array(a.length);
		for (var i = 0; i < a.length; i++) {
			b[i] = f(a[i]);
		}
		return b;
	};


	var schemeListToArray = function(lst) {
		var result = [];
		while ( !lst.isEmpty() ) {
			result.push(lst.first());
			lst = lst.rest();
		}
		return result;
	}

	// deepListToArray: any -> any
	// Converts list structure to array structure.
	var deepListToArray = function(x) {
		var thing = x;
		if (thing === types.EMPTY) {
			return [];
		} else if (types.isPair(thing)) {
			var result = [];
			while (!thing.isEmpty()) {
				result.push(deepListToArray(thing.first()));
				thing = thing.rest();
			}
			return result;
		} else {
			return x;
		}
	}


	var flattenSchemeListToArray = function(x) {
		if ( !isList(x) ) {
			return [x];
		}

		var ret = [];
		while ( !x.isEmpty() ) {
			ret = ret.concat( flattenSchemeListToArray(x.first()) );
			x = x.rest();
		}
		return ret;
	};


	// assocListToHash: (listof (list X Y)) -> (hashof X Y)
	var assocListToHash = function(lst) {
		var result = {};
		while ( !lst.isEmpty() ) {
			var key = lst.first().first();
			var val = lst.first().rest().first();
			result[key] = val;
			lst = lst.rest();
		}
		return result;
	};


	var ordinalize = function(n) {
		// special case for 11th:
		if ( n % 100 == 11 ) {
			return n + 'th';
		}
		var res = n;
		switch( n % 10 ) {
			case 1: res += 'st'; break;
			case 2: res += 'nd'; break;
			case 3: res += 'rd'; break;
			default: res += 'th'; break;
		}
		return res;
	}


	var wrapJsObject = function(x) {
		if (x === undefined) {
			return types.jsObject('undefined', x);
		}
		else if (x === null) {
			return types.jsObject('null', x);
		}
		else if (typeof(x) == 'function') {
			return types.jsObject('function', x);
		}
		else if ( x instanceof Array ) {
			return types.jsObject('array', x);
		}
		else if ( typeof(x) == 'string' ) {
			return types.jsObject("'" + x.toString() + "'", x);
		}
		else {
			return types.jsObject(x.toString(), x);
		}
	};


	var getKeyCodeName = function(e) {
	    var code = e.charCode || e.keyCode;
	    var keyname;
	    switch(code) {
    case 8:  keyname = "\b"; break;
		case 16: keyname = "shift"; break;
		case 17: keyname = "control"; break;
		case 19: keyname = "pause"; break;
		case 27: keyname = "escape"; break;
		case 33: keyname = "prior"; break;
		case 34: keyname = "next"; break;
		case 35: keyname = "end"; break;
		case 36: keyname = "home"; break;
		case 37: keyname = "left"; break;
		case 38: keyname = "up"; break;
		case 39: keyname = "right"; break;
		case 40: keyname = "down"; break;
		case 42: keyname = "print"; break;
		case 45: keyname = "insert"; break;
		case 46: keyname = String.fromCharCode(127); break;
		case 144: keyname = "numlock"; break;
		case 145: keyname = "scroll"; break;
		default:
      if (code >= 112 && code <= 123){  // fn keys
				 keyname = "f" + (code - 111);
      } else {
				 keyname = "";
      }
      break;
    }
    return keyname;
	};





        // maybeCallAfterAttach: dom-node -> void
        // walk the tree rooted at aNode, and call afterAttach if the element has
        // such a method.
        var maybeCallAfterAttach = function(aNode) {
	    var stack = [aNode];
	    while (stack.length !== 0) {
		var nextNode = stack.pop();
		if (nextNode.afterAttach) {
		    nextNode.afterAttach(nextNode);
		}
		if (nextNode.hasChildNodes && nextNode.hasChildNodes()) {
		    var children = nextNode.childNodes;
		    for (var i = 0; i < children.length; i++) {
			stack.push(children[i]);
		    }
		}
	    }
	};








    // makeLocationDom: location -> dom
    // Dom type that has special support in the editor through the print hook.
    // The print hook is expected to look at the printing of dom values with
    // this particular structure.  In the context of WeScheme, the environment
    // will rewrite these to be clickable links.
    var makeLocationDom = function(aLocation) {
	var locationSpan = document.createElement("span");
	var idSpan = document.createElement("span");
	var offsetSpan = document.createElement("span");
	var lineSpan = document.createElement("span");
	var columnSpan = document.createElement("span");
	var spanSpan = document.createElement("span");

	locationSpan['className'] = 'location-reference';
	idSpan['className'] = 'location-id';
	offsetSpan['className'] = 'location-offset';
	lineSpan['className'] = 'location-line';
	columnSpan['className'] = 'location-column';
	spanSpan['className'] = 'location-span';

	idSpan.appendChild(document.createTextNode(aLocation.id + ''));
	offsetSpan.appendChild(document.createTextNode(aLocation.offset + ''));
	lineSpan.appendChild(document.createTextNode(aLocation.line + ''));
	columnSpan.appendChild(document.createTextNode(aLocation.column + ''));
	spanSpan.appendChild(document.createTextNode(aLocation.span + ''));

	locationSpan.appendChild(idSpan);
	locationSpan.appendChild(offsetSpan);
	locationSpan.appendChild(lineSpan);
	locationSpan.appendChild(columnSpan);   
	locationSpan.appendChild(spanSpan);

	return locationSpan;
    };


    var isLocationDom = function(thing) {
	return (thing
		&&
		(thing.nodeType === Node.TEXT_NODE ||
		 thing.nodeType === Node.ELEMENT_NODE)
		&&
		thing['className'] === 'location-reference');
    };





	////////////////////////////////////////////////

	helpers.format = format;
	helpers.forEachK = forEachK;
	helpers.reportError = reportError;
	helpers.raise = raise;

	helpers.procArityContains = procArityContains;
	helpers.throwCheckError = throwCheckError;
	helpers.isList = isList;
	helpers.isListOf = isListOf;
	helpers.check = check;
	helpers.checkVarArity = checkVarArity;
	helpers.checkListOf = checkListOf;
	
//	helpers.remove = remove;
	helpers.map = map;
	helpers.schemeListToArray = schemeListToArray;
	helpers.deepListToArray = deepListToArray;
	helpers.flattenSchemeListToArray = flattenSchemeListToArray;
	helpers.assocListToHash = assocListToHash;

	helpers.ordinalize = ordinalize;
	helpers.wrapJsObject = wrapJsObject;

	helpers.getKeyCodeName = getKeyCodeName;

  helpers.maybeCallAfterAttach = maybeCallAfterAttach;

  helpers.makeLocationDom = makeLocationDom;
  helpers.isLocationDom = isLocationDom;

})();

/////////////////////////////////////////////////////////////////


var jsworld = {};

// Stuff here is copy-and-pasted from Chris's JSWorld.  We
// namespace-protect it, and add the Javascript <-> Moby wrapper
// functions here.

(function() {

    /* Type signature notation
     * CPS(a b ... -> c) is used to denote
     *    a b ... (c -> void) -> void
     */

    jsworld.Jsworld = {};
    var Jsworld = jsworld.Jsworld;


    var currentFocusedNode = false;

    var doNothing = function() {};



    //
    // WORLD STUFFS
    //

    function InitialWorld() {}

    var world = new InitialWorld();
    var isWorldChanging = false;
    var worldListeners = [];
    var eventDetachers = [];
    var runningBigBangs = [];



    // Close all world computations.
    Jsworld.shutdown = function() {
	while(runningBigBangs.length > 0) {
	    var currentRecord = runningBigBangs.pop();
	    if (currentRecord) { currentRecord.pause(); }
	}
	clear_running_state();
    }



    function add_world_listener(listener) {
	worldListeners.push(listener);
    }


    function remove_world_listener(listener) {
	var index = worldListeners.indexOf(listener);
	if (index != -1) {
	    worldListeners.splice(index, 1);
	}
    }

    function clear_running_state() {
	world = new InitialWorld();
	worldListeners = [];

	for (var i = 0; i < eventDetachers.length; i++) {
		eventDetachers[i]();
	}
	eventDetachers = [];
        isWorldChanging = false;
    }



    // change_world: CPS( CPS(world -> world) -> void )
    // Adjust the world, and notify all listeners.
    function change_world(updater, k) {
        if (isWorldChanging) {
            setTimeout(function() {change_world(updater, k);}, 100);
            return;
        }
	var originalWorld = world;
        isWorldChanging = true;
	var afterUpdate = function(newWorld) {
            world = newWorld;
	    if (world instanceof WrappedWorldWithEffects) {
		var effects = world.getEffects();
		helpers.forEachK(effects,
				 function(anEffect, k2) { anEffect.invokeEffect(change_world, k2); },
				 function (e) { throw e; },
				 function() {
				     world = world.getWorld();
				     changeWorldHelp2();
				 });
	    } else {
		changeWorldHelp2();
	    }
	};
	
        var doWorldChange = function(listener, k2) { listener(world, originalWorld, k2); };
        var onWorldChangeError = function(e) { world = originalWorld; throw e; };
	var changeWorldHelp2 = function() {
	    helpers.forEachK(worldListeners,
			     doWorldChange,
			     onWorldChangeError,
			     function(){isWorldChanging = false; k()});
	};

	try {
	    updater(world, afterUpdate);
	} catch(e) {
	    world = originalWorld;
	    if (typeof(console) !== 'undefined' && console.log && e.stack) {
		console.log(e.stack);
	    }
	    throw e;
	}
    }
    Jsworld.change_world = change_world;




    //
    // STUFF THAT SHOULD REALLY BE IN ECMASCRIPT
    //
    Number.prototype.NaN0=function(){return isNaN(this)?0:this;}
    function getPosition(e){
	var left = 0;
	var top  = 0;
	while (e.offsetParent){
	    left += e.offsetLeft + (e.currentStyle?(parseInt(e.currentStyle.borderLeftWidth)).NaN0():0);
	    top  += e.offsetTop  + (e.currentStyle?(parseInt(e.currentStyle.borderTopWidth)).NaN0():0);
	    e     = e.offsetParent;
	}
	left += e.offsetLeft + (e.currentStyle?(parseInt(e.currentStyle.borderLeftWidth)).NaN0():0);
	top  += e.offsetTop  + (e.currentStyle?(parseInt(e.currentStyle.borderTopWidth)).NaN0():0);
	return {x:left, y:top};	
    }
    Jsworld.getPosition = getPosition;


    var gensym_counter = 0;
    function gensym(){ return gensym_counter++;}
    Jsworld.gensym = gensym;


    function map(a, f) {
	var b = new Array(a.length);
	for (var i = 0; i < a.length; i++) {
		b[i] = f(a[i]);
	}
	return b;
    }
    Jsworld.map = map;



    function concat_map(a, f) {
	var b = [];
	for (var i = 0; i < a.length; i++) {
		b = b.concat(f(a[i]));
	}
	return b;
    }


    function mapi(a, f) {
	var b = new Array(a.length);
	for (var i = 0; i < a.length; i++) {
		b[i] = f(a[i], i);
	}
	return b;
    }
    Jsworld.mapi = mapi;


    function fold(a, x, f) {
	for (var i = 0; i < a.length; i++) {
		x = f(a[i], x);
	}
	return x;
    }
    Jsworld.fold = fold;


    function augment(o, a) {
	var oo = {};
	for (var e in o)
	    oo[e] = o[e];
	for (var e in a)
	    oo[e] = a[e];
	return oo;
    }
    Jsworld.augment = augment;


    function assoc_cons(o, k, v) {
	var oo = {};
	for (var e in o)
	    oo[e] = o[e];
	oo[k] = v;
	return oo;
    }
    Jsworld.assoc_cons = assoc_cons;


    function cons(value, array) {
	return [value].concat(array);
    }
    Jsworld.cons = cons;


    function append(array1, array2){
	return array1.concat(array2);
    }
    Jsworld.append = append;

    function array_join(array1, array2){
	var joined = [];
	for (var i = 0; i < array1.length; i++)
	    joined.push([array1[i], array2[i]]);
	return joined;
    }
    Jsworld.array_join = array_join;


    function removeq(a, value) {
	for (var i = 0; i < a.length; i++)
	    if (a[i] === value){
		return a.slice(0, i).concat(a.slice(i+1));
	    }			
	return a;
    }
    Jsworld.removeq = removeq;

    function removef(a, value) {
	for (var i = 0; i < a.length; i++)
	    if ( f(a[i]) ){
		return a.slice(0, i).concat(a.slice(i+1));
	    }			
	return a;
    }
    Jsworld.removef = removef;


    function filter(a, f) {
	var b = [];
	for (var i = 0; i < a.length; i++) {
		if ( f(a[i]) ) {
			b.push(a[i]);
		}
	}
	return b;
    }
    Jsworld.filter = filter;


    function without(obj, attrib) {
	var o = {};
	for (var a in obj)
	    if (a != attrib)
		o[a] = obj[a];
	return o;
    }
    Jsworld.without = without;


    function memberq(a, x) {
	for (var i = 0; i < a.length; i++)
	    if (a[i] === x) return true;
	return false;
    }
    Jsworld.memberq = memberq;


    function member(a, x) {
	for (var i = 0; i < a.length; i++)
	    if (a[i] == x) return true;
	return false;
    }
    Jsworld.member = member;



    function head(a){
	return a[0];
    }
    Jsworld.head = head;


    function tail(a){
	return a.slice(1, a.length);
    }
    Jsworld.tail = tail;

    //
    // DOM UPDATING STUFFS
    //

    // tree(N): { node: N, children: [tree(N)] }
    // relation(N): { relation: 'parent', parent: N, child: N } | { relation: 'neighbor', left: N, right: N }
    // relations(N): [relation(N)]
    // nodes(N): [N]
    // css(N): [css_node(N)]
    // css_node(N): { node: N, attribs: attribs } | { className: string, attribs: attribs }
    // attrib: { attrib: string, values: [string] }
    // attribs: [attrib]

    // treeable(nodes(N), relations(N)) = bool
    /*function treeable(nodes, relations) {
    // for all neighbor relations between x and y
    for (var i = 0; i < relations.length; i++)
    if (relations[i].relation == 'neighbor') {
    var x = relations[i].left, y = relations[i].right;
 
    // there does not exist a neighbor relation between x and z!=y or z!=x and y
    for (var j = 0; j < relations.length; j++)
    if (relations[j].relation === 'neighbor')
    if (relations[j].left === x && relations[j].right !== y ||
    relations[j].left !== x && relations[j].right === y)
    return false;
    }
 
    // for all parent relations between x and y
    for (var i = 0; i < relations.length; i++)
    if (relations[i].relation == 'parent') {
    var x = relations[i].parent, y = relations[i].child;
 
    // there does not exist a parent relation between z!=x and y
    for (var j = 0; j < relations.length; j++)
    if (relations[j].relation == 'parent')
    if (relations[j].parent !== x && relations[j].child === y)
    return false;
    }
 
    // for all neighbor relations between x and y
    for (var i = 0; i < relations.length; i++)
    if (relations[i].relation == 'neighbor') {
    var x = relations[i].left, y = relations[i].right;
 
    // all parent relations between z and x or y share the same z
    for (var j = 0; j < relations.length; j++)
    if (relations[j].relation == 'parent')
    for (var k = 0; k < relations.length; k++)
    if (relations[k].relation == 'parent')
    if (relations[j].child === x && relations[k].child === y &&
    relations[j].parent !== relations[k].parent)
    return false;
    }
 
    return true;
    }*/


    // node_to_tree: dom -> dom-tree
    // Given a native dom node, produces the appropriate tree.
    function node_to_tree(domNode) {
	var result = [domNode];
	for (var c = domNode.firstChild; c != null; c = c.nextSibling) {
	    result.push(node_to_tree(c));
	}
	return result;
    }
    Jsworld.node_to_tree = node_to_tree;



    // nodes(tree(N)) = nodes(N)
    function nodes(tree) {
	var ret = [tree.node];
	
	if (tree.node.jsworldOpaque == true) {
	    return ret;
	}

	for (var i = 0; i < tree.children.length; i++)
	    ret = ret.concat(nodes(tree.children[i]));
	
	return ret;
    }

    // nodeEq: node node -> boolean
    // Returns true if the two nodes should be the same.
    function nodeEq(node1, node2) {
	return (node1 && node2 && node1 === node2);
    }

    function nodeNotEq(node1, node2) {
	return ! nodeEq(node1, node2);
    }



    // relations(tree(N)) = relations(N)
    function relations(tree) {
	var ret = [];
	
	if (tree.node.jsworldOpaque == true) { return []; }

	for (var i = 0; i < tree.children.length; i++)
	    ret.push({ relation: 'parent', parent: tree.node, child: tree.children[i].node });
	
	for (var i = 0; i < tree.children.length - 1; i++)
	    ret.push({ relation: 'neighbor', left: tree.children[i].node, right: tree.children[i + 1].node });
	
	for (var i = 0; i < tree.children.length; i++)
	    ret = ret.concat(relations(tree.children[i]));
	
	return ret;
    }


    function appendChild(parent, child) {
	parent.appendChild(child);
    }


    // update_dom(nodes(Node), relations(Node)) = void
    function update_dom(toplevelNode, nodes, relations) {

	// TODO: rewrite this to move stuff all in one go... possible? necessary?
	
	// move all children to their proper parents
	for (var i = 0; i < relations.length; i++) {
	    if (relations[i].relation == 'parent') {
		var parent = relations[i].parent, child = relations[i].child;
		if (nodeNotEq(child.parentNode, parent)) {
		    appendChild(parent, child);
		} else {
		}
	    }
	}
	
	// arrange siblings in proper order
	// truly terrible... BUBBLE SORT
	var unsorted = true;
	while (unsorted) {
	    unsorted = false;
		
	    for (var i = 0; i < relations.length; i++) {
		if (relations[i].relation == 'neighbor') {
		    var left = relations[i].left, right = relations[i].right;
				
		    if (nodeNotEq(left.nextSibling, right)) {
			left.parentNode.insertBefore(left, right)
			unsorted = true;
		    }
		}
	    }
		
//	    if (!unsorted) break;
	}

	
	// remove dead nodes
	var live_nodes;
	
	// it is my hope that by sorting the nodes we get the worse of
	// O(n*log n) or O(m) performance instead of O(n*m)
	// for all I know Node.compareDocumentPosition is O(m)
	// and now we get O(n*m*log n)
	function positionComparator(a, b) {
	    var rel = a.compareDocumentPosition(b);
	    // children first
	    if (rel & a.DOCUMENT_POSITION_CONTAINED_BY) return 1;
	    if (rel & a.DOCUMENT_POSITION_CONTAINS) return -1;
	    // otherwise use precedes/follows
	    if (rel & a.DOCUMENT_POSITION_FOLLOWING) return -1;
	    if (rel & a.DOCUMENT_POSITION_PRECEDING) return 1;
	    // otherwise same node or don't care, we'll skip it anyway
	    return 0;
	}
	
	try {
	    // don't take out concat, it doubles as a shallow copy
	    // (as well as ensuring we keep document.body)
	    live_nodes = nodes.concat(toplevelNode).sort(positionComparator);
	}
	catch (e) {
	    // probably doesn't implement Node.compareDocumentPosition
	    live_nodes = null;
	}
	
	var node = toplevelNode, stop = toplevelNode.parentNode;
	while (node != stop) {
	    while ( !(node.firstChild == null || node.jsworldOpaque) ) {
		// process first
		// move down
		node = node.firstChild;
	    }
		
	    while (node != stop) {
		var next = node.nextSibling, parent = node.parentNode;
		
		// process last
		var found = false;
		var foundNode = undefined;

		if (live_nodes != null)
		    while (live_nodes.length > 0 && positionComparator(node, live_nodes[0]) >= 0) {
			var other_node = live_nodes.shift();
			if (nodeEq(other_node, node)) {
			    found = true;
			    foundNode = other_node;
			    break;
			}
			// need to think about this
			//live_nodes.push(other_node);
		    }
		else
		    for (var i = 0; i < nodes.length; i++)
			if (nodeEq(nodes[i], node)) {
			    found = true;
			    foundNode = nodes[i];
			    break;
			}
			
		if (!found) {
		    if (node.isJsworldOpaque) {
		    } else {
			// reparent children, remove node
			while (node.firstChild != null) {
			    appendChild(node.parentNode, node.firstChild);
			}
		    }
				
		    next = node.nextSibling; // HACKY
		    node.parentNode.removeChild(node);
		} else {
		    mergeNodeValues(node, foundNode);
		}

		// move sideways
		if (next == null) node = parent;
		else { node = next; break; }
	    }
	}

	
	refresh_node_values(nodes);
    }

    function mergeNodeValues(node, foundNode) {
//	for (attr in node) {
//	    foundNode[attr] = node[attr];
//	}
    }



    // camelCase: string -> string
    function camelCase(name) {
	return name.replace(/\-(.)/g, function(m, l){return l.toUpperCase()});
    }


    function set_css_attribs(node, attribs) {
	for (var j = 0; j < attribs.length; j++){
	    node.style[camelCase(attribs[j].attrib)] = attribs[j].values.join(" ");
	}
    }


    // isMatchingCssSelector: node css -> boolean
    // Returns true if the CSS selector matches.
    function isMatchingCssSelector(node, css) {
	if (css.id.match(/^\./)) {
	    // Check to see if we match the class
	    return ('class' in node && member(node['class'].split(/\s+/),
					      css.id.substring(1)));
	} else {
	    return ('id' in node && node.id == css.id);
	}
    }


    function update_css(nodes, css) {
	// clear CSS
	for (var i = 0; i < nodes.length; i++) {
	    if ( !nodes[i].jsworldOpaque ) {
		    clearCss(nodes[i]);
	    }
	}
	
	// set CSS
	for (var i = 0; i < css.length; i++)
	    if ('id' in css[i]) {
		for (var j = 0; j < nodes.length; j++)
		    if (isMatchingCssSelector(nodes[j], css[i])) {
			set_css_attribs(nodes[j], css[i].attribs);
		    }
	    }
	    else set_css_attribs(css[i].node, css[i].attribs);
    }


    var clearCss = function(node) {
	// FIXME: we should not be clearing the css
// 	if ('style' in node)
// 	    node.style.cssText = "";
    }



    // If any node cares about the world, send it in.
    function refresh_node_values(nodes) {
	for (var i = 0; i < nodes.length; i++) {
	    if (nodes[i].onWorldChange) {
		nodes[i].onWorldChange(world);
	    }
	}
    }


var cached_redraw, cached_redraw_css;
function do_redraw(world, oldWorld, toplevelNode, redraw_func, redraw_css_func, k) {
	if (oldWorld instanceof InitialWorld) {
	    // Simple path
	    redraw_func(world,
		function(drawn) {
			var t = sexp2tree(drawn);
			var ns = nodes(t);
	    		// HACK: css before dom, due to excanvas hack.
	    		redraw_css_func(world,
				function(css) {
					update_css(ns, sexp2css(css));
					update_dom(toplevelNode, ns, relations(t));
					k();
				});
		});
	} else {
	    maintainingSelection(
		function(k2) {
		    // For legibility, here is a non-working-but-non-CPS version of the same code:
		    /*
			var oldRedraw = cached_redraw || redraw_func(oldWorld);
 			var newRedraw = redraw_func(world);	    
 			var oldRedrawCss = cached_redraw_css || redraw_css_func(oldWorld);
			var newRedrawCss = redraw_css_func(world);
			var t = sexp2tree(newRedraw);
 			var ns = nodes(t);

			// Try to save the current selection and preserve it across
			// dom updates.

 			if(oldRedraw !== newRedraw) {
				// Kludge: update the CSS styles first.
				// This is a workaround an issue with excanvas: any style change
				// clears the content of the canvas, so we do this first before
				// attaching the dom element.
				update_css(ns, sexp2css(newRedrawCss));
				update_dom(toplevelNode, ns, relations(t));
 			} else {
				if(oldRedrawCss !== newRedrawCss) {
					update_css(ns, sexp2css(newRedrawCss));
				}
 			}
		    */
                           
       function cached_redraw_func(w, k){
         return cached_redraw? k(cached_redraw) : redraw_func(w, k);
       }
       function cached_redraw_css_func(w, k){
         return cached_redraw_css? k(cached_redraw_css) : redraw_css_func(w, k);
       }

		    // We try to avoid updating the dom if the value
		    // hasn't changed.
    cached_redraw_func(oldWorld,
			function(oldRedraw) {
			    redraw_func(world,
				function(newRedraw) {
				    cached_redraw_css_func(oldWorld,
					function(oldRedrawCss) {
					    redraw_css_func(world,
						function(newRedrawCss) {
						    var t = sexp2tree(newRedraw);
						    var ns = nodes(t);

						    // Try to save the current selection and preserve it across
						    // dom updates.

 						    if(oldRedraw !== newRedraw) {
                  cached_redraw = newRedraw;
							// Kludge: update the CSS styles first.
							// This is a workaround an issue with excanvas: any style change
							// clears the content of the canvas, so we do this first before
							// attaching the dom element.
							update_css(ns, sexp2css(newRedrawCss));
							update_dom(toplevelNode, ns, relations(t));
						    } else {
							if (oldRedrawCss !== newRedrawCss) {
                  cached_redraw_css = newRedrawCss;
							    update_css(ns, sexp2css(newRedrawCss));
							}
						    }
						    k2();
						})
					})
				})
			});
		}, k);
	}
    }


    // maintainingSelection: (-> void) -> void
    // Calls the thunk f while trying to maintain the current focused selection.
    function maintainingSelection(f, k) {
	var currentFocusedSelection;
	if (hasCurrentFocusedSelection()) {
	    currentFocusedSelection = getCurrentFocusedSelection();
	    f(function() {
		currentFocusedSelection.restore();
		k();
	    });
	} else {
	    f(k);
	}
    }



    function FocusedSelection() {
	this.focused = currentFocusedNode;
	this.selectionStart = currentFocusedNode.selectionStart;
	this.selectionEnd = currentFocusedNode.selectionEnd;
    }

    // Try to restore the focus.
    FocusedSelection.prototype.restore = function() {
	// FIXME: if we're scrolling through, what's visible
	// isn't restored yet.
	if (this.focused.parentNode) {
	    this.focused.selectionStart = this.selectionStart;
	    this.focused.selectionEnd = this.selectionEnd;
	    this.focused.focus();
	} else if (this.focused.id) {
	    var matching = document.getElementById(this.focused.id);
	    if (matching) {
		matching.selectionStart = this.selectionStart;
		matching.selectionEnd = this.selectionEnd;
		matching.focus();
	    }
	}
    };

    function hasCurrentFocusedSelection() {
	return currentFocusedNode != undefined;
    }

    function getCurrentFocusedSelection() {
	return new FocusedSelection();
    }



    //////////////////////////////////////////////////////////////////////

    function BigBangRecord(top, world, handlerCreators, handlers, attribs) {    
	this.top = top;
	this.world = world;
	this.handlers = handlers;
	this.handlerCreators = handlerCreators;
	this.attribs = attribs;
    }

    BigBangRecord.prototype.restart = function() {
	big_bang(this.top, this.world, this.handlerCreators, this.attribs);
    }
    
    BigBangRecord.prototype.pause = function() {
	for(var i = 0 ; i < this.handlers.length; i++) {
	    if (this.handlers[i] instanceof StopWhenHandler) {
		// Do nothing for now.
	    } else {
		this.handlers[i].onUnregister(top);
	    }
	}
    };
    //////////////////////////////////////////////////////////////////////

    // Notes: big_bang maintains a stack of activation records; it should be possible
    // to call big_bang re-entrantly.
    function big_bang(top, init_world, handlerCreators, attribs, k) {
	clear_running_state();

	// Construct a fresh set of the handlers.
	var handlers = map(handlerCreators, function(x) { return x();} );
	if (runningBigBangs.length > 0) { 
	    runningBigBangs[runningBigBangs.length - 1].pause();
	}

	// Create an activation record for this big-bang.
	var activationRecord = 
	    new BigBangRecord(top, init_world, handlerCreators, handlers, attribs);
	runningBigBangs.push(activationRecord);
	function keepRecordUpToDate(w, oldW, k2) {
	    activationRecord.world = w;
	    k2();
	}
	add_world_listener(keepRecordUpToDate);



	// Monitor for termination and register the other handlers.
	var stopWhen = new StopWhenHandler(function(w, k2) { k2(false); },
                                     function(w, k2) { k2(w); });
	for(var i = 0 ; i < handlers.length; i++) {
	    if (handlers[i] instanceof StopWhenHandler) {
        stopWhen = handlers[i];
	    } else {
        handlers[i].onRegister(top);
	    }
	}
	function watchForTermination(w, oldW, k2) {
	    stopWhen.test(w,
                    function(stop) {
                      if (stop) {
                        // install last_picture_handler and listener
                        var handler = stopWhen.last_picture_handler();
                        handler.onRegister(top);
                        handler._listener(w, oldW, function(v) { k2(); });
                        // shut down the world
                        Jsworld.shutdown();
                        k(w);
                      } else { k2(); }
                    });
	};
	add_world_listener(watchForTermination);


	// Finally, begin the big-bang.
	copy_attribs(top, attribs);
	change_world(function(w, k2) { k2(init_world); }, doNothing);


    }
    Jsworld.big_bang = big_bang;





    // on_tick: number CPS(world -> world) -> handler
    function on_tick(delay, tick) {
	return function() {
            var watchId;
            var reschedule = function() {
                watchId = setTimeout(change, delay);
            };
            var change = function() {
                change_world(tick, reschedule);
            };
	    var ticker = {
		onRegister: function (top) { 
                    reschedule();
		},
		onUnregister: function (top) {
		    if (watchId) { clearTimeout(watchId); }
		}
	    };
	    return ticker;
	};
    }
    Jsworld.on_tick = on_tick;


    // NOTE:keypresses are handled by both keydown AND keypress events
    // this is done because non-printable keys (shift, scroll, etc) are only fired
    // on keydown, but the keydown handler doesn't provide enough information
    // to reconstruct the printable character ("é", for example)
    // ASSUMPTION: the "press" handler is smart enough to produce the null character
    // for printable keydowns!!!
    function on_key(press) {
      return function() {
        var stillPressing = false;
        var clearPressing = function() {
            stillPressing = false;
        };
        var e;
        var f = function(w, k) { press(w, e, k); };
        var wrappedPress = function(e_) {
            // If the keyCode is ESCAPE, let it pass through.
            // That is, ignore it:
            if (e_.keyCode == 27) { return; }

            e = e_;
            // jump out of handler if we want to speed ahead to keypress
            if(e.type==="keydown" && helpers.getKeyCodeName(e) === "" && !e.altKey){
              return false;
            // preventDefault if we can (helps trap arrow and backspace calls on FF)
            } else if(e.type==="keydown" && helpers.getKeyCodeName(e) !== ""){
              preventDefault(e);
            }
            stopPropagation(e);
            // get around keydown press events blocking keypress events by
            // making sure the stillPressing flag was set by the appropriate event type
            if (stillPressing !== e.type) {
                stillPressing = e.type;
                change_world(f, clearPressing);
            }
        };
        return {
          onRegister:   function(top) {attachEvent(top, 'keypress', wrappedPress);
                                      attachEvent(top, 'keydown',  wrappedPress);
                                     },
          onUnregister: function(top) {detachEvent(top, 'keypress', wrappedPress);
                                      detachEvent(top, 'keydown',  wrappedPress);
                                     }
        };
      }
    }
 
    Jsworld.on_key = on_key;

    function on_mouse(mouse) {
      return function() {
        var e;
        var top;

        var stillMousing = false;
        var clearMousing = function() {
            stillMousing = false;
        };
 
        var f = function(w, k) { mouse(w, e, k); };
        var wrappedMouse = function(_e) {
            e = _e;
            if (top) { top.focus(); }

            preventDefault(e);
            stopPropagation(e);
   
            if (! stillMousing) {
              stillMousing = true;
              change_world(f, clearMousing);
            }
        };
 
        return {
          onRegister: function(top_) {
            top = top_;
            attachEvent(top, 'mousedown', wrappedMouse);
            attachEvent(top, 'mouseup', wrappedMouse);
            attachEvent(top, 'mousemove', wrappedMouse);
          },
          onUnregister: function(top) {
            detachEvent(top, 'mousedown', wrappedMouse);
            detachEvent(top, 'mouseup', wrappedMouse);
            detachEvent(top, 'mousemove', wrappedMouse);
          }
        };
      }
    }
    Jsworld.on_mouse = on_mouse;

 

 


    function on_tap(press) {
	return function() {
            var e;
            var top;

            var stillPressing = false;
            var clearPressing = function() {
                stillPressing = false;
            };

            var f = function(w, k) { press(w, e, k); };
	    var wrappedPress = function(_e) {
                e = _e;
                if (top) { top.focus(); }
  
		preventDefault(e);
		stopPropagation(e);
                if (! stillPressing) {
                    stillPressing = true;
		    change_world(f, clearPressing);
                }
	    };

	    return {
		onRegister: function(top_) {
                    top = top_;
//                    attachEvent(top, 'mousedown', wrappedPress);
                    attachEvent(top, 'touchstart', wrappedPress); 
                },
		onUnregister: function(top) { 
//                    detachEvent(top, 'mousedown', wrappedPress);
                    detachEvent(top, 'touchstart', wrappedPress); 
                }
	    };
	}
    }
    Jsworld.on_tap = on_tap;


    // devicemotion, deviceorientation
    //   
    // http://stackoverflow.com/questions/4378435/how-to-access-accelerometer-gyroscope-data-from-javascript
    // http://www.murraypicton.com/2011/01/exploring-the-iphones-accelerometer-through-javascript/
    //
    // with orientation change content in:
    //
    // http://stackoverflow.com/questions/1649086/detect-rotation-of-android-phone-in-the-browser-with-javascript
    function on_tilt(tilt) {
	return function() {
	    var wrappedTilt;
            var leftRight = 0,    // top/down
                topDown = 0;   // left/right
            var tickId;
            var delay = 1000 / 4; // Send an update four times a second.
            
            var f = function(w, k) { tilt(w, leftRight, topDown, k); };
            var update = function() {
                change_world(f, reschedule);
            };

            var reschedule = function() {
                tickId = setTimeout(update, delay);
            };


            if (window.DeviceOrientationEvent) {
                wrappedTilt = function(e) {
		    preventDefault(e);
		    stopPropagation(e);

                    // Under web browsers that don't have an accelerometer,
                    // we actually get the null values for beta and gamma.
                    // We should guard against that.
                    if (e.gamma === null || e.beta === null) {
                        if (tickId) { clearTimeout(tickId); tickId = undefined; }
                        return;
                    }

                    if (window.orientation === 0) {
                        // Portrait
                        leftRight = e.gamma;
                        topDown = e.beta; 
                    } else if (window.orientation === 90) {
                        // Landscape (counterclockwise turn from portrait)
                        leftRight = e.beta;
                        topDown = -(e.gamma); 
                    } else if (window.orientation === -90) {
                        // Landscape (clockwise turn from portrait)
                        leftRight = -(e.beta);
                        topDown = e.gamma; 
                    } else if (window.orientation === 180) {
                        // upside down
                        leftRight = -(e.gamma);
                        topDown = -(e.beta); 
                    } else {
                        // Failsafe: treat as portrait if we don't get a good
                        // window.orientation.
                        leftRight = e.gamma;
                        topDown = e.beta; 
                    }
                };

	        return {
		    onRegister: function(top) { 
                        attachEvent(window, 'deviceorientation', wrappedTilt); 
                        reschedule();
                    },
		    onUnregister: function(top) { 
                        if(tickId) { clearTimeout(tickId); }
                        detachEvent(window, 'deviceorientation', wrappedTilt);
                    }
	        };
            } else {
                // Otherwise, the environment doesn't support orientation events.
	        return {
		    onRegister: function(top) { },
		    onUnregister: function(top) { }
	        };
            }
	}
    }
    Jsworld.on_tilt = on_tilt;



    
    //  on_draw: CPS(world -> (sexpof node)) CPS(world -> (sexpof css-style)) -> handler
    function on_draw(redraw, redraw_css) {
        var k;
        var afterRedraw = function(newDomTree) {
	    checkDomSexp(newDomTree, newDomTree);
	    k(newDomTree);
	};
	var wrappedRedraw = function(w, k_) {
            k = k_;
	    redraw(w, afterRedraw);
	}

	return function() {
	    var drawer = {
		_top: null,
		_listener: function(w, oldW, k2) { 
		    do_redraw(w, oldW,
                              drawer._top,
                              wrappedRedraw,
                              redraw_css, 
                              k2); 
		},
		onRegister: function (top) { 
		    drawer._top = top;
		    add_world_listener(drawer._listener);
		},

		onUnregister: function (top) {
		    remove_world_listener(drawer._listener);
		}
	    };
	    return drawer;
	};
    }
    Jsworld.on_draw = on_draw;



    function StopWhenHandler(test, receiver, last_picture_handler) {
      this.test = test;
      this.receiver = receiver;
      this.last_picture_handler = last_picture_handler;
    }
    // stop_when: CPS(world -> boolean) CPS(world -> boolean) -> handler
    function stop_when(test, receiver, last_picture_handler) {
      return function() {
          if (receiver == undefined) {
            receiver = function(w, k) { k(w); };
          }
          return new StopWhenHandler(test, receiver, last_picture_handler);
        };
    }
    Jsworld.stop_when = stop_when;



    function on_world_change(f) {
	var listener = function(world, oldW, k) { f(world, k); };
	return function() {
	    return { 
		onRegister: function (top) { 
		    add_world_listener(listener); },
		onUnregister: function (top) {
		    remove_world_listener(listener)}
	    };
	};
    }
    Jsworld.on_world_change = on_world_change;





    // Compatibility for attaching events to nodes.
    function attachEvent(node, eventName, fn) {
	if (node.addEventListener) {
	    // Mozilla
	    node.addEventListener(eventName, fn, false);
	} else {
	    // IE
	    node.attachEvent('on' + eventName, fn, false);
	}
    }

    var detachEvent = function(node, eventName, fn) {
	if (node.addEventListener) {
	    // Mozilla
	    node.removeEventListener(eventName, fn, false);
	} else {
	    // IE
	    node.detachEvent('on' + eventName, fn, false);
	}
    }

    //
    // DOM CREATION STUFFS
    //

    // add_ev: node string CPS(world event -> world) -> void
    // Attaches a world-updating handler when the world is changed.
    function add_ev(node, event, f) {
	var eventHandler = function(e) { change_world(function(w, k) { f(w, e, k); },
						       doNothing); };
	attachEvent(node, event, eventHandler);
	eventDetachers.push(function() { detachEvent(node, event, eventHandler); });
    }

    // add_ev_after: node string CPS(world event -> world) -> void
    // Attaches a world-updating handler when the world is changed, but only
    // after the fired event has finished.
    function add_ev_after(node, event, f) {
	var eventHandler = function(e) {
		setTimeout(function() { change_world(function(w, k) { f(w, e, k); },
						     doNothing); },
			   0);
	};
	attachEvent(node, event, eventHandler);
	eventDetachers.push(function() { detachEvent(node, event, eventHandler); });
    }


    function addFocusTracking(node) {
	attachEvent(node, "focus", function(e) {
	    currentFocusedNode = node; });
	attachEvent(node, "blur", function(e) {
	    currentFocusedNode = undefined;
	});
	return node;
    }





    //
    // WORLD STUFFS
    //


    function sexp2tree(sexp) {
	if (isPage(sexp)) {
	    return sexp2tree(node_to_tree(sexp.toDomNode()));
	} else {
	    if(sexp.length == undefined) return { node: sexp, children: [] };
	    else return { node: sexp[0], children: map(sexp.slice(1), sexp2tree) };
	}
    }

    function sexp2attrib(sexp) {
	return { attrib: sexp[0], values: sexp.slice(1) };
    }

    function sexp2css_node(sexp) {
	var attribs = map(sexp.slice(1), sexp2attrib);
	if (typeof sexp[0] == 'string'){
	    return [{ id: sexp[0], attribs: attribs }];
	} else if ('length' in sexp[0]){
	    return map(sexp[0], function (id) { return { id: id, attribs: attribs } });
	} else {
	    return [{ node: sexp[0], attribs: attribs }];
	}
    }

    function sexp2css(sexp) {
	return concat_map(sexp, sexp2css_node);
    }



    function isTextNode(n) {
	return (n.nodeType == Node.TEXT_NODE);
    }


    function isElementNode(n) {
	return (n.nodeType == Node.ELEMENT_NODE);
    }


    var throwDomError = function(thing, topThing) {
	throw new JsworldDomError(
	    helpers.format(
		"Expected a non-empty array, received ~s within ~s",
		[thing, topThing]),
	    thing);
    };

    // checkDomSexp: X X -> boolean
    // Checks to see if thing is a DOM-sexp.  If not,
    // throws an object that explains why not.
    function checkDomSexp(thing, topThing) {
	if (isPage(thing)) {
	    return;
	}

	if (! thing instanceof Array) {
	    throwDomError(thing, topThing);
	}
	if (thing.length == 0) {
	    throwDomError(thing, topThing);
	}

	// Check that the first element is a Text or an element.
	if (isTextNode(thing[0])) {
	    if (thing.length > 1) {
		throw new JsworldDomError(helpers.format("Text node ~s can not have children",
							 [thing]),
					  thing);
	    }
	} else if (isElementNode(thing[0])) {
	    for (var i = 1; i < thing.length; i++) {
		checkDomSexp(thing[i], thing);
	    }
	} else {
	    throw new JsworldDomError(
		helpers.format(
		    "expected a Text or an Element, received ~s within ~s",
		    [thing, topThing]),
		thing[0]);
	}
    }

    function JsworldDomError(msg, elt) {
	this.msg = msg;
	this.elt = elt;
    }
    JsworldDomError.prototype.toString = function() {
	return "on-draw: " + this.msg;
    }





    //
    // DOM CREATION STUFFS
    //


    function copy_attribs(node, attribs) {
	if (attribs)
	    for (a in attribs) {
		if (Object.hasOwnProperty.call(attribs, a)) {
		    if (typeof attribs[a] == 'function')
			add_ev(node, a, attribs[a]);
		    else{
			node[a] = attribs[a];//eval("node."+a+"='"+attribs[a]+"'");
		    }
		}
	    }
	return node;
    }


    //
    // NODE TYPES
    //

    function p(attribs) {
	return addFocusTracking(copy_attribs(document.createElement('p'), attribs));
    }
    Jsworld.p = p;

    function div(attribs) {
	return addFocusTracking(copy_attribs(document.createElement('div'), attribs));
    }
    Jsworld.div = div;

    // Used To Be: (world event -> world) (hashof X Y) -> domElement
    // Now: CPS(world event -> world) (hashof X Y) -> domElement
    function button(f, attribs) {
	var n = document.createElement('button');
	n.onclick = function(e) {return false;};
	add_ev(n, 'click', f);
	return addFocusTracking(copy_attribs(n, attribs));
    }
    Jsworld.button = button;


//     function bidirectional_input(type, toVal, updateVal, attribs) {
// 	var n = document.createElement('input');
// 	n.type = type;
// 	function onKey(w, e) {
// 	    return updateVal(w, n.value);
// 	}
// 	// This established the widget->world direction
// 	add_ev_after(n, 'keypress', onKey);
// 	// and this establishes the world->widget.
// 	n.onWorldChange = function(w) {n.value = toVal(w)};
// 	return addFocusTracking(copy_attribs(n, attribs));
//     }
//     Jsworld.bidirectional_input = bidirectional_input;


    var preventDefault = function(event) {
	if (event.preventDefault) {
	    event.preventDefault();
	} else {
	    event.returnValue = false;
	}
    }

    var stopPropagation = function(event) {
	if (event.stopPropagation) {
	    event.stopPropagation();
	} else {
	    event.cancelBubble = true;
	}
    }


    var stopClickPropagation = function(node) {
	attachEvent(node, "click",
		    function(e) {
			stopPropagation(e);
		    });
	return node;
    }
    

    // input: string CPS(world -> world) 
    function input(aType, updateF, attribs) {
	aType = aType.toLowerCase();
	var dispatchTable = { text : text_input,
			      password: text_input,
			      checkbox: checkbox_input
			      //button: button_input,
			      //radio: radio_input 
	};

	if (dispatchTable[aType]) {
	    return (dispatchTable[aType])(aType, updateF, attribs);
	}
	else {
	    throw new Error("js-input: does not currently support type " + aType);
	}
    }
    Jsworld.input = input;


    var text_input = function(type, updateF, attribs) {
	var n = document.createElement('input');
	n.type = type;
	function onKey(w, e, k) {
	    updateF(w, n.value, k);
	}
	// This established the widget->world direction
	add_ev_after(n, 'keypress', onKey);

	// Every second, do a manual polling of the object, just in case.
	var delay = 1000;
	var lastVal = n.value;
	var intervalId = setInterval(function() {
	    if (! n.parentNode) {
		clearInterval(intervalId);
		return;
	    }
	    if (lastVal != n.value) {
		lastVal = n.value;
		change_world(function (w, k) {
		    updateF(w, n.value, k);
		}, doNothing);
	    }
	},
		    delay);
	return stopClickPropagation(
	    addFocusTracking(copy_attribs(n, attribs)));
    };


    var checkbox_input = function(type, updateF, attribs) {
	var n = document.createElement('input');
	n.type = type;

	var onCheck = function(w, e, k) {
	    updateF(w, n.checked, k);
	};
	// This established the widget->world direction
	add_ev_after(n, 'change', onCheck);
	
	attachEvent(n, 'click', function(e) {
		stopPropagation(e);
	    });

	return copy_attribs(n, attribs);
    };


    var button_input = function(type, updateF, attribs) {
	var n = document.createElement('button');
	add_ev(n, 'click', function(w, e, k) { updateF(w, n.value, k); });
	return addFocusTracking(copy_attribs(n, attribs));
    };



    // worldToValF: CPS(world -> string)
    // updateF: CPS(world string -> world)
    function bidirectional_text_input(worldToValF, updateF, attribs) {
	var n = document.createElement('input');
	n.type = "text";
	var lastValue = undefined;
	function monitor(w, e, k) {
	    updateF(w, n.value, k);
	}
	add_ev(n, 'keypress', monitor);
	return stopClickPropagation(
	    addFocusTracking(
		copy_attribs(n, attribs)));
    }
    

    function text(s, attribs) {
//	var result = document.createTextNode(s);
	var result = document.createElement("div");
	result.appendChild(document.createTextNode(s));
	result.style['white-space'] = 'pre';
	result.jsworldOpaque = true;
	return result;
    }
    Jsworld.text = text;

    function select(attribs, opts, f){
	var n = document.createElement('select');
	for(var i = 0; i < opts.length; i++) {
	    n.add(option({value: opts[i]}), null);
	}
	n.jsworldOpaque = true;
	add_ev(n, 'change', f);
	var result = addFocusTracking(copy_attribs(n, attribs));
	return result;
    }
    Jsworld.select = select;

    function option(attribs){
	var node = document.createElement("option");
        node.text = attribs.value;
	node.value = attribs.value;
 	return node;
    }



    function textarea(attribs){
	return addFocusTracking(copy_attribs(document.createElement('textarea'), attribs));
    }
    Jsworld.textarea = textarea;

    function h1(attribs){
	return addFocusTracking(copy_attribs(document.createElement('h1'), attribs));
    }
    Jsworld.h1 = h1;

    function canvas(attribs){
	return addFocusTracking(copy_attribs(document.createElement('canvas'), attribs));	
    }
    Jsworld.canvas = canvas;


    function img(src, attribs) {
	var n = document.createElement('img');
	n.src = src;
	return addFocusTracking(copy_attribs(n, attribs));
    }
    Jsworld.img = img;



    function raw_node(node, attribs) {
	return addFocusTracking(copy_attribs(node, attribs));
    }
    Jsworld.raw_node = raw_node;





    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    // Effects

    // An effect is an object with an invokeEffect() method.
    
    var WrappedWorldWithEffects = function(w, effects) {
	if (w instanceof WrappedWorldWithEffects) {
	    this.w = w.w;
	    this.e = w.e.concat(effects);
	} else {
	    this.w = w;
	    this.e = effects;
	}
    };

    WrappedWorldWithEffects.prototype.getWorld = function() {
	return this.w;
    };

    WrappedWorldWithEffects.prototype.getEffects = function() {
	return this.e;
    };


    //////////////////////////////////////////////////////////////////////

    Jsworld.with_effect = function(w, e) {
	return new WrappedWorldWithEffects(w, [e]);
    };

    Jsworld.with_multiple_effects = function(w, effects) {
	return new WrappedWorldWithEffects(w, effects);
    };

    Jsworld.has_effects = function(w) {
	return w instanceof WrappedWorldWithEffects;
    };




    //////////////////////////////////////////////////////////////////////
    // Example effect: raise an alert.
    Jsworld.alert_effect = function(msg) {
	return new AlertEffect(msg);
    };

    var AlertEffect = function(msg) {
	this.msg = msg;
    };

    AlertEffect.prototype.invokeEffect = function(k) {
	alert(this.msg);
	k();
    };


    //////////////////////////////////////////////////////////////////////


    // Example effect: play a song, given its url
    Jsworld.music_effect = function(musicUrl) {
	return new MusicEffect(musicUrl);
    };

    var MusicEffect = function(musicUrl) {
	this.musicUrl = musicUrl;
    };

    MusicEffect.prototype.invokeEffect = function(k) {
	new Audio(url).play();
	k();
    };





    //////////////////////////////////////////////////////////////////////
    // Pages


    var Page = function(elts, attribs) {
	if (typeof(elts) === 'undefined') { 
	    elts = [];
	}
	this.elts = elts;
	this.attribs = attribs;
    };

    Page.prototype.add = function(elt, positionLeft, positionTop) {
	return new Page(this.elts.concat([{elt: elt, 
					   positionTop: positionTop,
					   positionLeft: positionLeft}]),
			this.attribs);
    };

    Page.prototype.toDomNode = function() {
	var aDiv = div();
	for (var i = 0 ; i < this.elts.length; i++) {
	    var elt = this.elts[i].elt;
	    if (! elt.style) {
		elt.style = '';
	    }

	    elt.style.position = 'absolute';
	    elt.style.left = this.elts[i].positionLeft + "px";
	    elt.style.top = this.elts[i].positionTop + "px";	    
	    aDiv.appendChild(elt);
	};
	copy_attribs(aDiv, this.attribs)
	return aDiv;
    };


    isPage = function(x) {
	return x instanceof Page;
    };

    Jsworld.isPage = isPage;

    Jsworld.emptyPage = function(attribs) {
	var result = new Page([], attribs);
	return result;
    };

    Jsworld.placeOnPage = function(elt, positionLeft, positionTop, page) {
	if (typeof(elt) === 'string') {
	    elt = text(elt);
	}
	return page.add(elt, positionLeft, positionTop);
    };



    // getCurrentWorld: -> world
    // Returns the currently running world.
    Jsworld.getCurrentWorld = function() {
        return world;
    };


})();// Scheme numbers.


var __PLTNUMBERS_TOP__;
if (typeof(exports) !== 'undefined') {
    __PLTNUMBERS_TOP__ = exports;
} else {
    if (! this['jsnums']) {
 	this['jsnums'] = {};
    }
    __PLTNUMBERS_TOP__  = this['jsnums'];
}

//var jsnums = {};


// The numeric tower has the following levels:
//     integers
//     rationals
//     floats
//     complex numbers
//
// with the representations:
//     integers: fixnum or BigInteger [level=0]
//     rationals: Rational [level=1]
//     floats: FloatPoint [level=2]
//     complex numbers: Complex [level=3]

// We try to stick with the unboxed fixnum representation for
// integers, since that's what scheme programs commonly deal with, and
// we want that common type to be lightweight.


// A boxed-scheme-number is either BigInteger, Rational, FloatPoint, or Complex.
// An integer-scheme-number is either fixnum or BigInteger.


(function() {
    'use strict';
    // Abbreviation
    var Numbers = __PLTNUMBERS_TOP__;
    //var Numbers = jsnums;


    // makeNumericBinop: (fixnum fixnum -> any) (scheme-number scheme-number -> any) -> (scheme-number scheme-number) X
    // Creates a binary function that works either on fixnums or boxnums.
    // Applies the appropriate binary function, ensuring that both scheme numbers are
    // lifted to the same level.
    var makeNumericBinop = function(onFixnums, onBoxednums, options) {
	options = options || {};
	return function(x, y) {
	    if (options.isXSpecialCase && options.isXSpecialCase(x))
		return options.onXSpecialCase(x, y);
	    if (options.isYSpecialCase && options.isYSpecialCase(y))
		return options.onYSpecialCase(x, y);

	    if (typeof(x) === 'number' &&
		typeof(y) === 'number') {
		return onFixnums(x, y);
	    }
	    if (typeof(x) === 'number') {
		x = liftFixnumInteger(x, y);
	    }
	    if (typeof(y) === 'number') {
		y = liftFixnumInteger(y, x);
	    }

	    if (x.level < y.level) x = x.liftTo(y);
	    if (y.level < x.level) y = y.liftTo(x);
	    return onBoxednums(x, y);
	};
    }
    
    
    // fromFixnum: fixnum -> scheme-number
    var fromFixnum = function(x) {
	if (isNaN(x) || (! isFinite(x))) {
	    return FloatPoint.makeInstance(x);
	}
	var nf = Math.floor(x);
	if (nf === x) {
            if (isOverflow(nf)) {
		return makeBignum(expandExponent(x+''));
            } else {
		return nf;
	    }
	} else {
            return FloatPoint.makeInstance(x);
	}
    };

    var expandExponent = function(s) {
	var match = s.match(scientificPattern(digitsForRadix(10), expMarkForRadix(10))), mantissaChunks, exponent;
	if (match) {
	    mantissaChunks = match[1].match(/^([^.]*)(.*)$/);
	    exponent = Number(match[2]);

	    if (mantissaChunks[2].length === 0) {
		return mantissaChunks[1] + zfill(exponent);
	    }

	    if (exponent >= mantissaChunks[2].length - 1) {
		return (mantissaChunks[1] + 
			mantissaChunks[2].substring(1) + 
			zfill(exponent - (mantissaChunks[2].length - 1)));
	    } else {
		return (mantissaChunks[1] +
			mantissaChunks[2].substring(1, 1+exponent));
	    }
	} else {
	    return s;
	}
    };

    // zfill: integer -> string
    // builds a string of "0"'s of length n.
    var zfill = function(n) {
	var buffer = [];
	buffer.length = n;
	for (var i = 0; i < n; i++) {
	    buffer[i] = '0';
	}
	return buffer.join('');
    };
    

    
    // liftFixnumInteger: fixnum-integer boxed-scheme-number -> boxed-scheme-number
    // Lifts up fixnum integers to a boxed type.
    var liftFixnumInteger = function(x, other) {
	switch(other.level) {
	case 0: // BigInteger
	    return makeBignum(x);
	case 1: // Rational
	    return new Rational(x, 1);
	case 2: // FloatPoint
	    return new FloatPoint(x);
	case 3: // Complex
	    return new Complex(x, 0);
	default:
	    throwRuntimeError("IMPOSSIBLE: cannot lift fixnum integer to " + other.toString(), x, other);
	}
    };
    
    
    // throwRuntimeError: string (scheme-number | undefined) (scheme-number | undefined) -> void
    // Throws a runtime error with the given message string.
    var throwRuntimeError = function(msg, x, y) {
	Numbers['onThrowRuntimeError'](msg, x, y);
    };



    // onThrowRuntimeError: string (scheme-number | undefined) (scheme-number | undefined) -> void
    // By default, will throw a new Error with the given message.
    // Override Numbers['onThrowRuntimeError'] if you need to do something special.
    var onThrowRuntimeError = function(msg, x, y) {
	throw new Error(msg);
    };


    // isSchemeNumber: any -> boolean
    // Returns true if the thing is a scheme number.
    var isSchemeNumber = function(thing) {
	return (typeof(thing) === 'number'
		|| (thing instanceof Rational ||
		    thing instanceof FloatPoint ||
		    thing instanceof Complex ||
		    thing instanceof BigInteger));
    };


    // isRational: scheme-number -> boolean
    var isRational = function(n) {
	return (typeof(n) === 'number' ||
		(isSchemeNumber(n) && n.isRational()));
    };

    // isReal: scheme-number -> boolean
    var isReal = function(n) {
	return (typeof(n) === 'number' ||
		(isSchemeNumber(n) && n.isReal()));
    };

    // isExact: scheme-number -> boolean
    var isExact = function(n) {
	return (typeof(n) === 'number' || 
		(isSchemeNumber(n) && n.isExact()));
    };

    // isExact: scheme-number -> boolean
    var isInexact = function(n) {
	if (typeof(n) === 'number') {
	    return false;
	} else {
	    return (isSchemeNumber(n) && n.isInexact());
	}
    };

    // isInteger: scheme-number -> boolean
    var isInteger = function(n) {
	return (typeof(n) === 'number' ||
		(isSchemeNumber(n) && n.isInteger()));
    };

    // isExactInteger: scheme-number -> boolean
    var isExactInteger = function(n) {
	return (typeof(n) === 'number' ||
		(isSchemeNumber(n) && 
		 n.isInteger() && 
		 n.isExact()));
    }



    // toFixnum: scheme-number -> javascript-number
    var toFixnum = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.toFixnum();
    };

    // toExact: scheme-number -> scheme-number
    var toExact = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.toExact();
    };


    // toExact: scheme-number -> scheme-number
    var toInexact = function(n) {
	if (typeof(n) === 'number')
	    return FloatPoint.makeInstance(n);
	return n.toInexact();
    };



    //////////////////////////////////////////////////////////////////////


    // add: scheme-number scheme-number -> scheme-number
    var add = function(x, y) {
        var sum;
        if (typeof(x) === 'number' && typeof(y) === 'number') {
            sum = x + y;
            if (isOverflow(sum)) {
		return (makeBignum(x)).add(makeBignum(y));
            }
        }
        if (x instanceof FloatPoint && y instanceof FloatPoint) {
            return x.add(y);
        }
        return addSlow(x, y);        
    };

    var addSlow = makeNumericBinop(
	function(x, y) {
	    var sum = x + y;
	    if (isOverflow(sum)) {
		return (makeBignum(x)).add(makeBignum(y));
	    } else {
		return sum;
	    }
	},
	function(x, y) {
	    return x.add(y);
	},
	{isXSpecialCase: function(x) { 
	    return isExactInteger(x) && _integerIsZero(x) },
	 onXSpecialCase: function(x, y) { return y; },
	 isYSpecialCase: function(y) { 
	     return isExactInteger(y) && _integerIsZero(y) },
	 onYSpecialCase: function(x, y) { return x; }
	});


    // subtract: scheme-number scheme-number -> scheme-number
    var subtract = makeNumericBinop(
	function(x, y) {
	    var diff = x - y;
	    if (isOverflow(diff)) {
		return (makeBignum(x)).subtract(makeBignum(y));
	    } else {
		return diff;
	    }
	},
	function(x, y) {
	    return x.subtract(y);
	},
	{isXSpecialCase: function(x) { 
	    return isExactInteger(x) && _integerIsZero(x) },
	 onXSpecialCase: function(x, y) { return negate(y); },
	 isYSpecialCase: function(y) { 
	     return isExactInteger(y) && _integerIsZero(y) },
	 onYSpecialCase: function(x, y) { return x; }
	});


    // mulitply: scheme-number scheme-number -> scheme-number
    var multiply = function(x, y) {
        var prod;
        if (typeof(x) === 'number' && typeof(y) === 'number') {
	    prod = x * y;
	    if (isOverflow(prod)) {
		return (makeBignum(x)).multiply(makeBignum(y));
            } else {
                return prod;
            }
        }
        if (x instanceof FloatPoint && y instanceof FloatPoint) {
            return x.multiply(y);
        }
        return multiplySlow(x, y);
    };
    var multiplySlow = makeNumericBinop(
	function(x, y) {
	    var prod = x * y;
	    if (isOverflow(prod)) {
		return (makeBignum(x)).multiply(makeBignum(y));
	    } else {
		return prod;
	    }
	},
	function(x, y) {
	    return x.multiply(y);
	},
	{isXSpecialCase: function(x) { 
	    return (isExactInteger(x) && 
		    (_integerIsZero(x) || _integerIsOne(x) || _integerIsNegativeOne(x))) },
	 onXSpecialCase: function(x, y) { 
	     if (_integerIsZero(x))
		 return 0;
	     if (_integerIsOne(x))
		 return y;
	     if (_integerIsNegativeOne(x))
		 return negate(y);
	 },
	 isYSpecialCase: function(y) { 
	     return (isExactInteger(y) && 
		     (_integerIsZero(y) || _integerIsOne(y) || _integerIsNegativeOne(y)))},
	 onYSpecialCase: function(x, y) { 
	     if (_integerIsZero(y))
		 return 0;
	     if (_integerIsOne(y))
		 return x;
	     if (_integerIsNegativeOne(y)) 
		 return negate(x);
	 }
	});

    
    // divide: scheme-number scheme-number -> scheme-number
    var divide = makeNumericBinop(
	function(x, y) {
	    if (_integerIsZero(y))
		throwRuntimeError("/: division by zero", x, y);
	    var div = x / y;
	    if (isOverflow(div)) {
		return (makeBignum(x)).divide(makeBignum(y));
	    } else if (Math.floor(div) !== div) {
		return Rational.makeInstance(x, y);
	    } else {
		return div;
	    }
	},
	function(x, y) {
	    return x.divide(y);
	},
	{ isXSpecialCase: function(x) {
	    return (eqv(x, 0));
	},
	  onXSpecialCase: function(x, y) {
	      if (eqv(y, 0)) {
		  throwRuntimeError("/: division by zero", x, y);
	      }
	      return 0;
	  },
	  isYSpecialCase: function(y) { 
	    return (eqv(y, 0)); },
	  onYSpecialCase: function(x, y) {
	      throwRuntimeError("/: division by zero", x, y);
	  }
	});
    
    
    // equals: scheme-number scheme-number -> boolean
    var equals = makeNumericBinop(
	function(x, y) {
	    return x === y;
	},
	function(x, y) {
	    return x.equals(y);
	});


    // eqv: scheme-number scheme-number -> boolean
    var eqv = function(x, y) {
	if (x === y)
	    return true;
	if (typeof(x) === 'number' && typeof(y) === 'number')
	    return x === y;
	if (x === NEGATIVE_ZERO || y === NEGATIVE_ZERO)
	    return x === y;
	if (x instanceof Complex || y instanceof Complex) {
	    return (eqv(realPart(x), realPart(y)) &&
		    eqv(imaginaryPart(x), imaginaryPart(y)));
	}
	var ex = isExact(x), ey = isExact(y);
	return (((ex && ey) || (!ex && !ey)) && equals(x, y));
    };

    // approxEqual: scheme-number scheme-number scheme-number -> boolean
    var approxEquals = function(x, y, delta) {
	return lessThan(abs(subtract(x, y)),
                        delta);
    };

    // greaterThanOrEqual: scheme-number scheme-number -> boolean
    var greaterThanOrEqual = makeNumericBinop(
	function(x, y) {
	    return x >= y;
	},
	function(x, y) {
	    if (!(isReal(x) && isReal(y)))
		throwRuntimeError(
		    ">=: couldn't be applied to complex number", x, y);
	    return x.greaterThanOrEqual(y);
	});


    // lessThanOrEqual: scheme-number scheme-number -> boolean
    var lessThanOrEqual = makeNumericBinop(
	function(x, y){

	    return x <= y;
	},
	function(x, y) {
	    if (!(isReal(x) && isReal(y)))
		throwRuntimeError("<=: couldn't be applied to complex number", x, y);
	    return x.lessThanOrEqual(y);
	});


    // greaterThan: scheme-number scheme-number -> boolean
    var greaterThan = makeNumericBinop(
	function(x, y){
	    return x > y;
	},
	function(x, y) {
	    if (!(isReal(x) && isReal(y)))
		throwRuntimeError(">: couldn't be applied to complex number", x, y);
	    return x.greaterThan(y);
	});


    // lessThan: scheme-number scheme-number -> boolean
    var lessThan = makeNumericBinop(
	function(x, y){

	    return x < y;
	},
	function(x, y) {
	    if (!(isReal(x) && isReal(y)))
		throwRuntimeError("<: couldn't be applied to complex number", x, y);
	    return x.lessThan(y);
	});



    // expt: scheme-number scheme-number -> scheme-number
    var expt = (function() {
	var _expt = makeNumericBinop(
	    function(x, y){
		var pow = Math.pow(x, y);
		if (isOverflow(pow)) {
		    return (makeBignum(x)).expt(makeBignum(y));
		} else {
		    return pow;
		}
	    },
	    function(x, y) {
		if (equals(y, 0)) {
		    return add(y, 1);
		} else {
		    return x.expt(y);
		}
	    });
	return function(x, y) {
	    if (equals(y, 0)) 
		return add(y, 1);
	    if (isReal(y) && lessThan(y, 0)) {
		return _expt(divide(1, x), negate(y));
	    }
	    return _expt(x, y);
	};
    })();


    // exp: scheme-number -> scheme-number
    var exp = function(n) {
	if ( eqv(n, 0) ) {
		return 1;
	}
	if (typeof(n) === 'number') {
	    return FloatPoint.makeInstance(Math.exp(n));
	}
	return n.exp();
    };


    // modulo: scheme-number scheme-number -> scheme-number
    var modulo = function(m, n) {
	if (! isInteger(m)) {
	    throwRuntimeError('modulo: the first argument '
			      + m + " is not an integer.", m, n);
	}
	if (! isInteger(n)) {
	    throwRuntimeError('modulo: the second argument '
			      + n + " is not an integer.", m, n);
	}
	var result;
	if (typeof(m) === 'number') {
	    result = m % n;
	    if (n < 0) {
		if (result <= 0)
		    return result;
		else
		    return result + n;
	    } else {
		if (result < 0)
		    return result + n;
		else
		    return result;
	    }
	}
	result = _integerModulo(floor(m), floor(n));
	// The sign of the result should match the sign of n.
	if (lessThan(n, 0)) {
	    if (lessThanOrEqual(result, 0)) {
		return result;
	    }
	    return add(result, n);

	} else {
	    if (lessThan(result, 0)) {
		return add(result, n);
	    }
	    return result;
	}
    };



    // numerator: scheme-number -> scheme-number
    var numerator = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.numerator();
    };


    // denominator: scheme-number -> scheme-number
    var denominator = function(n) {
	if (typeof(n) === 'number')
	    return 1;
	return n.denominator();
    };

    // sqrt: scheme-number -> scheme-number
    var sqrt = function(n) {
	if (typeof(n) === 'number') {
	    if (n >= 0) {
		var result = Math.sqrt(n);
		if (Math.floor(result) === result) {
		    return result;
		} else {
		    return FloatPoint.makeInstance(result);
		}
	    } else {
		return (Complex.makeInstance(0, sqrt(-n)));
	    }
	}
	return n.sqrt();
    };

    // abs: scheme-number -> scheme-number
    var abs = function(n) {
	if (typeof(n) === 'number') {
	    return Math.abs(n);
	}
	return n.abs();
    };

    // floor: scheme-number -> scheme-number
    var floor = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.floor();
    };

    // ceiling: scheme-number -> scheme-number
    var ceiling = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.ceiling();
    };

    // conjugate: scheme-number -> scheme-number
    var conjugate = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.conjugate();
    };

    // magnitude: scheme-number -> scheme-number
    var magnitude = function(n) {
	if (typeof(n) === 'number')
	    return Math.abs(n);
	return n.magnitude();
    };


    // log: scheme-number -> scheme-number
    var log = function(n) {
	if ( eqv(n, 1) ) {
		return 0;
	}
	if (typeof(n) === 'number') {
	    return FloatPoint.makeInstance(Math.log(n));
	}
	return n.log();
    };

    // angle: scheme-number -> scheme-number
    var angle = function(n) {
	if (typeof(n) === 'number') {
	    if (n > 0)
		return 0;
	    else
		return FloatPoint.pi;
	}
	return n.angle();
    };

    // tan: scheme-number -> scheme-number
    var tan = function(n) {
	if (eqv(n, 0)) { return 0; }
	if (typeof(n) === 'number') {
	    return FloatPoint.makeInstance(Math.tan(n));
	}
	return n.tan();
    };

    // atan: scheme-number -> scheme-number
    var atan = function(n) {
	if (eqv(n, 0)) { return 0; }
	if (typeof(n) === 'number') {
	    return FloatPoint.makeInstance(Math.atan(n));
	}
	return n.atan();
    };

    // cos: scheme-number -> scheme-number
    var cos = function(n) {
	if (eqv(n, 0)) { return 1; }
	if (typeof(n) === 'number') {
	    return FloatPoint.makeInstance(Math.cos(n));
	}
	return n.cos();
    };

    // sin: scheme-number -> scheme-number
    var sin = function(n) {
	if (eqv(n, 0)) { return 0; }
	if (typeof(n) === 'number') {
	    return FloatPoint.makeInstance(Math.sin(n));
	}
	return n.sin();
    };

    // acos: scheme-number -> scheme-number
    var acos = function(n) {
	if (eqv(n, 1)) { return 0; }
	if (typeof(n) === 'number') {
	    return FloatPoint.makeInstance(Math.acos(n));
	}
	return n.acos();
    };

    // asin: scheme-number -> scheme-number
    var asin = function(n) {
        if (eqv(n, 0)) { return 0; }
	if (typeof(n) === 'number') {
	    return FloatPoint.makeInstance(Math.asin(n));
	}
	return n.asin();
    };

    // imaginaryPart: scheme-number -> scheme-number
    var imaginaryPart = function(n) {
	if (typeof(n) === 'number') {
	    return 0;
	}
	return n.imaginaryPart();
    };

    // realPart: scheme-number -> scheme-number
    var realPart = function(n) {
	if (typeof(n) === 'number') {
	    return n;
	}
	return n.realPart();
    };

    // round: scheme-number -> scheme-number
    var round = function(n) {
	if (typeof(n) === 'number') {
	    return n;
	}
	return n.round();
    };



    // sqr: scheme-number -> scheme-number
    var sqr = function(x) {
	return multiply(x, x);
    };


    // integerSqrt: scheme-number -> scheme-number
    var integerSqrt = function(x) {
	if (! isInteger(x)) {
	    throwRuntimeError('integer-sqrt: the argument ' + x.toString() +
			      " is not an integer.", x);
	}
	if (typeof (x) === 'number') {
	    if(x < 0) {
	        return Complex.makeInstance(0,
					    Math.floor(Math.sqrt(-x)))
	    } else {
		return Math.floor(Math.sqrt(x));
	    }
	}
	return x.integerSqrt();
    };


    // gcd: scheme-number [scheme-number ...] -> scheme-number
    var gcd = function(first, rest) {
	if (! isInteger(first)) {
	    throwRuntimeError('gcd: the argument ' + first.toString() +
			      " is not an integer.", first);
	}
	var a = abs(first), t, b;
	for(var i = 0; i < rest.length; i++) {
	    b = abs(rest[i]);	
	    if (! isInteger(b)) {
		throwRuntimeError('gcd: the argument ' + b.toString() +
				  " is not an integer.", b);
	    }
	    while (! _integerIsZero(b)) {
		t = a;
		a = b;
		b = _integerModulo(t, b);
	    }
	}
	return a;
    };

    // lcm: scheme-number [scheme-number ...] -> scheme-number
    var lcm = function(first, rest) {
	if (! isInteger(first)) {
	    throwRuntimeError('lcm: the argument ' + first.toString() +
			      " is not an integer.", first);
	}
	var result = abs(first);
	if (_integerIsZero(result)) { return 0; }
	for (var i = 0; i < rest.length; i++) {
	    if (! isInteger(rest[i])) {
		throwRuntimeError('lcm: the argument ' + rest[i].toString() +
				  " is not an integer.", rest[i]);
	    }
	    var divisor = _integerGcd(result, rest[i]);
	    if (_integerIsZero(divisor)) {
		return 0;
	    }
	    result = divide(multiply(result, rest[i]), divisor);
	}
	return result;
    };
    

    var quotient = function(x, y) {
 	if (! isInteger(x)) {
	    throwRuntimeError('quotient: the first argument ' + x.toString() +
			      " is not an integer.", x);
	}
	if (! isInteger(y)) {
	    throwRuntimeError('quotient: the second argument ' + y.toString() +
			      " is not an integer.", y);
	}
	return _integerQuotient(x, y);
    };

    
    var remainder = function(x, y) {
	if (! isInteger(x)) {
	    throwRuntimeError('remainder: the first argument ' + x.toString() +
			      " is not an integer.", x);
	}
	if (! isInteger(y)) {
	    throwRuntimeError('remainder: the second argument ' + y.toString() +
			      " is not an integer.", y);
	}
	return _integerRemainder(x, y);
    };


    // Implementation of the hyperbolic functions
    // http://en.wikipedia.org/wiki/Hyperbolic_cosine
    var cosh = function(x) {
	if (eqv(x, 0)) {
	    return FloatPoint.makeInstance(1.0);
	}
	return divide(add(exp(x), exp(negate(x))),
		      2);
    };
	
    var sinh = function(x) {
	return divide(subtract(exp(x), exp(negate(x))),
		      2);
    };


        
    var makeComplexPolar = function(r, theta) {
	// special case: if theta is zero, just return
	// the scalar.
	if (eqv(theta, 0)) {
	    return r;
	}
	return Complex.makeInstance(multiply(r, cos(theta)),
				    multiply(r, sin(theta)));
    };



    //////////////////////////////////////////////////////////////////////

    // Helpers


    // IsFinite: scheme-number -> boolean
    // Returns true if the scheme number is finite or not.
    var isSchemeNumberFinite = function(n) {
	if (typeof(n) === 'number') {
	    return isFinite(n);
	} else {
	    return n.isFinite();
	}
    };

    // isOverflow: javascript-number -> boolean
    // Returns true if we consider the number an overflow.
    var MIN_FIXNUM = -(9e15);
    var MAX_FIXNUM = (9e15);
    var isOverflow = function(n) {
	return (n < MIN_FIXNUM ||  MAX_FIXNUM < n);
    };


    // negate: scheme-number -> scheme-number
    // multiplies a number times -1.
    var negate = function(n) {
	if (typeof(n) === 'number') {
	    return -n;
	}
	return n.negate();
    };


    // halve: scheme-number -> scheme-number
    // Divide a number by 2.
    var halve = function(n) {
	return divide(n, 2);
    };


    // timesI: scheme-number scheme-number
    // multiplies a number times i.
    var timesI = function(x) {
	return multiply(x, plusI);
    };


    // fastExpt: computes n^k by squaring.
    // n^k = (n^2)^(k/2)
    // Assumes k is non-negative integer.
    var fastExpt = function(n, k) {
	var acc = 1;
	while (true) {
	    if (_integerIsZero(k)) {
		return acc;
	    }
	    if (equals(modulo(k, 2), 0)) {
		n = multiply(n, n);
		k = divide(k, 2);
	    } else {
		acc = multiply(acc, n);
		k = subtract(k, 1);
	    }
	}
    };



    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////


    // Integer operations
    // Integers are either represented as fixnums or as BigIntegers.

    // makeIntegerBinop: (fixnum fixnum -> X) (BigInteger BigInteger -> X) -> X
    // Helper to collect the common logic for coersing integer fixnums or bignums to a
    // common type before doing an operation.
    var makeIntegerBinop = function(onFixnums, onBignums, options) {
	options = options || {};
	return (function(m, n) {
	    if (m instanceof Rational) {
		m = numerator(m);
	    } else if (m instanceof Complex) {
		m = realPart(m);
	    }

	    if (n instanceof Rational) {
		n = numerator(n);
	    }else if (n instanceof Complex) {
		n = realPart(n);
	    }

	    if (typeof(m) === 'number' && typeof(n) === 'number') {
		var result = onFixnums(m, n);
		if (! isOverflow(result) ||
		    (options.ignoreOverflow)) {
		    return result;
		}
	    }
	    if (m instanceof FloatPoint || n instanceof FloatPoint) {
		if (options.doNotCoerseToFloating) {
		    return onFixnums(toFixnum(m), toFixnum(n));
		}
		else {
		    return FloatPoint.makeInstance(
			onFixnums(toFixnum(m), toFixnum(n)));
		}
	    }
	    if (typeof(m) === 'number') {
		m = makeBignum(m);
	    }
	    if (typeof(n) === 'number') {
		n = makeBignum(n);
	    }
	    return onBignums(m, n);
	});
    };


    var makeIntegerUnOp = function(onFixnums, onBignums, options) {
	options = options || {};
	return (function(m) {
	    if (m instanceof Rational) {
		m = numerator(m);
	    } else if (m instanceof Complex) {
		m = realPart(m);
	    }

	    if (typeof(m) === 'number') {
		var result = onFixnums(m);
		if (! isOverflow(result) ||
		    (options.ignoreOverflow)) {
		    return result;
		}
	    }
	    if (m instanceof FloatPoint) {
		return onFixnums(toFixnum(m));
	    }
	    if (typeof(m) === 'number') {
		m = makeBignum(m);
	    }
	    return onBignums(m);
	});
    };



    // _integerModulo: integer-scheme-number integer-scheme-number -> integer-scheme-number
    var _integerModulo = makeIntegerBinop(
	function(m, n) {
	    return m % n;
	},
	function(m, n) {
	    return bnMod.call(m, n);
	});


    // _integerGcd: integer-scheme-number integer-scheme-number -> integer-scheme-number
    var _integerGcd = makeIntegerBinop(
	function(a, b) {
	    var t;
	    while (b !== 0) {
		t = a;
		a = b;
		b = t % b;
	    }
	    return a;
	},
	function(m, n) {
	    return bnGCD.call(m, n);
	});


    // _integerIsZero: integer-scheme-number -> boolean
    // Returns true if the number is zero.
    var _integerIsZero = makeIntegerUnOp(
	function(n){
	    return n === 0;
	},
	function(n) {
	    return bnEquals.call(n, BigInteger.ZERO);
	}
    );


    // _integerIsOne: integer-scheme-number -> boolean
    var _integerIsOne = makeIntegerUnOp(
	function(n) {
	    return n === 1;
	},
	function(n) {
	    return bnEquals.call(n, BigInteger.ONE);
	});
    

 
    // _integerIsNegativeOne: integer-scheme-number -> boolean
    var _integerIsNegativeOne = makeIntegerUnOp(
	function(n) {
	    return n === -1;
	},
	function(n) {
	    return bnEquals.call(n, BigInteger.NEGATIVE_ONE);
	});
    


    // _integerAdd: integer-scheme-number integer-scheme-number -> integer-scheme-number
    var _integerAdd = makeIntegerBinop(
	function(m, n) {
	    return m + n;
	},
	function(m, n) {
	    return bnAdd.call(m, n);
	});

    // _integerSubtract: integer-scheme-number integer-scheme-number -> integer-scheme-number
    var _integerSubtract = makeIntegerBinop(
	function(m, n) {
	    return m - n;
	},
	function(m, n) {
	    return bnSubtract.call(m, n);
	});

    // _integerMultiply: integer-scheme-number integer-scheme-number -> integer-scheme-number
    var _integerMultiply = makeIntegerBinop(
	function(m, n) {
	    return m * n;
	},
	function(m, n) {
	    return bnMultiply.call(m, n);
	});

    //_integerQuotient: integer-scheme-number integer-scheme-number -> integer-scheme-number
    var _integerQuotient = makeIntegerBinop(
	function(m, n) {
	    return ((m - (m % n))/ n);
	},
	function(m, n) {
            return bnDivide.call(m, n);
	});

    var _integerRemainder = makeIntegerBinop(
	function(m, n) {
	    return m % n;
	},
	function(m, n) {
	    return bnRemainder.call(m, n);
	});


    // _integerDivideToFixnum: integer-scheme-number integer-scheme-number -> fixnum
    var _integerDivideToFixnum = makeIntegerBinop(
	function(m, n) {
	    return m / n;
	},
	function(m, n) {
	    return toFixnum(m) / toFixnum(n);
	},
	{ignoreOverflow: true,
	 doNotCoerseToFloating: true});


    // _integerEquals: integer-scheme-number integer-scheme-number -> boolean
    var _integerEquals = makeIntegerBinop(
	function(m, n) {
	    return m === n;
	},
	function(m, n) {
	    return bnEquals.call(m, n);
	},
	{doNotCoerseToFloating: true});

    // _integerGreaterThan: integer-scheme-number integer-scheme-number -> boolean
    var _integerGreaterThan = makeIntegerBinop(
	function(m, n) {
	    return m > n;
	},
	function(m, n) {
	    return bnCompareTo.call(m, n) > 0;
	},
	{doNotCoerseToFloating: true});

    // _integerLessThan: integer-scheme-number integer-scheme-number -> boolean
    var _integerLessThan = makeIntegerBinop(
	function(m, n) {
	    return m < n;
	},
	function(m, n) {
	    return bnCompareTo.call(m, n) < 0;
	},
	{doNotCoerseToFloating: true});

    // _integerGreaterThanOrEqual: integer-scheme-number integer-scheme-number -> boolean
    var _integerGreaterThanOrEqual = makeIntegerBinop(
	function(m, n) {
	    return m >= n;
	},
	function(m, n) {
	    return bnCompareTo.call(m, n) >= 0;
	},
	{doNotCoerseToFloating: true});

    // _integerLessThanOrEqual: integer-scheme-number integer-scheme-number -> boolean
    var _integerLessThanOrEqual = makeIntegerBinop(
	function(m, n) {
	    return m <= n;
	},
	function(m, n) {
	    return bnCompareTo.call(m, n) <= 0;
	},
	{doNotCoerseToFloating: true});



    //////////////////////////////////////////////////////////////////////
    // The boxed number types are expected to implement the following
    // interface.
    //
    // toString: -> string

    // level: number

    // liftTo: scheme-number -> scheme-number

    // isFinite: -> boolean

    // isInteger: -> boolean
    // Produce true if this number can be coersed into an integer.

    // isRational: -> boolean
    // Produce true if the number is rational.

    // isReal: -> boolean
    // Produce true if the number is real.

    // isExact: -> boolean
    // Produce true if the number is exact

    // toExact: -> scheme-number
    // Produce an exact number.

    // toFixnum: -> javascript-number
    // Produce a javascript number.

    // greaterThan: scheme-number -> boolean
    // Compare against instance of the same type.

    // greaterThanOrEqual: scheme-number -> boolean
    // Compare against instance of the same type.

    // lessThan: scheme-number -> boolean
    // Compare against instance of the same type.

    // lessThanOrEqual: scheme-number -> boolean
    // Compare against instance of the same type.

    // add: scheme-number -> scheme-number
    // Add with an instance of the same type.

    // subtract: scheme-number -> scheme-number
    // Subtract with an instance of the same type.

    // multiply: scheme-number -> scheme-number
    // Multiply with an instance of the same type.

    // divide: scheme-number -> scheme-number
    // Divide with an instance of the same type.

    // numerator: -> scheme-number
    // Return the numerator.

    // denominator: -> scheme-number
    // Return the denominator.

    // integerSqrt: -> scheme-number
    // Produce the integer square root.

    // sqrt: -> scheme-number
    // Produce the square root.

    // abs: -> scheme-number
    // Produce the absolute value.

    // floor: -> scheme-number
    // Produce the floor.

    // ceiling: -> scheme-number
    // Produce the ceiling.

    // conjugate: -> scheme-number
    // Produce the conjugate.

    // magnitude: -> scheme-number
    // Produce the magnitude.

    // log: -> scheme-number
    // Produce the log.

    // angle: -> scheme-number
    // Produce the angle.

    // atan: -> scheme-number
    // Produce the arc tangent.

    // cos: -> scheme-number
    // Produce the cosine.

    // sin: -> scheme-number
    // Produce the sine.

    // expt: scheme-number -> scheme-number
    // Produce the power to the input.

    // exp: -> scheme-number
    // Produce e raised to the given power.

    // acos: -> scheme-number
    // Produce the arc cosine.

    // asin: -> scheme-number
    // Produce the arc sine.

    // imaginaryPart: -> scheme-number
    // Produce the imaginary part

    // realPart: -> scheme-number
    // Produce the real part.

    // round: -> scheme-number
    // Round to the nearest integer.

    // equals: scheme-number -> boolean
    // Produce true if the given number of the same type is equal.



    //////////////////////////////////////////////////////////////////////

    // Rationals


    var Rational = function(n, d) {
	this.n = n;
	this.d = d;
    };


    Rational.prototype.toString = function() {
	if (_integerIsOne(this.d)) {
	    return this.n.toString() + "";
	} else {
	    return this.n.toString() + "/" + this.d.toString();
	}
    };


    Rational.prototype.level = 1;


    Rational.prototype.liftTo = function(target) {
	if (target.level === 2)
	    return new FloatPoint(
		_integerDivideToFixnum(this.n, this.d));
	if (target.level === 3)
	    return new Complex(this, 0);
	return throwRuntimeError("invalid level of Number", this, target);
    };

    Rational.prototype.isFinite = function() {
	return true;
    };

    Rational.prototype.equals = function(other) {
	return (other instanceof Rational &&
		_integerEquals(this.n, other.n) &&
		_integerEquals(this.d, other.d));
    };



    Rational.prototype.isInteger = function() {
	return _integerIsOne(this.d);
    };

    Rational.prototype.isRational = function() {
        return true;
    };

    Rational.prototype.isReal = function() {
	return true;
    };


    Rational.prototype.add = function(other) {
	return Rational.makeInstance(_integerAdd(_integerMultiply(this.n, other.d),
						 _integerMultiply(this.d, other.n)),
				     _integerMultiply(this.d, other.d));
    };

    Rational.prototype.subtract = function(other) {
	return Rational.makeInstance(_integerSubtract(_integerMultiply(this.n, other.d),
						      _integerMultiply(this.d, other.n)),
				     _integerMultiply(this.d, other.d));
    };

    Rational.prototype.negate = function() { 
	return Rational.makeInstance(-this.n, this.d) 
    };

    Rational.prototype.multiply = function(other) {
	return Rational.makeInstance(_integerMultiply(this.n, other.n),
				     _integerMultiply(this.d, other.d));
    };

    Rational.prototype.divide = function(other) {
	if (_integerIsZero(this.d) || _integerIsZero(other.n)) {
	    throwRuntimeError("/: division by zero", this, other);
	}
	return Rational.makeInstance(_integerMultiply(this.n, other.d),
				     _integerMultiply(this.d, other.n));
    };


    Rational.prototype.toExact = function() {
	return this;
    };

    Rational.prototype.toInexact = function() {
	return FloatPoint.makeInstance(this.toFixnum());
    };


    Rational.prototype.isExact = function() {
        return true;
    };

    Rational.prototype.isInexact = function() {
        return false;
    };


    Rational.prototype.toFixnum = function() {
	return _integerDivideToFixnum(this.n, this.d);
    };

    Rational.prototype.numerator = function() {
	return this.n;
    };

    Rational.prototype.denominator = function() {
	return this.d;
    };

    Rational.prototype.greaterThan = function(other) {
	return _integerGreaterThan(_integerMultiply(this.n, other.d),
				   _integerMultiply(this.d, other.n));
    };

    Rational.prototype.greaterThanOrEqual = function(other) {
	return _integerGreaterThanOrEqual(_integerMultiply(this.n, other.d),
					  _integerMultiply(this.d, other.n));
    };

    Rational.prototype.lessThan = function(other) {
	return _integerLessThan(_integerMultiply(this.n, other.d),
				_integerMultiply(this.d, other.n));
    };

    Rational.prototype.lessThanOrEqual = function(other) {
	return _integerLessThanOrEqual(_integerMultiply(this.n, other.d),
				       _integerMultiply(this.d, other.n));
    };

    Rational.prototype.integerSqrt = function() {
	var result = sqrt(this);
	if (isRational(result)) {
	    return toExact(floor(result));
	} else if (isReal(result)) {
	    return toExact(floor(result));
	} else {
	    return Complex.makeInstance(toExact(floor(realPart(result))),
					toExact(floor(imaginaryPart(result))));
	}
    };


    Rational.prototype.sqrt = function() {
	if (_integerGreaterThanOrEqual(this.n,  0)) {
	    var newN = sqrt(this.n);
	    var newD = sqrt(this.d);
	    if (equals(floor(newN), newN) &&
		equals(floor(newD), newD)) {
		return Rational.makeInstance(newN, newD);
	    } else {
		return FloatPoint.makeInstance(_integerDivideToFixnum(newN, newD));
	    }
	} else {
	    var newN = sqrt(negate(this.n));
	    var newD = sqrt(this.d);
	    if (equals(floor(newN), newN) &&
		equals(floor(newD), newD)) {
		return Complex.makeInstance(
		    0,
		    Rational.makeInstance(newN, newD));
	    } else {
		return Complex.makeInstance(
		    0,
		    FloatPoint.makeInstance(_integerDivideToFixnum(newN, newD)));
	    }
	}
    };

    Rational.prototype.abs = function() {
	return Rational.makeInstance(abs(this.n),
				     this.d);
    };


    Rational.prototype.floor = function() {
	var quotient = _integerQuotient(this.n, this.d);
	if (_integerLessThan(this.n, 0)) {
	    return subtract(quotient, 1);
	} else {
	    return quotient;
	}
    };


    Rational.prototype.ceiling = function() {
	var quotient = _integerQuotient(this.n, this.d);
	if (_integerLessThan(this.n, 0)) {
	    return quotient;
	} else {
	    return add(quotient, 1);
	}
    };

    Rational.prototype.conjugate = function() {
	return this;
    };

    Rational.prototype.magnitude = Rational.prototype.abs;

    Rational.prototype.log = function(){
	return FloatPoint.makeInstance(Math.log(this.n / this.d));
    };

    Rational.prototype.angle = function(){
	if (_integerIsZero(this.n))
	    return 0;
	if (_integerGreaterThan(this.n, 0))
	    return 0;
	else
	    return FloatPoint.pi;
    };

    Rational.prototype.tan = function(){
	return FloatPoint.makeInstance(Math.tan(_integerDivideToFixnum(this.n, this.d)));
    };

    Rational.prototype.atan = function(){
	return FloatPoint.makeInstance(Math.atan(_integerDivideToFixnum(this.n, this.d)));
    };

    Rational.prototype.cos = function(){
	return FloatPoint.makeInstance(Math.cos(_integerDivideToFixnum(this.n, this.d)));
    };

    Rational.prototype.sin = function(){
	return FloatPoint.makeInstance(Math.sin(_integerDivideToFixnum(this.n, this.d)));
    };

    Rational.prototype.expt = function(a){
	if (isExactInteger(a) && greaterThanOrEqual(a, 0)) {
	    return fastExpt(this, a);
	}
	return FloatPoint.makeInstance(Math.pow(_integerDivideToFixnum(this.n, this.d),
						_integerDivideToFixnum(a.n, a.d)));
    };

    Rational.prototype.exp = function(){
	return FloatPoint.makeInstance(Math.exp(_integerDivideToFixnum(this.n, this.d)));
    };

    Rational.prototype.acos = function(){
	return FloatPoint.makeInstance(Math.acos(_integerDivideToFixnum(this.n, this.d)));
    };

    Rational.prototype.asin = function(){
	return FloatPoint.makeInstance(Math.asin(_integerDivideToFixnum(this.n, this.d)));
    };

    Rational.prototype.imaginaryPart = function(){
	return 0;
    };

    Rational.prototype.realPart = function(){
	return this;
    };


   Rational.prototype.round = function() {
     var halfintp = equals(this.d, 2);
     var negativep = _integerLessThan(this.n, 0);
     var n = this.n;
     if (negativep) {
       n = negate(n);
     }
     var quo = _integerQuotient(n, this.d);
     if (halfintp) {
       // rounding half to away from 0
       // uncomment following if rounding half to even
       // if (_integerIsOne(_integerModulo(quo, 2)))
       quo = add(quo, 1);
     } else {
       var rem = _integerRemainder(n, this.d);
       if (greaterThan(multiply(rem, 2), this.d)) {
         quo = add(quo, 1);
       }
     }
     if (negativep) {
       quo = negate(quo);
     }
     return quo;
   };

    Rational.makeInstance = function(n, d) {
	if (n === undefined)
	    throwRuntimeError("n undefined", n, d);

	if (d === undefined) { d = 1; }

	if (_integerIsZero(d)) {
	    throwRuntimeError("division by zero: "+n+"/"+d);
	}

  if (_integerLessThan(d, 0)) {
	    n = negate(n);
	    d = negate(d);
	}

	var divisor = _integerGcd(abs(n), abs(d));
	n = _integerQuotient(n, divisor);
	d = _integerQuotient(d, divisor);

	// Optimization: if we can get around construction the rational
	// in favor of just returning n, do it:
	if (_integerIsOne(d) || _integerIsZero(n)) {
	    return n;
	}

	return new Rational(n, d);
    };



    // Floating Point numbers
    var FloatPoint = function(n) {
	this.n = n;
    };
    FloatPoint = FloatPoint;


    var NaN = new FloatPoint(Number.NaN);
    var inf = new FloatPoint(Number.POSITIVE_INFINITY);
    var neginf = new FloatPoint(Number.NEGATIVE_INFINITY);

    // We use these two constants to represent the floating-point coersion
    // of bignums that can't be represented with fidelity.
    var TOO_POSITIVE_TO_REPRESENT = new FloatPoint(Number.POSITIVE_INFINITY);
    var TOO_NEGATIVE_TO_REPRESENT = new FloatPoint(Number.NEGATIVE_INFINITY);

    // Negative zero is a distinguished value representing -0.0.
    // There should only be one instance for -0.0.
    var NEGATIVE_ZERO = new FloatPoint(-0.0);
    var INEXACT_ZERO = new FloatPoint(0.0);

    FloatPoint.pi = new FloatPoint(Math.PI);
    FloatPoint.e = new FloatPoint(Math.E);
    FloatPoint.nan = NaN;
    FloatPoint.inf = inf;
    FloatPoint.neginf = neginf;

    FloatPoint.makeInstance = function(n) {
	if (isNaN(n)) {
	    return FloatPoint.nan;
	} else if (n === Number.POSITIVE_INFINITY) {
	    return FloatPoint.inf;
	} else if (n === Number.NEGATIVE_INFINITY) {
	    return FloatPoint.neginf;
	} else if (n === 0) {
	    if ((1/n) === -Infinity) {
		return NEGATIVE_ZERO;
	    } else {
		return INEXACT_ZERO;
	    }
	}
	return new FloatPoint(n);
    };

    FloatPoint.prototype.isExact = function() {
	return false;
    };

    FloatPoint.prototype.isInexact = function() {
	return true;
    };


    FloatPoint.prototype.isFinite = function() {
	return (isFinite(this.n) ||
		this === TOO_POSITIVE_TO_REPRESENT ||
		this === TOO_NEGATIVE_TO_REPRESENT);
    };


    FloatPoint.prototype.toExact = function() {
	// The precision of ieee is about 16 decimal digits, which we use here.
	if (! isFinite(this.n) || isNaN(this.n)) {
	    throwRuntimeError("toExact: no exact representation for " + this, this);
	}

	var stringRep = this.n.toString();
	var match = stringRep.match(/^(.*)\.(.*)$/);
	if (match) {
	    var intPart = parseInt(match[1]);
	    var fracPart = parseInt(match[2]);
	    var tenToDecimalPlaces = Math.pow(10, match[2].length);
	    return Rational.makeInstance(Math.round(this.n * tenToDecimalPlaces),
					 tenToDecimalPlaces);
	}
	else {
	    return this.n;
	}
    };

    FloatPoint.prototype.toInexact = function() {
	return this;
    };

    FloatPoint.prototype.isInexact = function() {
	return true;
    };


    FloatPoint.prototype.level = 2;


    FloatPoint.prototype.liftTo = function(target) {
	if (target.level === 3)
	    return new Complex(this, 0);
	return throwRuntimeError("invalid level of Number", this, target);
    };

    FloatPoint.prototype.toString = function() {
	if (isNaN(this.n))
	    return "+nan.0";
	if (this.n === Number.POSITIVE_INFINITY)
	    return "+inf.0";
	if (this.n === Number.NEGATIVE_INFINITY)
	    return "-inf.0";
	if (this === NEGATIVE_ZERO)
	    return "-0.0";
	var partialResult = this.n.toString();
	if (! partialResult.match('\\.')) {
	    return partialResult + ".0";
	} else {
	    return partialResult;
	}
    };


    FloatPoint.prototype.equals = function(other, aUnionFind) {
	return ((other instanceof FloatPoint) &&
		((this.n === other.n)));
    };



    FloatPoint.prototype.isRational = function() {
        return this.isFinite();
    };

    FloatPoint.prototype.isInteger = function() {
	return this.isFinite() && this.n === Math.floor(this.n);
    };

    FloatPoint.prototype.isReal = function() {
	return true;
    };


    // sign: Number -> {-1, 0, 1}
    var sign = function(n) {
	if (lessThan(n, 0)) {
	    return -1;
	} else if (greaterThan(n, 0)) {
	    return 1;
	} else if (n === NEGATIVE_ZERO) {
	    return -1;
	} else {
	    return 0;
	}
    };


    FloatPoint.prototype.add = function(other) {
	if (this.isFinite() && other.isFinite()) {
	    return FloatPoint.makeInstance(this.n + other.n);
	} else {
	    if (isNaN(this.n) || isNaN(other.n)) {
		return NaN;
	    } else if (this.isFinite() && ! other.isFinite()) {
		return other;
	    } else if (!this.isFinite() && other.isFinite()) {
		return this;
	    } else {
		return ((sign(this) * sign(other) === 1) ?
			this : NaN);
	    };
	}
    };

    FloatPoint.prototype.subtract = function(other) {
	if (this.isFinite() && other.isFinite()) {
	    return FloatPoint.makeInstance(this.n - other.n);
	} else if (isNaN(this.n) || isNaN(other.n)) {
	    return NaN;
	} else if (! this.isFinite() && ! other.isFinite()) {
	    if (sign(this) === sign(other)) {
		return NaN;
	    } else {
		return this;
	    }
	} else if (this.isFinite()) {
	    return multiply(other, -1);
	} else {  // other.isFinite()
	    return this;
	}
    };


    FloatPoint.prototype.negate = function() {
	return FloatPoint.makeInstance(-this.n);
    };

    FloatPoint.prototype.multiply = function(other) {
	return FloatPoint.makeInstance(this.n * other.n);
    };

    FloatPoint.prototype.divide = function(other) {
        return FloatPoint.makeInstance(this.n / other.n);
    };


    FloatPoint.prototype.toFixnum = function() {
	return this.n;
    };

    FloatPoint.prototype.numerator = function() {
	var stringRep = this.n.toString();
	var match = stringRep.match(/^(.*)\.(.*)$/);
	if (match) {
	    var afterDecimal = parseInt(match[2]);
	    var factorToInt = Math.pow(10, match[2].length);
	    var extraFactor = _integerGcd(factorToInt, afterDecimal);
	    var multFactor = factorToInt / extraFactor;
	    return FloatPoint.makeInstance( Math.round(this.n * multFactor) );
	} else {
	    return this;
	}
    };

    FloatPoint.prototype.denominator = function() {
	var stringRep = this.n.toString();
	var match = stringRep.match(/^(.*)\.(.*)$/);
	if (match) {
	    var afterDecimal = parseInt(match[2]);
	    var factorToInt = Math.pow(10, match[2].length);
	    var extraFactor = _integerGcd(factorToInt, afterDecimal);
	    return FloatPoint.makeInstance( Math.round(factorToInt/extraFactor) );
	} else {
	    return FloatPoint.makeInstance(1);
	}
    };


    FloatPoint.prototype.floor = function() {
	return FloatPoint.makeInstance(Math.floor(this.n));
    };

    FloatPoint.prototype.ceiling = function() {
	return FloatPoint.makeInstance(Math.ceil(this.n));
    };


    FloatPoint.prototype.greaterThan = function(other) {
	return this.n > other.n;
    };

    FloatPoint.prototype.greaterThanOrEqual = function(other) {
	return this.n >= other.n;
    };

    FloatPoint.prototype.lessThan = function(other) {
	return this.n < other.n;
    };

    FloatPoint.prototype.lessThanOrEqual = function(other) {
	return this.n <= other.n;
    };


    FloatPoint.prototype.integerSqrt = function() {
	if (this === NEGATIVE_ZERO) { return this; }
	if (isInteger(this)) {
	    if(this.n >= 0) {
	        return FloatPoint.makeInstance(Math.floor(Math.sqrt(this.n)));
	    } else {
	        return Complex.makeInstance(
		    INEXACT_ZERO,
		    FloatPoint.makeInstance(Math.floor(Math.sqrt(-this.n))));
	    }
	} else {
	    throwRuntimeError("integerSqrt: can only be applied to an integer", this);
	}
    };

    FloatPoint.prototype.sqrt = function() {
	if (this.n < 0) {
	    var result = Complex.makeInstance(
		0,
		FloatPoint.makeInstance(Math.sqrt(-this.n)));
	    return result;
	} else {
	    return FloatPoint.makeInstance(Math.sqrt(this.n));
	}
    };

    FloatPoint.prototype.abs = function() {
	return FloatPoint.makeInstance(Math.abs(this.n));
    };



    FloatPoint.prototype.log = function(){
	if (this.n < 0)
	    return (new Complex(this, 0)).log();
	else
	    return FloatPoint.makeInstance(Math.log(this.n));
    };

    FloatPoint.prototype.angle = function(){
	if (0 === this.n)
	    return 0;
	if (this.n > 0)
	    return 0;
	else
	    return FloatPoint.pi;
    };

    FloatPoint.prototype.tan = function(){
	return FloatPoint.makeInstance(Math.tan(this.n));
    };

    FloatPoint.prototype.atan = function(){
	return FloatPoint.makeInstance(Math.atan(this.n));
    };

    FloatPoint.prototype.cos = function(){
	return FloatPoint.makeInstance(Math.cos(this.n));
    };

    FloatPoint.prototype.sin = function(){
	return FloatPoint.makeInstance(Math.sin(this.n));
    };

    FloatPoint.prototype.expt = function(a){
	if (this.n === 1) {
	    if (a.isFinite()) {
		return this;
	    } else if (isNaN(a.n)){
		return this;
	    } else {
		return this;
	    }
	} else {
	    return FloatPoint.makeInstance(Math.pow(this.n, a.n));
	}
    };

    FloatPoint.prototype.exp = function(){
	return FloatPoint.makeInstance(Math.exp(this.n));
    };

    FloatPoint.prototype.acos = function(){
	return FloatPoint.makeInstance(Math.acos(this.n));
    };

    FloatPoint.prototype.asin = function(){
	return FloatPoint.makeInstance(Math.asin(this.n));
    };

    FloatPoint.prototype.imaginaryPart = function(){
	return 0;
    };

    FloatPoint.prototype.realPart = function(){
	return this;
    };


    FloatPoint.prototype.round = function(){
	if (isFinite(this.n)) {
	    if (this === NEGATIVE_ZERO) {
		return this;
	    }
	    if (Math.abs(Math.floor(this.n) - this.n) === 0.5) {
		if (Math.floor(this.n) % 2 === 0)
		    return FloatPoint.makeInstance(Math.floor(this.n));
		return FloatPoint.makeInstance(Math.ceil(this.n));
	    } else {
		return FloatPoint.makeInstance(Math.round(this.n));
	    }
	} else {
	    return this;
	}
    };


    FloatPoint.prototype.conjugate = function() {
	return this;
    };

    FloatPoint.prototype.magnitude = FloatPoint.prototype.abs;



    //////////////////////////////////////////////////////////////////////
    // Complex numbers
    //////////////////////////////////////////////////////////////////////

    var Complex = function(r, i){
	this.r = r;
	this.i = i;
    };

    // Constructs a complex number from two basic number r and i.  r and i can
    // either be plt.type.Rational or plt.type.FloatPoint.
    Complex.makeInstance = function(r, i){
	if (i === undefined) { i = 0; }
	if (isExact(i) && isInteger(i) && _integerIsZero(i)) {
	    return r;
	}
	if (isInexact(r) || isInexact(i)) {
	    r = toInexact(r);
	    i = toInexact(i);
	}
	return new Complex(r, i);
    };

    Complex.prototype.toString = function() {
	var realPart = this.r.toString(), imagPart = this.i.toString();
	if (imagPart[0] === '-' || imagPart[0] === '+') {
	    return realPart + imagPart + 'i';
	} else {
	    return realPart + "+" + imagPart + 'i';
	}
    };


    Complex.prototype.isFinite = function() {
	return isSchemeNumberFinite(this.r) && isSchemeNumberFinite(this.i);
    };


    Complex.prototype.isRational = function() {
	return isRational(this.r) && eqv(this.i, 0);
    };

    Complex.prototype.isInteger = function() {
	return (isInteger(this.r) &&
		eqv(this.i, 0));
    };

    Complex.prototype.toExact = function() {
	return Complex.makeInstance( toExact(this.r), toExact(this.i) );
    };

    Complex.prototype.toInexact = function() {
	return Complex.makeInstance(toInexact(this.r),
				    toInexact(this.i));
    };


    Complex.prototype.isExact = function() {
        return isExact(this.r) && isExact(this.i);
    };


    Complex.prototype.isInexact = function() {
	return isInexact(this.r) || isInexact(this.i);
    };


    Complex.prototype.level = 3;


    Complex.prototype.liftTo = function(target){
	throwRuntimeError("Don't know how to lift Complex number", this, target);
    };

    Complex.prototype.equals = function(other) {
	var result = ((other instanceof Complex) &&
		      (equals(this.r, other.r)) &&
		      (equals(this.i, other.i)));
	return result;
    };



    Complex.prototype.greaterThan = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    throwRuntimeError(">: expects argument of type real number", this, other);
	}
	return greaterThan(this.r, other.r);
    };

    Complex.prototype.greaterThanOrEqual = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    throwRuntimeError(">=: expects argument of type real number", this, other);
	}
	return greaterThanOrEqual(this.r, other.r);
    };

    Complex.prototype.lessThan = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    throwRuntimeError("<: expects argument of type real number", this, other);
	}
	return lessThan(this.r, other.r);
    };

    Complex.prototype.lessThanOrEqual = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    throwRuntimeError("<=: expects argument of type real number", this, other);
	}
	return lessThanOrEqual(this.r, other.r);
    };


    Complex.prototype.abs = function(){
	if (!equals(this.i, 0).valueOf())
	    throwRuntimeError("abs: expects argument of type real number", this);
	return abs(this.r);
    };

    Complex.prototype.toFixnum = function(){
	if (!equals(this.i, 0).valueOf())
	    throwRuntimeError("toFixnum: expects argument of type real number", this);
	return toFixnum(this.r);
    };

    Complex.prototype.numerator = function() {
	if (!this.isReal())
	    throwRuntimeError("numerator: can only be applied to real number", this);
	return numerator(this.n);
    };


    Complex.prototype.denominator = function() {
	if (!this.isReal())
	    throwRuntimeError("floor: can only be applied to real number", this);
	return denominator(this.n);
    };

    Complex.prototype.add = function(other){
	return Complex.makeInstance(
	    add(this.r, other.r),
	    add(this.i, other.i));
    };

    Complex.prototype.subtract = function(other){
	return Complex.makeInstance(
	    subtract(this.r, other.r),
	    subtract(this.i, other.i));
    };

    Complex.prototype.negate = function() {
	return Complex.makeInstance(negate(this.r),
				    negate(this.i));
    };


    Complex.prototype.multiply = function(other){
	// If the other value is real, just do primitive division
	if (other.isReal()) {
	    return Complex.makeInstance(
		multiply(this.r, other.r),
		multiply(this.i, other.r));
	}
	var r = subtract(
	    multiply(this.r, other.r),
	    multiply(this.i, other.i));
	var i = add(
	    multiply(this.r, other.i),
	    multiply(this.i, other.r));
	return Complex.makeInstance(r, i);
    };





    Complex.prototype.divide = function(other){
	var a, b, c, d, r, x, y;
	// If the other value is real, just do primitive division
	if (other.isReal()) {
	    return Complex.makeInstance(
		divide(this.r, other.r),
		divide(this.i, other.r));
	}

	if (this.isInexact() || other.isInexact()) {
	    // http://portal.acm.org/citation.cfm?id=1039814
	    // We currently use Smith's method, though we should
	    // probably switch over to Priest's method.
	    a = this.r;
	    b = this.i;
	    c = other.r;
	    d = other.i;
	    if (lessThanOrEqual(abs(d), abs(c))) {
		r = divide(d, c);
		x = divide(add(a, multiply(b, r)),
			   add(c, multiply(d, r)));
		y = divide(subtract(b, multiply(a, r)),
			   add(c, multiply(d, r)));
	    } else {
		r = divide(c, d);
		x = divide(add(multiply(a, r), b),
			   add(multiply(c, r), d));
		y = divide(subtract(multiply(b, r), a),
			   add(multiply(c, r), d));
	    }
	    return Complex.makeInstance(x, y);
	} else {
	    var con = conjugate(other);
	    var up = multiply(this, con);

	    // Down is guaranteed to be real by this point.
	    var down = realPart(multiply(other, con));

	    var result = Complex.makeInstance(
		divide(realPart(up), down),
		divide(imaginaryPart(up), down));
	    return result;
	}
    };

    Complex.prototype.conjugate = function(){
	var result = Complex.makeInstance(
	    this.r,
	    subtract(0, this.i));

	return result;
    };

    Complex.prototype.magnitude = function(){
	var sum = add(
	    multiply(this.r, this.r),
	    multiply(this.i, this.i));
	return sqrt(sum);
    };

    Complex.prototype.isReal = function(){
	return eqv(this.i, 0);
    };

    Complex.prototype.integerSqrt = function() {
	if (isInteger(this)) {
	    return integerSqrt(this.r);
	} else {
	    throwRuntimeError("integerSqrt: can only be applied to an integer", this);
	}
    };

    Complex.prototype.sqrt = function(){
	if (this.isReal())
	    return sqrt(this.r);
	// http://en.wikipedia.org/wiki/Square_root#Square_roots_of_negative_and_complex_numbers
	var r_plus_x = add(this.magnitude(), this.r);

	var r = sqrt(halve(r_plus_x));

	var i = divide(this.i, sqrt(multiply(r_plus_x, 2)));


	return Complex.makeInstance(r, i);
    };

    Complex.prototype.log = function(){
	var m = this.magnitude();
	var theta = this.angle();
	var result = add(
	    log(m),
	    timesI(theta));
	return result;
    };

    Complex.prototype.angle = function(){
	if (this.isReal()) {
	    return angle(this.r);
	}
	if (equals(0, this.r)) {
	    var tmp = halve(FloatPoint.pi);
	    return greaterThan(this.i, 0) ?
		tmp : negate(tmp);
	} else {
	    var tmp = atan(divide(abs(this.i), abs(this.r)));
	    if (greaterThan(this.r, 0)) {
		return greaterThan(this.i, 0) ?
		    tmp : negate(tmp);
	    } else {
		return greaterThan(this.i, 0) ?
		    subtract(FloatPoint.pi, tmp) : subtract(tmp, FloatPoint.pi);
	    }
	}
    };

    var plusI = Complex.makeInstance(0, 1);
    var minusI = Complex.makeInstance(0, -1);


    Complex.prototype.tan = function() {
	return divide(this.sin(), this.cos());
    };

    Complex.prototype.atan = function(){
	if (equals(this, plusI) ||
	    equals(this, minusI)) {
	    return neginf;
	}
	return multiply(
	    plusI,
	    multiply(
		FloatPoint.makeInstance(0.5),
		log(divide(
		    add(plusI, this),
		    add(
			plusI,
			subtract(0, this))))));
    };

    Complex.prototype.cos = function(){
	if (this.isReal())
	    return cos(this.r);
	var iz = timesI(this);
	var iz_negate = negate(iz);

	return halve(add(exp(iz), exp(iz_negate)));
    };

    Complex.prototype.sin = function(){
	if (this.isReal())
	    return sin(this.r);
	var iz = timesI(this);
	var iz_negate = negate(iz);
	var z2 = Complex.makeInstance(0, 2);
	var exp_negate = subtract(exp(iz), exp(iz_negate));
	var result = divide(exp_negate, z2);
	return result;
    };


    Complex.prototype.expt = function(y){
	if (isExactInteger(y) && greaterThanOrEqual(y, 0)) {
	    return fastExpt(this, y);
	}
	var expo = multiply(y, this.log());
	return exp(expo);
    };

    Complex.prototype.exp = function(){
	var r = exp(this.r);
	var cos_a = cos(this.i);
	var sin_a = sin(this.i);

	return multiply(
	    r,
	    add(cos_a, timesI(sin_a)));
    };

    Complex.prototype.acos = function(){
	if (this.isReal())
	    return acos(this.r);
	var pi_half = halve(FloatPoint.pi);
	var iz = timesI(this);
	var root = sqrt(subtract(1, sqr(this)));
	var l = timesI(log(add(iz, root)));
	return add(pi_half, l);
    };

    Complex.prototype.asin = function(){
	if (this.isReal())
	    return asin(this.r);

	var oneNegateThisSq =
	    subtract(1, sqr(this));
	var sqrtOneNegateThisSq = sqrt(oneNegateThisSq);
	return multiply(2, atan(divide(this,
				       add(1, sqrtOneNegateThisSq))));
    };

    Complex.prototype.ceiling = function(){
	if (!this.isReal())
	    throwRuntimeError("ceiling: can only be applied to real number", this);
	return ceiling(this.r);
    };

    Complex.prototype.floor = function(){
	if (!this.isReal())
	    throwRuntimeError("floor: can only be applied to real number", this);
	return floor(this.r);
    };

    Complex.prototype.imaginaryPart = function(){
	return this.i;
    };

    Complex.prototype.realPart = function(){
	return this.r;
    };

    Complex.prototype.round = function(){
	if (!this.isReal())
	    throwRuntimeError("round: can only be applied to real number", this);
	return round(this.r);
    };



    var hashModifiersRegexp = new RegExp("^(#[ei]#[bodx]|#[bodx]#[ei]|#[bodxei])(.*)$")
    function rationalRegexp(digits) { return new RegExp("^([+-]?["+digits+"]+)/(["+digits+"]+)$"); }
    function matchComplexRegexp(radix, x) {
	var sign = "[+-]";
	var maybeSign = "[+-]?";
	var digits = digitsForRadix(radix)
	var expmark = "["+expMarkForRadix(radix)+"]"
	var digitSequence = "["+digits+"]+"

	var unsignedRational = digitSequence+"/"+digitSequence
	var rational = maybeSign + unsignedRational

	var noDecimal = digitSequence
	var decimalNumOnRight = "["+digits+"]*\\.["+digits+"]+"
	var decimalNumOnLeft = "["+digits+"]+\\.["+digits+"]*"

	var unsignedDecimal = "(?:" + noDecimal + "|" + decimalNumOnRight + "|" + decimalNumOnLeft + ")"

	var special = "(?:inf\.0|nan\.0|inf\.f|nan\.f)"

	var unsignedRealNoExp = "(?:" + unsignedDecimal + "|" + unsignedRational + ")"
	var unsignedReal = unsignedRealNoExp + "(?:" + expmark + maybeSign + digitSequence + ")?"
	var unsignedRealOrSpecial = "(?:" + unsignedReal + "|" + special + ")"
	var real = "(?:" + maybeSign + unsignedReal + "|" + sign + special + ")"

	var alt1 = new RegExp("^(" + rational + ")"
                             + "(" + sign + unsignedRational + "?)"
                             + "i$");
	var alt2 = new RegExp("^(" + real + ")?"
                             + "(" + sign + unsignedRealOrSpecial + "?)"
                             + "i$");
	var alt3 = new RegExp("^(" + real + ")@(" + real + ")$");

	var match1 = x.match(alt1)
	var match2 = x.match(alt2)
	var match3 = x.match(alt3)

	return match1 ? match1 :
	       match2 ? match2 :
	       match3 ? match3 :
	     /* else */ false
    }

    function digitRegexp(digits) { return new RegExp("^[+-]?["+digits+"]+$"); }
    /**
    /* NB: !!!! flonum regexp only matches "X.", ".X", or "X.X", NOT "X", this
    /* must be separately checked with digitRegexp.
    /* I know this seems dumb, but the alternative would be that this regexp
    /* returns six matches, which also seems dumb.
    /***/
    function flonumRegexp(digits) {
	var decimalNumOnRight = "(["+digits+"]*)\\.(["+digits+"]+)"
	var decimalNumOnLeft = "(["+digits+"]+)\\.(["+digits+"]*)"
	return new RegExp("^(?:([+-]?)(" +
                          decimalNumOnRight+"|"+decimalNumOnLeft +
                          "))$");
    }
    function scientificPattern(digits, exp_mark) {
	var noDecimal = "["+digits+"]+"
	var decimalNumOnRight = "["+digits+"]*\\.["+digits+"]+"
	var decimalNumOnLeft = "["+digits+"]+\\.["+digits+"]*"
	return new RegExp("^(?:([+-]?" +
			  "(?:"+noDecimal+"|"+decimalNumOnRight+"|"+decimalNumOnLeft+")" +
			  ")["+exp_mark+"]([+-]?["+digits+"]+))$");
    }

    function digitsForRadix(radix) {
	return radix === 2  ? "01" :
	       radix === 8  ? "0-7" :
	       radix === 10 ? "0-9" :
	       radix === 16 ? "0-9a-fA-F" :
	       throwRuntimeError("digitsForRadix: invalid radix", this, radix)
    }

    function expMarkForRadix(radix) {
	return (radix === 2 || radix === 8 || radix === 10) ? "defsl" :
	       (radix === 16)                               ? "sl" :
	       throwRuntimeError("expMarkForRadix: invalid radix", this, radix)
    }

    function Exactness(i) {
      this.defaultp = function () { return i == 0; }
      this.exactp = function () { return i == 1; }
      this.inexactp = function () { return i == 2; }
    }

    Exactness.def = new Exactness(0);
    Exactness.on = new Exactness(1);
    Exactness.off = new Exactness(2);

    Exactness.prototype.intAsExactp = function () { return this.defaultp() || this.exactp(); };
    Exactness.prototype.floatAsInexactp = function () { return this.defaultp() || this.inexactp(); };


    // fromString: string boolean -> (scheme-number | false)
    var fromString = function(x, exactness) {
	var radix = 10
	var exactness = typeof exactness === 'undefined' ? Exactness.def :
			exactness === true               ? Exactness.on :
			exactness === false              ? Exactness.off :
	   /* else */  throwRuntimeError( "exactness must be true or false"
                                        , this
                                        , r) ;

	var hMatch = x.toLowerCase().match(hashModifiersRegexp)
	if (hMatch) {
	    var modifierString = hMatch[1].toLowerCase();

	    var exactFlag = modifierString.match(new RegExp("(#[ei])"))
	    var radixFlag = modifierString.match(new RegExp("(#[bodx])"))

	    if (exactFlag) {
		var f = exactFlag[1].charAt(1)
		exactness = f === 'e' ? Exactness.on :
			    f === 'i' ? Exactness.off :
			 // this case is unreachable
			 throwRuntimeError("invalid exactness flag", this, r)
	    }
	    if (radixFlag) {
		var f = radixFlag[1].charAt(1)
		radix = f === 'b' ? 2 :
            f === 'o' ? 8 :
            f === 'd' ? 10 :
            f === 'x' ? 16 :
			 // this case is unreachable
			throwRuntimeError("invalid radix flag", this, r)
	    }
	}

	var numberString = hMatch ? hMatch[2] : x
	// if the string begins with a hash modifier, then it must parse as a
	// number, an invalid parse is an error, not false. False is returned
	// when the item could potentially have been read as a symbol.
	var mustBeANumberp = hMatch ? true : false

	return fromStringRaw(numberString, radix, exactness, mustBeANumberp)
    };

    function fromStringRaw(x, radix, exactness, mustBeANumberp) {
	var cMatch = matchComplexRegexp(radix, x);
	if (cMatch) {
	  return Complex.makeInstance( fromStringRawNoComplex( cMatch[1] || "0"
							     , radix
							     , exactness
							     )
				     , fromStringRawNoComplex( cMatch[2] === "+" ? "1"  :
							       cMatch[2] === "-" ? "-1" :
							       cMatch[2]
							     , radix
							     , exactness
							     ));
	}

        return fromStringRawNoComplex(x, radix, exactness, mustBeANumberp)
    }

    function fromStringRawNoComplex(x, radix, exactness, mustBeANumberp) {
	var aMatch = x.match(rationalRegexp(digitsForRadix(radix)));
	if (aMatch) {
	    return Rational.makeInstance( fromStringRawNoComplex( aMatch[1]
                                                                , radix
                                                                , exactness
                                                                )
                                        , fromStringRawNoComplex( aMatch[2]
                                                                , radix
                                                                , exactness
                                                                ));
	}

	// Floating point tests
	if (x === '+nan.0' || x === '-nan.0')
	    return FloatPoint.nan;
	if (x === '+inf.0')
	    return FloatPoint.inf;
	if (x === '-inf.0')
	    return FloatPoint.neginf;
	if (x === "-0.0") {
	    return NEGATIVE_ZERO;
	}

	var fMatch = x.match(flonumRegexp(digitsForRadix(radix)))
	if (fMatch) {
	    var integralPart = fMatch[3] !== undefined ? fMatch[3] : fMatch[5];
	    var fractionalPart = fMatch[4] !== undefined ? fMatch[4] : fMatch[6];
	    return parseFloat( fMatch[1]
                             , integralPart
                             , fractionalPart
                             , radix
                             , exactness
                             )
	}

	var sMatch = x.match(scientificPattern( digitsForRadix(radix)
					      , expMarkForRadix(radix)
					      ))
	if (sMatch) {
	    var coefficient = fromStringRawNoComplex(sMatch[1], radix, exactness)
	    var exponent = fromStringRawNoComplex(sMatch[2], radix, exactness)
	    return multiply(coefficient, expt(radix, exponent));
	}

	// Finally, integer tests.
	if (x.match(digitRegexp(digitsForRadix(radix)))) {
	    var n = parseInt(x, radix);
	    if (isOverflow(n)) {
		return makeBignum(x);
	    } else if (exactness.intAsExactp()) {
		return n;
	    } else {
		return FloatPoint.makeInstance(n)
	    }
	} else if (mustBeANumberp) {
	    if(x.length===0) throwRuntimeError("no digits");
	    throwRuntimeError("bad number: " + x, this);
	} else {
	    return false;
	}
    };

    function parseFloat(sign, integralPart, fractionalPart, radix, exactness) {
	var sign = (sign == "-" ? -1 : 1);
	var integralPartValue = integralPart === ""  ? 0  :
				exactness.intAsExactp() ? parseExactInt(integralPart, radix) :
							  parseInt(integralPart, radix)

	var fractionalNumerator = fractionalPart === "" ? 0 :
				  exactness.intAsExactp() ? parseExactInt(fractionalPart, radix) :
							    parseInt(fractionalPart, radix)
	/* unfortunately, for these next two calculations, `expt` and `divide` */
	/* will promote to Bignum and Rational, respectively, but we only want */
	/* these if we're parsing in exact mode */
	var fractionalDenominator = exactness.intAsExactp() ? expt(radix, fractionalPart.length) :
							      Math.pow(radix, fractionalPart.length)
	var fractionalPartValue = fractionalPart === "" ? 0 :
				  exactness.intAsExactp() ? divide(fractionalNumerator, fractionalDenominator) :
							    fractionalNumerator / fractionalDenominator

	var forceInexact = function(o) {
	    return typeof o === "number" ? FloatPoint.makeInstance(o) :
					   o.toInexact();
	}

	return exactness.floatAsInexactp() ? forceInexact(multiply(sign, add( integralPartValue, fractionalPartValue))) :
					     multiply(sign, add(integralPartValue, fractionalPartValue));
    }

    function parseExactInt(str, radix) {
	return fromStringRawNoComplex(str, radix, Exactness.on, true);
    }

    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////

    // The code below comes from Tom Wu's BigInteger implementation:

    // Copyright (c) 2005  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Basic JavaScript BN library - subset useful for RSA encryption.

    // Bits per digit
    var dbits;

    // JavaScript engine analysis
    var canary = 0xdeadbeefcafe;
    var j_lm = ((canary&0xffffff)==0xefcafe);

    // (public) Constructor
    function BigInteger(a,b,c) {
	if(a != null)
	    if("number" == typeof a) this.fromNumber(a,b,c);
	else if(b == null && "string" != typeof a) this.fromString(a,256);
	else this.fromString(a,b);
    }

    // return new, unset BigInteger
    function nbi() { return new BigInteger(null); }

    // am: Compute w_j += (x*this_i), propagate carries,
    // c is initial carry, returns final carry.
    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
    // We need to select the fastest one that works in this environment.

    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    function am1(i,x,w,j,c,n) {
	while(--n >= 0) {
	    var v = x*this[i++]+w[j]+c;
	    c = Math.floor(v/0x4000000);
	    w[j++] = v&0x3ffffff;
	}
	return c;
    }
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    function am2(i,x,w,j,c,n) {
	var xl = x&0x7fff, xh = x>>15;
	while(--n >= 0) {
	    var l = this[i]&0x7fff;
	    var h = this[i++]>>15;
	    var m = xh*l+h*xl;
	    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
	    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
	    w[j++] = l&0x3fffffff;
	}
	return c;
    }
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    function am3(i,x,w,j,c,n) {
	var xl = x&0x3fff, xh = x>>14;
	while(--n >= 0) {
	    var l = this[i]&0x3fff;
	    var h = this[i++]>>14;
	    var m = xh*l+h*xl;
	    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
	    c = (l>>28)+(m>>14)+xh*h;
	    w[j++] = l&0xfffffff;
	}
	return c;
    }
    if(j_lm && (typeof(navigator) !== 'undefined' && navigator.appName == "Microsoft Internet Explorer")) {
	BigInteger.prototype.am = am2;
	dbits = 30;
    }
    else if(j_lm && (typeof(navigator) !== 'undefined' && navigator.appName != "Netscape")) {
	BigInteger.prototype.am = am1;
	dbits = 26;
    }
    else { // Mozilla/Netscape seems to prefer am3
	BigInteger.prototype.am = am3;
	dbits = 28;
    }

    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = ((1<<dbits)-1);
    BigInteger.prototype.DV = (1<<dbits);

    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2,BI_FP);
    BigInteger.prototype.F1 = BI_FP-dbits;
    BigInteger.prototype.F2 = 2*dbits-BI_FP;

    // Digit conversions
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = [];
    var rr,vv;
    rr = "0".charCodeAt(0);
    for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

    function int2char(n) { return BI_RM.charAt(n); }
    function intAt(s,i) {
	var c = BI_RC[s.charCodeAt(i)];
	return (c==null)?-1:c;
    }

    // (protected) copy this to r
    function bnpCopyTo(r) {
	for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
	r.t = this.t;
	r.s = this.s;
    }

    // (protected) set from integer value x, -DV <= x < DV
    function bnpFromInt(x) {
	this.t = 1;
	this.s = (x<0)?-1:0;
	if(x > 0) this[0] = x;
	else if(x < -1) this[0] = x+DV;
	else this.t = 0;
    }

    // return bigint initialized to value
    function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

    // (protected) set from string and radix
    function bnpFromString(s,b) {
	var k;
	if(b == 16) k = 4;
	else if(b == 8) k = 3;
	else if(b == 256) k = 8; // byte array
	else if(b == 2) k = 1;
	else if(b == 32) k = 5;
	else if(b == 4) k = 2;
	else { this.fromRadix(s,b); return; }
	this.t = 0;
	this.s = 0;
	var i = s.length, mi = false, sh = 0;
	while(--i >= 0) {
	    var x = (k==8)?s[i]&0xff:intAt(s,i);
	    if(x < 0) {
		if(s.charAt(i) == "-") mi = true;
		continue;
	    }
	    mi = false;
	    if(sh == 0)
		this[this.t++] = x;
	    else if(sh+k > this.DB) {
		this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
		this[this.t++] = (x>>(this.DB-sh));
	    }
	    else
		this[this.t-1] |= x<<sh;
	    sh += k;
	    if(sh >= this.DB) sh -= this.DB;
	}
	if(k == 8 && (s[0]&0x80) != 0) {
	    this.s = -1;
	    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
	}
	this.clamp();
	if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) clamp off excess high words
    function bnpClamp() {
	var c = this.s&this.DM;
	while(this.t > 0 && this[this.t-1] == c) --this.t;
    }

    // (public) return string representation in given radix
    function bnToString(b) {
	if(this.s < 0) return "-"+this.negate().toString(b);
	var k;
	if(b == 16) k = 4;
	else if(b == 8) k = 3;
	else if(b == 2) k = 1;
	else if(b == 32) k = 5;
	else if(b == 4) k = 2;
	else return this.toRadix(b);
	var km = (1<<k)-1, d, m = false, r = [], i = this.t;
	var p = this.DB-(i*this.DB)%k;
	if(i-- > 0) {
	    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r.push(int2char(d)); }
	    while(i >= 0) {
		if(p < k) {
		    d = (this[i]&((1<<p)-1))<<(k-p);
		    d |= this[--i]>>(p+=this.DB-k);
		}
		else {
		    d = (this[i]>>(p-=k))&km;
		    if(p <= 0) { p += this.DB; --i; }
		}
		if(d > 0) m = true;
		if(m) r.push(int2char(d));
	    }
	}
	return m?r.join(""):"0";
    }

    // (public) -this
    function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

    // (public) |this|
    function bnAbs() { return (this.s<0)?this.negate():this; }

    // (public) return + if this > a, - if this < a, 0 if equal
    function bnCompareTo(a) {
	var r = this.s-a.s;
	if(r != 0) return r;
	var i = this.t;
	if ( this.s < 0 ) {
		r = a.t - i;
	}
	else {
		r = i - a.t;
	}
	if(r != 0) return r;
	while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
	return 0;
    }

    // returns bit length of the integer x
    function nbits(x) {
	var r = 1, t;
	if((t=x>>>16) != 0) { x = t; r += 16; }
	if((t=x>>8) != 0) { x = t; r += 8; }
	if((t=x>>4) != 0) { x = t; r += 4; }
	if((t=x>>2) != 0) { x = t; r += 2; }
	if((t=x>>1) != 0) { x = t; r += 1; }
	return r;
    }

    // (public) return the number of bits in "this"
    function bnBitLength() {
	if(this.t <= 0) return 0;
	return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
    }

    // (protected) r = this << n*DB
    function bnpDLShiftTo(n,r) {
	var i;
	for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
	for(i = n-1; i >= 0; --i) r[i] = 0;
	r.t = this.t+n;
	r.s = this.s;
    }

    // (protected) r = this >> n*DB
    function bnpDRShiftTo(n,r) {
	for(var i = n; i < this.t; ++i) r[i-n] = this[i];
	r.t = Math.max(this.t-n,0);
	r.s = this.s;
    }

    // (protected) r = this << n
    function bnpLShiftTo(n,r) {
	var bs = n%this.DB;
	var cbs = this.DB-bs;
	var bm = (1<<cbs)-1;
	var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
	for(i = this.t-1; i >= 0; --i) {
	    r[i+ds+1] = (this[i]>>cbs)|c;
	    c = (this[i]&bm)<<bs;
	}
	for(i = ds-1; i >= 0; --i) r[i] = 0;
	r[ds] = c;
	r.t = this.t+ds+1;
	r.s = this.s;
	r.clamp();
    }

    // (protected) r = this >> n
    function bnpRShiftTo(n,r) {
	r.s = this.s;
	var ds = Math.floor(n/this.DB);
	if(ds >= this.t) { r.t = 0; return; }
	var bs = n%this.DB;
	var cbs = this.DB-bs;
	var bm = (1<<bs)-1;
	r[0] = this[ds]>>bs;
	for(var i = ds+1; i < this.t; ++i) {
	    r[i-ds-1] |= (this[i]&bm)<<cbs;
	    r[i-ds] = this[i]>>bs;
	}
	if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
	r.t = this.t-ds;
	r.clamp();
    }

    // (protected) r = this - a
    function bnpSubTo(a,r) {
	var i = 0, c = 0, m = Math.min(a.t,this.t);
	while(i < m) {
	    c += this[i]-a[i];
	    r[i++] = c&this.DM;
	    c >>= this.DB;
	}
	if(a.t < this.t) {
	    c -= a.s;
	    while(i < this.t) {
		c += this[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	    }
	    c += this.s;
	}
	else {
	    c += this.s;
	    while(i < a.t) {
		c -= a[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	    }
	    c -= a.s;
	}
	r.s = (c<0)?-1:0;
	if(c < -1) r[i++] = this.DV+c;
	else if(c > 0) r[i++] = c;
	r.t = i;
	r.clamp();
    }

    // (protected) r = this * a, r != this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    function bnpMultiplyTo(a,r) {
	var x = this.abs(), y = a.abs();
	var i = x.t;
	r.t = i+y.t;
	while(--i >= 0) r[i] = 0;
	for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
	r.s = 0;
	r.clamp();
	if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
    }

    // (protected) r = this^2, r != this (HAC 14.16)
    function bnpSquareTo(r) {
	var x = this.abs();
	var i = r.t = 2*x.t;
	while(--i >= 0) r[i] = 0;
	for(i = 0; i < x.t-1; ++i) {
	    var c = x.am(i,x[i],r,2*i,0,1);
	    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
		r[i+x.t] -= x.DV;
		r[i+x.t+1] = 1;
	    }
	}
	if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
	r.s = 0;
	r.clamp();
    }


    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r != q, this != m.  q or r may be null.
    function bnpDivRemTo(m,q,r) {
	var pm = m.abs();
	if(pm.t <= 0) return;
	var pt = this.abs();
	if(pt.t < pm.t) {
	    if(q != null) q.fromInt(0);
	    if(r != null) this.copyTo(r);
	    return;
	}
	if(r == null) r = nbi();
	var y = nbi(), ts = this.s, ms = m.s;
	var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
	if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
	else { pm.copyTo(y); pt.copyTo(r); }
	var ys = y.t;
	var y0 = y[ys-1];
	if(y0 == 0) return;
	var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
	var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
	var i = r.t, j = i-ys, t = (q==null)?nbi():q;
	y.dlShiftTo(j,t);
	if(r.compareTo(t) >= 0) {
	    r[r.t++] = 1;
	    r.subTo(t,r);
	}
	BigInteger.ONE.dlShiftTo(ys,t);
	t.subTo(y,y);	// "negative" y so we can replace sub with am later
	while(y.t < ys) y[y.t++] = 0;
	while(--j >= 0) {
	    // Estimate quotient digit
	    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
	    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
		y.dlShiftTo(j,t);
		r.subTo(t,r);
		while(r[i] < --qd) r.subTo(t,r);
	    }
	}
	if(q != null) {
	    r.drShiftTo(ys,q);
	    if(ts != ms) BigInteger.ZERO.subTo(q,q);
	}
	r.t = ys;
	r.clamp();
	if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
	if(ts < 0) BigInteger.ZERO.subTo(r,r);
    }

    // (public) this mod a
    function bnMod(a) {
	var r = nbi();
	this.abs().divRemTo(a,null,r);
	if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
	return r;
    }

    // Modular reduction using "classic" algorithm
    function Classic(m) { this.m = m; }
    function cConvert(x) {
	if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
	else return x;
    }
    function cRevert(x) { return x; }
    function cReduce(x) { x.divRemTo(this.m,null,x); }
    function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
    function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;

    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy == 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] == 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    function bnpInvDigit() {
	if(this.t < 1) return 0;
	var x = this[0];
	if((x&1) == 0) return 0;
	var y = x&3;		// y == 1/x mod 2^2
	y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
	y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
	y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
	// last step - calculate inverse mod DV directly;
	// assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
	y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
	// we really want the negative inverse, and -DV < y < DV
	return (y>0)?this.DV-y:-y;
    }

    // Montgomery reduction
    function Montgomery(m) {
	this.m = m;
	this.mp = m.invDigit();
	this.mpl = this.mp&0x7fff;
	this.mph = this.mp>>15;
	this.um = (1<<(m.DB-15))-1;
	this.mt2 = 2*m.t;
    }

    // xR mod m
    function montConvert(x) {
	var r = nbi();
	x.abs().dlShiftTo(this.m.t,r);
	r.divRemTo(this.m,null,r);
	if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
	return r;
    }

    // x/R mod m
    function montRevert(x) {
	var r = nbi();
	x.copyTo(r);
	this.reduce(r);
	return r;
    }

    // x = x/R mod m (HAC 14.32)
    function montReduce(x) {
	while(x.t <= this.mt2)	// pad x so am has enough room later
	    x[x.t++] = 0;
	for(var i = 0; i < this.m.t; ++i) {
	    // faster way of calculating u0 = x[i]*mp mod DV
	    var j = x[i]&0x7fff;
	    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
	    // use am to combine the multiply-shift-add into one call
	    j = i+this.m.t;
	    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
	    // propagate carry
	    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
	}
	x.clamp();
	x.drShiftTo(this.m.t,x);
	if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = "x^2/R mod m"; x != r
    function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = "xy/R mod m"; x,y != r
    function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;

    // (protected) true iff this is even
    function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    function bnpExp(e,z) {
	    if(e > 0xffffffff || e < 1) return BigInteger.ONE;
	    var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
	    g.copyTo(r);
	    while(--i >= 0) {
	        z.sqrTo(r,r2);
	        if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
	        else { var t = r; r = r2; r2 = t; }
	    }
	    return z.revert(r);
    }

    // (public) this^e % m, 0 <= e < 2^32
    function bnModPowInt(e,m) {
	var z;
	if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
	return this.exp(e,z);
    }

    // protected
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.bnpExp = bnpExp;

    // public
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;

    // "constants"
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);

    // Copyright (c) 2005-2009  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Extended JavaScript BN functions, required for RSA private ops.

    // Version 1.1: new BigInteger("0", 10) returns "proper" zero

    // (public)
    function bnClone() { var r = nbi(); this.copyTo(r); return r; }

    // (public) return value as integer
    function bnIntValue() {
	if(this.s < 0) {
	    if(this.t == 1) return this[0]-this.DV;
	    else if(this.t == 0) return -1;
	}
	else if(this.t == 1) return this[0];
	else if(this.t == 0) return 0;
	// assumes 16 < DB < 32
	return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
    }

    // (public) return value as byte
    function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

    // (public) return value as short (assumes DB>=16)
    function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

    // (protected) return x s.t. r^x < DV
    function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

    // (public) 0 if this == 0, 1 if this > 0
    function bnSigNum() {
	if(this.s < 0) return -1;
	else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
	else return 1;
    }

    // (protected) convert to radix string
    function bnpToRadix(b) {
	if(b == null) b = 10;
	if(this.signum() == 0 || b < 2 || b > 36) return "0";
	var cs = this.chunkSize(b);
	var a = Math.pow(b,cs);
	var d = nbv(a), y = nbi(), z = nbi(), r = "";
	this.divRemTo(d,y,z);
	while(y.signum() > 0) {
	    r = (a+z.intValue()).toString(b).substr(1) + r;
	    y.divRemTo(d,y,z);
	}
	return z.intValue().toString(b) + r;
    }

    // (protected) convert from radix string
    function bnpFromRadix(s,b) {
	this.fromInt(0);
	if(b == null) b = 10;
	var cs = this.chunkSize(b);
	var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
	for(var i = 0; i < s.length; ++i) {
	    var x = intAt(s,i);
	    if(x < 0) {
		if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
		continue;
	    }
	    w = b*w+x;
	    if(++j >= cs) {
		this.dMultiply(d);
		this.dAddOffset(w,0);
		j = 0;
		w = 0;
	    }
	}
	if(j > 0) {
	    this.dMultiply(Math.pow(b,j));
	    this.dAddOffset(w,0);
	}
	if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) alternate constructor
    function bnpFromNumber(a,b,c) {
	if("number" == typeof b) {
	    // new BigInteger(int,int,RNG)
	    if(a < 2) this.fromInt(1);
	    else {
		this.fromNumber(a,c);
		if(!this.testBit(a-1))	// force MSB set
		    this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
		if(this.isEven()) this.dAddOffset(1,0); // force odd
		while(!this.isProbablePrime(b)) {
		    this.dAddOffset(2,0);
		    if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
		}
	    }
	}
	else {
	    // new BigInteger(int,RNG)
	    var x = [], t = a&7;
	    x.length = (a>>3)+1;
	    b.nextBytes(x);
	    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
	    this.fromString(x,256);
	}
    }

    // (public) convert to bigendian byte array
    function bnToByteArray() {
	var i = this.t, r = [];
	r[0] = this.s;
	var p = this.DB-(i*this.DB)%8, d, k = 0;
	if(i-- > 0) {
	    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
		r[k++] = d|(this.s<<(this.DB-p));
	    while(i >= 0) {
		if(p < 8) {
		    d = (this[i]&((1<<p)-1))<<(8-p);
		    d |= this[--i]>>(p+=this.DB-8);
		}
		else {
		    d = (this[i]>>(p-=8))&0xff;
		    if(p <= 0) { p += this.DB; --i; }
		}
		if((d&0x80) != 0) d |= -256;
		if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
		if(k > 0 || d != this.s) r[k++] = d;
	    }
	}
	return r;
    }

    function bnEquals(a) { return(this.compareTo(a)==0); }
    function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
    function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

    // (protected) r = this op a (bitwise)
    function bnpBitwiseTo(a,op,r) {
	var i, f, m = Math.min(a.t,this.t);
	for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
	if(a.t < this.t) {
	    f = a.s&this.DM;
	    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
	    r.t = this.t;
	}
	else {
	    f = this.s&this.DM;
	    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
	    r.t = a.t;
	}
	r.s = op(this.s,a.s);
	r.clamp();
    }

    // (public) this & a
    function op_and(x,y) { return x&y; }
    function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

    // (public) this | a
    function op_or(x,y) { return x|y; }
    function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

    // (public) this ^ a
    function op_xor(x,y) { return x^y; }
    function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

    // (public) this & ~a
    function op_andnot(x,y) { return x&~y; }
    function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

    // (public) ~this
    function bnNot() {
	var r = nbi();
	for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
	r.t = this.t;
	r.s = ~this.s;
	return r;
    }

    // (public) this << n
    function bnShiftLeft(n) {
	var r = nbi();
	if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
	return r;
    }

    // (public) this >> n
    function bnShiftRight(n) {
	var r = nbi();
	if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
	return r;
    }

    // return index of lowest 1-bit in x, x < 2^31
    function lbit(x) {
	if(x == 0) return -1;
	var r = 0;
	if((x&0xffff) == 0) { x >>= 16; r += 16; }
	if((x&0xff) == 0) { x >>= 8; r += 8; }
	if((x&0xf) == 0) { x >>= 4; r += 4; }
	if((x&3) == 0) { x >>= 2; r += 2; }
	if((x&1) == 0) ++r;
	return r;
    }

    // (public) returns index of lowest 1-bit (or -1 if none)
    function bnGetLowestSetBit() {
	for(var i = 0; i < this.t; ++i)
	    if(this[i] != 0) return i*this.DB+lbit(this[i]);
	if(this.s < 0) return this.t*this.DB;
	return -1;
    }

    // return number of 1 bits in x
    function cbit(x) {
	var r = 0;
	while(x != 0) { x &= x-1; ++r; }
	return r;
    }

    // (public) return number of set bits
    function bnBitCount() {
	var r = 0, x = this.s&this.DM;
	for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
	return r;
    }

    // (public) true iff nth bit is set
    function bnTestBit(n) {
	var j = Math.floor(n/this.DB);
	if(j >= this.t) return(this.s!=0);
	return((this[j]&(1<<(n%this.DB)))!=0);
    }

    // (protected) this op (1<<n)
    function bnpChangeBit(n,op) {
	var r = BigInteger.ONE.shiftLeft(n);
	this.bitwiseTo(r,op,r);
	return r;
    }

    // (public) this | (1<<n)
    function bnSetBit(n) { return this.changeBit(n,op_or); }

    // (public) this & ~(1<<n)
    function bnClearBit(n) { return this.changeBit(n,op_andnot); }

    // (public) this ^ (1<<n)
    function bnFlipBit(n) { return this.changeBit(n,op_xor); }

    // (protected) r = this + a
    function bnpAddTo(a,r) {
	var i = 0, c = 0, m = Math.min(a.t,this.t);
	while(i < m) {
	    c += this[i]+a[i];
	    r[i++] = c&this.DM;
	    c >>= this.DB;
	}
	if(a.t < this.t) {
	    c += a.s;
	    while(i < this.t) {
		c += this[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	    }
	    c += this.s;
	}
	else {
	    c += this.s;
	    while(i < a.t) {
		c += a[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	    }
	    c += a.s;
	}
	r.s = (c<0)?-1:0;
	if(c > 0) r[i++] = c;
	else if(c < -1) r[i++] = this.DV+c;
	r.t = i;
	r.clamp();
    }

    // (public) this + a
    function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

    // (public) this - a
    function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

    // (public) this * a
    function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

    // (public) this / a
    function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

    // (public) this % a
    function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

    // (public) [this/a,this%a]
    function bnDivideAndRemainder(a) {
	var q = nbi(), r = nbi();
	this.divRemTo(a,q,r);
	return [q,r];
    }

    // (protected) this *= n, this >= 0, 1 < n < DV
    function bnpDMultiply(n) {
	this[this.t] = this.am(0,n-1,this,0,0,this.t);
	++this.t;
	this.clamp();
    }

    // (protected) this += n << w words, this >= 0
    function bnpDAddOffset(n,w) {
	if(n == 0) return;
	while(this.t <= w) this[this.t++] = 0;
	this[w] += n;
	while(this[w] >= this.DV) {
	    this[w] -= this.DV;
	    if(++w >= this.t) this[this.t++] = 0;
	    ++this[w];
	}
    }

    // A "null" reducer
    function NullExp() {}
    function nNop(x) { return x; }
    function nMulTo(x,y,r) { x.multiplyTo(y,r); }
    function nSqrTo(x,r) { x.squareTo(r); }

    NullExp.prototype.convert = nNop;
    NullExp.prototype.revert = nNop;
    NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.sqrTo = nSqrTo;

    // (public) this^e
    function bnPow(e) { return this.bnpExp(e,new NullExp()); }

    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    function bnpMultiplyLowerTo(a,n,r) {
	var i = Math.min(this.t+a.t,n);
	r.s = 0; // assumes a,this >= 0
	r.t = i;
	while(i > 0) r[--i] = 0;
	var j;
	for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
	for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
	r.clamp();
    }

    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    function bnpMultiplyUpperTo(a,n,r) {
	--n;
	var i = r.t = this.t+a.t-n;
	r.s = 0; // assumes a,this >= 0
	while(--i >= 0) r[i] = 0;
	for(i = Math.max(n-this.t,0); i < a.t; ++i)
	    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
	r.clamp();
	r.drShiftTo(1,r);
    }

    // Barrett modular reduction
    function Barrett(m) {
	// setup Barrett
	this.r2 = nbi();
	this.q3 = nbi();
	BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
	this.mu = this.r2.divide(m);
	this.m = m;
    }

    function barrettConvert(x) {
	if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
	else if(x.compareTo(this.m) < 0) return x;
	else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
    }

    function barrettRevert(x) { return x; }

    // x = x mod m (HAC 14.42)
    function barrettReduce(x) {
	x.drShiftTo(this.m.t-1,this.r2);
	if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
	this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
	this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
	while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
	x.subTo(this.r2,x);
	while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = x^2 mod m; x != r
    function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = x*y mod m; x,y != r
    function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.reduce = barrettReduce;
    Barrett.prototype.mulTo = barrettMulTo;
    Barrett.prototype.sqrTo = barrettSqrTo;

    // (public) this^e % m (HAC 14.85)
    function bnModPow(e,m) {
	var i = e.bitLength(), k, r = nbv(1), z;
	if(i <= 0) return r;
	else if(i < 18) k = 1;
	else if(i < 48) k = 3;
	else if(i < 144) k = 4;
	else if(i < 768) k = 5;
	else k = 6;
	if(i < 8)
	    z = new Classic(m);
	else if(m.isEven())
	    z = new Barrett(m);
	else
	    z = new Montgomery(m);

	// precomputation
	var g = [], n = 3, k1 = k-1, km = (1<<k)-1;
	g[1] = z.convert(this);
	if(k > 1) {
	    var g2 = nbi();
	    z.sqrTo(g[1],g2);
	    while(n <= km) {
		g[n] = nbi();
		z.mulTo(g2,g[n-2],g[n]);
		n += 2;
	    }
	}

	var j = e.t-1, w, is1 = true, r2 = nbi(), t;
	i = nbits(e[j])-1;
	while(j >= 0) {
	    if(i >= k1) w = (e[j]>>(i-k1))&km;
	    else {
		w = (e[j]&((1<<(i+1))-1))<<(k1-i);
		if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
	    }

	    n = k;
	    while((w&1) == 0) { w >>= 1; --n; }
	    if((i -= n) < 0) { i += this.DB; --j; }
	    if(is1) {	// ret == 1, don't bother squaring or multiplying it
		g[w].copyTo(r);
		is1 = false;
	    }
	    else {
		while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
		if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
		z.mulTo(r2,g[w],r);
	    }

	    while(j >= 0 && (e[j]&(1<<i)) == 0) {
		z.sqrTo(r,r2); t = r; r = r2; r2 = t;
		if(--i < 0) { i = this.DB-1; --j; }
	    }
	}
	return z.revert(r);
    }

    // (public) gcd(this,a) (HAC 14.54)
    function bnGCD(a) {
	var x = (this.s<0)?this.negate():this.clone();
	var y = (a.s<0)?a.negate():a.clone();
	if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
	var i = x.getLowestSetBit(), g = y.getLowestSetBit();
	if(g < 0) return x;
	if(i < g) g = i;
	if(g > 0) {
	    x.rShiftTo(g,x);
	    y.rShiftTo(g,y);
	}
	while(x.signum() > 0) {
	    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
	    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
	    if(x.compareTo(y) >= 0) {
		x.subTo(y,x);
		x.rShiftTo(1,x);
	    }
	    else {
		y.subTo(x,y);
		y.rShiftTo(1,y);
	    }
	}
	if(g > 0) y.lShiftTo(g,y);
	return y;
    }

    // (protected) this % n, n < 2^26
    function bnpModInt(n) {
	if(n <= 0) return 0;
	var d = this.DV%n, r = (this.s<0)?n-1:0;
	if(this.t > 0)
	    if(d == 0) r = this[0]%n;
	else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
	return r;
    }

    // (public) 1/this % m (HAC 14.61)
    function bnModInverse(m) {
	var ac = m.isEven();
	if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
	var u = m.clone(), v = this.clone();
	var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
	while(u.signum() != 0) {
	    while(u.isEven()) {
		u.rShiftTo(1,u);
		if(ac) {
		    if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
		    a.rShiftTo(1,a);
		}
		else if(!b.isEven()) b.subTo(m,b);
		b.rShiftTo(1,b);
	    }
	    while(v.isEven()) {
		v.rShiftTo(1,v);
		if(ac) {
		    if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
		    c.rShiftTo(1,c);
		}
		else if(!d.isEven()) d.subTo(m,d);
		d.rShiftTo(1,d);
	    }
	    if(u.compareTo(v) >= 0) {
		u.subTo(v,u);
		if(ac) a.subTo(c,a);
		b.subTo(d,b);
	    }
	    else {
		v.subTo(u,v);
		if(ac) c.subTo(a,c);
		d.subTo(b,d);
	    }
	}
	if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
	if(d.compareTo(m) >= 0) return d.subtract(m);
	if(d.signum() < 0) d.addTo(m,d); else return d;
	if(d.signum() < 0) return d.add(m); else return d;
    }

    var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509];
    var lplim = (1<<26)/lowprimes[lowprimes.length-1];

    // (public) test primality with certainty >= 1-.5^t
    function bnIsProbablePrime(t) {
	var i, x = this.abs();
	if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
	    for(i = 0; i < lowprimes.length; ++i)
		if(x[0] == lowprimes[i]) return true;
	    return false;
	}
	if(x.isEven()) return false;
	i = 1;
	while(i < lowprimes.length) {
	    var m = lowprimes[i], j = i+1;
	    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
	    m = x.modInt(m);
	    while(i < j) if(m%lowprimes[i++] == 0) return false;
	}
	return x.millerRabin(t);
    }

    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    function bnpMillerRabin(t) {
	var n1 = this.subtract(BigInteger.ONE);
	var k = n1.getLowestSetBit();
	if(k <= 0) return false;
	var r = n1.shiftRight(k);
	t = (t+1)>>1;
	if(t > lowprimes.length) t = lowprimes.length;
	var a = nbi();
	for(var i = 0; i < t; ++i) {
	    a.fromInt(lowprimes[i]);
	    var y = a.modPow(r,this);
	    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
		var j = 1;
		while(j++ < k && y.compareTo(n1) != 0) {
		    y = y.modPowInt(2,this);
		    if(y.compareTo(BigInteger.ONE) == 0) return false;
		}
		if(y.compareTo(n1) != 0) return false;
	    }
	}
	return true;
    }
    
    

    // protected
    BigInteger.prototype.chunkSize = bnpChunkSize;
    BigInteger.prototype.toRadix = bnpToRadix;
    BigInteger.prototype.fromRadix = bnpFromRadix;
    BigInteger.prototype.fromNumber = bnpFromNumber;
    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    BigInteger.prototype.changeBit = bnpChangeBit;
    BigInteger.prototype.addTo = bnpAddTo;
    BigInteger.prototype.dMultiply = bnpDMultiply;
    BigInteger.prototype.dAddOffset = bnpDAddOffset;
    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    BigInteger.prototype.modInt = bnpModInt;
    BigInteger.prototype.millerRabin = bnpMillerRabin;

    // public
    BigInteger.prototype.clone = bnClone;
    BigInteger.prototype.intValue = bnIntValue;
    BigInteger.prototype.byteValue = bnByteValue;
    BigInteger.prototype.shortValue = bnShortValue;
    BigInteger.prototype.signum = bnSigNum;
    BigInteger.prototype.toByteArray = bnToByteArray;
    BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.min = bnMin;
    BigInteger.prototype.max = bnMax;
    BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.or = bnOr;
    BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.not = bnNot;
    BigInteger.prototype.shiftLeft = bnShiftLeft;
    BigInteger.prototype.shiftRight = bnShiftRight;
    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    BigInteger.prototype.bitCount = bnBitCount;
    BigInteger.prototype.testBit = bnTestBit;
    BigInteger.prototype.setBit = bnSetBit;
    BigInteger.prototype.clearBit = bnClearBit;
    BigInteger.prototype.flipBit = bnFlipBit;
    BigInteger.prototype.add = bnAdd;
    BigInteger.prototype.subtract = bnSubtract;
    BigInteger.prototype.multiply = bnMultiply;
    BigInteger.prototype.divide = bnDivide;
    BigInteger.prototype.remainder = bnRemainder;
    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    BigInteger.prototype.modPow = bnModPow;
    BigInteger.prototype.modInverse = bnModInverse;
    BigInteger.prototype.pow = bnPow;
    BigInteger.prototype.expt = bnPow;
    BigInteger.prototype.gcd = bnGCD;
    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

    // BigInteger interfaces not implemented in jsbn:

    // BigInteger(int signum, byte[] magnitude)
    // double doubleValue()
    // float floatValue()
    // int hashCode()
    // long longValue()
    // static BigInteger valueOf(long val)



    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    // END OF copy-and-paste of jsbn.



    BigInteger.NEGATIVE_ONE = BigInteger.ONE.negate();


    // Other methods we need to add for compatibilty with js-numbers numeric tower.

    // add is implemented above.
    // subtract is implemented above.
    // multiply is implemented above.
    // equals is implemented above.
    // abs is implemented above.
    // negate is defined above.

    // makeBignum: string -> BigInteger
    var makeBignum = function(s) {
	if (typeof(s) === 'number') { s = s + ''; }
	s = expandExponent(s);
	return new BigInteger(s, 10);
    };

    var zerostring = function(n) {
	var buf = [];
	for (var i = 0; i < n; i++) {
	    buf.push('0');
	}
	return buf.join('');
    };


    BigInteger.prototype.level = 0;
    BigInteger.prototype.liftTo = function(target) {
	if (target.level === 1) {
	    return new Rational(this, 1);
	}
	if (target.level === 2) {
	    var fixrep = this.toFixnum();
	    if (fixrep === Number.POSITIVE_INFINITY)
		return TOO_POSITIVE_TO_REPRESENT;
	    if (fixrep === Number.NEGATIVE_INFINITY)
		return TOO_NEGATIVE_TO_REPRESENT;
	    return new FloatPoint(fixrep);
	}
	if (target.level === 3) {
	    return new Complex(this, 0);
	}
	return throwRuntimeError("invalid level for BigInteger lift", this, target);
    };

    BigInteger.prototype.isFinite = function() {
	return true;
    };

    BigInteger.prototype.isInteger = function() {
	return true;
    };

    BigInteger.prototype.isRational = function() {
	return true;
    };

    BigInteger.prototype.isReal = function() {
	return true;
    };

    BigInteger.prototype.isExact = function() {
	return true;
    };

    BigInteger.prototype.isInexact = function() {
	return false;
    };

    BigInteger.prototype.toExact = function() {
	return this;
    };

    BigInteger.prototype.toInexact = function() {
	return FloatPoint.makeInstance(this.toFixnum());
    };

    BigInteger.prototype.toFixnum = function() {
	var result = 0, str = this.toString(), i;
	if (str[0] === '-') {
	    for (i=1; i < str.length; i++) {
		result = result * 10 + Number(str[i]);
	    }
	    return -result;
	} else {
	    for (i=0; i < str.length; i++) {
		result = result * 10 + Number(str[i]);
	    }
	    return result;
	}
    };


    BigInteger.prototype.greaterThan = function(other) {
	return this.compareTo(other) > 0;
    };

    BigInteger.prototype.greaterThanOrEqual = function(other) {
	return this.compareTo(other) >= 0;
    };

    BigInteger.prototype.lessThan = function(other) {
	return this.compareTo(other) < 0;
    };

    BigInteger.prototype.lessThanOrEqual = function(other) {
	return this.compareTo(other) <= 0;
    };

    // divide: scheme-number -> scheme-number
    // WARNING NOTE: we override the old version of divide.
    BigInteger.prototype.divide = function(other) {
	var quotientAndRemainder = bnDivideAndRemainder.call(this, other);
	if (quotientAndRemainder[1].compareTo(BigInteger.ZERO) === 0) {
	    return quotientAndRemainder[0];
	} else {
	    var result = add(quotientAndRemainder[0],
			     Rational.makeInstance(quotientAndRemainder[1], other));
	    return result;
	}
    };

    BigInteger.prototype.numerator = function() {
	return this;
    };

    BigInteger.prototype.denominator = function() {
	return 1;
    };


    (function() {
	// Classic implementation of Newton-Ralphson square-root search,
	// adapted for integer-sqrt.
	// http://en.wikipedia.org/wiki/Newton's_method#Square_root_of_a_number
	    var searchIter = function(n, guess) {
		while(!(lessThanOrEqual(sqr(guess),n) &&
			lessThan(n,sqr(add(guess, 1))))) {
		    guess = floor(divide(add(guess,
					     floor(divide(n, guess))),
					 2));
		}
		return guess;
	    };

	    // integerSqrt: -> scheme-number
	    BigInteger.prototype.integerSqrt = function() {
		var n;
		if(sign(this) >= 0) {
		    return searchIter(this, this);
		} else {
		    n = this.negate();
		    return Complex.makeInstance(0, searchIter(n, n));
		}
	    };
    })();


    // sqrt: -> scheme-number
    // http://en.wikipedia.org/wiki/Newton's_method#Square_root_of_a_number
    // Produce the square root.
    (function() {	
	// Get an approximation using integerSqrt, and then start another
	// Newton-Ralphson search if necessary.
	BigInteger.prototype.sqrt = function() {
	    var approx = this.integerSqrt(), fix;
	    if (eqv(sqr(approx), this)) {
		return approx;
	    }
	    fix = toFixnum(this);
	    if (isFinite(fix)) {
		if (fix >= 0) {
		    return FloatPoint.makeInstance(Math.sqrt(fix));
		} else {
		    return Complex.makeInstance(
			0,
			FloatPoint.makeInstance(Math.sqrt(-fix)));
		}
	    } else {
		return approx;
	    }
	};
    })();

    // floor: -> scheme-number
    // Produce the floor.
    BigInteger.prototype.floor = function() {
        return this;
    }

    // ceiling: -> scheme-number
    // Produce the ceiling.
    BigInteger.prototype.ceiling = function() {
        return this;
    }


    // Until we have a feature-complete Big Number implementation, we'll
    // convert BigInteger objects into FloatPoint objects and perform
    // unsupported operations there.
    function temporaryAccuracyLosingWorkAroundForBigNums(function_name) {
      return function () {
	var inexact = this.toInexact();
	return inexact[function_name].apply(inexact, arguments);
      }
    }

    // conjugate: -> scheme-number
    // Produce the conjugate.
    BigInteger.prototype.conjugate = temporaryAccuracyLosingWorkAroundForBigNums("conjugate");

    // magnitude: -> scheme-number
    // Produce the magnitude.
    BigInteger.prototype.magnitude = temporaryAccuracyLosingWorkAroundForBigNums("magnitude");

    // log: -> scheme-number
    // Produce the log.
    BigInteger.prototype.log = temporaryAccuracyLosingWorkAroundForBigNums("log");

    // angle: -> scheme-number
    // Produce the angle.
    BigInteger.prototype.angle = temporaryAccuracyLosingWorkAroundForBigNums("angle");

    // atan: -> scheme-number
    // Produce the arc tangent.
    BigInteger.prototype.atan = temporaryAccuracyLosingWorkAroundForBigNums("atan");

    // acos: -> scheme-number
    // Produce the arc cosine.
    BigInteger.prototype.acos = temporaryAccuracyLosingWorkAroundForBigNums("acos");

    // asin: -> scheme-number
    // Produce the arc sine.
    BigInteger.prototype.asin = temporaryAccuracyLosingWorkAroundForBigNums("asin");

    // tan: -> scheme-number
    // Produce the tangent.
    BigInteger.prototype.tan = temporaryAccuracyLosingWorkAroundForBigNums("tan");

    // cos: -> scheme-number
    // Produce the cosine.
    BigInteger.prototype.cos = temporaryAccuracyLosingWorkAroundForBigNums("cos");

    // sin: -> scheme-number
    // Produce the sine.
    BigInteger.prototype.sin = temporaryAccuracyLosingWorkAroundForBigNums("sin");

    // exp: -> scheme-number
    // Produce e raised to the given power.
    BigInteger.prototype.exp = temporaryAccuracyLosingWorkAroundForBigNums("exp");

    BigInteger.prototype.imaginaryPart = function() {
	    return 0;
    }
    BigInteger.prototype.realPart = function() {
	    return this;
    }

    // round: -> scheme-number
    // Round to the nearest integer.
    BigInteger.prototype.round = function() {
	    return this;
    }





    //////////////////////////////////////////////////////////////////////
    // toRepeatingDecimal: jsnum jsnum {limit: number}? -> [string, string, string]
    //
    // Given the numerator and denominator parts of a rational,
    // produces the repeating-decimal representation, where the first
    // part are the digits before the decimal, the second are the
    // non-repeating digits after the decimal, and the third are the
    // remaining repeating decimals.
    // 
    // An optional limit on the decimal expansion can be provided, in which
    // case the search cuts off if we go past the limit.
    // If this happens, the third argument returned becomes '...' to indicate
    // that the search was prematurely cut off.
    var toRepeatingDecimal = (function() {
	var getResidue = function(r, d, limit) {
	    var digits = [];
	    var seenRemainders = {};
	    seenRemainders[r] = true;
	    while(true) {	
		if (limit-- <= 0) {
		    return [digits.join(''), '...']
		}

		var nextDigit = quotient(
		    multiply(r, 10), d);
		var nextRemainder = remainder(
		    multiply(r, 10),
		    d);
		digits.push(nextDigit.toString());
		if (seenRemainders[nextRemainder]) {
		    r = nextRemainder;
		    break;
		} else {
		    seenRemainders[nextRemainder] = true;
		    r = nextRemainder;
		}
	    }
	    
	    var firstRepeatingRemainder = r;
	    var repeatingDigits = [];
	    while (true) {
		var nextDigit = quotient(multiply(r, 10), d);
		var nextRemainder = remainder(
		    multiply(r, 10),
		    d);
		repeatingDigits.push(nextDigit.toString());
		if (equals(nextRemainder, firstRepeatingRemainder)) {
		    break;
		} else {
		    r = nextRemainder;
		}
	    };

	    var digitString = digits.join('');
	    var repeatingDigitString = repeatingDigits.join('');

	    while (digitString.length >= repeatingDigitString.length &&
		   (digitString.substring(
		       digitString.length - repeatingDigitString.length)
		    === repeatingDigitString)) {
		digitString = digitString.substring(
		    0, digitString.length - repeatingDigitString.length);
	    }

	    return [digitString, repeatingDigitString];

	};

	return function(n, d, options) {
	    // default limit on decimal expansion; can be overridden
	    var limit = 512;
	    if (options && typeof(options.limit) !== 'undefined') {
		limit = options.limit;
	    }
	    if (! isInteger(n)) {
		throwRuntimeError('toRepeatingDecimal: n ' + n.toString() +
				  " is not an integer.");
	    }
	    if (! isInteger(d)) {
		throwRuntimeError('toRepeatingDecimal: d ' + d.toString() +
				  " is not an integer.");
	    }
	    if (equals(d, 0)) {
		throwRuntimeError('toRepeatingDecimal: d equals 0');
	    }
	    if (lessThan(d, 0)) {
		throwRuntimeError('toRepeatingDecimal: d < 0');
	    }
 	    var sign = (lessThan(n, 0) ? "-" : "");
 	    n = abs(n);
 	    var beforeDecimalPoint = sign + quotient(n, d);
 	    var afterDecimals = getResidue(remainder(n, d), d, limit);
 	    return [beforeDecimalPoint].concat(afterDecimals);
	};
    })();
    //////////////////////////////////////////////////////////////////////




    // External interface of js-numbers:

    Numbers['fromFixnum'] = fromFixnum;
    Numbers['fromString'] = fromString;
    Numbers['makeBignum'] = makeBignum;
    Numbers['makeRational'] = Rational.makeInstance;
    Numbers['makeFloat'] = FloatPoint.makeInstance;
    Numbers['makeComplex'] = Complex.makeInstance;
    Numbers['makeComplexPolar'] = makeComplexPolar;

    Numbers['pi'] = FloatPoint.pi;
    Numbers['e'] = FloatPoint.e;
    Numbers['nan'] = FloatPoint.nan;
    Numbers['negative_inf'] = FloatPoint.neginf;
    Numbers['inf'] = FloatPoint.inf;
    Numbers['negative_one'] = -1;   // Rational.NEGATIVE_ONE;
    Numbers['zero'] = 0;            // Rational.ZERO;
    Numbers['one'] = 1;             // Rational.ONE;
    Numbers['i'] = plusI;
    Numbers['negative_i'] = minusI;
    Numbers['negative_zero'] = NEGATIVE_ZERO;

    Numbers['onThrowRuntimeError'] = onThrowRuntimeError;
    Numbers['isSchemeNumber'] = isSchemeNumber;
    Numbers['isRational'] = isRational;
    Numbers['isReal'] = isReal;
    Numbers['isExact'] = isExact;
    Numbers['isInexact'] = isInexact;
    Numbers['isInteger'] = isInteger;

    Numbers['toFixnum'] = toFixnum;
    Numbers['toExact'] = toExact;
    Numbers['toInexact'] = toInexact;
    Numbers['add'] = add;
    Numbers['subtract'] = subtract;
    Numbers['multiply'] = multiply;
    Numbers['divide'] = divide;
    Numbers['equals'] = equals;
    Numbers['eqv'] = eqv;
    Numbers['approxEquals'] = approxEquals;
    Numbers['greaterThanOrEqual'] = greaterThanOrEqual;
    Numbers['lessThanOrEqual'] = lessThanOrEqual;
    Numbers['greaterThan'] = greaterThan;
    Numbers['lessThan'] = lessThan;
    Numbers['expt'] = expt;
    Numbers['exp'] = exp;
    Numbers['modulo'] = modulo;
    Numbers['numerator'] = numerator;
    Numbers['denominator'] = denominator;
    Numbers['integerSqrt'] = integerSqrt;
    Numbers['sqrt'] = sqrt;
    Numbers['abs'] = abs;
    Numbers['quotient'] = quotient;
    Numbers['remainder'] = remainder;
    Numbers['floor'] = floor;
    Numbers['ceiling'] = ceiling;
    Numbers['conjugate'] = conjugate;
    Numbers['magnitude'] = magnitude;
    Numbers['log'] = log;
    Numbers['angle'] = angle;
    Numbers['tan'] = tan;
    Numbers['atan'] = atan;
    Numbers['cos'] = cos;
    Numbers['sin'] = sin;
    Numbers['tan'] = tan;
    Numbers['acos'] = acos;
    Numbers['asin'] = asin;
    Numbers['cosh'] = cosh;
    Numbers['sinh'] = sinh;
    Numbers['imaginaryPart'] = imaginaryPart;
    Numbers['realPart'] = realPart;
    Numbers['round'] = round;
    Numbers['sqr'] = sqr;
    Numbers['gcd'] = gcd;
    Numbers['lcm'] = lcm;

    Numbers['toRepeatingDecimal'] = toRepeatingDecimal;



    // The following exposes the class representations for easier
    // integration with other projects.
    Numbers['BigInteger'] = BigInteger;
    Numbers['Rational'] = Rational;
    Numbers['FloatPoint'] = FloatPoint;
    Numbers['Complex'] = Complex;   

    Numbers['MIN_FIXNUM'] = MIN_FIXNUM;
    Numbers['MAX_FIXNUM'] = MAX_FIXNUM;

})();

/**
 * Copyright 2009 Tim Down.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


//     *
//       void put(Object key, Object value)

//       Sets the value associated with the key supplied. If the hash table already contains the key then the old value is overwritten.
//     *
//       void get(Object key)

//       Returns the value associated with the key supplied, or null if no value is found for that key.
//     *
//       Boolean containsKey(Object key)

//       Returns whether the hash table contains the specified key.
//     *
//       Boolean containsValue(Object value)

//       Returns whether the hash table contains the specified value.
//     *
//       void clear()

//       Removes all entries from the hash table.
//     *
//       Boolean isEmpty()

//       Returns true if the hash table contains no key/value pairs.
//     *
//       Array keys()

//       Returns an array containing all the keys contained in the hash table.
//     *
//       Array values()

//       Returns an array containing all the values contained in the hash table.
//     *
//       void remove(Object key)

//       Removes the key and its corresponding value from the hash table.
//     *
//       Number size()

//       Returns the number of key/value pairs contained in the hash table.


var _Hashtable=(function(){function _1(_2){return(typeof _2==="undefined");};function _3(_4){return(typeof _4==="function");};function _5(_6){return(typeof _6==="string");};function _7(_8,_9){return _3(_8[_9]);};function _a(_b){return _7(_b,"equals");};function _c(_d){return _7(_d,"hashCode");};function _e(_f){if(_5(_f)){return _f;}else{if(_c(_f)){var _10=_f.hashCode();if(!_5(_10)){return _e(_10);}
return _10;}else{if(_7(_f,"toString")){return _f.toString();}else{return String(_f);}}}};function _11(_12,_13){return _12.equals(_13);};function _14(_15,_16){if(_a(_16)){return _16.equals(_15);}else{return _15===_16;}};function _17(o1,o2){return o1===o2;};function _1a(arr,_1c,_1d,_1e,_1f){var _20;for(var i=0,len=arr.length;i<len;i++){_20=arr[i];if(_1f(_1c,_1d(_20))){return _1e?[i,_20]:true;}}
return false;};function _23(arr,idx){if(_7(arr,"splice")){arr.splice(idx,1);}else{if(idx===arr.length-1){arr.length=idx;}else{var _26=arr.slice(idx+1);arr.length=idx;for(var i=0,len=_26.length;i<len;i++){arr[idx+i]=_26[i];}}}};function _29(kv,_2b){if(kv===null){throw new Error("null is not a valid "+_2b);}else{if(_1(kv)){throw new Error(_2b+" must not be undefined");}}};var _2c="key",_2d="value";function _2e(key){_29(key,_2c);};function _30(_31){_29(_31,_2d);};function _32(_33,_34,_35){this.entries=[];this.addEntry(_33,_34);if(_35!==null){this.getEqualityFunction=function(){return _35;};}};function _36(_37){return _37[0];};function _38(_39){return _39[1];};_32.prototype={getEqualityFunction:function(_3a){if(_a(_3a)){return _11;}else{return _14;}},searchForEntry:function(key){return _1a(this.entries,key,_36,true,this.getEqualityFunction(key));},getEntryForKey:function(key){return this.searchForEntry(key)[1];},getEntryIndexForKey:function(key){return this.searchForEntry(key)[0];},removeEntryForKey:function(key){var _3f=this.searchForEntry(key);if(_3f){_23(this.entries,_3f[0]);return true;}
return false;},addEntry:function(key,_41){this.entries[this.entries.length]=[key,_41];},size:function(){return this.entries.length;},keys:function(_42){var _43=_42.length;for(var i=0,len=this.entries.length;i<len;i++){_42[_43+i]=this.entries[i][0];}},values:function(_46){var _47=_46.length;for(var i=0,len=this.entries.length;i<len;i++){_46[_47+i]=this.entries[i][1];}},containsKey:function(key){return _1a(this.entries,key,_36,false,this.getEqualityFunction(key));},containsValue:function(_4b){return _1a(this.entries,_4b,_38,false,_17);}};function _4c(){};_4c.prototype=[];function _4d(_4e){return _4e[0];};function _4f(_50,_51,_52){return _1a(_50,_51,_4d,true,_52);};function _53(_54,_55){var _56=_54[_55];if(_56&&(_56 instanceof _4c)){return _56[1];}
return null;};function _57(_58,_59){var _5a=[];var _5b={};_58=_3(_58)?_58:_e;_59=_3(_59)?_59:null;this.put=function(key,_5d){_2e(key);_30(_5d);var _5e=_58(key);var _5f=_53(_5b,_5e);if(_5f){var _60=_5f.getEntryForKey(key);if(_60){_60[1]=_5d;}else{_5f.addEntry(key,_5d);}}else{var _61=new _4c();_61[0]=_5e;_61[1]=new _32(key,_5d,_59);_5a[_5a.length]=_61;_5b[_5e]=_61;}};this.get=function(key){_2e(key);var _63=_58(key);var _64=_53(_5b,_63);if(_64){var _65=_64.getEntryForKey(key);if(_65){return _65[1];}}
return null;};this.containsKey=function(key){_2e(key);var _67=_58(key);var _68=_53(_5b,_67);if(_68){return _68.containsKey(key);}
return false;};this.containsValue=function(_69){_30(_69);for(var i=0,len=_5a.length;i<len;i++){if(_5a[i][1].containsValue(_69)){return true;}}
return false;};this.clear=function(){_5a.length=0;_5b={};};this.isEmpty=function(){return _5a.length===0;};this.keys=function(){var _6c=[];for(var i=0,len=_5a.length;i<len;i++){_5a[i][1].keys(_6c);}
return _6c;};this.values=function(){var _6f=[];for(var i=0,len=_5a.length;i<len;i++){_5a[i][1].values(_6f);}
return _6f;};this.remove=function(key){_2e(key);var _73=_58(key);var _74=_53(_5b,_73);if(_74){if(_74.removeEntryForKey(key)){if(_74.size()===0){var _75=_4f(_5a,_73,_74.getEqualityFunction(key));_23(_5a,_75[0]);delete _5b[_73];}}}};this.size=function(){var _76=0;for(var i=0,len=_5a.length;i<len;i++){_76+=_5a[i][1].size();}
return _76;};};return _57;})();
//////////////////////////////////////////////////////////////////////
// helper functions

//var jsnums = require('./js-numbers');
var types = {};
(function () {

var hasOwnProperty = {}.hasOwnProperty;

//////////////////////////////////////////////////////////////////////
var _eqHashCodeCounter = 0;
makeEqHashCode = function() {
    _eqHashCodeCounter++;
    return _eqHashCodeCounter;
};
// getHashCode: any -> (or fixnum string)
// Produces a hashcode appropriate for eq.
getEqHashCode = function(x) {
    if (x && !x._eqHashCode) {
	x._eqHashCode = makeEqHashCode();
    }
    if (x && x._eqHashCode) {
	return x._eqHashCode;
    }
    if (typeof(x) == 'string') {
	return x;
    }
    return 0;
};
// Union/find for circular equality testing.
var UnionFind = function() {
	// this.parenMap holds the arrows from an arbitrary pointer
	// to its parent.
	this.parentMap = makeLowLevelEqHash();
}

// find: ptr -> UnionFindNode
// Returns the representative for this ptr.
UnionFind.prototype.find = function(ptr) {
	var parent = (this.parentMap.containsKey(ptr) ? 
		      this.parentMap.get(ptr) : ptr);
	if (parent === ptr) {
	    return parent;
	} else {
	    var rep = this.find(parent);
	    // Path compression:
	    this.parentMap.put(ptr, rep);
	    return rep;
	}
};

// merge: ptr ptr -> void
// Merge the representative nodes for ptr1 and ptr2.
UnionFind.prototype.merge = function(ptr1, ptr2) {
	this.parentMap.put(this.find(ptr1), this.find(ptr2));
};

//////////////////////////////////////////////////////////////////////
// simpleToDomNode : String String String -> <SPAN>
// Consumes the displayed contents and the ariaText, and produces a span
function simpleToDomNode(contents, className, ariaText) {
	var wrapper = document.createElement("span");
    wrapper.className = className;
	wrapper.ariaText = ariaText;
	wrapper.setAttribute("aria-label", ariaText);
    wrapper.appendChild(document.createTextNode(contents));
    return wrapper;
}

//////////////////////////////////////////////////////////////////////
// Class inheritance infrastructure
// This code copied directly from http://ejohn.org/blog/simple-javascript-inheritance/
var Class = (function(){
	var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
	// The base Class implementation (does nothing)
	var innerClass = function(){};
	
	// Create a new Class that inherits from this class
	innerClass.extend = function(prop) {
		var _super = this.prototype;
		
		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
		
		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" && 
				typeof _super[name] == "function" && fnTest.test(prop[name]) ?
				(function(name, fn){
					return function() {
						var tmp = this._super;
						
						// Add a new ._super() method that is the same method
						// but on the super-class
						this._super = _super[name];
						
						// The method only need to be bound temporarily, so we
						// remove it when we're done executing
						var ret = fn.apply(this, arguments);				
						this._super = tmp;
						
						return ret;
					};
				})(name, prop[name]) :
				prop[name];
		}
		
		// The dummy class constructor
		var Dummy = function() {
			// All construction is actually done in the init method
			if ( !initializing && this.init )
				this.init.apply(this, arguments);
		}
		
		// Populate our constructed prototype object
		Dummy.prototype = prototype;
		
		// Enforce the constructor to be what we expect
		Dummy.constructor = Dummy;

		// And make this class extendable
		Dummy.extend = arguments.callee;
		
		return Dummy;
	};
	return innerClass;
})();
 
function makeLParen(){
   var node = document.createElement('span');
   node.appendChild(document.createTextNode("("));
   node.className = "lParen";
   return node;
}

function makeRParen(){
   var node = document.createElement('span');
   node.appendChild(document.createTextNode(")"));
   node.className = "rParen";
   return node;
}

//////////////////////////////////////////////////////////////////////
// Struct Types
StructType = function(name, type, numberOfArgs, numberOfFields, firstField,
		      constructor, predicate, accessor, mutator) {
	this.name = name;
	this.type = type;
	this.numberOfArgs = numberOfArgs;
	this.numberOfFields = numberOfFields;
	this.firstField = firstField;

	this.constructor = constructor;
	this.predicate = predicate;
	this.accessor = accessor;
	this.mutator = mutator;
};
StructType.prototype.toString = function() {
	return '#<struct-type:' + this.name + '>';
};
StructType.prototype.isEqual = function(other, aUnionFind) {
	return this === other;
};
var makeStructureType = function(theName, parentType, initFieldCnt, autoFieldCnt, autoV, guard) {
    // If no parent type given, then the parent type is Struct
    if ( !parentType ) {
	parentType = ({type: Struct,
		       numberOfArgs: 0,
		       numberOfFields: 0,
		       firstField: 0});
    }
    var numParentArgs = parentType.numberOfArgs;

    // Create a new struct type inheriting from the parent
    var aStruct = parentType.type.extend({
	init: function(name, initArgs) {
		// if there's no guard, construct a default one

		if (!guard) {
			guard = function(k) {
				if (arguments.length == 3) {
					k(arguments[1]);
				}
				else {
					var args = [];
					var i;
					for(i = 1; i < arguments.length-1; i++) {
						args.push(arguments[i]);
					}
					k(new ValuesWrapper(args));
				}
			}
		}

		var that = this;
		var cont = function(guardRes) {
			var guardedArgs;
			if ( guardRes instanceof ValuesWrapper ) {
				guardedArgs = guardRes.elts;
			} else {
				guardedArgs = [guardRes];
			}
			
			var parentArgs = guardedArgs.slice(0, numParentArgs);
			that._super(name, parentArgs);

			for (var i = 0; i < initFieldCnt; i++) {
				that._fields.push(guardedArgs[i+numParentArgs]);
			}
			for (var i = 0; i < autoFieldCnt; i++) {
				that._fields.push(autoV);
			}
		};
		initArgs.unshift(cont);
		initArgs.push(Symbol.makeInstance(name));
		guard.apply(null, initArgs);
	}
    });
    // Set type, necessary for equality checking
    aStruct.prototype.type = aStruct;

    // construct and return the new type
    return new StructType(theName,
			  aStruct,
			  initFieldCnt + numParentArgs,
			  initFieldCnt + autoFieldCnt,
			  parentType.firstField + parentType.numberOfFields,
			  function() {
			  	var args = [];
				for (var i = 0; i < arguments.length; i++) {
					args.push(arguments[i]);
				}
				return new aStruct(theName, args);
			  },
			  function(x) { return x instanceof aStruct; },
			  function(x, i) { return x._fields[i + this.firstField]; },
			  function(x, i, v) { x._fields[i + this.firstField] = v; });
};
// Structures.
var Struct = Class.extend({
	init: function (constructorName, fields) {
	    this._constructorName = constructorName; 
	    this._fields = [];
	},

	toWrittenString: function(cache) { 
	    //    cache.put(this, true);
	    var buffer = [];
	    var i;
	    buffer.push("(");
	    buffer.push(this._constructorName);
	    for(i = 0; i < this._fields.length; i++) {
			buffer.push(" ");
			buffer.push(toWrittenString(this._fields[i], cache));
	    }
	    buffer.push(")");
	    return buffer.join("");
	},

	toDisplayedString: this.toWrittenString,

	toDomNode: function(cache) {
	    //    cache.put(this, true);
	    var wrapper = document.createElement("span"),
            constructor= document.createElement("span");
            constructor.appendChild(document.createTextNode(this._constructorName)),
            ariaText = this._constructorName + ":";
	    var i;
	    wrapper.appendChild(makeLParen());
	    wrapper.appendChild(constructor);
	    for(i = 0; i < this._fields.length; i++) {
	    	var dom = toDomNode(this._fields[i], cache);
	    	ariaText += " "+dom.ariaText;
            wrapper.appendChild(dom);
	    }
	    wrapper.appendChild(makeRParen());
	    wrapper.ariaText = ariaText;
	    wrapper.setAttribute("aria-label", ariaText);
	    return wrapper;
	},


	isEqual: function(other, aUnionFind) {
	    if ( other.type == undefined ||
		 this.type !== other.type ||
		 !(other instanceof this.type) ) {
		    return false;
	    }

	    for (var i = 0; i < this._fields.length; i++) {
		if (! isEqual(this._fields[i],
			      other._fields[i],
			      aUnionFind)) {
			return false;
		}
	    }
	    return true;
	}
});
Struct.prototype.type = Struct;

//////////////////////////////////////////////////////////////////////
// Hashtables
// makeLowLevelEqHash: -> hashtable
// Constructs an eq hashtable that uses Moby's getEqHashCode function.
var makeLowLevelEqHash = function() {
    return new _Hashtable(function(x) { return getEqHashCode(x); },
			  function(x, y) { return x === y; });
};

var EqHashTable = function(inputHash) {
    this.hash = makeLowLevelEqHash();
    this.mutable = true;

};
EqHashTable = EqHashTable;
EqHashTable.prototype.toWrittenString = function(cache) {
    var keys = this.hash.keys();
    var ret = [];
    for (var i = 0; i < keys.length; i++) {
	    var keyStr = types.toWrittenString(keys[i], cache);
	    var valStr = types.toWrittenString(this.hash.get(keys[i]), cache);
	    ret.push('(' + keyStr + ' . ' + valStr + ')');
    }
    return ('#hasheq(' + ret.join(' ') + ')');
};
EqHashTable.prototype.toDisplayedString = EqHashTable.prototype.toWrittenString;
EqHashTable.prototype.isEqual = function(other, aUnionFind) {
    if ( !(other instanceof EqHashTable) ) {
		return false; 
    }
    if (this.hash.keys().length != other.hash.keys().length) { 
		return false;
    }
    var keys = this.hash.keys();
    for (var i = 0; i < keys.length; i++){
		if ( !(other.hash.containsKey(keys[i]) &&
		       isEqual(this.hash.get(keys[i]),
			       other.hash.get(keys[i]),
			       aUnionFind)) ) {
			return false;
		}
    }
    return true;
};
var EqualHashTable = function(inputHash) {
	this.hash = new _Hashtable(function(x) {
			return toWrittenString(x); 
		},
		function(x, y) {
			return isEqual(x, y, new UnionFind()); 
		});
	this.mutable = true;
};
EqualHashTable = EqualHashTable;
EqualHashTable.prototype.toWrittenString = function(cache) {
    var keys = this.hash.keys();
    var ret = [];
    for (var i = 0; i < keys.length; i++) {
	    var keyStr = types.toWrittenString(keys[i], cache);
	    var valStr = types.toWrittenString(this.hash.get(keys[i]), cache);
	    ret.push('(' + keyStr + ' . ' + valStr + ')');
    }
    return ('#hash(' + ret.join(' ') + ')');
};
EqualHashTable.prototype.toDisplayedString = EqualHashTable.prototype.toWrittenString;
EqualHashTable.prototype.toDomNode = function(cache) {
	var wrapper = document.createElement("span"),
		hashSymbol = document.createElement("span"),
    	keys = this.hash.keys(),
    	ariaText = "hashtable with "+keys.length + " item"+(keys.length==1? "" : "s")+": ";
    wrapper.appendChild(document.createTextNode(this.toDisplayedString()));
    for (var i = 0; i < keys.length; i++) {
	    var keyDom = toDomNode(keys[i], cache);
	    var valDom = toDomNode(this.hash.get(keys[i]), cache);
	    ariaText += " "+keyDom.ariaText+" maps to "+valDom.ariaText;
    }
    wrapper.ariaText = ariaText;
    wrapper.setAttribute("aria-label", ariaText);
    return wrapper;
};
EqualHashTable.prototype.isEqual = function(other, aUnionFind) {
    if ( !(other instanceof EqualHashTable) ) {
		return false; 
    }
    if (this.hash.keys().length != other.hash.keys().length) { 
		return false;
    }
    var keys = this.hash.keys();
    for (var i = 0; i < keys.length; i++){
		if (! (other.hash.containsKey(keys[i]) &&
		       isEqual(this.hash.get(keys[i]),
			       other.hash.get(keys[i]),
			       aUnionFind))) {
		    return false;
		}
    }
    return true;
};

//////////////////////////////////////////////////////////////////////
// Boxes
var Box = function(x, mutable) {
	this.val = x;
	this.mutable = mutable;
};
Box.prototype.unbox = function() {
    return this.val;
};
Box.prototype.set = function(newVal) {
    if (this.mutable) {
	    this.val = newVal;
    }
};
Box.prototype.toString = function() {
    return "#&" + this.val.toString();
};
Box.prototype.toWrittenString = function(cache) {
    return "#&" + toWrittenString(this.val, cache);
};
Box.prototype.toDisplayedString = this.toWrittenString;
Box.prototype.toDomNode = function(cache) {
    var wrapper = document.createElement("span"),
    boxSymbol = document.createElement("span");
    boxSymbol.appendChild(document.createTextNode("#&"));
    var ariaText = "a box containing: "+toDomNode(this.val).ariaText;
    wrapper.className = "wescheme-box";
	wrapper.ariaText = ariaText;
	wrapper.setAttribute("aria-label", ariaText);
    wrapper.appendChild(boxSymbol);
    wrapper.appendChild(toDomNode(this.val, cache));
    return wrapper;
};

//////////////////////////////////////////////////////////////////////
// Booleans
// We are reusing the built-in Javascript boolean class here.
Logic = {
    TRUE : true,
    FALSE : false
};
// WARNING: we are extending the built-in Javascript boolean class here!
Boolean.prototype.toString = function() { return this.valueOf() ? "true" : "false"; };
Boolean.prototype.toWrittenString = Boolean.prototype.toString
Boolean.prototype.toDisplayedString = Boolean.prototype.toString;
Boolean.prototype.toDomNode = function() {
	return simpleToDomNode( this.toString(), 
							"wescheme-boolean", 
							this.toString() + ", a Boolean");
};
Boolean.prototype.isEqual = function(other, aUnionFind){
    return this == other;
};

//////////////////////////////////////////////////////////////////////
// Chars
// Char: string -> Char
Char = function(val){
    this.val = val;
};
Char.makeInstance = function(val){
    return new Char(val);
};
Char.prototype.toString = function() {
	var code = this.val.charCodeAt(0);
	var returnVal;
	switch (code) {
		case 0: returnVal = '#\\nul'; break;
		case 8: returnVal = '#\\backspace'; break;
		case 9: returnVal = '#\\tab'; break;
		case 10: returnVal = '#\\newline'; break;
		case 11: returnVal = '#\\vtab'; break;
		case 12: returnVal = '#\\page'; break;
		case 13: returnVal = '#\\return'; break;
		case 20: returnVal = '#\\space'; break;
		case 127: returnVal = '#\\rubout'; break;
		default: if (code >= 32 && code <= 126) {
				 returnVal = ("#\\" + this.val);
			 }
			 else {
				 var numStr = code.toString(16).toUpperCase();
				 while (numStr.length < 4) {
					 numStr = '0' + numStr;
				 }
				 returnVal = ('#\\u' + numStr);
			 }
			 break;
	}
	return returnVal;
};
Char.prototype.toWrittenString = Char.prototype.toString;
Char.prototype.toDisplayedString = function (cache) {
    return this.val;
};
Char.prototype.toDomNode = function() {
	return simpleToDomNode( this.toString(), 
							"wescheme-character", 
							this.toString().substring(2) + ", a Character");
}
Char.prototype.getValue = function() {
    return this.val;
};
Char.prototype.isEqual = function(other, aUnionFind){
    return other instanceof Char && this.val == other.val;
};

////////////////////////////////////////////////////////////////////// 
// Symbols
var Symbol = function(val) {
    this.val = val;
};
var symbolCache = {};
  
// makeInstance: string -> Symbol.
Symbol.makeInstance = function(val) {
    // To ensure that we can eq? symbols with equal values.
    if (!(hasOwnProperty.call(symbolCache, val))) {
		symbolCache[val] = new Symbol(val);
    }
    return symbolCache[val];
}; 
Symbol.prototype.isEqual = function(other, aUnionFind) {
    return other instanceof Symbol &&
    this.val == other.val;
};
Symbol.prototype.toString = function() {
    return this.val;
};
Symbol.prototype.toWrittenString = function(cache) {
    return this.val;
};
Symbol.prototype.toDisplayedString = this.toWrittenString;
Symbol.prototype.toDomNode = function(cache) {
	var dom = simpleToDomNode(this.toString(), 
							"wescheme-symbol", 
							"'"+this.val + ", a Symbol");
    dom.style.fontFamily = 'monospace';
    dom.style.whiteSpace = "pre";
    return dom;
};

//////////////////////////////////////////////////////////////////////
// Cons, Lists and Empty    
Empty = function() {};
Empty.EMPTY = new Empty();
Empty.prototype.isEqual = function(other, aUnionFind) {
    return other instanceof Empty;
};
Empty.prototype.reverse = function() {
    return this;
};
Empty.prototype.first = function() {
    throw new Error("first can't be applied on empty.");
};
Empty.prototype.rest = function() {
    throw new Error("rest can't be applied on empty.");
};
Empty.prototype.isEmpty = function() {
    return true;
};
Empty.prototype.toWrittenString = function(cache) { return "empty"; };
Empty.prototype.toDisplayedString = this.toWrittenString;
Empty.prototype.toString = function(cache) { return "()"; }; 
Empty.prototype.toDomNode = function(cache) { 
	var wrapper = document.createElement("span");
	var dom = simpleToDomNode("empty", "wescheme-symbol", "empty");
    dom.style.fontFamily = 'monospace';
    dom.style.whiteSpace = "pre";
    return dom;
};

// Empty.append: (listof X) -> (listof X)
Empty.prototype.append = function(b){
    return b;
};
Cons = function(f, r) {
    this.f = f;
    this.r = r;
};
Cons.prototype.reverse = function() {
    var lst = this;
    var ret = Empty.EMPTY;
    while (!lst.isEmpty()){
		ret = Cons.makeInstance(lst.first(), ret);
		lst = lst.rest();
    }
    return ret;
};
Cons.makeInstance = function(f, r) {
    return new Cons(f, r);
};
// FIXME: can we reduce the recursion on this?
Cons.prototype.isEqual = function(other, aUnionFind) {
    if (! (other instanceof Cons)) {
		return Logic.FALSE;
    }
    return (isEqual(this.first(), other.first(), aUnionFind) &&
	    	isEqual(this.rest(), other.rest(), aUnionFind));
};
Cons.prototype.first = function() {
    return this.f;
};  
Cons.prototype.rest = function() {
    return this.r;
};  
Cons.prototype.isEmpty = function() {
    return false;
};  
// Cons.append: (listof X) -> (listof X)
Cons.prototype.append = function(b){
    if (b === Empty.EMPTY)
	return this;
    var ret = b;
    var lst = this.reverse();
    while ( !lst.isEmpty() ) {
		ret = Cons.makeInstance(lst.first(), ret);
		lst = lst.rest();
    }
	
    return ret;
};
Cons.prototype.toWrittenString = function(cache) {
    //    cache.put(this, true);
    var texts = ["list"];
    var p = this;
    while ( p instanceof Cons ) {
		texts.push(toWrittenString(p.first(), cache));
		p = p.rest();
    }
    if ( p !== Empty.EMPTY ) {
		// If not a list, we've got to switch over to cons pair
		// representation.
		return explicitConsString(this, cache, toWrittenString);
    }
    return "(" + texts.join(" ") + ")";
};
var explicitConsString = function(p, cache, f) {
    var texts = [];
    var tails = []
    while ( p instanceof Cons ) {
		texts.push("(cons ");
		texts.push(f(p.first(), cache));
		texts.push(" ");
		tails.push(")");
		p = p.rest();
    }
    texts.push(f(p, cache));
    return (texts.join("") + tails.join(""));
};
Cons.prototype.toString = Cons.prototype.toWrittenString;
Cons.prototype.toDisplayedString = this.toWrittenString;
Cons.prototype.toDomNode = function(cache) {
    //    cache.put(this, true);
    var node = document.createElement("span"),
        abbr = document.createElement("span");
    node.className = "wescheme-cons";
    abbr.appendChild(document.createTextNode("list"));
 
    node.appendChild(makeLParen());
    node.appendChild(abbr);
    var p = this, i = 0, ariaElts = "";
    while ( p instanceof Cons ) {
    	var dom = toDomNode(p.first(), cache);
    	node.appendChild(dom);
    	i++;
		ariaElts += ", " + dom.ariaText || dom.textContent;
    	p = p.rest();
    }
    if ( p !== Empty.EMPTY ) {
		return explicitConsDomNode(this, cache);
    }
 	node.appendChild(makeRParen());
 	var ariaText = "list of "+i+ " element"+(i==1? "" : "s")+": "+ariaElts;
 	node.setAttribute("aria-label", ariaText);
 	node.ariaText = ariaText;
    return node;
};
var explicitConsDomNode = function(p, cache) {
    var topNode = document.createElement("span");
    var node = topNode, constructor = document.createElement("span");
       	constructor.appendChild(document.createTextNode("cons")),
       	ariaText = "", trailingRParens="";

    node.className = "wescheme-cons";
    while ( p instanceof Cons ) {
      node.appendChild(makeLParen());
      node.appendChild(constructor.cloneNode(true));
      ariaText += " (cons";
      trailingRParens += ")";
      var first = toDomNode(p.first(), cache);
      ariaText += " " + first.ariaText || first.textContent;
      node.appendChild(first);
      var restSpan = document.createElement("span");
      node.appendChild(restSpan);
      node.appendChild(makeRParen());
      node = restSpan;
      p = p.rest();
    }
    var rest = toDomNode(p, cache);
    ariaText += " " + (rest.ariaText || rest.textContent) + ")"+trailingRParens;
    node.appendChild(rest);
    topNode.ariaText = ariaText;
    topNode.setAttribute("aria-label", ariaText);
    return topNode;
};

//////////////////////////////////////////////////////////////////////
// Vectors
Vector = function(n, initialElements) {
    this.elts = new Array(n);
    if (initialElements) {
		for (var i = 0; i < n; i++) {
		    this.elts[i] = initialElements[i];
		}
    } else {
		for (var i = 0; i < n; i++) {
		    this.elts[i] = undefined;
		}
    }
    this.mutable = true;
};
Vector.makeInstance = function(n, elts) {
    return new Vector(n, elts);
}
Vector.prototype.length = function() {
	return this.elts.length;
};
Vector.prototype.ref = function(k) {
    return this.elts[k];
};
Vector.prototype.set = function(k, v) {
    this.elts[k] = v;
};
Vector.prototype.isEqual = function(other, aUnionFind) {
    if (other != null && other != undefined && other instanceof Vector) {
		if (other.length() != this.length()) {
		    return false
		}
		for (var i = 0; i <  this.length(); i++) {
		    if (! isEqual(this.elts[i], other.elts[i], aUnionFind)) {
			return false;
		    }
		}
		return true;
    } else {
		return false;
    }
};

Vector.prototype.toList = function() {
    var ret = Empty.EMPTY;
    for (var i = this.length() - 1; i >= 0; i--) {
		ret = Cons.makeInstance(this.elts[i], ret);	    
    }	
    return ret;
};
Vector.prototype.toWrittenString = function(cache) {
    //    cache.put(this, true);
    var texts = [];
    for (var i = 0; i < this.length(); i++) {
		texts.push(toWrittenString(this.ref(i), cache));
    }
    return "#(" + texts.join(" ") + ")";
};
Vector.prototype.toDisplayedString = this.toWrittenString;
Vector.prototype.toDomNode = function(cache) {
    var wrapper = document.createElement("span"),
        lVect = document.createElement("span"),
        rVect = document.createElement("span");
    lVect.appendChild(document.createTextNode("#("));
    lVect.className = "lParen";
    rVect.appendChild(document.createTextNode(")"));
    rVect.className = "rParen";
    wrapper.className = "wescheme-vector";
    wrapper.appendChild(lVect);
    var ariaText = "a vector of size "+this.length() + ": ";
    for (var i = 0; i < this.length(); i++) {
    	var dom = toDomNode(this.ref(i), cache)
    	ariaText+=" "+dom.ariaText
    	wrapper.appendChild(dom);
    }
    wrapper.appendChild(rVect);
    wrapper.setAttribute("aria-label", ariaText);
    wrapper.ariaText = ariaText;
    return wrapper;
};

//////////////////////////////////////////////////////////////////////
// Strings
var Str = function(chars) {
	this.chars = chars;
	this.length = chars.length;
	this.mutable = true;
}
Str.makeInstance = function(chars) {
	return new Str(chars);
}
Str.fromString = function(s) {
	return Str.makeInstance(s.split(""));
}
Str.prototype.toString = function() {
	return this.chars.join("");
}
Str.prototype.toWrittenString = function(cache) {
    return escapeString(this.toString());
}
Str.prototype.toDisplayedString = Str.prototype.toString;
Str.prototype.copy = function() {
	return Str.makeInstance(this.chars.slice(0));
}
Str.prototype.substring = function(start, end) {
	if (end == null || end == undefined) {
		end = this.length;
	}	
	return Str.makeInstance( this.chars.slice(start, end) );
}
Str.prototype.charAt = function(index) {
	return this.chars[index];
}
Str.prototype.charCodeAt = function(index) {
	return this.chars[index].charCodeAt(0);
}
Str.prototype.replace = function(expr, newStr) {
	return Str.fromString( this.toString().replace(expr, newStr) );
}
Str.prototype.isEqual = function(other, aUnionFind) {
	if ( !(other instanceof Str || typeof(other) == 'string') ) {
		return false;
	}
	return this.toString() === other.toString();
}
Str.prototype.set = function(i, c) {
	this.chars[i] = c;
}
Str.prototype.toUpperCase = function() {
	return Str.fromString( this.chars.join("").toUpperCase() );
}
Str.prototype.toLowerCase = function() {
	return Str.fromString( this.chars.join("").toLowerCase() );
}
Str.prototype.match = function(regexpr) {
	return this.toString().match(regexpr);
}
var escapeString = function(s) {
    return '"' + replaceUnprintableStringChars(s) + '"';
};
var replaceUnprintableStringChars = function(s) {
	var ret = [];
	for (var i = 0; i < s.length; i++) {
		var val = s.charCodeAt(i);
		switch(val) {
			case 7: ret.push('\\a'); break;
			case 8: ret.push('\\b'); break;
			case 9: ret.push('\\t'); break;
			case 10: ret.push('\\n'); break;
			case 11: ret.push('\\v'); break;
			case 12: ret.push('\\f'); break;
			case 13: ret.push('\\r'); break;
			case 34: ret.push('\\"'); break;
			case 92: ret.push('\\\\'); break;
			default: if (val >= 32 && val <= 126) {
					 ret.push( s.charAt(i) );
				 }
				 else {
					 var numStr = val.toString(16).toUpperCase();
					 while (numStr.length < 4) {
						 numStr = '0' + numStr;
					 }
					 ret.push('\\u' + numStr);
				 }
				 break;
		}
	}
	return ret.join('');
};

//////////////////////////////////////////////////////////////////////
// Native JS-objects
var JsObject = function(name, obj) {
	this.name = name;
	this.obj = obj;
};
JsObject.prototype.toString = function() {
	return '#<js-object:' + typeof(this.obj) + ':' + this.name + '>';
};
JsObject.prototype.isEqual = function(other, aUnionFind) {
	return (this.obj === other.obj);
};

//////////////////////////////////////////////////////////////////////
// World Configs
var WorldConfig = function(startup, shutdown, args) {
	this.startup = startup;
	this.shutdown = shutdown;
	this.startupArgs = args;
	this.shutdownArg = undefined;
};
WorldConfig.prototype.toString = function() {
	return '#<world-config>';
};
WorldConfig.prototype.isEqual = function(other, aUnionFind) {
	if ( ! isEqual(this.startup, other.startup, aUnionFind) ||
	     ! isEqual(this.shutdown, other.shutdown, aUnionFind) ||
	     this.startupArgs.length != other.startupArgs.length || 
	     ! isEqual(this.shutdownArg, other.shutdownArg, aUnionFind) ) {
		return false;
	}

	for (var i = 0; i < args.length; i++) {
		if ( !isEqual(this.startupArgs[i], other.startupArgs[i], aUnionFind) )
			return false;
	}
	return true;
};
var Effect = makeStructureType('effect', false, 0, 0, false, false);
Effect.type.prototype.invokeEffect = function(k) {
	helpers.raise(types.incompleteExn(
			types.exnFail,
			'effect type created without using make-effect-type',
			[]));
};
var makeEffectType = function(name, superType, initFieldCnt, impl, guard, caller) {
	if ( !superType ) {
		superType = Effect;
	}
	
	var newType = makeStructureType(name, superType, initFieldCnt, 0, false, guard);
	var lastFieldIndex = newType.firstField + newType.numberOfFields;

	newType.type.prototype.invokeEffect = function(changeWorld, k) {
		var schemeChangeWorld = new PrimProc('update-world', 1, false, true,
			function(aState, worldUpdater) {
				helpers.check(aState, worldUpdater, helpers.procArityContains(1),
					      'update-world', 'procedure (arity 1)', 1);
				
				changeWorld(function(w, k2) { interpret.call(aState,
									     worldUpdater, [w],
									     k2,
									     function(e) { throw e; }); },
					    function() { aState.v = VOID_VALUE; });
			});

		var args = this._fields.slice(0, lastFieldIndex);
		args.unshift(schemeChangeWorld);
		caller(impl, args, k);
	}

	return newType;
};
var RenderEffect = makeStructureType('render-effect', false, 0, 0, false, false);
RenderEffect.type.prototype.callImplementation = function(caller, k) {
	helpers.raise(types.incompleteExn(
			types.exnFail,
			'render effect created without using make-render-effect-type',
			[]));
};
var makeRenderEffectType = function(name, superType, initFieldCnt, impl, guard) {
	if ( !superType ) {
		superType = RenderEffect;
	}
	
	var newType = makeStructureType(name, superType, initFieldCnt, 0, false, guard);
	var lastFieldIndex = newType.firstField + newType.numberOfFields;

	newType.type.prototype.callImplementation = function(caller, k) {
		var args = this._fields.slice(0, lastFieldIndex);
		caller(impl, args, k);
	}
	return newType;
};

//////////////////////////////////////////////////////////////////////
// generic, top-level description functions
var toWrittenString = function(x, cache) {
    if (! cache) { 
     	cache = makeLowLevelEqHash();
    }

    if (typeof(x) == 'object') {
	    if (cache.containsKey(x)) {
		    return "...";
	    } else {
	        cache.put(x, true);
            }
    }

    if (x == undefined || x == null) {
		return "#<undefined>";
    }
    if (typeof(x) == 'string') {
		return escapeString(x.toString());
    }
    if (typeof(x) != 'object' && typeof(x) != 'function') {
		return x.toString();
    }

    var returnVal;
    if (typeof(x.toWrittenString) !== 'undefined') {
		returnVal = x.toWrittenString(cache);
    } else if (typeof(x.toDisplayedString) !== 'undefined') {
		returnVal = x.toDisplayedString(cache);
    } else {
		returnVal = x.toString();
    }
    cache.remove(x);
    return returnVal;
};

var toDisplayedString = function(x, cache) {
    if (! cache) {
    	cache = makeLowLevelEqHash();
    }

    if (typeof(x) == 'object') {
	    if (cache.containsKey(x)) {
		    return "...";
	    }
	    cache.put(x, true);
    }

    if (x == undefined || x == null) {
		return "#<undefined>";
    }
    if (typeof(x) == 'string') {
		return x;
    }
    if (typeof(x) != 'object' && typeof(x) != 'function') {
		return x.toString();
    }

    var returnVal;
    if (typeof(x.toDisplayedString) !== 'undefined') {
		returnVal = x.toDisplayedString(cache);
    } else if (typeof(x.toWrittenString) !== 'undefined') {
		returnVal = x.toWrittenString(cache);
    } else {
		returnVal = x.toString();
    }
    cache.remove(x);
    return returnVal;
};



// toDomNode: scheme-value -> dom-node
var toDomNode = function(x, cache) {
    if (! cache) {
    	cache = makeLowLevelEqHash();
    }
    // try using the value's native toDomNode method, if it exists
    if(typeof(x.toDomNode) !== 'undefined') {
    	return x.toDomNode(cache);
    }
    // Not all numbers have it, so use a special toDomNode
    if (isNumber(x)) {
		return numberToDomNode(x);
    }
    // Deal with unknown objects differently
    if (typeof(x) == 'object') {
	    if (cache.containsKey(x)) {
        var node = document.createElement("span");
        node.style['font-family'] = 'monospace';
        node.appendChild(document.createTextNode("..."));
        return node;
	    }
	    cache.put(x, true);
    }
    // Deal with js-null and js-undefined differently
    if (x == undefined || x == null) {
      var node = document.createElement("span");
      node.style['font-family'] = 'monospace';
      node.appendChild(document.createTextNode("#<undefined>"));
      return node;
    }
    // Deal with strings differently
    if (typeof(x) == 'string') {
        return textToDomNode(toWrittenString(x));
    }
    if (typeof(x) != 'object' && typeof(x) != 'function') {
        return textToDomNode(x.toString());
    }

    // See if we can find something useful from toWrittenString or toDisplayedString
    var returnVal;
    if (x.nodeType) {
		returnVal =  x;
    } else if (typeof(x.toWrittenString) !== 'undefined') {	
        returnVal = textToDomNode(x.toWrittenString(cache))
    } else if (typeof(x.toDisplayedString) !== 'undefined') {
        returnVal = textToDomNode(x.toDisplayedString(cache));
    } else {
        returnVal = textToDomNode(x.toString());
    }
    cache.remove(x);
    return returnVal;
};

// from http://stackoverflow.com/questions/17267329/converting-unicode-character-to-string-format
function unicodeToChar(text) {
   return text.replace(/\\u[\dABCDEFabcdef][\dABCDEFabcdef][\dABCDEFabcdef][\dABCDEFabcdef]/g, 
          function (match) {
               return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
          });
}

var textToDomNode = function(text) {
    var rawChunks = text.split("\n");
    var displayedChunks = rawChunks.map(unicodeToChar);
    var i;
    var wrapper = document.createElement("span");
    var displayedString = document.createElement("span");
    var rawString = document.createElement("span");
    rawString.style.paddingLeft = displayedString.style.paddingLeft = "0px";
    var newlineDiv;
    if (rawChunks.length > 0) {
        displayedString.appendChild(document.createTextNode(displayedChunks[0]));
        rawString.appendChild(document.createTextNode(rawChunks[0]));
    }
    for (i = 1; i < rawChunks.length; i++) {
        newlineDiv = document.createElement("br");
        newlineDiv.style.clear = 'left';
        displayedString.appendChild(newlineDiv);
        displayedString.appendChild(document.createTextNode(displayedChunks[i]));
        rawString.appendChild(document.createTextNode(rawChunks[i]));
    }
    wrapper.className = "wescheme-string";
    var ariaText = displayedChunks.join(" ") +  ", a String";
    wrapper.ariaText = ariaText;
    wrapper.setAttribute("aria-label", ariaText);
    wrapper.style.fontFamily = 'monospace';
    wrapper.style.whiteSpace = "pre-wrap";
    wrapper.appendChild(rawString);
    // if the text isn't pure ASCII, make a toggleable node 
    if(text !== unicodeToChar(text)) {
	    wrapper.appendChild(displayedString);
	    var showingDisplayedString = true;
	    rawString.style.display = 'none';
	    wrapper.onclick = function(e) {
			showingDisplayedString = !showingDisplayedString;
			rawString.style.display = (!showingDisplayedString ? 'inline' : 'none')
			displayedString.style.display = (showingDisplayedString ? 'inline' : 'none');
	    };
	    wrapper.style['cursor'] = 'pointer';
	}
    return wrapper;
};

// numberToDomNode: jsnum -> dom
// Given a jsnum, produces a dom-node representation.
var numberToDomNode = function(n) {
    var className, ariaText = n.toString();
    if (jsnums.isExact(n)) {
      if (jsnums.isInteger(n)) {
          className = "wescheme-number Integer";
          ariaText += "";
      } else if (jsnums.isRational(n)) {
          node = rationalToDomNode(n);
          className = node.className;
          ariaText = node.ariaText + ", Rational";
          return node;
      } else if (isComplex(n)) {
          className = "wescheme-number Complex";
          ariaText += ", Complex Number";
      } else {
          ariaText += ", Number";
      }
    } else {
    	if (isComplex(n)) {
          className = " wescheme-numberComplex";
          ariaText += ", a Complex Number";
      	} else {
      		ariaText += ", a Number";
      	}
    }
    return simpleToDomNode(n.toString(), className, ariaText);
};

// rationalToDomNode: rational -> dom-node
var rationalToDomNode = function(n) {
    var repeatingDecimalNode = document.createElement("span");
    var chunks = jsnums.toRepeatingDecimal(jsnums.numerator(n),
					   jsnums.denominator(n),
					   {limit: 25});
    var firstPart = document.createElement("span");
    firstPart.appendChild(document.createTextNode(chunks[0] + '.' + chunks[1]));
    repeatingDecimalNode.appendChild(firstPart);
    repeatingDecimalNode.ariaText = chunks[0] + ' point ' + chunks[1];
    if (chunks[2] === '...') {
      firstPart.appendChild(document.createTextNode(chunks[2]));
      repeatingDecimalNode.ariaText += " , (truncated)";
    } else if (chunks[2] !== '0') {
      var overlineSpan = document.createElement("span");
      overlineSpan.style.textDecoration = 'overline';
      overlineSpan.appendChild(document.createTextNode(chunks[2]));
      repeatingDecimalNode.appendChild(overlineSpan);
      repeatingDecimalNode.ariaText += (chunks[1]? " with repeating "+chunks[2] : chunks[2]+" repeating");
    }
    repeatingDecimalNode.setAttribute('aria-hidden', true);

    var fractionalNode = document.createElement("span");
    var numeratorNode = document.createElement("sup");
    numeratorNode.appendChild(document.createTextNode(String(jsnums.numerator(n))));
    var denominatorNode = document.createElement("sub");
    denominatorNode.appendChild(document.createTextNode(String(jsnums.denominator(n))));
    var barNode = document.createElement("span");
    barNode.appendChild(document.createTextNode("/"));

    fractionalNode.appendChild(numeratorNode);
    fractionalNode.appendChild(barNode);
    fractionalNode.appendChild(denominatorNode);
    fractionalNode.ariaText = String(jsnums.numerator(n))+" over "+String(jsnums.denominator(n));

    
    var numberNode = document.createElement("span");
    numberNode.appendChild(repeatingDecimalNode);
    numberNode.appendChild(fractionalNode);
    fractionalNode.style['display'] = 'none';
    fractionalNode.setAttribute('aria-hidden', true);

    var showingRepeating = true;

    numberNode.onclick = function(e) {
		showingRepeating = !showingRepeating;
		repeatingDecimalNode.style['display'] = (showingRepeating ? 'inline' : 'none');
		fractionalNode.style['display'] = (!showingRepeating ? 'inline' : 'none');
		numberNode.setAttribute('aria-label', (showingRepeating? repeatingDecimalNode : fractionalNode).ariaText);
    };
    numberNode.ariaText = repeatingDecimalNode.ariaText;
    numberNode.style['cursor'] = 'pointer';
    numberNode.className = "wescheme-number Rational";
    
    return numberNode;
};

var isNumber = jsnums.isSchemeNumber;
var isComplex = function(n) {return n instanceof jsnums.Complex; };
var isString = function(s) {
	return (typeof s === 'string' || s instanceof Str);
}

// isEqual: X Y -> boolean
// Returns true if the objects are equivalent; otherwise, returns false.
var isEqual = function(x, y, aUnionFind) {
    if (x === y) { return true; }

    if (isNumber(x) && isNumber(y)) {
	return jsnums.equals(x, y);
    }

    if (isString(x) && isString(y)) {
	return x.toString() === y.toString();
    }

    if (x == undefined || x == null) {
	return (y == undefined || y == null);
    }

    if ( typeof(x) == 'object' &&
	 typeof(y) == 'object' &&
	 x.isEqual &&
	 y.isEqual) {
	if (aUnionFind.find(x) === aUnionFind.find(y)) {
	    return true;
	}
	else {
	    aUnionFind.merge(x, y); 
	    return x.isEqual(y, aUnionFind);
	}
    }
    return false;
};


// liftToplevelToFunctionValue: primitive-function string fixnum scheme-value -> scheme-value
// Lifts a primitive toplevel or module-bound value to a scheme value.
var liftToplevelToFunctionValue = function(primitiveF,
				       name,
				       minArity, 
				       procedureArityDescription) {
    if (! primitiveF._mobyLiftedFunction) {
	var lifted = function(args) {
	    return primitiveF.apply(null, args.slice(0, minArity).concat([args.slice(minArity)]));
	};
	lifted.isEqual = function(other, cache) { 
	    return this === other; 
	}
	lifted.toWrittenString = function(cache) { 
	    return "#<function:" + name + ">";
	};
	lifted.toDomNode = function() {
		return simpleToDomNode(this.toWrittenString(), "wescheme-primproc", name + ", a function");
	};
	lifted.toDisplayedString = lifted.toWrittenString;
	lifted.procedureArity = procedureArityDescription;
	primitiveF._mobyLiftedFunction = lifted;
	    
    } 
    return primitiveF._mobyLiftedFunction;
};



//////////////////////////////////////////////////////////////////////
var ThreadCell = function(v, isPreserved) {
    this.v = v;
    this.isPreserved = isPreserved || false;
};



//////////////////////////////////////////////////////////////////////
// Wrapper around functions that return multiple values.
var ValuesWrapper = function(elts) {
    this.elts = elts;
};

ValuesWrapper.prototype.toDomNode = function(cache) {
    var parent = document.createElement("span");
    parent.style.whiteSpace = "pre";
    var ariaText = "Value Wrapper with "+this.elts.length
    	+ "element"+(this.elts.length===1? "" : "s")+":";
    if ( this.elts.length > 0 ) {
	    parent.appendChild( toDomNode(this.elts[0], cache) );
	    for (var i = 1; i < this.elts.length; i++) {
	    	var dom = toDomNode(this.elts[i], cache);
		    parent.appendChild( document.createTextNode('\n') );
		    parent.appendChild(dom);
		    ariaText += " "+ dom.ariaText || dom.textContent;
	    }
    }
    return parent;
};


var UndefinedValue = function() {
};
UndefinedValue.prototype.toString = function() {
    return "#<undefined>";
};
var UNDEFINED_VALUE = new UndefinedValue();

var VoidValue = function() {};
VoidValue.prototype.toString = function() {
	return "#<void>";
};
var VOID_VALUE = new VoidValue();

var EofValue = function() {};
EofValue.prototype.toString = function() {
	return "#<eof>";
}
var EOF_VALUE = new EofValue();
var ClosureValue = function(name, locs, numParams, paramTypes, isRest, closureVals, body) {
    this.name = name;
    this.locs = locs;
    this.numParams = numParams;
    this.paramTypes = paramTypes;
    this.isRest = isRest;
    this.closureVals = closureVals;
    this.body = body;
};

ClosureValue.prototype.toString = function() {
    if (this.name !== Empty.EMPTY) {
		return helpers.format("#<function:~a>", [this.name]);
    } else {
		return "#<function>";
    }
};
ClosureValue.prototype.toDomNode = function () {
	return simpleToDomNode(this.toString(), "wescheme-primproc", 
		this.name === Empty.EMPTY? "anonymous function" : this.name + ", a function");
};
var CaseLambdaValue = function(name, closures) {
    this.name = name;
    this.closures = closures;
};
CaseLambdaValue.prototype.toString = function() {
    if (this.name !== Empty.EMPTY) {
		return helpers.format("#<case-lambda-procedure:~a>", [this.name]);
    } else {
		return "#<case-lambda-procedure>";
    }
};
var ContinuationClosureValue = function(vstack, cstack) {
    this.name = false;
    this.vstack = vstack.slice(0);
    this.cstack = cstack.slice(0);
};

ContinuationClosureValue.prototype.toString = function() {
    if (this.name !== Empty.EMPTY) {
		return helpers.format("#<function:~a>", [this.name]);
    } else {
		return "#<function>";
    }
};
ContinuationClosureValue.prototype.toDomNode = function () {
	return simpleToDomNode(this.toWrittenString(), "wescheme-primproc", 
		this.name === Empty.EMPTY? "anonymous function" : this.name + ", a function");
};
//////////////////////////////////////////////////////////////////////
var PrefixValue = function() {
    this.slots = [];
    this.definedMask = [];
};
PrefixValue.prototype.addSlot = function(v) {
    if (v === undefined) { 
		this.slots.push(types.UNDEFINED);
		this.definedMask.push(false);
    } else {
        this.slots.push(v);
		if (v instanceof GlobalBucket) {
		    if (v.value === types.UNDEFINED) {
				this.definedMask.push(false);
		    } else {
				this.definedMask.push(true);
		    }
		} else {
		    this.definedMask.push(true);
		}
    }
};
PrefixValue.prototype.ref = function(n, srcloc) {
    if (this.slots[n] instanceof GlobalBucket) {
    	if (this.definedMask[n]) {
    	    return this.slots[n].value;
    	} else {
    	    helpers.raise(types.incompleteExn(
    			types.exnFailContractVariable,
    			new Message([new ColoredPart(this.slots[n].name, srcloc),
                            ": this variable is not defined"]),
    			[this.slots[n].name]));
    	}
    } else {
    	if (this.definedMask[n]) {
    	    return this.slots[n];
    	} else {
    	    helpers.raise(types.incompleteExn(
    			types.exnFailContractVariable,
    			"variable has not been defined",
    			[false]));
    	}
    }
};

PrefixValue.prototype.set = function(n, v) {
    if (this.slots[n] instanceof GlobalBucket) {
	this.slots[n].value = v;
	this.definedMask[n] = true;
    } else {
	this.slots[n] = v;
	this.definedMask[n] = true;
    }
};
PrefixValue.prototype.length = function() { 
    return this.slots.length;
};
var GlobalBucket = function(name, value) {
    this.name = name;
    this.value = value;
};
var ModuleVariableRecord = function(resolvedModuleName,
				    variableName) {
    this.resolvedModuleName = resolvedModuleName;
    this.variableName = variableName;
};

//////////////////////////////////////////////////////////////////////
// Variable Reference
var VariableReference = function(prefix, pos) {
    this.prefix = prefix;
    this.pos = pos;
};
VariableReference.prototype.ref = function() {
    return this.prefix.ref(this.pos);
};
VariableReference.prototype.set = function(v) {
    this.prefix.set(this.pos, v);
}

//////////////////////////////////////////////////////////////////////
// Continuation Marks
var ContMarkRecordControl = function(dict) {
    this.dict = dict || {};
};
ContMarkRecordControl.prototype.invoke = function(state) {
    // No-op: the record will simply pop off the control stack.
};
ContMarkRecordControl.prototype.update = function(key, val) {
 this.dict[key.val] = val;
  return this;
};
var ContinuationMarkSet = function(dict) {
    this.dict = dict;
}
ContinuationMarkSet.prototype.toDomNode = function(cache) {
    var dom = document.createElement("span");
    dom.appendChild(document.createTextNode('#<continuation-mark-set>'));
    return dom;
};
ContinuationMarkSet.prototype.toWrittenString = function(cache) {
    return '#<continuation-mark-set>';
};
ContinuationMarkSet.prototype.toDisplayedString = this.toWrittenString;
ContinuationMarkSet.prototype.ref = function(key) {
    if ( this.dict.containsKey(key) ) {
	    return this.dict.get(key);
    }
    return [];
};

//////////////////////////////////////////////////////////////////////
// Continuation Prompt
var ContinuationPrompt = function() {
};
var defaultContinuationPrompt = new ContinuationPrompt();

//////////////////////////////////////////////////////////////////////
// Primitive Procedure
var PrimProc = function(name, numParams, isRest, assignsToValueRegister, impl) {
    this.name = name;
    this.numParams = numParams;
    this.isRest = isRest;
    this.assignsToValueRegister = assignsToValueRegister;
    this.impl = impl;
};
PrimProc.prototype.toString = function() {
    return ("#<function:" + this.name + ">");
};
PrimProc.prototype.toWrittenString = PrimProc.prototype.toString;
PrimProc.prototype.toDisplayedString = PrimProc.prototype.toString;
PrimProc.prototype.toDomNode = function(cache) {
    return simpleToDomNode(this.toString(), "wescheme-primproc", this.name + ", a function");
};
//////////////////////////////////////////////////////////////////////
// Case Primitive
var CasePrimitive = function(name, cases) {
    this.name = name;
    this.cases = cases;
};

CasePrimitive.prototype.toString = function(cache) {
    return ("#<function:" + this.name + ">");
};
CasePrimitive.prototype.toWrittenString = CasePrimitive.prototype.toString;
CasePrimitive.prototype.toDisplayedString = CasePrimitive.prototype.toString;
CasePrimitive.prototype.toDomNode = function(cache) {
    return simpleToDomNode(this.toString(), "wescheme-caseprimitive", this.name + ", a function");
};/////////////////////////////////////////////////////////////////////
// Colored Error Message Support

var Message = function(args) {
  this.args = args;
};

Message.prototype.toString = function() {
  var toReturn = [];
  var i;
  for(i = 0; i < this.args.length; i++) {
      toReturn.push(''+this.args[i]);
  }
  
  return toReturn.join("");
};

var isMessage = function(o) {
  return o instanceof Message;
};

var ColoredPart = function(text, location) {
  this.text = text;
  this.location = location;
};

var isColoredPart = function(o) {
  return o instanceof ColoredPart;
};

ColoredPart.prototype.toString = function() {
    return this.text+'';
};

var GradientPart = function(coloredParts) {
    this.coloredParts = coloredParts;
};

var isGradientPart = function(o) {
  return o instanceof GradientPart;
};

GradientPart.prototype.toString = function() {
	var i;
	var resultArray = [];
	for(i = 0; i < this.coloredParts.length; i++){
		resultArray.push(this.coloredParts[i].text+'');
	}
	return resultArray.join("");

};

var MultiPart = function(text, locations, solid) {
    this.text = text;
    this.locations = locations;
    this.solid = solid;
};

var isMultiPart = function(o) {
  return o instanceof MultiPart;
};

MultiPart.prototype.toString = function() {
	return this.text;
};


//////////////////////////////////////////////////////////////////////
var makeList = function(args) {
    var result = Empty.EMPTY;
    var i;
    for(i = args.length-1; i >= 0; i--) {
	result = Cons.makeInstance(args[i], result);
    }
    return result;
};
var makeVector = function(args) {
    return Vector.makeInstance(args.length, args);
};
var makeString = function(s) {
	if (s instanceof Str) {
		return s;
	}
	else if (s instanceof Array) {
		return Str.makeInstance(s);
	}
	else if (typeof s === 'string') {
		return Str.fromString(s);
	}
	else {
		throw types.internalError('makeString expects and array of 1-character strings or a string;' +
					  ' given ' + s.toString(),
					  false);
	}
};
var makeHashEq = function(lst) {
	var newHash = new EqHashTable();
	while ( !lst.isEmpty() ) {
		newHash.hash.put(lst.first().first(), lst.first().rest());
		lst = lst.rest();
	}
	return newHash;
};
var makeHashEqual = function(lst) {
	var newHash = new EqualHashTable();
	while ( !lst.isEmpty() ) {
		newHash.hash.put(lst.first().first(), lst.first().rest());
		lst = lst.rest();
	}
	return newHash;
};

//if there is not enough location information available,
//this allows for highlighting to be turned off
var NoLocation = makeVector(['<no-location>', 0,0,0,0]);

var isNoLocation = function(o) {
  return o === NoLocation;
};

var Posn = makeStructureType('posn', false, 2, 0, false, false);
var Color = makeStructureType('color', false, 4, 0, false, false);
var ArityAtLeast = makeStructureType('arity-at-least', false, 1, 0, false,
		function(k, n, name) {
			helpers.check(undefined, n, function(x) { return ( jsnums.isExact(x) &&
								jsnums.isInteger(x) &&
								jsnums.greaterThanOrEqual(x, 0) ); },
				      name, 'exact non-negative integer', 1);
			k(n);
		});


types.symbol = Symbol.makeInstance;
types.rational = jsnums.makeRational;
types['float'] = jsnums.makeFloat;
types.complex = jsnums.makeComplex;
types.bignum = jsnums.makeBignum;
types.list = makeList;
types.vector = makeVector;
types['char'] = Char.makeInstance;
types['string'] = makeString;
types.box = function(x) { return new Box(x, true); };
types.boxImmutable = function(x) { return new Box(x, false); };
types.pair = function(x, y) { return Cons.makeInstance(x, y); };
types.hash = makeHashEqual;
types.hashEq = makeHashEq;
types.jsObject = function(name, obj) { return new JsObject(name, obj); };

types.toWrittenString = toWrittenString;
types.toDisplayedString = toDisplayedString;
types.toDomNode = toDomNode;

types.posn = Posn.constructor;
types.posnX = function(psn) { return Posn.accessor(psn, 0); };
types.posnY = function(psn) { return Posn.accessor(psn, 1); };

types.color = function(r, g, b, a) { 
    if (a === undefined) {
        a = 255;
    }
    return Color.constructor(r, g, b, a);
};
types.colorRed = function(x) { return Color.accessor(x, 0); };
types.colorGreen = function(x) { return Color.accessor(x, 1); };
types.colorBlue = function(x) { return Color.accessor(x, 2); };
types.colorAlpha = function(x) { return Color.accessor(x, 3); };

types.arityAtLeast = ArityAtLeast.constructor;
types.arityValue = function(arity) { return ArityAtLeast.accessor(arity, 0); };


types.FALSE = Logic.FALSE;
types.TRUE = Logic.TRUE;
types.EMPTY = Empty.EMPTY;

types.isEqual = isEqual;
types.isNumber = isNumber;
types.isSymbol = function(x) { return x instanceof Symbol; };
types.isChar = function(x) { return x instanceof Char; };
types.isString = isString;
types.isPair = function(x) { return x instanceof Cons; };
types.isVector = function(x) { return x instanceof Vector; };
types.isBox = function(x) { return x instanceof Box; };
types.isHash = function(x) { return (x instanceof EqHashTable ||
				     x instanceof EqualHashTable); };
types.isStruct = function(x) { return x instanceof Struct; };
types.isPosn = Posn.predicate;
types.isArityAtLeast = ArityAtLeast.predicate;
types.isColor = Color.predicate;
types.isFunction = function(x) {
	return (x instanceof PrimProc ||
		x instanceof CasePrimitive ||
		x instanceof ClosureValue ||
		x instanceof CaseLambdaValue ||
		x instanceof ContinuationClosureValue);
};
types.getProcedureType = function(x){
 return (x instanceof PrimProc)? "PrimProc" :
       (x instanceof CasePrimitive)? "CasePrimitive" :
       (x instanceof ClosureValue)? "ClosureValue" :
       (x instanceof CaseLambdaValue)? "CaseLambdaValue" :
       (x instanceof ContinuationClosureValue)? "ContinuationClosureValue" :
       /* else */ false;
};
 
types.isJsObject = function(x) { return x instanceof JsObject; };

types.UnionFind = UnionFind;
types.cons = Cons.makeInstance;

types.UNDEFINED = UNDEFINED_VALUE;
types.VOID = VOID_VALUE;
types.EOF = EOF_VALUE;

types.ValuesWrapper = ValuesWrapper;
types.ClosureValue = ClosureValue;
types.ContinuationPrompt = ContinuationPrompt;
types.defaultContinuationPrompt = defaultContinuationPrompt;
types.ContinuationClosureValue = ContinuationClosureValue;
types.CaseLambdaValue = CaseLambdaValue;
types.PrimProc = PrimProc;
types.CasePrimitive = CasePrimitive;

types.contMarkRecordControl = function(dict) { return new ContMarkRecordControl(dict); };
types.isContMarkRecordControl = function(x) { return x instanceof ContMarkRecordControl; };
types.continuationMarkSet = function(dict) { return new ContinuationMarkSet(dict); };
types.isContinuationMarkSet = function(x) { return x instanceof ContinuationMarkSet; };


types.PrefixValue = PrefixValue;
types.GlobalBucket = GlobalBucket;
types.ModuleVariableRecord = ModuleVariableRecord;
types.VariableReference = VariableReference;

types.Box = Box;
types.ThreadCell = ThreadCell;



types.Class = Class;


types.makeStructureType = makeStructureType;
types.isStructType = function(x) { return x instanceof StructType; };


types.makeLowLevelEqHash = makeLowLevelEqHash;


// Error type exports
var InternalError = function(val, contMarks) {
	this.val = val;
	this.contMarks = (contMarks ? contMarks : false);
}
types.internalError = function(v, contMarks) { return new InternalError(v, contMarks); };
types.isInternalError = function(x) { return x instanceof InternalError; };

var SchemeError = function(val) {
	this.val = val;
}
types.schemeError = function(v) { return new SchemeError(v); };
types.isSchemeError = function(v) { return v instanceof SchemeError; };


var IncompleteExn = function(constructor, msg, otherArgs) {
	this.constructor = constructor;
	this.msg = msg;
	this.otherArgs = otherArgs;
};
types.incompleteExn = function(constructor, msg, args) { return new IncompleteExn(constructor, msg, args); };
types.isIncompleteExn = function(x) { return x instanceof IncompleteExn; };

var Exn = makeStructureType('exn', false, 2, 0, false,
		function(k, msg, contMarks, name) {
			// helpers.check(msg, isString, name, 'string', 1, [msg, contMarks]);
			helpers.check(undefined, contMarks, types.isContinuationMarkSet, name, 'continuation mark set', 2);
			k( new ValuesWrapper([msg, contMarks]) );
		});
types.exn = Exn.constructor;
types.isExn = Exn.predicate;
types.exnMessage = function(exn) { return Exn.accessor(exn, 0); };
types.exnContMarks = function(exn) { return Exn.accessor(exn, 1); };
types.exnSetContMarks = function(exn, v) { Exn.mutator(exn, 1, v); };

// (define-struct (exn:break exn) (continuation))
var ExnBreak = makeStructureType('exn:break', Exn, 1, 0, false,
		function(k, msg, contMarks, cont, name) {
		// FIXME: what type is a continuation here?
//			helpers.check(cont, isContinuation, name, 'continuation', 3);
			k( new ValuesWrapper([msg, contMarks, cont]) );
		});
types.exnBreak = ExnBreak.constructor;
types.isExnBreak = ExnBreak.predicate;
types.exnBreakContinuation = function(exn) {
    return ExnBreak.accessor(exn, 0); };

var ExnFail = makeStructureType('exn:fail', Exn, 0, 0, false, false);
types.exnFail = ExnFail.constructor;
types.isExnFail = ExnFail.predicate;

var ExnFailContract = makeStructureType('exn:fail:contract', ExnFail, 0, 0, false, false);
types.exnFailContract = ExnFailContract.constructor;
types.isExnFailContract = ExnFailContract.predicate;

var ExnFailContractArity = makeStructureType('exn:fail:contract:arity', ExnFailContract, 0, 0, false, false);
types.exnFailContractArity = ExnFailContract.constructor;
types.isExnFailContractArity = ExnFailContract.predicate;

var ExnFailContractVariable = makeStructureType('exn:fail:contract:variable', ExnFailContract, 1, 0, false, false);
types.exnFailContractVariable = ExnFailContract.constructor;
types.isExnFailContractVariable = ExnFailContract.predicate;
types.exnFailContractVariableId = function(exn) { return ExnFailContractVariable.accessor(exn, 0); };

var ExnFailContractDivisionByZero = makeStructureType('exn:fail:contract:division-by-zero', ExnFailContract, 0, 0, false, false);
types.exnFailContractDivisionByZero = ExnFailContractDivisionByZero.constructor;
types.isExnFailContractDivisionByZero = ExnFailContractDivisionByZero.predicate;

var ExnFailContractArityWithPosition = makeStructureType('exn:fail:contract:arity:position', ExnFailContractArity, 1, 0, false, false);
types.exnFailContractArityWithPosition = ExnFailContractArityWithPosition.constructor;
types.isExnFailContractArityWithPosition = ExnFailContractArityWithPosition.predicate;

types.exnFailContractArityWithPositionLocations = function(exn) { return ExnFailContractArityWithPosition.accessor(exn, 0); };


///////////////////////////////////////
// World-specific exports

types.worldConfig = function(startup, shutdown, args) { return new WorldConfig(startup, shutdown, args); };
types.isWorldConfig = function(x) { return x instanceof WorldConfig; };

types.makeEffectType = makeEffectType;
types.isEffectType = function(x) {
	return (x instanceof StructType && x.type.prototype.invokeEffect) ? true : false;
};


types.isEffect = Effect.predicate;
types.makeRenderEffectType = makeRenderEffectType;
types.isRenderEffectType = function(x) {
	return (x instanceof StructType && x.type.prototype.callImplementation) ? true : false;
};
types.isRenderEffect = RenderEffect.predicate;
types.NoLocation = NoLocation;
types.isNoLocation = isNoLocation;
types.ColoredPart = ColoredPart;
types.Message = Message;
types.isColoredPart = isColoredPart;
types.isMessage = isMessage;
types.GradientPart = GradientPart;
types.isGradientPart = isGradientPart;
types.MultiPart = MultiPart;
types.isMultiPart = isMultiPart;
})();
//var types = require('./types');



// Represents the interpreter state.


var state = {};

(function () {

var DEBUG_ON = false;

var setDebug = function(v) {
    DEBUG_ON = v;
}

var debug = function(s) {
    if (DEBUG_ON) {
	sys.debug(s);
    }
}

var debugF = function(f_s) {
    if (DEBUG_ON) {
	sys.debug(f_s());
    }
}


var defaultPrintHook = function(thing) { 
    sys.print(types.toWrittenString(thing) + "\n"); };

var defaultDisplayHook = function(thing) { 
    sys.print(types.toDisplayedString(thing)); };

var defaultToplevelNodeHook = function() { 
    throw new Error("There is a software configuration error by the system's maintainer: the toplevel node has not been initialized yet.");
};

var defaultDynamicModuleLoader = function(moduleName, successCallback, errorCallback){ 
    errorCallback(moduleName +" not known"); 
};


// Interpreter
var State = function() {
    this.v = [];       // value register
    this.vstack = [];  // value stack
    this.cstack = [];  // control stack
    this.heap = {};    // map from name to closures
    this.globals = {}; // map from string to types.GlobalBucket values
    this.hooks = { printHook: defaultPrintHook,
		   displayHook: defaultPrintHook,
		   toplevelNodeHook: defaultToplevelNodeHook,
		   imageProxyHook: false,
                   dynamicModuleLoader: defaultDynamicModuleLoader
                 };

    this.invokedModules = {};

    // Internal flag: if set, then we stop evaluation immediately.
    this.breakRequested = false;
    this.breakRequestedListeners = [];
};

var isState = function(o) {
  return o instanceof State;
};



// clearForEval: -> void
// Clear out the value register, the vstack, and the cstack.
State.prototype.clearForEval = function(attrs) {
    this.v = [];
    this.vstack = [];
    this.cstack = [];


    // FIXME: what should happen to globals here?
    if (attrs && attrs.preserveBreak) {
    } else {
      this.breakRequested = false;
      this.breakRequestedListeners = [];
    }


    if (attrs && attrs.clearGlobals) {
      this.globals = {};
    } else {
    }
};


State.prototype.save = function() {
    return { v: this.v,
	     vstack: this.vstack.slice(0),
	     cstack: this.cstack.slice(0),
	     heap: this.heap,
	     globals: copyHash(this.globals),
             hooks: this.hooks,
	     breakRequested: this.breakRequested,
	     breakRequestedListeners: copyHash(this.breakRequestedListeners),
	     invokedModules: this.invokedModules };
};


var hasOwnProperty = {}.hasOwnProperty;

var copyHash = function(hash) {
    var result = {};
    for (var key in hash) {
	if (hasOwnProperty.call(hash, key)) {
	    result[key] = hash[key];
	}
    }
    return result;
};


State.prototype.restore = function(params) {
    this.v = params.v;
    this.vstack = params.vstack;
    this.cstack = params.cstack;
    this.heap = params.heap;
    this.globals = params.globals;
    this.hooks = params.hooks;
    // DELIBERATE: don't restore breakRequested
    // this.breakRequested = params.breakRequested;
    this.breakRequestListeners = params.breakRequestListeners;
    this.invokedModules = params.invokedModules;
};


// Request a break
//
// BreakRequestedListeners will be notified.
State.prototype.requestBreak = function() {
    this.breakRequested = true;
    for (var i = 0; i < this.breakRequestedListeners.length; i++ ) {
	try {
	    this.breakRequestedListeners[i]();
	} catch(e) {
	    helpers.reportError(e);
	}
    }
};


State.prototype.addBreakRequestedListener = function(listener) {
    this.breakRequestedListeners.push(listener);
};



State.prototype.removeBreakRequestedListener = function(listener) {
    for (var i = this.breakRequestedListeners.length - 1 ; i >= 0; i--) {
	if (this.breakRequestedListeners[i] === listener) {
	    this.breakRequestedListeners.splice(i, 1);
	}
    }
};




// Add the following form to the control stack.
State.prototype.pushControl = function(aForm) {
    this.cstack.push(aForm);
};


// Add several forms to the control stack in reverse order.
State.prototype.pushManyControls = function(forms) {
    for (var i = 0; i < forms.length; i++) {
	this.cstack.push(forms[forms.length-1-i]);
    }
};


// Returns true if the machine is in a stuck state.
State.prototype.isStuck = function() {
    return this.cstack.length === 0;
};

// Pop the last pushed form.
State.prototype.popControl = function() {
    if (this.cstack.length === 0) {
	throw types.internalError("cstack empty", captureCurrentContinuationMarks(this));
    }
    return this.cstack.pop();
};


// Push a value.
State.prototype.pushValue = function(aVal) {
    debugF(function(){ return "pushValue" + sys.inspect(aVal); } );
    this.vstack.push(aVal);
};


// Pop a value.
State.prototype.popValue = function() {
    debugF(function(){ return "popValue" });
    if (this.vstack.length === 0) {
 	throw types.internalError("vstack empty", captureCurrentContinuationMarks(this));
    }
    return this.vstack.pop();
};

// Push n undefined values onto the stack.
State.prototype.pushn = function(n) {
    debugF(function(){ return "PUSHN " + n } );
    for (var i = 0; i < n; i++) {
	this.vstack.push(types.UNDEFINED);
    }
};

// Pop n values from the stack.
State.prototype.popn = function(n) {
  debugF(function(){ return "POPN " + n } );
  var returnedValues = [];
  for (var i = 0; i < n; i++) {
    if (this.vstack.length === 0) {
        throw types.internalError("vstack empty", captureCurrentContinuationMarks(this));
    }
    returnedValues.push(this.vstack.pop());
  }
 return returnedValues;
};


// Peek at the nth value on the stack.
State.prototype.peekn = function(depth) {
    if (this.vstack.length - 1 - (depth || 0) < 0) {
	throw types.internalError("vstack not long enough", captureCurrentContinuationMarks(this));
    }
    return this.vstack[this.vstack.length - 1 - (depth || 0)];
};

// Set the nth value on the stack.
State.prototype.setn = function(depth, v) {
    this.vstack[this.vstack.length - 1 - (depth || 0)] = v;
};


// Reference an element of a prefix on the value stack.
State.prototype.refPrefix = function(depth, pos, srcloc) {
    var value = this.vstack[this.vstack.length-1 - depth].ref(pos, srcloc);
    if (value instanceof types.ModuleVariableRecord) {
    	if (this.invokedModules[value.resolvedModuleName]) {
    	    var moduleRecord =  this.invokedModules[value.resolvedModuleName];
    	    if (typeof(moduleRecord.providedValues[value.variableName]) !== 'undefined') {
    		    return moduleRecord.providedValues[value.variableName];
    	    }
    	   throw types.schemeError(
    		types.exnFailContractVariable(
    		    "reference to an identifier before its definition: " +
    			value.variableName,
    		    false,
    		    value.variableName)); 
    	}
    }
    return value;
};


// Set an element of a prefix on the value stack.
State.prototype.setPrefix = function(depth, pos, v) {
    debug("setPrefix");
    this.vstack[this.vstack.length - 1 - depth].set(pos, v);
};




State.prototype.setPrintHook = function(printHook) {
    this.hooks['printHook'] = printHook;
};


State.prototype.getPrintHook = function() {
    return this.hooks['printHook'];
};


State.prototype.setDisplayHook = function(printHook) {
    this.hooks['displayHook'] = printHook;
};

State.prototype.setImageProxyHook = function(imageProxyHook) {
    this.hooks['imageProxyHook'] = imageProxyHook;
};

State.prototype.getImageProxyHook = function() {
    return this.hooks['imageProxyHook'];
};


State.prototype.getDisplayHook = function() {
    return this.hooks['displayHook'];
};


State.prototype.getToplevelNodeHook = function() {
    return this.hooks['toplevelNodeHook'];
};


State.prototype.setToplevelNodeHook = function(hook) {
    this.hooks['toplevelNodeHook'] = hook;
};




// Captures the current continuation marks in the state.
// Helper function
var captureCurrentContinuationMarks = function(state) {
    var dict = types.makeLowLevelEqHash();
    for (var i = 0; i < state.cstack.length; i++) {
      if ( types.isContMarkRecordControl(state.cstack[i]) ) {
          var aDict = state.cstack[i].dict;
    /*	    var keys = aDict.keys();
          for (var j = 0; j < keys.length; j++) {
            dict.put(keys[j], (dict.get(keys[j]) || []) );
            dict.get(keys[j]).push(aDict.get(keys[j]) );
          }
     */
          // copy the JS hashtable into a lowLevelEqHash
          for(var key in aDict) {
            dict.put(key, [aDict[key]] || []);
            dict.get(key).push(aDict[key]);
          }
      }
    }
    return types.continuationMarkSet(dict);
};




var STACK_KEY = "moby-stack-record-continuation-mark-key";

var getStackTraceFromContinuationMarks = function(contMarkSet) {
    var results = [];
    var stackTrace = contMarkSet.ref(STACK_KEY);
    // KLUDGE: the first element in the stack trace
    // can be weird print-values may introduce a duplicate
    // location.
    for (var i = stackTrace.length - 1; 
	 i >= 0; i--) {
	var callRecord = stackTrace[i];
	var id = callRecord.ref(0);
	var offset = callRecord.ref(1);
	var line = callRecord.ref(2);
	var column = callRecord.ref(3);
	var span = callRecord.ref(4);
	var newHash = {'id': id, 
		       'offset': offset,
		       'line': line, 
		       'column': column,
		       'span': span};
	if (results.length === 0 ||
	    (! isEqualHash(results[results.length-1],
			   newHash))) {
	    results.push(newHash);
	}
    }
    return results;
};



var isEqualHash = function(hash1, hash2) {
    for (var key in hash1) {
	if (hasOwnProperty.call(hash1, key)) {
	    if (hasOwnProperty.call(hash2, key)) {
		if (hash1[key] !== hash2[key]) {
		    return false;
		}
	    } else {
		return false;
	    }
	}
    }
    for (var key in hash2) {
	if (hasOwnProperty.call(hash2, key)) {
	    if (hasOwnProperty.call(hash1, key)) {
		if (hash1[key] !== hash2[key]) {
		    return false;
		}
	    } else {
		return false;
	    }
	}
    }
    return true;
};







state.State = State;
state.isState = isState;
state.captureCurrentContinuationMarks = captureCurrentContinuationMarks;
state.getStackTraceFromContinuationMarks = getStackTraceFromContinuationMarks;


})();
/*
 * http://www.myersdaily.org/joseph/javascript/md5-text.html
 */

if (typeof(world) === 'undefined') {
    world = {};
}

(function (global) {

  var md5cycle = function (x, k) {
    var a = x[0],
      b = x[1],
      c = x[2],
      d = x[3];

    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);

    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);

    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);

    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);

    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);

  }

  var cmn = function (q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  var ff = function (a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
  }

  var gg = function (a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
  }

  var hh = function (a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  var ii = function (a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
  }

  var md51 = function (s) {
    var txt = '',
      n = s.length,
      state = [1732584193, -271733879, -1732584194, 271733878],
      i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }

  /* there needs to be support for Unicode here,
   * unless we pretend that we can redefine the MD-5
   * algorithm for multi-byte characters (perhaps
   * by adding every four 16-bit characters and
   * shortening the sum to 32 bits). Otherwise
   * I suggest performing MD-5 as if every character
   * was two bytes--e.g., 0040 0025 = @%--but then
   * how will an ordinary MD-5 sum be matched?
   * There is no way to standardize text to something
   * like UTF-8 before transformation; speed cost is
   * utterly prohibitive. The JavaScript standard
   * itself needs to look at this: it should start
   * providing access to strings as preformed UTF-8
   * 8-bit unsigned value arrays.
   */
  var md5blk = function (s) { /* I figured global was faster.   */
    var md5blks = [],
      i; /* Andy King said do it this way. */
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }

  var hex_chr = '0123456789abcdef'.split('');

  var rhex = function (n) {
    var s = '',
      j = 0;
    for (; j < 4; j++)
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
  }

  var hex = function (x) {
    for (var i = 0; i < x.length; i++)
      x[i] = rhex(x[i]);
    return x.join('');
  }

  var md5 = global.md5 = function (s) {
    return hex(md51(s));
  }

  /* this function is much faster,
  so if possible we use it. Some IEs
  are the only ones I know of that
  need the idiotic second function,
  generated by an if clause.  */

  var add32 = function (a, b) {
    return (a + b) & 0xFFFFFFFF;
  }

  if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
    add32 = function (x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF),
        msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }
  }

})(world);
if (typeof(world) === 'undefined') {
    world = {};
}

(function() {

//     var make_dash_effect_colon_none =
// 	(plt.Kernel.invokeModule("moby/runtime/effect-struct")
// 	 .EXPORTS['make-effect:none']);

    world.config = {};


    // augment: hash hash -> hash
    // Functionally extend a hashtable with another one.
    var augment = function(o, a) {
	var oo = {};
	for (var e in o) {
	    if (Object.hasOwnProperty.call(o, e)) {
		oo[e] = o[e];
	    }
	}
	for (var e in a) {
	    if (Object.hasOwnProperty.call(a, e)) {
		oo[e] = a[e];
	    }
	}
	return oo;
    }



    var WorldConfig = function() {
	// The following handler values are initially false until they're updated
	// by configuration.
      
	// A handler is a function:
	//     handler: world X Y ... -> Z


	this.vals = {
	    // changeWorld: (world -> world) -> void
	    // When called, this will update the world based on the
	    // updater passed to it.
	    changeWorld: false,

	    // shutdownWorld: -> void
	    // When called, this will shut down the world computation.
	    shutdownWorld: false,

	    // initialEffect: effect
	    // The initial effect to invoke when the world computation
	    // begins.
	    initialEffect: false,


	    // onRedraw: world -> scene
	    onRedraw: false,

	    // onDraw: world -> (sexpof dom)
	    onDraw: false,

	    // onDrawCss: world -> (sexpof css-style)
	    onDrawCss: false,


	    // tickDelay: number
	    tickDelay: false,
	    // onTick: world -> world
	    onTick: false,
	    // onTickEffect: world -> effect
	    onTickEffect: false,

	    // onKey: world key -> world
	    onKey: false,
	    // onKeyEffect: world key -> effect
	    onKeyEffect : false,

	    // onMouse: world number number string -> world
	    onMouse: false,
 
	    // onTilt: world number number number -> world
	    onTilt: false,
	    // onTiltEffect: world number number number -> effect
	    onTiltEffect: false,


            // Corresponds to touchstart
	    // onTap: world number number -> world
	    onTap: false,
	    // onTapEffect: world number number -> effect
	    onTapEffect: false,


	    // onAcceleration: world number number number -> world
	    onAcceleration: false,
	    // onAccelerationEffect: world number number number -> effect
	    onAccelerationEffect: false,

	    // onShake: world -> world
	    onShake: false,
	    // onShakeEffect: world -> effect
	    onShakeEffect: false,

	    // onSmsReceive: world -> world
	    onSmsReceive: false,
	    // onSmsReceiveEffect: world -> effect
	    onSmsReceiveEffect: false,

	    // onLocationChange: world number number -> world
	    onLocationChange : false,
	    // onLocationChangeEffect: world number number -> effect
	    onLocationChangeEffect: false,


	    // onAnnounce: world string X ... -> world
	    onAnnounce: false,
	    // onAnnounce: world string X ... -> effect
	    onAnnounceEffect: false,

	    // stopWhen: world -> boolean
	    stopWhen: false,
	    // stopWhenEffect: world -> effect
	    stopWhenEffect: false,



	    //////////////////////////////////////////////////////////////////////
	    // For universe game playing

	    // connectToGame: string
	    // Registers with some universe, given an identifier
	    // which is a URL to a Universe server.
	    connectToGame: false,
	    onGameStart: false,
	    onOpponentTurn: false,
	    onMyTurn: false,
	    afterMyTurn: false,
	    onGameFinish: false
	};
    }

  
    // WorldConfig.lookup: string -> handler
    // Looks up a value in the configuration.
    WorldConfig.prototype.lookup = function(key) {
//	plt.Kernel.check(key, plt.Kernel.isString, "WorldConfig.lookup", "string", 1);
	if (key in this.vals) {
	    return this.vals[key];
	} else {
	    throw Error("Can't find " + key + " in the configuration");
	}
    }
  


    // WorldConfig.updateAll: (hashof string handler) -> WorldConfig
    WorldConfig.prototype.updateAll = function(aHash) {
	var result = new WorldConfig();
	result.vals = augment(this.vals, aHash);
	return result;
    }

  
    world.config.WorldConfig = WorldConfig;

    // The following global variable CONFIG is mutated by either
    // big-bang from the regular world or the one in jsworld.
    world.config.CONFIG = new WorldConfig();


    // A handler is a function that consumes a config and produces a
    // config.


    //////////////////////////////////////////////////////////////////////

    var getNoneEffect = function() {
	throw new Error("getNoneEffect: We should not be calling effects!");
	//	return make_dash_effect_colon_none();
    }



    //////////////////////////////////////////////////////////////////////

    world.config.Kernel = world.config.Kernel || {};
    world.config.Kernel.getNoneEffect = getNoneEffect;


/*
    // makeSimplePropertyUpdater: (string (X -> boolean) string string) -> (X -> handler)
    var makeSimplePropertyUpdater = function(propertyName,
					     propertyPredicate,
					     propertyTypeName,
					     updaterName) {
	return function(val) {
	    plt.Kernel.check(val, propertyPredicate, updaterName, propertyTypeName, 1);
	    return addStringMethods(
		function(config) {
		    return config.updateAll({propertyName: val });
		}, updaterName);
	}
    };

    // connects to the game
    world.config.Kernel.connect_dash_to_dash_game = 
	makeSimplePropertyUpdater('connectToGame',
				  plt.Kernel.isString,
				  "string",
				  "connect-to-game");


    // Registers a handler for game-start events.
    world.config.Kernel.on_dash_game_dash_start = 
	makeSimplePropertyUpdater('onGameStart',
				  plt.Kernel.isFunction,
				  "function",
				  "on-game-start");


    // Registers a handler for opponent-turn events.
    world.config.Kernel.on_dash_opponent_dash_turn = 
	makeSimplePropertyUpdater('onOpponentTurn',
				  plt.Kernel.isFunction,
				  "function",
				  "on-opponent-turn");


    // Registers a handler for my turn.
    world.config.Kernel.on_dash_my_dash_turn = 
	makeSimplePropertyUpdater('onMyTurn',
				  plt.Kernel.isFunction,
				  "function",
				  "on-my-turn");

    // Register a handler after I make a move.
    world.config.Kernel.after_dash_my_dash_turn = 
	makeSimplePropertyUpdater('afterMyTurn',
				  plt.Kernel.isFunction,
				  "function",
				  "after-my-turn");

    world.config.Kernel.on_dash_game_dash_finish = 
	makeSimplePropertyUpdater('onGameFinish',
				  plt.Kernel.isFunction,
				  "function",
				  "on-game-finish");
*/



})();
// Feeds stimuli inputs into the world.  The functions here
// are responsible for converting to Scheme values.
//
// NOTE and WARNING: make sure to really do the coersions, even for
// strings.  Bad things happen otherwise, as in the sms stuff, where
// we're getting string-like values that aren't actually strings.



(function() {

    world.stimuli = {};

    var handlers = [];

    var doNothing = function() {};


    var StimuliHandler = function(config, caller, restarter) {
	this.config = config;
	this.caller = caller;
	this.restarter = restarter;
	handlers.push(this);
    };

//    StimuliHandler.prototype.failHandler = function(e) {
//	this.onShutdown();
//    	this.restarter(e);
//    };	

    // doStimuli: CPS( (world -> effect) (world -> world) -> void )
    //
    // Processes a stimuli by compute the effect and applying it, and
    // computing a new world to replace the old.
    StimuliHandler.prototype.doStimuli = function(computeEffectF, computeWorldF, restArgs, k) {
	var effectUpdaters = [];
	var that = this;
	try {
	    that.change(function(w, k2) {
		var args = [w].concat(restArgs);
		var doStimuliHelper = function() {
			if (computeWorldF) {
			    that.caller(computeWorldF, args, k2);
			} else {
			    k2(w);
			}
		};
		doStimuliHelper();
	    }, k);
 		// if (computeEffectF) {
// 		    that.caller(computeEffectF, [args],
// 			    function(effect) {
// 			    	effectUpdaters = applyEffect(effect);
// 				doStimuliHelper();
// 			    },
//	    		    this.failHandler);
// 		}
// 		else { doStimuliHelper(); }
// 	    },
// 	    function() {
// 	    	helpers.forEachK(effectUpdaters,
// 				 function(effect, k2) { that.change(effect, k2); },
// 				 function(e) { throw e; },
// 				 k);
// 	    });
	} catch (e) { 
//		if (console && console.log && e.stack) {
//			console.log(e.stack);
//		}
	    this.onShutdown();
	}
    }


    // Orientation change
    // args: [azimuth, pitch, roll]
    StimuliHandler.prototype.onTilt = function(args, k) {
	var onTilt = this.lookup("onTilt");
	var onTiltEffect = this.lookup("onTiltEffect");
	this.doStimuli(onTiltEffect, onTilt, helpers.map(flt, args), k);
    };


    // Accelerations
    // args: [x, y, z]
    StimuliHandler.prototype.onAcceleration = function(args, k) {
	var onAcceleration = this.lookup('onAcceleration');
	var onAccelerationEffect = this.lookup('onAccelerationEffect');
	this.doStimuli(onAccelerationEffect, onAcceleration, helpers.map(flt, args), k);
    };


    // Shakes
    // args: []
    StimuliHandler.prototype.onShake = function(args, k) {
	var onShake = this.lookup('onShake');
	var onShakeEffect = this.lookup('onShakeEffect');
	this.doStimuli(onShakeEffect, onShake, [], k);
    };


    // Sms receiving
    // args: [sender, message]
    StimuliHandler.prototype.onSmsReceive = function(args, k) {
	var onSmsReceive = this.lookup('onSmsReceive');
	var onSmsReceiveEffect = this.lookup('onSmsReceiveEffect');
	// IMPORTANT: must coerse to string by using x+"".  Do not use
	// toString(): it's not safe.
	this.doStimuli(onSmsReceiveEffect, onSmsReceive, [args[0]+"", args[1]+""], k);
    };


    // Locations
    // args: [lat, lng]
    StimuliHandler.prototype.onLocation = function(args, k) {
	var onLocationChange = this.lookup('onLocationChange');
	var onLocationChangeEffect = this.lookup('onLocationChangeEffect');
	this.doStimuli(onLocationChangeEffect, onLocationChange, helpers.map(flt, args), k);
    };



    // Keystrokes
    // args: [e]
    StimuliHandler.prototype.onKey = function(args, k) {
	var keyname = helpers.getKeyCodeName(args[0]);
	var onKey = this.lookup('onKey');
	var onKeyEffect = this.lookup('onKeyEffect');
	this.doStimuli(onKeyEffect, onKey, [keyname], k);
    };



//    // Time ticks
//    // args: []
//    StimuliHandler.prototype.onTick = function(args, k) {
//	var onTick = this.lookup('onTick');
//	var onTickEffect = this.lookup('onTickEffect');
//	this.doStimuli(onTickEffect, onTick, [], k);
//    };



    // Announcements
    // args: [eventName, vals]
    StimuliHandler.prototype.onAnnounce = function(args, k) {
	var vals = args[1];
	var valsList = types.EMPTY;
	for (var i = 0; i < vals.length; i++) {
	    valsList = types.cons(vals[vals.length - i - 1], valsList);
	}

	var onAnnounce = this.lookup('onAnnounce');
	var onAnnounceEffect = this.lookup('onAnnounceEffect');	
	this.doStimuli(onAnnounce, onAnnounceEffect, [args[0], valsList], k);
    };



    // The shutdown stimuli: special case that forces a world computation to quit.
    // Also removes this instance from the list of handlers
    StimuliHandler.prototype.onShutdown = function() {	
	var index = handlers.indexOf(this);
	if (index != -1) {
		handlers.splice(index, 1);
	}

	var shutdownWorld = this.lookup('shutdownWorld');
	if (shutdownWorld) {
	    shutdownWorld();
	}
    };


    //////////////////////////////////////////////////////////////////////
    // Helpers
    var flt = types['float'];
    
    StimuliHandler.prototype.lookup = function(s) {
	return this.config.lookup(s);
    };

    StimuliHandler.prototype.change = function(f, k) {
	if (this.lookup('changeWorld')) {
	    this.lookup('changeWorld')(f, k);
	}
	else { k(); }
    };

    // applyEffect: compound-effect: (arrayof (world -> world))
    var applyEffect = function(e) {
	return world.Kernel.applyEffect(e);
    };

    var makeStimulusHandler = function(funName) {
	    return function() {
		var args = arguments;
		for (var i = 0; i < handlers.length; i++) {
			(handlers[i])[funName](args, doNothing);
		}
//		helpers.forEachK(handlers,
//				 function(h, k) { h[funName](args, k); },
//				 function(e) { throw e; },
//				 doNothing);
	    }
    };

    //////////////////////////////////////////////////////////////////////
    // Exports
    
    world.stimuli.StimuliHandler = StimuliHandler;

    world.stimuli.onTilt = makeStimulusHandler('onTilt');
    world.stimuli.onAcceleration = makeStimulusHandler('onAcceleration');
    world.stimuli.onShake = makeStimulusHandler('onShake');
    world.stimuli.onSmsReceive = makeStimulusHandler('onSmsReceive');
    world.stimuli.onLocation = makeStimulusHandler('onLocation');
    world.stimuli.onKey = makeStimulusHandler('onKey');
//    world.stimuli.onTick = makeStimulusHandler('onTick');
    world.stimuli.onAnnounce = makeStimulusHandler('onAnnounce');

    world.stimuli.massShutdown = function() {
	    for (var i = 0; i < handlers.length; i++) {
		var shutdownWorld = handlers[i].lookup('shutdownWorld');
		if (shutdownWorld) {
		    shutdownWorld();
		}
	    }
	    handlers = [];
    };


})();

/*global world, types */
if (typeof(world) === 'undefined') {
    world = {};
}
// Depends on kernel.js, world-config.js, effect-struct.js
(function() {
    world.Kernel = {};
    var worldListeners = [];
    var stopped;
    var timerInterval = false;

    // Inheritance from pg 168: Javascript, the Definitive Guide.
    var heir = function(p) {
        var f = function() {};
        f.prototype = p;
        return new f();
    };

    // clone: object -> object
    // Copies an object.  The new object should respond like the old
    // object, including to things like instanceof
    var clone = function(obj) {
        var C = function() {};
        var property;
        C.prototype = obj;
        var c = new C();
        for (property in obj) {
            if (Object.hasOwnProperty.call(obj, property)) {
                c[property] = obj[property];
            }
        }
        return c;
    };

    var announceListeners = [];
    world.Kernel.addAnnounceListener = function(listener) {
        announceListeners.push(listener);
    };
    world.Kernel.removeAnnounceListener = function(listener) {
        var idx = announceListeners.indexOf(listener);
        if (idx !== -1) {
            announceListeners.splice(idx, 1);
        }
    };
    world.Kernel.announce = function(eventName, vals) {
        var i;
        for (i = 0; i < announceListeners.length; i++) {
            try {
                announceListeners[i](eventName, vals);
            } catch (e) {}
        }
    };


    // changeWorld: world -> void
    // Changes the current world to newWorld.
    var changeWorld = function(newWorld) {
        world = newWorld;
        notifyWorldListeners();
    };


    // updateWorld: (world -> world) -> void
    // Public function: update the world, given the old state of the
    // world.
    world.Kernel.updateWorld = function(updater) {
        var newWorld = updater(world);
        changeWorld(newWorld);
    };


    world.Kernel.shutdownWorld = function() {
        stopped = true;
    };


    // notifyWorldListeners: -> void
    // Tells all of the world listeners that the world has changed.
    var notifyWorldListeners = function() {
        var i;
        for (i = 0; i < worldListeners.length; i++) {
            worldListeners[i](world);
        }
    };

    // addWorldListener: (world -> void) -> void
    // Adds a new world listener: whenever the world is changed, the aListener
    // will be called with that new world.
    var addWorldListener = function(aListener) {
        worldListeners.push(aListener);
    };


    // resetWorld: -> void
    // Resets all of the world global values.
    var resetWorld = function() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = false;
        }
        stopped = false;
        worldListeners = [];
    };


    var getBigBangWindow = function(width, height) {
        if (window.document.getElementById("canvas") !== undefined) {
            return window;
        }

        var newWindow = window.open(
            "big-bang.html",
            "big-bang");
        //"toolbar=false,location=false,directories=false,status=false,menubar=false,width="+width+",height="+height);
        if (newWindow === null) {
            throw new Error("Error: Not allowed to create a new window."); }

        return newWindow;
    };

    // scheduleTimerTick: -> void
    // Repeatedly schedules an evaluation of the onTick until the program has stopped.
    var scheduleTimerTick = function(window, config) {
        timerInterval = window.setInterval(
            function() {
                if (stopped) {
                    window.clearTimeout(timerInterval);
                    timerInterval = false;
                }
                else {
                    world.Kernel.stimuli.onTick();
                }
            },
            config.lookup('tickDelay'));
    };
 
    // given two arrays of {x,y} structs, determine their equivalence
    var verticesEqual = function(v1, v2){
        if(v1.length !== v2.length){ return false; }
        var v1_str = v1.map(function(o){return "x:"+o.x+",y:"+o.y}).join(","),
            v2_str = v2.map(function(o){return "x:"+o.x+",y:"+o.y}).join(",");
        // v1 == rot(v2) if append(v1,v1) includes v2
        return (v1_str+","+v1_str).includes(v2_str);
    };

    // given an array of (x, y) pairs, unzip them into separate arrays
    var unzipVertices = function(vertices){
        return {xs: vertices.map(function(v) { return v.x }),
                ys: vertices.map(function(v) { return v.y })};
    };
    // given an array of vertices, find the width of the shape
    var findWidth = function(vertices){
        var xs = unzipVertices(vertices).xs;
        return Math.max.apply(Math, xs) - Math.min.apply(Math, xs);
    }
    // given an array of vertices, find the height of the shape
    var findHeight = function(vertices){
        var ys = unzipVertices(vertices).ys;
        return Math.max.apply(Math, ys) - Math.min.apply(Math, ys);
    }

    // given a list of vertices and a translationX/Y, shift them
    var translateVertices = function(vertices) {
        var vs = unzipVertices(vertices);
        var translateX = -Math.min.apply( Math, vs.xs );
        var translateY = -Math.min.apply( Math, vs.ys );
        return vertices.map(function(v) {
            return {x: v.x + translateX, y: v.y + translateY };
        })
    }

    // Base class for all images.
    var BaseImage = function() {};
    world.Kernel.BaseImage = BaseImage;


    var isImage = function(thing) {
        return (thing !== null &&
                thing !== undefined &&
                thing instanceof BaseImage);
    };
    /*
    // almost certainly dead code
    BaseImage.prototype.updatePinhole = function(x, y) {
        var aCopy = clone(this);
        aCopy.pinholeX = x;
        aCopy.pinholeY = y;
        return aCopy;
    };
    */
    // return Integer-only height for the getter methods
    BaseImage.prototype.getHeight = function(){
        return Math.round(this.height);
    };
    BaseImage.prototype.getWidth = function(){
        return Math.round(this.width);
    };
    BaseImage.prototype.getBaseline = function(){
        return Math.round(this.height);
    };

    // return the vertex array if it exists, otherwise make one using height and width
    BaseImage.prototype.getVertices = function(){
        if(this.vertices){ return this.vertices; }
        else{ return [{x:0 , y: 0},
                      {x: this.width, y: 0},
                      {x: 0, y: this.height},
                      {x: this.width, y: this.height}]; }
    };

    // render: context fixnum fixnum: -> void
    // Render the image, where the upper-left corner of the image is drawn at
    // (x, y).
    // If the image isn't vertex-based, throw an error
    // Otherwise, stroke and fill the vertices.
    BaseImage.prototype.render = function(ctx, x, y) {
        if(!this.vertices){
            throw new Error('BaseImage.render is not implemented for this type!');
        }
        ctx.save();
        ctx.beginPath();

        // we care about the stroke because drawing to a canvas is *different* for
        // fill v. stroke! If it's fill, we can draw on the pixel boundaries and
        // stroke within them. If it's outline, we need to draw _inside_ those 
        // boundaries, adjusting by a half-pixel towards the center.
        var isSolid = this.style.toString().toLowerCase() !== "outline";

        var vertices;
        // pixel-perfect vertices fail on Chrome, and certain versions of FF,
        // so we disable the offset for equality tests and solid images
        if(ctx.isEqualityTest || isSolid){
            vertices = this.vertices;
        } else {
            // find the midpoint of the xs and ys from vertices
            var midX = findWidth(this.vertices)  / 2;
            var midY = findHeight(this.vertices) / 2;

            // compute 0.5px offsets to ensure that we draw on the pixel
            // and not the pixel boundary
            vertices = this.vertices.map(function(v){
                return {x: v.x + (v.x < midX ? 0.5 : -0.5),
                        y: v.y + (v.y < midY ? 0.5 : -0.5)};
            });
        }
        
        // draw a path from vertex to vertex
        ctx.moveTo( x+vertices[0].x, y+vertices[0].y );
        vertices.forEach(function(v){ ctx.lineTo( x + v.x, y + v.y); });
        ctx.closePath();
       
        if (isSolid) {
            ctx.fillStyle = colorString(this.color, this.style);
            ctx.fill();
        } else {
            ctx.strokeStyle = colorString(this.color);
            ctx.stroke();
        }
        ctx.restore();
    };


    // makeCanvas: number number -> canvas
    // Constructs a canvas object of a particular width and height.
    world.Kernel.makeCanvas = makeCanvas = function(width, height) {
        var canvas = document.createElement("canvas");
        canvas.width  = width;
        canvas.height = height;
        canvas.style.width  = canvas.width  + "px";
        canvas.style.height = canvas.height + "px"; 
        return canvas;
    };

    BaseImage.prototype.toDomNode = function(cache) {
        var that = this;
        var width = that.getWidth();
        var height = that.getHeight();
        var canvas = world.Kernel.makeCanvas(width, height);
        var ctx;

        // KLUDGE: on IE, the canvas rendering functions depend on a
        // context where the canvas is attached to the DOM tree.
        // We initialize an afterAttach hook; the client's responsible
        // for calling this after the dom node is attached to the
        // document.
        canvas.afterAttach = function() {
            ctx = canvas.getContext("2d");
            that.render(ctx, 0, 0);
        };
        canvas.ariaText = this.getAriaText(BaseImage.ariaNestingDepth);
        return canvas;
    };
    // don't bother reading descriptions of images nested deeper than 6
    BaseImage.ariaNestingDepth = 6;

    BaseImage.prototype.toWrittenString = function(cache) { return "<image>"; };
    BaseImage.prototype.toDisplayedString = this.toWrittenString;
    BaseImage.prototype.getAriaText = function(depth) { return "image"; }

    // Best-Guess equivalence for images. If they're vertex-based we're in luck,
    // otherwise we go pixel-by-pixel. It's up to exotic image types to provide
    // more efficient ways of comparing one another
    BaseImage.prototype.isEqual = function(other, aUnionFind) {
      if(!(other instanceof BaseImage) ||
         this.getWidth()  !== other.getWidth()    ||
         this.getHeight() !== other.getHeight()){ return false; }

      // FAST PATH: if they're both vertex-based images, compare
      // their styles, vertices and colors.
      // * Also checks for rotations of otherwise-identical vertices
      if(   (this.vertices && other.vertices)
         && (this.style    === other.style)
         && (types.isEqual(this.color, other.color, aUnionFind))
         && (verticesEqual(this.vertices, other.vertices))) {
            console.log('Using fast path for image equality check');
            return true;
      }

      // SLOW PATH: render both images to canvases
      // First check canvas dimensions, then hash both images and compare
      console.log('Using slow path for image equality check');
      var c1 = this.toDomNode(), c2 = other.toDomNode();
      c1.style.visibility = c2.style.visibility = "hidden";
      if(c1.width !== c2.width || c1.height !== c2.height){ return false;}
      try{
        var ctx1 = c1.getContext('2d'), ctx2 = c2.getContext('2d');
        ctx1.isEqualityTest = true;
        ctx2.isEqualityTest = true;
        this.render(ctx1, 0, 0); other.render(ctx2, 0, 0);
        // create temporary canvases
        var slice1 = document.createElement('canvas').getContext('2d'),
            slice2 = document.createElement('canvas').getContext('2d');
        var tileW = Math.min(10000, c1.width); // use only the largest tiles we need for these images
        var tileH = Math.min(10000, c1.height);
        for (var y=0; y < c1.height; y += tileH){
            for (var x=0; x < c1.width; x += tileW){
                tileW = Math.min(tileW, c1.width - x); // can we use smaller tiles for what's left?
                tileH = Math.min(tileH, c1.height- y);
                slice1.canvas.width  = slice2.canvas.width  = tileW;
                slice1.canvas.height = slice2.canvas.height = tileH;
                console.log('processing chunk from ('+x+','+y+') to ('+(x+tileW)+','+(y+tileH)+')');
                slice1.clearRect(0, 0, tileW, tileH);
                slice1.drawImage(c1, x, y, tileW, tileH, 0, 0, tileW, tileH);
                slice2.clearRect(0, 0, tileW, tileH);
                slice2.drawImage(c2, x, y, tileW, tileH, 0, 0, tileW, tileH);
                var d1 = slice1.canvas.toDataURL(),
                    d2 = slice2.canvas.toDataURL(),
                    h1 = world.md5(d1),  h2 = world.md5(d2);
                if(h1 !== h2) return false;
            }
        }
      // Slow-path can fail with CORS or image-loading problems
      } catch(e){
        console.log('Couldn\'t compare images:', e);
        return false;
      }
      // if, after all this, we're still good...then they're equal!
      return true;
    };

    // isScene: any -> boolean
    // Produces true when x is a scene.
    var isScene = function(x) {
        return ((x !== undefined) && (x !== null) && (x instanceof SceneImage));
    };

    //////////////////////////////////////////////////////////////////////
    // SceneImage: primitive-number primitive-number (listof image) boolean color -> Scene
    var SceneImage = function(width, height, children, withBorder, color) {
        BaseImage.call(this);
        this.width    = width;
        this.height   = height;
        this.children = children; // arrayof [image, number, number]
        this.withBorder = withBorder;
        this.color    = color;
    };
    SceneImage.prototype = heir(BaseImage.prototype);

    // add: image primitive-number primitive-number -> Scene
    SceneImage.prototype.add = function(anImage, x, y) {
        return new SceneImage(this.width, 
                              this.height,
                              this.children.concat([[anImage, 
                                                     x - anImage.getWidth()/2,
                                                     y - anImage.getHeight()/2]]),
                              this.withBorder,
                              this.color);
    };

    SceneImage.prototype.getAriaText = function(depth) {
        if (depth <= 0) return "scene image";
        var ariaText = " a Scene that is "+this.width+" by "+this.height+". children are: ";
        ariaText += this.children.map(function(c,i){
          return "child "+(i+1)+": "+c[0].getAriaText(depth - 1)+", positioned at "+c[1]+","+c[2]+" ";
        }).join(". ");
        return ariaText;
    }

    // render: 2d-context primitive-number primitive-number -> void
    SceneImage.prototype.render = function(ctx, x, y) {
        var childImage, childX, childY;
        // create a clipping region around the boundaries of the Scene
        ctx.save();
        ctx.fillStyle = this.color? colorString(this.color) : "transparent";
        ctx.fillRect(x, y, this.width, this.height);
        ctx.restore();
        // save the context, reset the path, and clip to the path around the scene edge
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.clip();
        // Ask every object to render itself inside the region
        this.children.forEach(function(child) { 
            // then, render the child images
            childImage = child[0];
            childX = child[1];
            childY = child[2];
            childImage.render(ctx, childX + x, childY + y);
        });
        // unclip
        ctx.restore();

        if (this.withBorder) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, y, this.width, this.height);
        }
    };

    SceneImage.prototype.isEqual = function(other, aUnionFind) {
        return (other instanceof SceneImage     &&
                this.width    == other.width    &&
                this.height   == other.height   &&
                this.children.length == other.children.length && 
                this.children.every(function(child1, i) {
                    var child2 = other.children[i];
                    return (child1[1] == child2[1] &&
                            child1[2] == child2[2] &&
                            types.isEqual(child1[0], child2[0], aUnionFind));
                }))
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };


    //////////////////////////////////////////////////////////////////////
    // FileImage: string node -> Image
    var FileImage = function(src, rawImage, afterInit) {
        BaseImage.call(this);
        var self = this;
        this.src = src;
        this.isLoaded = false;
        this.originalURI = decodeURIComponent(src).slice(16);
        this.labeled = false;

        // animationHack: see installHackToSupportAnimatedGifs() for details.
        this.animationHackImg = undefined;

        function onImgLoad() {
            self.isLoaded = true;
            self.width = self.img.width;
            self.height = self.img.height;
        }

        if (rawImage && rawImage.complete) {
            self.img = rawImage;
            onImgLoad();
        } else {
            // fixme: we may want to do something blocking here for
            // onload, since we don't know at this time what the file size
            // should be, nor will drawImage do the right thing until the
            // file is loaded.
            self.img = new Image();
            self.img.onload = onImgLoad;
            self.img.onerror = function(e) {
                self.img.onerror = "";
                self.img.src = "http://www.wescheme.org/images/broken.png";
            };
            self.img.src = src;
        }
        this.installHackToSupportAnimatedGifs(afterInit);
    };
    FileImage.prototype = heir(BaseImage.prototype);

    FileImage.prototype.getAriaText = function(depth) {
        return imageCache && imageCache[this.originalURI] && imageCache[this.originalURI].labeled? 
            imageCache[this.originalURI].getAriaText()
            : " an image file from "+this.originalURI;
    }

    // set up the cache, and look for images that need describing every 5 sec
    var imageCache = {};
    var VISION_API_TIMEOUT = 5000;
    var visionAPITimer = window.myEditor? setTimeout(describeImagesInCache, VISION_API_TIMEOUT) : null;

    function describeImagesInCache() {
        visionAPITimer = setTimeout(describeImagesInCache, VISION_API_TIMEOUT);

        if(!myEditor.getScreenreader()) return;
        // collect all undescribed fileImages in an array
        var undescribedImages = [];
        for (var src in imageCache) {
            if (imageCache.hasOwnProperty(src) && !imageCache[src].labeled) {
                undescribedImages.push(imageCache[src]);
            }
        }
        // bail if there's no work to be done
        if(undescribedImages.length === 0) return;

        // do some work! create a batch request for all undescribed images
        var requests = [];
        undescribedImages.forEach(function(img) {
          requests.push(  { image: { source: { imageUri: img.originalURI } }, 
                            features: [{type: "LABEL_DETECTION", maxResults: 10}]});
        });
        var CONFIDENCE_THRESHOLD = 0.75;
        var jsonString = JSON.stringify({requests: requests});
        try {
            var xhr = new XMLHttpRequest();
            xhr.onload = function() { 
                var data = JSON.parse(this.responseText);
                if(!data.responses) {
                    VISION_API_TIMEOUT *= 2; // Decay
                    console.log('no response from VisionAPI. set timeout to ', VISION_API_TIMEOUT, 'ms');
                    throw "No response from Google Vision API";
                } else {
                    console.log('successful load from VisionAPI. set timeout to ', VISION_API_TIMEOUT, 'ms');
                    VISION_API_TIMEOUT = 5000; //reset time to default 5sec
                }
                data.responses.forEach(function(response, i) {
                    // sort labels by *descending* confidence (in-place!), then grab the
                    // label with the highest confidence
                    response.labelAnnotations.sort(function(label1, label2){
                        return (label1.confidence < label2.confidence)? 1 : -1; // descending order!
                    });
                    var bestLabel = response.labelAnnotations[0].description;
                    // update the FileImage in the imageCache
                    imageCache[undescribedImages[i].originalURI].labeled = true;
                    imageCache[undescribedImages[i].originalURI].getAriaText = function() { 
                        " a picture of a "+bestLabel;
                    };
                });
                console.log('after load(), timeout is', VISION_API_TIMEOUT);
            }
            xhr.onerror = function () { console.log("Google VisionAPI post() failure"); }
            xhr.open('POST', "https://vision.googleapis.com/v1/images:annotate?key="+plt.config.API_KEY);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(jsonString);
        } catch (e) {
            console.log('Setting up XHR for Google Vision API failed', e);
            VISION_API_TIMEOUT *= 2; // Decay
        }
    }

    FileImage.makeInstance = function(path, rawImage, afterInit) {
        var uri = decodeURIComponent(path).slice(16); // get the original URI
        if (! (uri in imageCache)) {
            imageCache[uri] = new FileImage(path, rawImage, afterInit);
            return imageCache[uri];
        } else {
            afterInit(imageCache[uri]);
            return imageCache[uri];
        }
    };

    FileImage.prototype.render = function(ctx, x, y) {
        var self = this;
        ctx.drawImage(self.animationHackImg, x, y);
        setTimeout(function(){
            //ctx.canvas.setAttribute('aria-label', self.getAriaText());
            //ctx.canvas.ariaText = self.getAriaText();
        }, 5000);
    };

    // The following is a hack that we use to allow animated gifs to show
    // as animating on the canvas. They have to be added to the DOM as *images*
    // in order to have their frames fed to the canvas, so we add them someplace hidden
    FileImage.prototype.installHackToSupportAnimatedGifs = function(afterInit) {
        var that = this;
        this.animationHackImg = this.img.cloneNode(true);
        document.body.appendChild(this.animationHackImg);
        this.animationHackImg.style.position = 'absolute';
        this.animationHackImg.style.top = '-50000px';
 
        if (this.animationHackImg.complete) {
            afterInit(that);
        } else {
            this.animationHackImg.onload = function() {
                afterInit(that);
            };
        }
    };

    FileImage.prototype.getWidth = function() {
        return Math.round(this.img.width);
    };

    FileImage.prototype.getHeight = function() {
        return Math.round(this.img.height);
    };

    FileImage.prototype.isEqual = function(other, aUnionFind) {
        return ((other instanceof FileImage) && this.src === other.src)
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };

    //////////////////////////////////////////////////////////////////////
    // fileVideo: String Node -> Video
    var FileVideo = function(src, rawVideo) {
        BaseImage.call(this);
        var self = this;
        this.src = src;
        if (rawVideo) {
            this.video                  = rawVideo;
            this.width                  = self.video.videoWidth;
            this.height                 = self.video.videoHeight;
            this.video.volume           = 1;
            this.video.poster           = "http://www.wescheme.org/images/broken.png";
            this.video.autoplay         = true;
            this.video.autobuffer       = true;
            this.video.loop             = true;
            this.video.play();
        } else {
            // fixme: we may want to do something blocking here for
            // onload, since we don't know at this time what the file size
            // should be, nor will drawImage do the right thing until the
            // file is loaded.
            this.video = document.createElement('video');
            this.video.src = src;
            this.video.addEventListener('canplay', function() {
                this.width              = self.video.videoWidth;
                this.height             = self.video.videoHeight;
                this.video.poster       = "http://www.wescheme.org/images/broken.png";
                this.video.autoplay     = true;
                this.video.autobuffer   = true;
                this.video.loop         = true;
                this.video.play();
            });
            this.video.addEventListener('error', function(e) {
                self.video.onerror = "";
                self.video.poster = "http://www.wescheme.org/images/broken.png";
            });
        }
    };
    FileVideo.prototype = heir(BaseImage.prototype);

    FileVideo.prototype.getAriaText = function(depth) {
        return " a video file from "+decodeURIComponent(this.src).slice(16);
    }

    var videoCache = {};
    FileVideo.makeInstance = function(path, rawVideo) {
        if (! (path in FileVideo)) {
            videoCache[path] = new FileVideo(path, rawVideo);
        } 
        return videoCache[path];
    };

    FileVideo.prototype.render = function(ctx, x, y) {
        ctx.drawImage(this.video, x, y);
    };
    FileVideo.prototype.isEqual = function(other, aUnionFind) {
        return ((other instanceof FileVideo) && this.src === other.src)
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };
 

    //////////////////////////////////////////////////////////////////////
    // FileAudio: String Node -> Video
    var FileAudio = function(src, loop, rawAudio) {
        this.src = src;
        var that = this;
        if (rawAudio && (rawAudio.readyState===4)) {
            that.audio                  = rawAudio;
            that.audio.autoplay         = true;
            that.audio.autobuffer       = true;
            that.audio.currentTime      = 0;
            that.audio.loop             = loop;
            that.audio.play();
        } else {
            // fixme: we may want to do something blocking here for
            // onload, since we don't know at this time what the file size
            // should be, nor will drawImage do the right thing until the
            // file is loaded.
            that.audio = document.createElement('audio');
            that.audio.src = src;
            that.audio.addEventListener('canplay', function() {
                that.audio.autoplay     = true;
                that.audio.autobuffer   = true;
                that.audio.currentTime  = 0;
                that.audio.loop         = loop;
                that.audio.play();
            });
        }
        return true;
    };
    var audioCache = {};
    FileAudio.makeInstance = function(path, loop, rawAudio) {
        if (! (path in audioCache)) {
            audioCache[path] = new FileAudio(path, loop, rawAudio, afterInit);
            return audioCache[path];
        } else {
            audioCache[path].audio.play();
            afterInit(audioCache[path]);
            return audioCache[path];
        }
        return new FileAudio(path, loop, rawAudio);
    };
 
    //////////////////////////////////////////////////////////////////////
    // ImageDataImage: imageData -> image
    // Given an array of pixel data, create an image
    var ImageDataImage = function(imageData) {
        BaseImage.call(this);
        this.imageData= imageData;
        this.width    = imageData.width;
        this.height   = imageData.height;
    };
 
    ImageDataImage.prototype = heir(BaseImage.prototype);
 
    ImageDataImage.prototype.render = function(ctx, x, y) {
        ctx.putImageData(this.imageData, x, y);
    };

    //////////////////////////////////////////////////////////////////////
    // OverlayImage: image image placeX placeY -> image
    // Creates an image that overlays img1 on top of the
    // other image img2.
    var OverlayImage = function(img1, img2, placeX, placeY) {
        BaseImage.call(this);

        // An overlay image consists of width, height, x1, y1, x2, and
        // y2.  We need to compute these based on the inputs img1,
        // img2, placex, and placey.

        // placeX and placeY may be non-numbers, in which case their values
        // depend on the img1 and img2 geometry.
        
        var x1, y1, x2, y2;

        if (placeX === "left") {
            x1 = 0;
            x2 = 0;
        } else if (placeX === "right") {
            x1 = Math.max(img1.width, img2.width) - img1.width;
            x2 = Math.max(img1.width, img2.width) - img2.width;
        } else if (placeX === "beside") {
            x1 = 0;
            x2 = img1.width;
        } else if (placeX === "middle" || placeX === "center") {
            x1 = Math.max(img1.width, img2.width)/2 - img1.width/2;
            x2 = Math.max(img1.width, img2.width)/2 - img2.width/2;
        } else {
            x1 = Math.max(placeX, 0) - placeX;
            x2 = Math.max(placeX, 0);
        }
        
        if (placeY === "top") {
            y1 = 0;
            y2 = 0;
        } else if (placeY === "bottom") {
            y1 = Math.max(img1.height, img2.height) - img1.height;
            y2 = Math.max(img1.height, img2.height) - img2.height;
        } else if (placeY === "above") {
            y1 = 0;
            y2 = img1.height;
        } else if (placeY === "baseline") {
            y1 = Math.max(img1.getBaseline(), img2.getBaseline()) - img1.getBaseline();
            y2 = Math.max(img1.getBaseline(), img2.getBaseline()) - img2.getBaseline();
        } else if (placeY === "middle" || placeY === "center") {
            y1 = Math.max(img1.height, img2.height)/2 - img1.height/2;
            y2 = Math.max(img1.height, img2.height)/2 - img2.height/2;
        } else {
            y1 = Math.max(placeY, 0) - placeY;
            y2 = Math.max(placeY, 0);
        }

        // calculate the vertices of this image by translating the vertices of the sub-images
        var i, v1 = img1.getVertices(), v2 = img2.getVertices(), xs = [], ys = [];
        v1 = v1.map(function(v){ return {x: v.x + x1, y: v.y + y1}; });
        v2 = v2.map(function(v){ return {x: v.x + x2, y: v.y + y2}; });
        
        // store the vertices as something private, so this.getVertices() will still return undefined
        this._vertices = v1.concat(v2);

        // store the offsets for rendering
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.img1 = img1;
        this.img2 = img2;
        var positionText;
        if((["middle","center"].indexOf(placeX)>-1) && (["middle","center"].indexOf(placeY)>-1)){
          positionText = " centered ";
        } else if(placeX==="left"){
          positionText = " left-aligned ";
        } else if(placeX==="right"){
          positionText = " right-aligned ";
        } else if(placeX==="beside"){
          positionText = " beside ";
        } else if(!isNaN(placeX)){
          positionText = " shifted left by "+placeX;
        }
        if(placeY==="top"){
          positionText += " top-aligned ";
        } else if(placeY==="bottom"){
          positionText += " bottom-aligned ";
        } else if(placeY==="above"){
          positionText += " above ";
        } else if(!isNaN(placeY)){
          positionText += " , shifted up by "+placeY;
        }
        this.width  = findWidth(this._vertices);
        this.height = findHeight(this._vertices);
        this.positionText = positionText;
    };

    OverlayImage.prototype = heir(BaseImage.prototype);
 
    OverlayImage.prototype.getAriaText = function(depth) {
        if (depth <= 0) return "overlay image";
        return " an overlay: " + this.img1.getAriaText(depth - 1) 
            + this.positionText + " above " + this.img2.getAriaText(depth - 1);
    };

    OverlayImage.prototype.getVertices = function() { return this._vertices; };
 
    OverlayImage.prototype.render = function(ctx, x, y) {
        ctx.save();
        this.img2.render(ctx, x + this.x2, y + this.y2);
        this.img1.render(ctx, x + this.x1, y + this.y1);
        ctx.restore();
    };

    // try the fast-path (structural equality), fail to the slow path
    OverlayImage.prototype.isEqual = function(other, aUnionFind) {
        return ((other instanceof OverlayImage) &&
                this.width     === other.width  &&
                this.height    === other.height &&
                this.x1        === other.x1     &&
                this.y1        === other.y1     &&
                this.x2        === other.x2     &&
                this.y2        === other.y2     &&
                types.isEqual(this.img1, other.img1, aUnionFind) &&
                types.isEqual(this.img2, other.img2, aUnionFind) )
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };


    //////////////////////////////////////////////////////////////////////
    // rotate: angle image -> image
    // Rotates image by angle degrees in a counter-clockwise direction.
    var RotateImage = function(angle, img) {
        BaseImage.call(this);
        // optimization for trying to rotate a circle
        if((img instanceof EllipseImage) && (img.width == img.height)){
            angle = 0;
        }
        var sin   = Math.sin(angle * Math.PI / 180);
        var cos   = Math.cos(angle * Math.PI / 180);
        
        // rotate each point as if it were rotated about (0,0)
        var vertices = img.getVertices().map(function(v) {
            return {x: v.x*cos - v.y*sin, y: v.x*sin + v.y*cos };
        });

        // extract the xs and ys separately
        var vs = unzipVertices(vertices);
        
        // store the vertices as something private, so this.getVertices() will still return undefined
        this._vertices  = translateVertices(vertices);
        this.img        = img;
        this.width      = findWidth(vertices);
        this.height     = findHeight(vertices);
        this.angle      = Math.round(angle);
        this.translateX = -Math.min.apply( Math, vs.xs );
        this.translateY = -Math.min.apply( Math, vs.ys );
    };

    RotateImage.prototype = heir(BaseImage.prototype);

    RotateImage.prototype.getAriaText = function(depth) {
        if (depth <= 0) return "rotated image";
        return "Rotated image, "+(-1 * this.angle)+" degrees: "+this.img.getAriaText(depth - 1);
    };

    RotateImage.prototype.getVertices = function() { return this._vertices; };

    // translate the canvas using the calculated values, then draw at the rotated (x,y) offset.
    RotateImage.prototype.render = function(ctx, x, y) {
        ctx.save();
        ctx.translate(x + this.translateX, y + this.translateY);
        ctx.rotate(this.angle * Math.PI / 180);
        this.img.render(ctx, 0, 0);
        ctx.restore();
    };

    // try the fast-path (structural equality), fail to the slow path
    RotateImage.prototype.isEqual = function(other, aUnionFind) {
        return ((other instanceof RotateImage)      &&
                this.width     === other.width      &&
                this.height    === other.height     &&
                this.angle     === other.angle      &&
                this.translateX=== other.translateX &&
                this.translateY=== other.translateY &&
                types.isEqual(this.img, other.img, aUnionFind) )
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };

    //////////////////////////////////////////////////////////////////////
    // ScaleImage: factor factor image -> image
    // Scale an image
    var ScaleImage = function(xFactor, yFactor, img) {
        BaseImage.call(this);

        // grab the img vertices, scale them, and save the result to this_vertices
        this._vertices = img.getVertices().map(function(v) {
            return {x: v.x * xFactor, y: v.y * yFactor };
        });
 
        this.img      = img;
        this.width    = img.width  * xFactor;
        this.height   = img.height * yFactor;
        this.xFactor  = xFactor;
        this.yFactor  = yFactor;
    };

    ScaleImage.prototype = heir(BaseImage.prototype);


    ScaleImage.prototype.getAriaText = function(depth) {
        if (depth <= 0) return "scaled image";
        return "Scaled Image, "+
            (this.xFactor===this.yFactor
            ? "by "+this.xFactor
            : "horizontally by "+this.xFactor+" and vertically by "+this.yFactor)+". " +
        this.img.getAriaText(depth - 1);
    };

    ScaleImage.prototype.getVertices = function() { return this._vertices; };

    // scale the context, and pass it to the image's render function
    ScaleImage.prototype.render = function(ctx, x, y) {
        ctx.save();
        ctx.scale(this.xFactor, this.yFactor);
        this.img.render(ctx, x / this.xFactor, y / this.yFactor);
        ctx.restore();
    };

    ScaleImage.prototype.isEqual = function(other, aUnionFind) {
        return ((other instanceof ScaleImage)       &&
                this.width     === other.width      &&
                this.height    === other.height     &&
                this.xFactor   === other.xFactor    &&
                this.yFactor   === other.yFactor    &&
                types.isEqual(this.img, other.img, aUnionFind) )
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };

    //////////////////////////////////////////////////////////////////////
    // CropImage: startX startY width height image -> image
    // Crop an image
    var CropImage = function(x, y, width, height, img) {
        BaseImage.call(this);
        this.x          = x;
        this.y          = y;
        this.width      = width;
        this.height     = height;
        this.img        = img;
    };

    CropImage.prototype = heir(BaseImage.prototype);


    CropImage.prototype.getAriaText = function(depth) {
        if (depth <= 0) return "cropped image";
        return "Cropped image, from "+this.x+", "+this.y+" to "+(this.x+this.width)+", "+(this.y+this.height)+": "+this.img.getAriaText(depth - 1);
    };

    CropImage.prototype.render = function(ctx, x, y) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.clip();
        ctx.translate(-this.x, -this.y);
        this.img.render(ctx, x, y);
        ctx.restore();
    };

    CropImage.prototype.isEqual = function(other, aUnionFind) {
        return ((other instanceof CropImage)    &&
                this.width     === other.width  &&
                this.height    === other.height &&
                this.x         === other.x      &&
                this.y         === other.y      &&
                types.isEqual(this.img, other.img, aUnionFind) )
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };

    //////////////////////////////////////////////////////////////////////
    // FrameImage: factor factor image -> image
    // Stick a frame around the image
    var FrameImage = function(img) {
        BaseImage.call(this);
        this.img        = img;
        this.width      = img.width;
        this.height     = img.height;
    };

    FrameImage.prototype = heir(BaseImage.prototype);


    FrameImage.prototype.getAriaText = function(depth) {
        if (depth <= 0) return "framed image";
        return " Framed image: "+this.img.getAriaText(depth - 1);
    };

    // scale the context, and pass it to the image's render function
    FrameImage.prototype.render = function(ctx, x, y) {
        ctx.save();
        this.img.render(ctx, x, y);
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.strokeRect(x, y, this.width, this.height);
        ctx.closePath();
        ctx.restore();
    };

    FrameImage.prototype.isEqual = function(other, aUnionFind) {
        return (other instanceof FrameImage &&
                types.isEqual(this.img, other.img, aUnionFind) )
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };

    //////////////////////////////////////////////////////////////////////
    // FlipImage: image string -> image
    // Flip an image either horizontally or vertically
    var FlipImage = function(img, direction) {
        BaseImage.call(this);
        this.img        = img;
        this.width      = img.getWidth();
        this.height     = img.getHeight();
        this.direction  = direction;
    };

    FlipImage.prototype = heir(BaseImage.prototype);


    FlipImage.prototype.getAriaText = function(depth) {
        if (depth <= 0) return "flipped image";
        return indefiniteArticle(this.direction)+"ly flipped image: " 
            + this.img.getAriaText(depth - 1);
    };

    FlipImage.prototype.render = function(ctx, x, y) {
        // when flipping an image of dimension M and offset by N across an axis, 
        // we need to translate the canvas by M+2N in the opposite direction
        ctx.save();
        if(this.direction === "horizontal"){
            ctx.scale(-1, 1);
            ctx.translate(-(this.width+2*x), 0);
        }
        if (this.direction === "vertical"){
            ctx.scale(1, -1);
            ctx.translate(0, -(this.height+2*y));
        }
        this.img.render(ctx, x, y);
        ctx.restore();
    };

    FlipImage.prototype.isEqual = function(other, aUnionFind) {
        return ((other instanceof FlipImage)        &&
                this.width     === other.width      &&
                this.height    === other.height     &&
                this.direction === other.direction  &&
                types.isEqual(this.img, other.img, aUnionFind) )
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };


    //////////////////////////////////////////////////////////////////////
    // colorString : hexColor Style -> rgba
    // Style can be "solid" (1.0), "outline" (1.0), a number (0-1.0) or null (1.0)
    var colorString = function(aColor, aStyle) {
      var styleAlpha = isNaN(aStyle)? 1.0 : aStyle/255,
          colorAlpha = types.colorAlpha(aColor)/255;
      return "rgba(" +  types.colorRed(aColor)   + ", " +
                        types.colorGreen(aColor) + ", " +
                        types.colorBlue(aColor)  + ", " +
                        styleAlpha * colorAlpha  + ")";
    };
 
    //////////////////////////////////////////////////////////////////////
    // indefiniteArticle : String -> String
    // Prepend "a" or "an" to the given string, depending on whether it
    // starts with a vowel
    function indefiniteArticle(str) {
        str = str.replace(/^\s*/, ""); // strip any leading whitespace
        return (str.match(/^[aeiouAEIOU]/)? " an " : " a ") + str;
    }
    

    //////////////////////////////////////////////////////////////////////
    // colorToSpokenString : hexColor Style -> String
    // Describes the color using the nearest HTML color name
    // Style can be "solid" (1.0), "outline" (1.0), a number (0-1.0) or null (1.0)
    function colorToSpokenString(aColor, aStyle){
      if(aStyle===0) return " transparent ";
      var lab1 = RGBtoLAB(types.colorRed(aColor),
                          types.colorGreen(aColor),
                          types.colorBlue(aColor));
      var distances = world.Kernel.colorLabs.map(function(lab2){
              return {l: lab2.l, a: lab2.a, b:lab2.b, name: lab2.name,
                      d: Math.sqrt(Math.pow(lab1.l-lab2.l,2)
                                   +Math.pow(lab1.a-lab2.a,2)
                                   +Math.pow(lab1.b-lab2.b,2))}});
      var distances = distances.sort(function(a,b){return a.d<b.d? -1 : a.d>b.d? 1 : 0 ;});
      var match = distances[0].name;
      var style = (aStyle == "" || isNaN(aStyle))? (aStyle = " " + aStyle) : " translucent ";
      return style + " " + match.toLowerCase();
    }

    //////////////////////////////////////////////////////////////////////
    // RectangleImage: Number Number Mode Color -> Image
    var RectangleImage = function(width, height, style, color) {
        BaseImage.call(this);
        this.width  = width;
        this.height = height;
        this.style  = style;
        this.color  = color;
        this.vertices = [{x:0,y:height},{x:0,y:0},{x:width,y:0},{x:width,y:height}];
    };
    RectangleImage.prototype = heir(BaseImage.prototype);


    RectangleImage.prototype.getAriaText = function(depth) {
      return indefiniteArticle(colorToSpokenString(this.color,this.style)) +
        ((this.width===this.height)
         ? " square of size "+this.width
         : " rectangle of width "+this.width+" and height "+this.height);
    };

    //////////////////////////////////////////////////////////////////////
    // RhombusImage: Number Number Mode Color -> Image
    var RhombusImage = function(side, angle, style, color) {
        BaseImage.call(this);
        // sin(angle/2-in-radians) * side = half of base
        // cos(angle/2-in-radians) * side = half of height
        this.width  = Math.sin(angle/2 * Math.PI / 180) * side * 2;
        this.height = Math.abs(Math.cos(angle/2 * Math.PI / 180)) * side * 2;
        this.style  = style;
        this.color  = color;
        this.side   = side;
        this.angle  = angle;
        this.vertices = [{x:this.width/2, y:0},
                         {x:this.width,   y:this.height/2},
                         {x:this.width/2, y:this.height},
                         {x:0,            y:this.height/2}];
    };
    RhombusImage.prototype = heir(BaseImage.prototype);

    RhombusImage.prototype.getAriaText = function(depth) {
        return indefiniteArticle(colorToSpokenString(this.color,this.style)) + " rhombus of size "+this.side+" and angle "+this.angle;
    };

    //////////////////////////////////////////////////////////////////////
    // PosnImage: Vertices Mode Color -> Image
    //
    var PosnImage = function(vertices, style, color) {
        BaseImage.call(this);
        var vertices = vertices.map(function(v){
            return { x: jsnums.toFixnum(types.posnX(v)), y: jsnums.toFixnum(types.posnY(v)) };
        });
        console.log('vertices are', vertices);

        this.width      = findWidth(vertices);
        this.height     = findHeight(vertices);
        this.style      = style;
        this.color      = color;
        this.vertices   = translateVertices(vertices);
    };
    PosnImage.prototype = heir(BaseImage.prototype);

    PosnImage.prototype.getAriaText = function(depth) {
        return indefiniteArticle(colorToSpokenString(this.color,this.style)) + ", " + this.vertices.length + "-pointed polygon ";
    };

    //////////////////////////////////////////////////////////////////////
    // PolygonImage: Number Count Step Mode Color -> Image
    //
    // See http://www.algebra.com/algebra/homework/Polygons/Inscribed-and-circumscribed-polygons.lesson
    // the polygon is inscribed in a circle, whose radius is length/2sin(pi/count)
    // another circle is inscribed in the polygon, whose radius is length/2tan(pi/count)
    // rotate a 3/4 quarter turn plus half the angle length to keep bottom base level
    var PolygonImage = function(length, count, step, style, color, ariaOverride) {
        BaseImage.call(this);
        this.outerRadius = Math.round(length/(2*Math.sin(Math.PI/count)));
        this.innerRadius = Math.round(length/(2*Math.tan(Math.PI/count)));
        var adjust = (3*Math.PI/2)+Math.PI/count;
        
        // rotate around outer circle, storing x and y coordinates
        var radians = 0, vertices = [];
        for(var i = 0; i < count; i++) {
            radians = radians + (step*2*Math.PI/count);
            vertices.push({ x: Math.round(this.outerRadius*Math.cos(radians-adjust)),
                            y: Math.round(this.outerRadius*Math.sin(radians-adjust))});
        }
        
        this.width      = findWidth(vertices);
        this.height     = findHeight(vertices);
        this.length     = length;
        this.count      = count;
        this.style      = style;
        this.color      = color;
        this.vertices   = translateVertices(vertices);
        this.ariaOverride = ariaOverride;
    };
 
    PolygonImage.prototype = heir(BaseImage.prototype);

    PolygonImage.prototype.getAriaText = function(depth) {
      return indefiniteArticle(colorToSpokenString(this.color, this.style)) + 
            (this.ariaOverride? " " + this.ariaOverride + " of size " + this.length
                : ", " + this.count + " sided polygon with each side of length " + this.length);
    };
    
    //////////////////////////////////////////////////////////////////////
    // TextImage: String Number Color String String String String any/c Boolean -> Image
    var TextImage = function(str, size, color, face, family, style, weight, underline, outline) {
        BaseImage.call(this);
        str             = JSON.stringify(str) // show all escape chars
        this.str        = str.substring(1, str.length-1); // chop off quotes
        this.size       = size;   // 18
        this.color      = color;  // red
        this.face       = face;   // Gill Sans
        this.family     = family; // 'swiss
        this.outline    = outline || false;
        this.style      = (style === "slant")? "oblique" : style;  // Racket's "slant" -> CSS's "oblique"
        this.weight     = (weight=== "light")? "lighter" : weight; // Racket's "light" -> CSS's "lighter"
        this.underline  = underline;
 
        // NOTE: we *ignore* font-family, as it causes a number of font bugs due the browser inconsistencies
        // example: "bold italic 20px 'Times', sans-serif".
        // Default weight is "normal", face is "Arial"
        this.font = (this.style+" " +this.weight+" "+this.size+"px "+'"'+this.face+'", '+this.family);

        // We don't trust ctx.measureText, since (a) it's buggy and (b) it doesn't measure height
        // based off of the amazing work at http://mudcu.be/journal/2011/01/html5-typographic-metrics/#baselineCanvas
        // PENDING CANVAS V5 API: http://www.whatwg.org/specs/web-apps/current-work/#textmetrics
 
        // build a DOM node with the same styling as the canvas, then measure it
        var container = document.createElement("div"),
            parent    = document.createElement("span"),
            image     = document.createElement("img");// hack to get at CSS measuring properties
        parent.style.font = this.font;                // use the same font settings as the context
        image.width = 42; image.height = 1;           // we use a dataURL to reduce dependency on external image files
        image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWM4MbPgPwAGzwLR05RbqwAAAABJRU5ErkJggg==";
        container.style.cssText = "position: absolute; top: 0px; left: 0px; zIndex=-1; white-space: pre;";
        parent.appendChild(document.createTextNode(this.str)); // show all escape chars
        parent.appendChild(image);
        container.appendChild(parent);
        document.body.appendChild(container);
        
        // getting (more accurate) css equivalent of ctx.measureText()
        image.style.display = "none";
        parent.style.display= "inline";
        this.alphaBaseline = 0;
        this.width       = parent.offsetWidth;
        this.height      = parent.offsetHeight;
        document.body.removeChild(container);       // clean up after ourselves
    };
    
    TextImage.prototype = heir(BaseImage.prototype);

    TextImage.prototype.getAriaText = function(depth) {
      return " a string "+this.str+", colored "+colorToSpokenString(this.color,'solid')+" of size "+ this.size;
    };

    TextImage.prototype.render = function(ctx, x, y) {
        ctx.save();
        ctx.textAlign   = 'left';
        ctx.textBaseline= 'top';
        ctx.font        = this.font;
 
        // if 'outline' is enabled, use strokeText. Otherwise use fillText
        ctx.fillStyle = this.outline? 'white' : colorString(this.color);
        ctx.fillText(this.str, x, y);
        if(this.outline){
          ctx.strokeStyle = colorString(this.color);
          ctx.strokeText(this.str, x, y);
        }
        if(this.underline){
            ctx.beginPath();
            ctx.moveTo(x, y+this.size);
            // we use this.size, as it is more accurate for underlining than this.height
            ctx.lineTo(x+this.width, y+this.size);
            ctx.closePath();
            ctx.strokeStyle = colorString(this.color);
            ctx.stroke();
        }
        ctx.restore();
    };

    TextImage.prototype.getBaseline = function() { return this.alphaBaseline; };

    TextImage.prototype.isEqual = function(other, aUnionFind) {
        return ((other instanceof TextImage)        &&
                this.str        === other.str       &&
                this.size       === other.size      &&
                this.face       === other.face      &&
                this.family     === other.family    &&
                this.style      === other.style     &&
                this.weight     === other.weight    &&
                this.underline  === other.underline &&
                this.font       === other.font      &&
                types.isEqual(this.color, other.color, aUnionFind) )
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);

    };


    //////////////////////////////////////////////////////////////////////
    // StarImage: fixnum fixnum fixnum color -> image
    // Most of this code here adapted from the Canvas tutorial at:
    // http://developer.apple.com/safari/articles/makinggraphicswithcanvas.html
    var StarImage = function(points, outer, inner, style, color) {
        BaseImage.call(this);
        var maxRadius = Math.max(inner, outer);
        var vertices  = [];
 
        var oneDegreeAsRadian = Math.PI / 180;
        for(var pt = 0; pt < (points * 2) + 1; pt++ ) {
          var rads = ( ( 360 / (2 * points) ) * pt ) * oneDegreeAsRadian - 0.5;
          var whichRadius = ( pt % 2 === 1 ) ? outer : inner;
          vertices.push({x:maxRadius + ( Math.sin( rads ) * whichRadius ),
                         y:maxRadius + ( Math.cos( rads ) * whichRadius )} );
        }
        // calculate width and height of the bounding box
        this.width      = findWidth(vertices);
        this.height     = findHeight(vertices);
        this.style      = style;
        this.color      = color;
        this.points     = points;
        this.inner      = inner;
        this.outer      = outer;
        this.vertices   =   translateVertices(vertices);
    };
    StarImage.prototype = heir(BaseImage.prototype);

    StarImage.prototype.getAriaText = function(depth) {
         return indefiniteArticle(colorToSpokenString(this.color,this.style)) + ", " + this.points +
           "-pointed star with inner radius "+this.inner+" and outer radius "+this.outer;
       };

     /////////////////////////////////////////////////////////////////////
     //TriangleImage: Number Number Number Mode Color -> Image
     // Draws a triangle with the base = sideC, and the angle between sideC
     // and sideB being angleA
     // See http://docs.racket-lang.org/teachpack/2htdpimage.html#(def._((lib._2htdp/image..rkt)._triangle))
    var TriangleImage = function(sideC, angleA, sideB, style, color) {
        BaseImage.call(this);
        this.sideC = sideC;
        this.sideB = sideB;
        this.angleA = angleA;
        var thirdX = sideB * Math.cos(angleA * Math.PI/180);
        var thirdY = sideB * Math.sin(angleA * Math.PI/180);
        var offsetX = 0 - Math.min(0, thirdX); // angleA could be obtuse

        var vertices = [];
        // if angle < 180 start at the top of the canvas, otherwise start at the bottom
        if(thirdY > 0){
          vertices.push({x: offsetX + 0,        y: 0});
          vertices.push({x: offsetX + sideC,    y: 0});
          vertices.push({x: offsetX + thirdX,   y: thirdY});
        } else {
          vertices.push({x: offsetX + 0,        y: -thirdY});
          vertices.push({x: offsetX + sideC,    y: -thirdY});
          vertices.push({x: offsetX + thirdX,   y: 0});
        }
        
        this.width = Math.max(sideC, thirdX) + offsetX;
        this.height = Math.abs(thirdY);
        this.style = style;
        this.color = color;
        this.vertices = vertices;
    };
    TriangleImage.prototype = heir(BaseImage.prototype);

    TriangleImage.prototype.getAriaText = function(depth) {
        var ariaText = indefiniteArticle(colorToSpokenString(this.color,this.style));
        if(this.angleA === 270) {
            ariaText += " right triangle whose base is of length "+this.sideC+" and height of "+this.sideB;
        } else if(this.angleA === 300 && this.sideC === this.sideB) {
            ariaText += " equilateral triangle with sides of length "+this.sideC;
        } else {
            ariaText += " triangle whose base is of length "+this.sideC + ", with an angle of "
             + (this.angleA%180) + " degrees between it and a side of length "+this.sideB;
        }
        return ariaText;
    }

    //////////////////////////////////////////////////////////////////////
    //Ellipse : Number Number Mode Color -> Image
    var EllipseImage = function(width, height, style, color) {
        BaseImage.call(this);
        this.width = width;
        this.height = height;
        this.style = style;
        this.color = color;
    };

    EllipseImage.prototype = heir(BaseImage.prototype);

    EllipseImage.prototype.getAriaText = function(depth) {
        return indefiniteArticle(colorToSpokenString(this.color,this.style)) + 
            ((this.width===this.height)? " circle of radius "+(this.width/2) 
            : " ellipse of width "+this.width+" and height "+this.height);

    }

    EllipseImage.prototype.render = function(ctx, aX, aY) {
        ctx.save();
        ctx.beginPath();

        // if it's a solid ellipse...
        var isSolid = this.style.toString().toLowerCase() !== "outline";
        var adjust = isSolid? 0 : 0.5;
        // ...account for the 1px border width
        var width = this.width - 2*adjust, height = this.height - 2*adjust;
        aX += adjust; aY += adjust;

        // Most of this code is taken from:
        // http://webreflection.blogspot.com/2009/01/ellipse-and-circle-for-canvas-2d.html
        var hB = (width  / 2) * 0.5522848,
            vB = (height / 2) * 0.5522848,
            eX = aX + width ,
            eY = aY + height,
            mX = aX + width  / 2,
            mY = aY + height / 2;
        ctx.moveTo(aX, mY);
        ctx.bezierCurveTo(aX, mY - vB, mX - hB, aY, mX, aY);
        ctx.bezierCurveTo(mX + hB, aY, eX, mY - vB, eX, mY);
        ctx.bezierCurveTo(eX, mY + vB, mX + hB, eY, mX, eY);
        ctx.bezierCurveTo(mX - hB, eY, aX, mY + vB, aX, mY);
        ctx.closePath();
        if (this.style.toString().toLowerCase() === "outline") {
            ctx.strokeStyle = colorString(this.color);
            ctx.stroke();
        } else {
            ctx.fillStyle = colorString(this.color, this.style);
            ctx.fill();
        }

        ctx.restore();
    };

    EllipseImage.prototype.isEqual = function(other, aUnionFind) {
        return ((other instanceof EllipseImage)     &&
                this.width    === other.width       &&
                this.height   === other.height      &&
                this.style    === other.style       &&
                types.isEqual(this.color, other.color, aUnionFind))
            || BaseImage.prototype.isEqual.call(this, other, aUnionFind);
    };


    //////////////////////////////////////////////////////////////////////
    // Line: Number Number Color Boolean -> Image
    var LineImage = function(x, y, color) {
        BaseImage.call(this);
        var vertices;
        if (x >= 0) {
            if (y >= 0) { vertices = [{x:  0, y:  0}, {x: x, y: y}]; }
            else        { vertices = [{x:  0, y: -y}, {x: x, y: 0}]; }
        } else {
            if (y >= 0) { vertices = [{x: -x, y:  0}, {x: 0, y: y}]; }
            else        { vertices = [{x: -x, y: -y}, {x: 0, y: 0}]; }
        }
        this.x = x;
        this.y = y;
        this.width  = Math.abs(x);
        this.height = Math.abs(y);
        this.style  = "outline"; // all vertex-based images must have a style
        this.color  = color;
        this.vertices = vertices;
    };

    LineImage.prototype = heir(BaseImage.prototype);

    LineImage.prototype.getAriaText = function(depth) {
        return indefiniteArticle(colorToSpokenString(this.color,"")) + 
            " line of width "+this.x+" and height "+this.y;
    }

    //////////////////////////////////////////////////////////////////////
    // Effects

    /**
     * applyEffect: compound-effect -> (arrayof (world -> world))

     applyEffect applies all of the effects

     @param aCompEffect a compound effect is either a scheme list of
     compound effects or a single primitive effect */
    world.Kernel.applyEffect = function(aCompEffect) {
        if (aCompEffect === types.EMPTY) {
            // Do Nothing
        } else if ( types.isPair(aCompEffect) ) {
            var results = world.Kernel.applyEffect(aCompEffect.first);
            return results.concat(world.Kernel.applyEffect(aCompEffect.rest));
        } else {
            var newResult = aCompEffect.run();
            if (newResult) {
                return newResult;
            }
        }
        return [];
    };

    //////////////////////////////////////////////////////////////////////////
    // Color database
    var ColorDb = function() {
        this.colors = {};
    };
    ColorDb.prototype.put = function(name, color) {
        this.colors[name] = color;
    };

    // can be called with three types of value: (1) a string (colorname), (2) a color struct
    // or (3) a runtime string object with a hash and a toString method
    ColorDb.prototype.get = function(name) {
        if(name.toString) { // normalize if it's a string, or can be made into one
            return this.colors[name.toString().replace(/\s/g, "").toUpperCase()];
        }
    };


    // FIXME: update toString to handle the primitive field values.
    var colorDb = new ColorDb();
    colorDb.put("ORANGE", types.color(255, 165, 0, 255));
    colorDb.put("LIGHTORANGE", types.color(255, 216, 51, 255));
    colorDb.put("MEDIUMORANGE", types.color(255, 165, 0, 255));
    colorDb.put("ORANGERED", types.color(255, 69, 0, 255));
    colorDb.put("TOMATO", types.color(255, 99, 71, 255));
    colorDb.put("RED", types.color(255, 0, 0, 255));
    colorDb.put("LIGHTRED", types.color(255, 102, 102, 255));
    colorDb.put("MEDIUMRED", types.color(255, 0, 0, 255));
    colorDb.put("DARKRED", types.color(139, 0, 0, 255));
    colorDb.put("FIREBRICK", types.color(178, 34, 34, 255));
    colorDb.put("CRIMSON", types.color(220, 20, 60, 255));
    colorDb.put("DEEPPINK", types.color(255, 20, 147, 255));
    colorDb.put("MAROON", types.color(176, 48, 96, 255));
    colorDb.put("INDIANRED", types.color(205, 92, 92, 255));
    colorDb.put("MEDIUMVIOLETRED", types.color(199, 21, 133, 255));
    colorDb.put("VIOLETRED", types.color(208, 32, 144, 255));
    colorDb.put("LIGHTCORAL", types.color(240, 128, 128, 255));
    colorDb.put("HOTPINK", types.color(255, 105, 180, 255));
    colorDb.put("PALEVIOLETRED", types.color(219, 112, 147, 255));
    colorDb.put("LIGHTPINK", types.color(255, 182, 193, 255));
    colorDb.put("ROSYBROWN", types.color(188, 143, 143, 255));
    colorDb.put("PINK", types.color(255, 192, 203, 255));
    colorDb.put("MEDIUMPINK", types.color(255, 192, 203, 255));
    colorDb.put("DARKPINK", types.color(204, 141, 152, 255));
    colorDb.put("ORCHID", types.color(218, 112, 214, 255));
    colorDb.put("LAVENDERBLUSH", types.color(255, 240, 245, 255));
    colorDb.put("SNOW", types.color(255, 250, 250, 255));
    colorDb.put("CHOCOLATE", types.color(210, 105, 30, 255));
    colorDb.put("SADDLEBROWN", types.color(139, 69, 19, 255));
    colorDb.put("BROWN", types.color(132, 60, 36, 255));
    colorDb.put("LIGHTBROWN", types.color(183, 111, 87, 255));
    colorDb.put("MEDIUMBROWN", types.color(132, 60, 36, 255));
    colorDb.put("DARKBROWN", types.color(81, 9, 0, 255));
    colorDb.put("DARKORANGE", types.color(255, 140, 0, 255));
    colorDb.put("CORAL", types.color(255, 127, 80, 255));
    colorDb.put("SIENNA", types.color(160, 82, 45, 255));
    colorDb.put("ORANGE", types.color(255, 165, 0, 255));
    colorDb.put("SALMON", types.color(250, 128, 114, 255));
    colorDb.put("PERU", types.color(205, 133, 63, 255));
    colorDb.put("GOLDENROD", types.color(218, 165, 32, 255));
    colorDb.put("LIGHTGOLDENROD", types.color(255, 216, 83, 255));
    colorDb.put("DARKGOLDENROD", types.color(184, 134, 11, 255));
    colorDb.put("SANDYBROWN", types.color(244, 164, 96, 255));
    colorDb.put("LIGHTSALMON", types.color(255, 160, 122, 255));
    colorDb.put("DARKSALMON", types.color(233, 150, 122, 255));
    colorDb.put("GOLD", types.color(255, 215, 0, 255));
    colorDb.put("YELLOW", types.color(255, 255, 0, 255));
    colorDb.put("LIGHTYELLOW", types.color(255, 255, 51, 255));
    colorDb.put("MEDIUMYELLOW", types.color(255, 255, 0, 255));
    colorDb.put("DARKYELLOW", types.color(204, 204, 0, 255));
    colorDb.put("OLIVE", types.color(128, 128, 0, 255));
    colorDb.put("BURLYWOOD", types.color(222, 184, 135, 255));
    colorDb.put("TAN", types.color(210, 180, 140, 255));
    colorDb.put("NAVAJOWHITE", types.color(255, 222, 173, 255));
    colorDb.put("PEACHPUFF", types.color(255, 218, 185, 255));
    colorDb.put("KHAKI", types.color(240, 230, 140, 255));
    colorDb.put("DARKKHAKI", types.color(189, 183, 107, 255));
    colorDb.put("MOCCASIN", types.color(255, 228, 181, 255));
    colorDb.put("WHEAT", types.color(245, 222, 179, 255));
    colorDb.put("BISQUE", types.color(255, 228, 196, 255));
    colorDb.put("PALEGOLDENROD", types.color(238, 232, 170, 255));
    colorDb.put("BLANCHEDALMOND", types.color(255, 235, 205, 255));
    colorDb.put("MEDIUMGOLDENROD", types.color(234, 234, 173, 255));
    colorDb.put("PAPAYAWHIP", types.color(255, 239, 213, 255));
    colorDb.put("MISTYROSE", types.color(255, 228, 225, 255));
    colorDb.put("LEMONCHIFFON", types.color(255, 250, 205, 255));
    colorDb.put("ANTIQUEWHITE", types.color(250, 235, 215, 255));
    colorDb.put("CORNSILK", types.color(255, 248, 220, 255));
    colorDb.put("LIGHTGOLDENRODYELLOW", types.color(250, 250, 210, 255));
    colorDb.put("OLDLACE", types.color(253, 245, 230, 255));
    colorDb.put("LINEN", types.color(250, 240, 230, 255));
    colorDb.put("LIGHTYELLOW", types.color(255, 255, 224, 255));
    colorDb.put("SEASHELL", types.color(255, 245, 238, 255));
    colorDb.put("BEIGE", types.color(245, 245, 220, 255));
    colorDb.put("FLORALWHITE", types.color(255, 250, 240, 255));
    colorDb.put("IVORY", types.color(255, 255, 240, 255));
    colorDb.put("GREEN", types.color(0, 255, 0, 255));
    colorDb.put("MEDIUMGREEN", types.color(0, 255, 0, 255));
    colorDb.put("LAWNGREEN", types.color(124, 252, 0, 255));
    colorDb.put("CHARTREUSE", types.color(127, 255, 0, 255));
    colorDb.put("GREENYELLOW", types.color(173, 255, 47, 255));
    colorDb.put("YELLOWGREEN", types.color(154, 205, 50, 255));
    colorDb.put("OLIVEDRAB", types.color(107, 142, 35, 255));
    colorDb.put("MEDIUMFORESTGREEN", types.color(107, 142, 35, 255));
    colorDb.put("DARKOLIVEGREEN", types.color(85, 107, 47, 255));
    colorDb.put("DARKSEAGREEN", types.color(143, 188, 139, 255));
    colorDb.put("LIME", types.color(0, 255, 0, 255));
    colorDb.put("DARKGREEN", types.color(0, 100, 0, 255));
    colorDb.put("LIMEGREEN", types.color(50, 205, 50, 255));
    colorDb.put("FORESTGREEN", types.color(34, 139, 34, 255));
    colorDb.put("SPRING GREEN", types.color(0, 255, 127, 255));
    colorDb.put("SPRINGGREEN", types.color(0, 255, 127, 255));
    colorDb.put("MEDIUMSPRINGGREEN", types.color(0, 250, 154, 255));
    colorDb.put("SEAGREEN", types.color(46, 139, 87, 255));
    colorDb.put("MEDIUMSEAGREEN", types.color(60, 179, 113, 255));
    colorDb.put("AQUAMARINE", types.color(112, 216, 144, 255));
    colorDb.put("LIGHTGREEN", types.color(144, 238, 144, 255));
    colorDb.put("PALEGREEN", types.color(152, 251, 152, 255));
    colorDb.put("MEDIUM AQUAMARINE", types.color(102, 205, 170, 255));
    colorDb.put("MEDIUMAQUAMARINE", types.color(102, 205, 170, 255));
    colorDb.put("TURQUOISE", types.color(64, 224, 208, 255));
    colorDb.put("LIGHTTURQUOISE", types.color(155, 255, 255, 255));
    colorDb.put("MEDIUMTURQUOISE", types.color(72, 209, 204, 255));
    colorDb.put("LIGHTSEAGREEN", types.color(32, 178, 170, 255));
    colorDb.put("HONEYDEW", types.color(240, 255, 240, 255));
    colorDb.put("MINTCREAM", types.color(245, 255, 250, 255));
    colorDb.put("ROYALBLUE", types.color(65, 105, 225, 255));
    colorDb.put("DODGERBLUE", types.color(30, 144, 255, 255));
    colorDb.put("DEEPSKYBLUE", types.color(0, 191, 255, 255));
    colorDb.put("CORNFLOWERBLUE", types.color(100, 149, 237, 255));
    colorDb.put("STEELBLUE", types.color(70, 130, 180, 255));
    colorDb.put("LIGHTSKYBLUE", types.color(135, 206, 250, 255));
    colorDb.put("DARKTURQUOISE", types.color(0, 206, 209, 255));
    colorDb.put("CYAN", types.color(0, 255, 255, 255));
    colorDb.put("LIGHTCYAN", types.color(224, 255, 255, 255));
    colorDb.put("MEDIUMCYAN", types.color(0, 255, 255, 255));
    colorDb.put("DARKCYAN", types.color(0, 139, 139, 255));
    colorDb.put("AQUA", types.color(0, 255, 255, 255));
    colorDb.put("TEAL", types.color(0, 128, 128, 255));
    colorDb.put("SKYBLUE", types.color(135, 206, 235, 255));
    colorDb.put("CADETBLUE", types.color(95, 158, 160, 255));
    colorDb.put("DARKSLATEGRAY", types.color(47, 79, 79, 255));
    colorDb.put("LIGHTSLATEGRAY", types.color(119, 136, 153, 255));
    colorDb.put("SLATEGRAY", types.color(112, 128, 144, 255));
    colorDb.put("LIGHTSTEELBLUE", types.color(176, 196, 222, 255));
    colorDb.put("LIGHTBLUE", types.color(173, 216, 230, 255));
    colorDb.put("POWDERBLUE", types.color(176, 224, 230, 255));
    colorDb.put("PALETURQUOISE", types.color(175, 238, 238, 255));
    colorDb.put("ALICEBLUE", types.color(240, 248, 255, 255));
    colorDb.put("AZURE", types.color(240, 255, 255, 255));
    colorDb.put("MEDIUMBLUE", types.color(0, 0, 205, 255));
    colorDb.put("DARKBLUE", types.color(0, 0, 139, 255));
    colorDb.put("MIDNIGHTBLUE", types.color(25, 25, 112, 255));
    colorDb.put("NAVY", types.color(36, 36, 140, 255));
    colorDb.put("BLUE", types.color(0, 0, 255, 255));
    colorDb.put("INDIGO", types.color(75, 0, 130, 255));
    colorDb.put("BLUEVIOLET", types.color(138, 43, 226, 255));
    colorDb.put("MEDIUMSLATEBLUE", types.color(123, 104, 238, 255));
    colorDb.put("SLATEBLUE", types.color(106, 90, 205, 255));
    colorDb.put("PURPLE", types.color(160, 32, 240, 255));
    colorDb.put("LIGHTPURPLE", types.color(211, 83, 255, 255));
    colorDb.put("MEDIUMPURPLE", types.color(147, 112, 219, 255));
    colorDb.put("DARKPURPLE", types.color(109, 0, 189, 255));
    colorDb.put("DARKSLATEBLUE", types.color(72, 61, 139, 255));
    colorDb.put("DARKVIOLET", types.color(148, 0, 211, 255));
    colorDb.put("DARKORCHID", types.color(153, 50, 204, 255));
    colorDb.put("MEDIUMORCHID", types.color(186, 85, 211, 255));
    colorDb.put("MAGENTA", types.color(255, 0, 255, 255));
    colorDb.put("FUCHSIA", types.color(255, 0, 255, 255));
    colorDb.put("DARKMAGENTA", types.color(139, 0, 139, 255));
    colorDb.put("VIOLET", types.color(238, 130, 238, 255));
    colorDb.put("PLUM", types.color(221, 160, 221, 255));
    colorDb.put("LAVENDER", types.color(230, 230, 250, 255));
    colorDb.put("THISTLE", types.color(216, 191, 216, 255));
    colorDb.put("GHOSTWHITE", types.color(248, 248, 255, 255));
    colorDb.put("WHITE", types.color(255, 255, 255, 255));
    colorDb.put("WHITESMOKE", types.color(245, 245, 245, 255));
    colorDb.put("GAINSBORO", types.color(220, 220, 220, 255));
    colorDb.put("LIGHTGRAY", types.color(211, 211, 211, 255));
    colorDb.put("LIGHTGREY", types.color(211, 211, 211, 255));
    colorDb.put("SILVER", types.color(192, 192, 192, 255));
    colorDb.put("GRAY", types.color(190, 190, 190, 255));
    colorDb.put("GREY", types.color(190, 190, 190, 255));
    colorDb.put("MEDIUMGRAY", types.color(190, 190, 190, 255));
    colorDb.put("MEDIUMGREY", types.color(190, 190, 190, 255));
    colorDb.put("DARKGRAY", types.color(169, 169, 169, 255));
    colorDb.put("DARKGREY", types.color(169, 169, 169, 255));
    colorDb.put("DIMGRAY", types.color(105, 105, 105, 255));
    colorDb.put("DIMGREY", types.color(105, 105, 105, 255));
    colorDb.put("BLACK", types.color(0, 0, 0, 255));
    colorDb.put("TRANSPARENT", types.color(0, 0, 0, 0));

    var nameToColor = function(s) {
         return colorDb.get('' + s);
    };
 
    // based on answer provided at
    // http://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion
    function RGBtoLAB(r, g, b){
      function RGBtoXYZ(r, g, b){
         function process(v){
           v = parseFloat(v/255);
           return (v>0.04045? Math.pow( (v+0.055)/1.055, 2.4) : v/12.92) * 100;
         }
        var var_R = process(r), var_G = process(g), var_B = process(b);
        //Observer. = 2°, Illuminant = D65
        var X = var_R * 0.4124 + var_G * 0.3576 + var_B * 0.1805;
        var Y = var_R * 0.2126 + var_G * 0.7152 + var_B * 0.0722;
        var Z = var_R * 0.0193 + var_G * 0.1192 + var_B * 0.9505;
        return [X, Y, Z];
      }
      
      function XYZtoLAB(x, y, z){
        var var_X = x / 95.047;           //ref_X =  95.047   Observer= 2°, Illuminant= D65
        var var_Y = y / 100.000;          //ref_Y = 100.000
        var var_Z = z / 108.883;          //ref_Z = 108.883
        function process(v){ return v>0.008856? Math.pow(v, 1/3) : (7.787*v) + (16/116); }
        var_X = process(var_X); var_Y = process(var_Y); var_Z = process(var_Z);
        var CIE_L = ( 116 * var_Y ) - 16;
        var CIE_a = 500 * ( var_X - var_Y );
        var CIE_b = 200 * ( var_Y - var_Z );
        return [CIE_L, CIE_a, CIE_b];
      }
      var xyz = RGBtoXYZ(r,g,b), lab = XYZtoLAB(xyz[0],xyz[1],xyz[2]);
      return {l: lab[0], a: lab[1], b:lab[2]};
    }
    var colorLabs = [], colorRgbs = colorDb.colors;
    for (var p in colorRgbs) {
      if (colorRgbs.hasOwnProperty(p)) {
        var lab = RGBtoLAB(types.colorRed(colorRgbs[p]),
                           types.colorGreen(colorRgbs[p]),
                           types.colorBlue(colorRgbs[p]));
        colorLabs.push({name:p, l:lab.l, a:lab.a, b:lab.b});
      }
    }

    ///////////////////////////////////////////////////////////////
    // Exports

    world.Kernel.isImage = isImage;
    world.Kernel.isScene = isScene;
    world.Kernel.isColor = function(thing) {
        return (types.isColor(thing) ||
                ((types.isString(thing) || types.isSymbol(thing)) &&
                 typeof(colorDb.get(thing)) !== 'undefined'));
    };
    world.Kernel.nameToColor = nameToColor;
    world.Kernel.colorDb = colorDb;
    world.Kernel.colorLabs = colorLabs;
 
    world.Kernel.sceneImage = function(width, height, children, withBorder, color) {
        return new SceneImage(width, height, children, withBorder, color);
    };
    world.Kernel.circleImage = function(radius, style, color) {
        return new EllipseImage(2*radius, 2*radius, style, color);
    };
    world.Kernel.starImage = function(points, outer, inner, style, color) {
        return new StarImage(points, outer, inner, style, color);
    };
    world.Kernel.rectangleImage = function(width, height, style, color) {
        return new RectangleImage(width, height, style, color);
    };
    world.Kernel.rhombusImage = function(side, angle, style, color) {
        return new RhombusImage(side, angle, style, color);
    };
    world.Kernel.polygonImage = function(length, count, step, style, color, ariaOverride) {
        return new PolygonImage(length, count, step, style, color, ariaOverride);
    };
    world.Kernel.posnImage = function(posns, style, color) {
        return new PosnImage(posns, style, color);
    };
    world.Kernel.squareImage = function(length, style, color) {
        return new RectangleImage(length, length, style, color);
    };
    world.Kernel.triangleImage = function(side, angle, side2, style, color) {
        return new TriangleImage(side, angle, side2, style, color);
    };
    world.Kernel.ellipseImage = function(width, height, style, color) {
        return new EllipseImage(width, height, style, color);
    };
    world.Kernel.lineImage = function(x, y, color) {
        return new LineImage(x, y, color);
    };
    world.Kernel.overlayImage = function(img1, img2, X, Y) {
        return new OverlayImage(img1, img2, X, Y);
    };
    world.Kernel.rotateImage = function(angle, img) {
        return new RotateImage(angle, img);
    };
    world.Kernel.scaleImage = function(xFactor, yFactor, img) {
        return new ScaleImage(xFactor, yFactor, img);
    };
    world.Kernel.cropImage = function(x, y, width, height, img) {
        return new CropImage(x, y, width, height, img);
    };
    world.Kernel.frameImage = function(img) {
        return new FrameImage(img);
    };
    world.Kernel.flipImage = function(img, direction) {
        return new FlipImage(img, direction);
    };
    world.Kernel.textImage = function(str, size, color, face, family, style, weight, underline, outline) {
        return new TextImage(str, size, color, face, family, style, weight, underline, outline);
    };
    world.Kernel.fileImage = function(path, rawImage, afterInit) {
        return FileImage.makeInstance(path, rawImage, afterInit);
    };
    world.Kernel.fileVideo = function(path, rawVideo) {
        return FileVideo.makeInstance(path, rawVideo);
    };
    world.Kernel.fileAudio = function(path, loop, rawAudio) {
        return FileAudio.makeInstance(path, loop, rawAudio);
    };

    world.Kernel.isSceneImage   = function(x) { return x instanceof SceneImage; };
    world.Kernel.isStarImage    = function(x) { return x instanceof StarImage; };
    world.Kernel.isRectangleImage=function(x) { return x instanceof RectangleImage; };
    world.Kernel.isPolygonImage = function(x) { return x instanceof PolygonImage; };
    world.Kernel.isRhombusImage = function(x) { return x instanceof RhombusImage; };
    world.Kernel.isTriangleImage= function(x) { return x instanceof TriangleImage; };
    world.Kernel.isEllipseImage = function(x) { return x instanceof EllipseImage; };
    world.Kernel.isLineImage    = function(x) { return x instanceof LineImage; };
    world.Kernel.isOverlayImage = function(x) { return x instanceof OverlayImage; };
    world.Kernel.isRotateImage  = function(x) { return x instanceof RotateImage; };
    world.Kernel.isScaleImage   = function(x) { return x instanceof ScaleImage; };
    world.Kernel.isCropImage    = function(x) { return x instanceof CropImage; };
    world.Kernel.isFrameImage   = function(x) { return x instanceof FrameImage; };
    world.Kernel.isFlipImage    = function(x) { return x instanceof FlipImage; };
    world.Kernel.isTextImage    = function(x) { return x instanceof TextImage; };
    world.Kernel.isFileImage    = function(x) { return x instanceof FileImage; };
    world.Kernel.isFileVideo    = function(x) { return x instanceof FileVideo; };

})();

// Depends on world.js, world-config.js

(function() {

    var Jsworld = jsworld.MobyJsworld = {};

    // The real low-level jsworld module:
    var _js = jsworld.Jsworld;






//////////////////////////////////////////////////////////////////////
// From:
// https://gist.github.com/1579671

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
//////////////////////////////////////////////////////////////////////
var bigBangLog = document.getElementById('bigBangLog');

var caller;
var setCaller = function(c) {
	caller = function(op, args, k) {
		c(op, args, k, handleError);
	};
};
var unsetCaller = function() {
	caller = function() {
		throw new Error('caller not defined!');
	};
};
unsetCaller();

// The restarted and things to set it
// Note that we never want to restart the same computation
// more than once, so we throw an error if someone tries to do that
var restarter;
var setRestarter = function(r) {
    var hasRestarted = false;
    restarter = function(v) {
	    if (hasRestarted) {
		    throw new Error('Cannot restart twice!');
	    }
	    hasRestarted = true;
	    r(v);
    };
};
var unsetRestarter = function() {
	restarter = function() {
		throw new Error('restarter not defined!');
	};
};
unsetRestarter();

var terminator;
var setTerminator = function(t) {
    terminator = t;
};
var unsetTerminator = function() {
	terminator = function() {
		throw new Error('terminator not defined!');
	};
};
unsetTerminator();



var userConfigs = [];

var startUserConfigs = function(k) {
    helpers.forEachK(userConfigs,
		     function(aConfig, k2) {
			caller(aConfig.startup, aConfig.startupArgs,
				function(res) {
					aConfig.shutdownArg = res;
					k2()
				});
		     },
		     handleError,
		     k);
}

var shutdownUserConfigs = function(k) {
    var theConfigs = userConfigs;
    userConfigs = []
    helpers.forEachK(theConfigs,
		     function(aConfig, k2) {
		     	caller(aConfig.shutdown, [aConfig.shutdownArg], k2);
		     },
		     handleError,
		     k);
}

var expandHandler = function(handler) {
	return types.jsObject('function', function() {
		var wrappedStimulusArgs = [];
		for (var i = 0; i < arguments.length; i++) {
			wrappedStimulusArgs.push( helpers.wrapJsObject(arguments[i]) );
		}

		Jsworld.updateWorld(
			function(w, k) {
				var args = [w].concat(wrappedStimulusArgs);
				caller(handler, args, k);
			},
			function() {});
	});
};

var deepUnwrapJsObjects = function(x, k) {
    if ( types.isJsObject(x) ) {
	    k(x.obj);
    }
    else if ( types.isRenderEffect(x) ) {
	    x.callImplementation(caller, function(y) { deepUnwrapJsObjects(y, k); });
    }
	/*
	    var effects = helpers.schemeListToArray( types.renderEffectEffects(x) ).reverse();
	    types.setRenderEffectEffects(x, types.EMPTY);

	    helpers.forEachK(effects,
			     function(ef, k2) { caller(ef, [], k2); },
			     handleError,
			     function() { deepUnwrapJsObjects(types.renderEffectDomNode(x), k); });
	}
	*/
    else if ( types.isPair(x) ) {
	deepUnwrapJsObjects(x.first(), function(first) {
			deepUnwrapJsObjects(x.rest(), function(rest) {
				k( types.cons(first, rest) );
			});
		});
    }
    else {
	    k(x);
    }
};


// isHandler: X -> boolean
// Right now, a handler is a function that consumes and produces
// configs.  We should tighten up the type check eventually.
var isHandler = function(x) {
	return typeof(x) == 'function';
}


//////////////////////////////////////////////////////////////////////
//From this point forward, we define wrappers to integrate jsworld
//with Moby.


// getBigBangWindow: -> window
var getBigBangWindow = function() {
    if (window.document.getElementById("jsworld-div") !== undefined) {
    	return window;
	} else {
	    var newDiv = window.document.createElement("div");
	    newDiv.id = 'jsworld-div';
	    window.document.appendChild(newDiv);
	    return window;
	}
}


// types are
// sexp: (cons node (listof sexp))
// css-style: (node (listof (list string string)))

// Exports:
var isPair = types.isPair;
var isEmpty = function(x) { return x === types.EMPTY; };
var isList = function(x) { return (isPair(x) || isEmpty(x)); };



// The default printWorldHook will write the written content of the node.
// We probably want to invoke the pretty printer here instead!
Jsworld.printWorldHook = function(world, node) {
	var newNode;
	if(node.lastChild == null) {
	    newNode = types.toDomNode(world);
	    node.appendChild(newNode);
	    helpers.maybeCallAfterAttach(newNode);
	} else {
	    newNode = types.toDomNode(world);
	    node.replaceChild(newNode, node.lastChild);
	    helpers.maybeCallAfterAttach(newNode);
	}
};



// Figure out the target of an event.
// http://www.quirksmode.org/js/events_properties.html#target
var findEventTarget = function(e) {
	var targ;
	if (e.target) 
	    targ = e.target;
	else if (e.srcElement) 
	    targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
	    targ = targ.parentNode;
	return targ;
}

// isNode: any -> boolean
// Returns true if the thing has a nodeType.
var isNode = function(thing) {
	return typeof(thing.nodeType) != 'undefined';
}



// checkWellFormedDomTree: X X (or number undefined) -> void
// Check to see if the tree is well formed.  If it isn't,
// we need to raise a meaningful error so the user can repair
// the structure.
//
// Invariants:
// The dom tree must be a pair.
// The first element must be a node.
// Each of the rest of the elements must be dom trees.
// If the first element is a text node, it must NOT have children.
var checkWellFormedDomTree = function(x, top, index) {
	var fail = function(formatStr, formatArgs) {
		throw types.schemeError(
			types.incompleteExn(types.exnFailContract,
					    helpers.format(formatStr, formatArgs),
			       		    []));
	}

	if (_js.isPage(x)) {
	    return;
	}

	if (types.isPair(x)) {
	    var firstElt = x.first();
	    var restElts = x.rest();

	    if (! isNode(firstElt)) {
		fail("on-draw: expected a dom-element, but received ~s instead, the first element within ~s", [firstElt, top]);
	    }

	    if (firstElt.nodeType == Node.TEXT_NODE && !restElts.isEmpty() ) {
		fail("on-draw: the text node ~s must not have children.  It has ~s", [firstElt, restElts]);
	    }

	    var i = 2;
	    while( !restElts.isEmpty() ) {
		checkWellFormedDomTree(restElts.first(), x, i);
		restElts = restElts.rest();
		i++;
	    }
	} else {
		var formatStr = "on-draw: expected a dom-s-expression, but received ~s instead";
		var formatArgs = [x];
		if (index != undefined) {
			formatStr += ", the ~a element within ~s";
			formatArgs.push( helpers.ordinalize(index) );
			formatArgs.push(top);
		}
		formatStr += ".";

		fail(formatStr, formatArgs);
	}
};

// Compatibility for attaching events to nodes.
var attachEvent = function(node, eventName, fn) {
	if (node.addEventListener) {
	    // Mozilla
	    node.addEventListener(eventName, fn, false);
	} else {
	    // IE
	    node.attachEvent('on' + eventName, fn, false);
	}
	return function() {
	    detachEvent(node, eventName, fn);
	}
};

var detachEvent = function(node, eventName, fn) {
	if (node.addEventListener) {
	    // Mozilla
	    node.removeEventListener(eventName, fn, false);
	} else {
	    // IE
	    node.detachEvent('on' + eventName, fn, false);
	}
}


var preventDefault = function(event) {
	if (event.preventDefault) {
	    event.preventDefault();
	} else {
	    event.returnValue = false;
	}
}

var stopPropagation = function(event) {
	if (event.stopPropagation) {
	    event.stopPropagation();
	} else {
	    event.cancelBubble = true;
	}
}


// bigBang: world dom (listof (list string string)) (arrayof handler) -> world
Jsworld.bigBang = function(initWorld, toplevelNode, handlers, theCaller, theRestarter) {

	// shutdownListeners: arrayof (-> void)
	// We maintain a list of thunks that need to be called as soon as we come out of
	// bigBang, to do cleanup.
	var shutdownListeners = [];

	var onTermination = function(w) {
	    for (var i = 0; i < shutdownListeners.length; i++) {
		try { 
		    shutdownListeners[i]();
		} catch (e) { }
	    }
	    shutdownUserConfigs(function() {
		unsetCaller();
		theRestarter(w);
	    });
	}

	setCaller(theCaller);
	setRestarter(theRestarter);
	setTerminator(function(w) {
		detachEvent(toplevelNode, 'click', absorber);
		shutdownUserConfigs(function() {
			unsetCaller();
			unsetTerminator();
			restarter(w);
		});
	});

	var attribs = types.EMPTY;
	
	// Ensure that the toplevelNode can be focused by mouse or keyboard
	toplevelNode.tabIndex = 0;

	// Absorb all click events so they don't bubble up.
	var absorber = function(e) {
		preventDefault(e);
		stopPropagation(e);
		return false;
	}

	attachEvent(toplevelNode, 'click', absorber);
	shutdownListeners.push(function() { detachEvent(toplevelNode, 'click', absorber)});

	var config = new world.config.WorldConfig();
	for(var i = 0; i < handlers.length; i++) {
	    if (isList(handlers[i])) {
		attribs = handlers[i];
	    }
	    else if (isHandler(handlers[i])) {
		config = handlers[i](config);
	    }
	    else if ( types.isWorldConfig(handlers[i]) ) {
		    handlers[i].startupArgs = helpers.map(expandHandler, handlers[i].startupArgs);
		    userConfigs.push(handlers[i]); 
	    }
	}
	config = config.updateAll({'changeWorld': Jsworld.updateWorld,
                            'shutdownWorld': Jsworld.shutdownWorld});
	var stimuli = new world.stimuli.StimuliHandler(config, caller, restarter);
	
	var wrappedHandlers = [];
	var wrappedRedraw;
	var wrappedRedrawCss;
  	var last3frames = []; // for FPS calculation

  	// on-draw may define separate DOM and CSS handlers
	if (config.lookup('onDraw')) {
	    wrappedRedraw = function(w, k) {
        try {
            caller(config.lookup('onDraw'), [w],
              function(newDomTree) {
                deepUnwrapJsObjects(newDomTree, function(unwrappedTree) {
              checkWellFormedDomTree(unwrappedTree, unwrappedTree, undefined);
              var result = [toplevelNode, 
                      helpers.deepListToArray(unwrappedTree)];
              k(result);
            });
              });
        } catch (e) {
            handleError(e);
        }
	    }

	    if (config.lookup('onDrawCss')) {
		    wrappedRedrawCss = function(w, k) {
          try {
              caller(config.lookup('onDrawCss'), [w],
                function(res) {
              var result = helpers.deepListToArray(res);
              k(result);
                });
          } catch (e) {
              handleError(e);
          }
		    }
	    } else {
		    wrappedRedrawCss = function(w, k) { k([]); };
	    }
	    wrappedHandlers.push(_js.on_draw(wrappedRedraw, wrappedRedrawCss));
	}
 
  	// on-redraw defines an image-producing handler, and a dummy CSS handler
  	else if (config.lookup('onRedraw')) {
	    var reusableCanvas = undefined;
	    var reusableCanvasNode = undefined;
	    wrappedRedraw = function(w, k) {
        var nextFrame = function(t) {
          last3frames = [t/1000].concat(last3frames); // save the # ms
          last3frames = last3frames.slice(0,3); // only keep the last 3 saves
          // report running FPS avg
          //if(last3frames.length===3) console.log(Math.round(3 / (last3frames[0] - last3frames[2]))+"fps");
          try {
            // By the time we get here, the current world may have changed
            // already, so we need to reacquire the value of the
            // current world.
            w = _js.getCurrentWorld();
		        caller(config.lookup('onRedraw'), [w],
			       function(aScene) {
		               // Performance hack: if we're using onRedraw, we know
		               // we've got a scene, so we optimize away the repeated
		               // construction of a canvas object.
		               if ( world.Kernel.isImage(aScene) ) {
		                   var width = aScene.getWidth();
		                   var height = aScene.getHeight();

		                   if (! reusableCanvas) {
		                 reusableCanvas = world.Kernel.makeCanvas(width, height);
		                 // Note: the canvas object may itself manage objects,
		                 // as in the case of an excanvas.  In that case, we must make
		                 // sure jsworld doesn't try to disrupt its contents!
		                 reusableCanvas.jsworldOpaque = true;
		                 reusableCanvasNode = _js.node_to_tree(reusableCanvas);
		                   }

		                   setTimeout(
		                 function() {			
		                 	reusableCanvas.width = width;
		                 	reusableCanvas.height = height;
		                     var ctx = reusableCanvas.getContext("2d");
		                     aScene.render(ctx, 0, 0);
		                     var log = document.createElement("span");
		                     log.className = "screenreader-only";
		                     log.appendChild(document.createTextNode(aScene.getAriaText(6)));
		                     toplevelNode.appendChild(log);
		                 },
		                 0);

		                   k([toplevelNode, reusableCanvasNode]);
		               } else {
		               	  handleError("to-draw handler: is expected to return a scene or image");
		                  // k([toplevelNode, _js.node_to_tree(types.toDomNode(aScene))]);
		               }
			       });
          } catch (e) {
		        handleError(e);
          }
        };
        window.requestAnimationFrame(nextFrame);
	    }
	    wrappedRedrawCss = function(w, k) {
        k([[reusableCanvas,
            ["width", reusableCanvas.width + "px"],
            ["height", reusableCanvas.height + "px"]]]);
      };
	    wrappedHandlers.push(_js.on_draw(wrappedRedraw, wrappedRedrawCss));
	}
 
  	// if no draw handlers are defined, we just print the state of the world
  	else {
	    wrappedHandlers.push(_js.on_world_change
				 (function(w, k) { 
				     Jsworld.printWorldHook(w, toplevelNode);
				     k();
				 }));
	}

	if (config.lookup('tickDelay')) {
	    var wrappedTick = function(w, k) {
		caller(config.lookup('onTick'), [w], k);
	    }
	    var wrappedDelay = jsnums.toFixnum( config.lookup('tickDelay') );
	    wrappedHandlers.push(_js.on_tick(wrappedDelay, wrappedTick));
	}

	if (config.lookup('stopWhen')) {
      var worldFunction = function(w, k) {
                            caller(config.lookup('stopWhen'), [w],
                                   function(res) { k(res); });
      };
      var lastPictureFunction = function(w, k) {
        var nextFrame = function(t) {
          try {
            if(config.lookup('lastPicture')){
              // By the time we get here, the current world may have changed
              // already, so we need to reacquire the value of the
              // current world.
              w = _js.getCurrentWorld();
              caller(config.lookup('lastPicture'), [w],
               function(aScene) {
                 if ( world.Kernel.isImage(aScene) ) {
                     setTimeout(
                       function() {
                           reusableCanvas.width = aScene.getWidth();
                           reusableCanvas.height = aScene.getHeight();
                           var ctx = reusableCanvas.getContext("2d");
                           aScene.render(ctx, 0, 0);
                       },
                       0);
                 } else {
                     handleError("stop-when handler: is expected to return a scene or image");
                 }
               });
            }
          } catch (e) {
            handleError(e);
          }
        };
        lastPictureCss = function(w, k) {
          k([[reusableCanvas,
          	["width", reusableCanvas.width + "px"],
          	["height", reusableCanvas.height + "px"]]]);
        };
        return _js.on_draw(nextFrame, lastPictureCss)();
      };

      wrappedHandlers.push(_js.stop_when(worldFunction, undefined, lastPictureFunction));
	}
	
	if (config.lookup('onKey')) {
	    // // TODO: add virtual key bindings
	    // var removeVirtualKeys = addVirtualKeys(stimuli, toplevelNode);
	    // shutdownListeners.push(function() { removeVirtualKeys(); });
	    var wrappedKey = function(w, e, k) {
        // get control character names on keydown, otherwise use ASCII equivalent for key
        // remove all non-printable chars on keypress
        var keyChar = e.type==="keydown"? helpers.getKeyCodeName(e)
                : String.fromCharCode(e.which).replace(/[^\x00-\xFE]+/g, '');
          caller(config.lookup('onKey'), [w, keyChar], k);
	    }
	    wrappedHandlers.push(_js.on_key(wrappedKey));
	    toplevelNode.focus();
	}

  	var mouseIsDown = false;
  	if (config.lookup('onMouse')) {
	  	if(!(config.lookup('onRedraw') || config.lookup('onDraw'))) {
	  		handleError("a mouse handler cannot be used without a draw handler");
	  	}
  		
	    var wrappedMouse = function(w, e, k) {
          // browsers don't send drag events for *all* move-while-down mouse events,
          // so we use state to track those events
          if(e.type==="mousedown") mouseIsDown = true;
          if(e.type==="mouseup" || e.type==="mouseleave")   mouseIsDown = false;
 
          var x = e.pageX, y = e.pageY,
              type  = e.type==='mousedown' ? "button-down"
                    : e.type==='mouseup'   ? "button-up"
                    : e.type==='mouseenter'? "enter"
                    : e.type==='mouseleave'? "leave"
                    : (e.type==='mousemove' && mouseIsDown)? "drag"
                    : e.type==='mousemove'? "move"
                    : e.type;
 
          var currentElement = e.target;
          do {
              x -= currentElement.offsetLeft;
              y -= currentElement.offsetTop;
              currentElement = currentElement.offsetParent;
          } while(currentElement);

          var scaledX = x*e.target.width/e.target.offsetWidth
              scaledY = y*e.target.height/e.target.offsetHeight;
          caller(config.lookup('onMouse'), [w, scaledX, scaledY, type], k);
	    }
	    wrappedHandlers.push(_js.on_mouse(wrappedMouse));
  	}
 
	if (config.lookup('onTap')) {
		var wrappedTap = function(w, e, k) {
	        var x = e.pageX, y = e.pageY;
	        var currentElement = e.target;
	        do {
	            x -= currentElement.offsetLeft;
	            y -= currentElement.offsetTop;
	            currentElement = currentElement.offsetParent;
	        } while(currentElement);

			caller(config.lookup('onTap'), [w, x, y], k);
		}
		wrappedHandlers.push(_js.on_tap(wrappedTap));
	}

	if (config.lookup('onTilt')) {
	    var wrappedTilt = function(w, gamma, beta, k) {
			caller(config.lookup('onTilt'), [w, jsnums.makeFloat(gamma), jsnums.makeFloat(beta)], k);
	    }
	    wrappedHandlers.push(_js.on_tilt(wrappedTilt));
	    toplevelNode.focus();
	}

	startUserConfigs(function() {
		_js.big_bang(toplevelNode,
			     initWorld,
			     wrappedHandlers,
			     helpers.assocListToHash(attribs),
			     terminator);
	});

	return {
	    breaker: function() {
		handleError(types.schemeError(
		    types.incompleteExn(types.exnBreak, 'user break', [])));
	    }
	};

    }



    var addVirtualKeys = function(stimuli, toplevelNode) {
	var makeVirtualButton = function(className, label, keyCode) {
	    var button = document.createElement("input");
	    button.type = "button";
	    button.value = label;
	    button.style.width = "20px";
	    button.style.height = "20px";
	    button.onclick = function(e) {
		stimuli.onKey([{keyCode: keyCode}], function() {});
		preventDefault(e);
		stopPropagation(e);
	    };
	    return button;
	};

	var upButton = makeVirtualButton('up-virtual-button', "U", 38);
	var downButton = makeVirtualButton('down-virtual-button', "D", 40);
	var leftButton = makeVirtualButton('left-virtual-button', "L", 37);
	var rightButton = makeVirtualButton('right-virtual-button', "R", 39);
	var fireButton = makeVirtualButton('space-virtual-button', " ", 32);

	upButton.style['position'] = 'fixed';
	upButton.style['bottom'] = '60px';
	upButton.style['right'] = '50px';

	downButton.style['position'] = 'fixed';
	downButton.style['bottom'] = '0px';
	downButton.style['right'] = '50px';

	leftButton.style['position'] = 'fixed';
	leftButton.style['bottom'] = '30px';
	leftButton.style['right'] = '80px';

	rightButton.style['position'] = 'fixed';
	rightButton.style['bottom'] = '30px';
	rightButton.style['right'] = '20px';

	fireButton.style['position'] = 'fixed';
	fireButton.style['bottom'] = '30px';
	fireButton.style['right'] = '50px';


	toplevelNode.appendChild(upButton);
	toplevelNode.appendChild(downButton);
	toplevelNode.appendChild(leftButton);
	toplevelNode.appendChild(rightButton);
	toplevelNode.appendChild(fireButton);

	return function() {
	    toplevelNode.removeChild(upButton);
	    toplevelNode.removeChild(downButton);
	    toplevelNode.removeChild(leftButton);
	    toplevelNode.removeChild(rightButton);
	    toplevelNode.removeChild(fireButton);
	};
    };


    var handleError = function(e) {
    	console.log('handling error', e);
    	/*
		helpers.reportError(e);
		// When something bad happens, shut down 
		// the world computation.
		helpers.reportError("Shutting down jsworld computations");
		world.stimuli.onShutdown(); 
		*/
		world.stimuli.massShutdown();
		shutdownUserConfigs(function() {
			/*
			// console.log('Got an error, the error was:');
			// console.log(e);
			 if (typeof(console) !== 'undefined' && console.log) {
			 	if (e.stack) {
			 		console.log(e.stack);
			 	}
			 	else {
			 		console.log(e);
			 	}
			 }
			*/
			if ( types.isSchemeError(e) ) {
				console.log(1);
				terminator(e);
			}
			else if ( types.isInternalError(e) ) {
				console.log(2);
				terminator(e);
			}
			else if (typeof(e) == 'string') {
				console.log(3);
				terminator( types.schemeError(types.incompleteExn(types.exnFail, e, [])) );
			}
			else if (e instanceof Error) {
				console.log(4);
				terminator( types.schemeError(types.incompleteExn(types.exnFail, e.message, [])) );
			}
			else {
				console.log(5);
				terminator( types.schemeError(e) );
			}
		});
    }
    


    // updateWorld: CPS( CPS(world -> world) -> void )
    Jsworld.updateWorld = function(updater, k) {
		var wrappedUpdater = function(w, k2) {
		    try {
				updater(w, k2);
		    } catch (e) {
				handleError(e);
				//k2(w);
		    }
		}

		_js.change_world(wrappedUpdater, k);
    }
    


    // shutdownWorld: -> void
    // Shut down all world computations.
    Jsworld.shutdownWorld = function() {
	_js.shutdown();
    };


//    var getAttribs = function(args) {
//	if (args.length == 0) {
//	    return []
//	}
//	if (args.length == 1) {
//	    return helpers.assocListToHash(args[0]);
//	} else {
//	    throw new Error("getAttribs recevied unexpected value for args: "
//			    + args);
//	}
//    }


    Jsworld.p = _js.p;

    Jsworld.div = _js.div;

    Jsworld.buttonBang = function(updateWorldF, effectF, attribs) {
	var wrappedF = function(w, evt, k) {
	    try {
// FIXME: Get effects back online!
//		caller(effectF, [world],
//			function(effect) {
			    caller(updateWorldF, [w],
				function(newWorld) {
//					world.Kernel.applyEffect(effect);
					k(newWorld);
				});
//			});
	    } catch (e) {
		// if (typeof(console) !== 'undefined' && console.log && e.stack) {
		// 	    console.log(e.stack);
		//     }
		handleError(e);
//		k(w);
	    }
	}
	return _js.button(wrappedF, attribs);
    };
    

    Jsworld.input = function(type, updateF, attribs) {
	    var wrappedUpdater = function(w, evt, k) {
		    caller(updateF, [w, evt], k);
	    }
	    return _js.input(type, wrappedUpdater, attribs);
    };


    Jsworld.get_dash_input_dash_value = function(node) {
//	plt.Kernel.check(node, 
//			 function(x) { return (plt.Kernel.isString(node) ||
//					       node.nodeType == 
//					       Node.ELEMENT_NODE) }, 
//			 "get-input-value",
//			 "dom-node",
//			 1);
	if (types.isString(node)) {
	    return (document.getElementById(node).value || "");
	} else {
	    return (node.value || "");
	}

    };



    // Images.
    Jsworld.img = _js.img;

    // text: string -> node
    Jsworld.text = _js.text;

    Jsworld.select = function(options, updateF, attribs) { 
	    var wrappedUpdater = function(w, e, k) {
		    caller(updateF, [w, e.target.value], k);
	    }
	    return _js.select(attribs, options, wrappedUpdater);
    };




    //////////////////////////////////////////////////////////////////////
    Jsworld.emptyPage = _js.emptyPage;

    Jsworld.placeOnPage = function(elt, left, top, page) { 
	elt = types.toDomNode(deepUnwrapJsObjects(elt));
 	return _js.placeOnPage(elt, left, top, page);
    };


    // fixme: add support for textarea, h1, canvas


//    // raw_node: scheme-value assoc -> node
//    Jsworld.rawNode = function(x, args) {
//	var attribs = getAttribs(args);
//	var node = _js.raw_node(types.toDomNode(x), attribs);
//	node.toWrittenString = function(cache) { return "(js-raw-node ...)"; }
//	node.toDisplayedString = node.toWrittenString;
//	node.toDomNode = function(cache) { return node; }
//	return node;
//    };



})();

var primitive = {};

(function() {


var CALL;
var setCALL = function(V) {
    CALL = function(op, operands, k) {
	return new V(op, operands, k);
    };
};



var PAUSE;
var setPAUSE = function(V) {
    PAUSE = function(onPause) {
	return new V(onPause);
    };
};








var PRIMITIVES = {};

var PrimProc = types.PrimProc;
var CasePrimitive = types.CasePrimitive;


//////////////////////////////////////////////////////////////////////

// Helper Functions

var id = function(x) { return x; };



var callWithValues = function(f, vals) {
	if (vals instanceof types.ValuesWrapper) {
		return CALL(f, vals.elts, id);
	}
	else {
		return CALL(f, [vals], id);
	}
};

var procedureArity = function(aState, proc) {
	check(aState, proc, isFunction, 'procedure-arity', 'function', 1, [proc]);
			
	var singleCaseArity = function(aCase) {
		if (aCase instanceof types.ContinuationClosureValue) {
			return types.arityAtLeast(0);
		}
		else if (aCase.isRest) {
			return types.arityAtLeast(aCase.numParams);
		}
		else {
			return aCase.numParams;
		}
	}
	
	if ( proc instanceof PrimProc ||
	     proc instanceof types.ClosureValue ||
	     proc instanceof types.ContinuationClosureValue ) {
		return singleCaseArity(proc);
	}
	else {
		var cases;
		if ( proc instanceof CasePrimitive ) {
			cases = proc.cases;
		}
		else if ( proc instanceof types.CaseLambdaValue ) {
			cases = proc.closures;
		}
		else {
			throw types.internalError('procedure-arity given wrong type that passed isFunction!', false);
		}

		var ret = [];
		for (var i = 0; i < cases.length; i++) {
			ret.push( singleCaseArity(cases[i]) );
		}
		ret = normalizeArity(ret);
		if (ret.length == 1) {
			return ret[0];
		}
		return types.list(ret);
	}
};

var normalizeArity = function(arity) {
	var newArity = arity.splice(0);
	var sortFunc = function(x, y) {
		if ( types.isArityAtLeast(x) && types.isArityAtLeast(y) ) {
			return types.arityValue(x) - types.arityValue(y);
		}
		else if ( types.isArityAtLeast(x) ) {
			return types.arityValue(x) - y - 0.5;
		}
		else if ( types.isArityAtLeast(y) ) {
			return x - types.arityValue(y) + 0.5;
		}
		else {
			return x - y;
		}
	};
	newArity.sort(sortFunc);

	for (var i = 0; i < newArity.length-1; i++) {
		if ( types.isArityAtLeast(newArity[i]) ) {
			return newArity.splice(0, i+1);
		}
	}
	return newArity;
};


var procArityContains = helpers.procArityContains;


var length = function(lst) {
	var ret = 0;
	for (; !lst.isEmpty(); lst = lst.rest()) {
		ret = ret+1;
	}
	return ret;
}

var append = function(aState, initArgs) {
	if (initArgs.length == 0) {
		return types.EMPTY;
	}
	var args = initArgs.slice(0, initArgs.length-1);
	var lastArg = initArgs[initArgs.length - 1];
	arrayEach(args, function(x, i) {checkList(aState, x, 'append', i+1, initArgs);});

	var ret = lastArg;
	for (var i = args.length-1; i >= 0; i--) {
		ret = args[i].append(ret);
	}
	return ret;
}


function checkHandlerArity(aState, event, expected, actual) {
	var positionStack = 
		state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
	var locationList = positionStack[positionStack.length - 1];
	var eventLoc = locationList.first(), handlerLoc = locationList.rest().first();
	if(actual !== expected) {
		var msg = new types.Message([new types.ColoredPart(event, eventLoc), 
					": expected a " + expected + "-argument function as input, but given",
					new types.ColoredPart("a function",  handlerLoc), 
					"of " + actual + " arguments"]);
		raise( types.incompleteExn(types.exnFailContract, msg, []) );
	}
}


var foldHelp = function(f, acc, args) {
	if ( args[0].isEmpty() ) {
		return acc;
	}

	var fArgs = [];
	var argsRest = [];
	for (var i = 0; i < args.length; i++) {
		fArgs.push(args[i].first());
		argsRest.push(args[i].rest());
	}
	fArgs.push(acc);
	return CALL(f, fArgs,
		function(result) {
			return foldHelp(f, result, argsRest);
		});
};


var quicksort = function(functionName) {
    return function(aState, initList, comp) {
	checkList(aState, initList, functionName, 1, arguments);
	check(aState, comp, procArityContains(2), functionName, 'procedure (arity 2)', 2, arguments);
	
	var quicksortHelp = function(aState, lst) {
	    if ( lst.isEmpty() ) {
		return types.EMPTY;
	    }
	    
	    var compYes = new PrimProc('compYes', 1, false, false,
				       function(aState, x) { return CALL(comp, [x, lst.first()], id); });
	    var compNo = new PrimProc('compNo', 1, false, false,
				      function(aState, x) { return CALL(comp, [x, lst.first()],
								        function(res) { return !res; });
					                  });
	    var recCallProc = new PrimProc('quicksort', 1, false, false, quicksortHelp);
	    return CALL(PRIMITIVES['filter'], [compYes, lst.rest()],
			function(half1) {
			    return CALL(recCallProc, [half1],
					function(sorted1) {
					    return CALL(PRIMITIVES['filter'], [compNo, lst.rest()],
							function(half2) {
							    return CALL(recCallProc, [half2],
									function(sorted2) {
									    return append(aState, [sorted1,
											   types.list([lst.first()]),
											   sorted2]);
									});
							});
					});
			});
	}
	return quicksortHelp(aState, initList);
    };
};

var compare = function(args, comp) {
	var curArg = args[0];
	for (var i = 1; i < args.length; i++) {
		if ( !comp(curArg, args[i]) ) {
			return false;
		}
		curArg = args[i];
	}
	return true;
}

// isAlphabeticString: string -> boolean
var isAlphabeticString = function(s) {
	var i;
	for(i = 0; i < s.length; i++) {
		if (! ((s.charAt(i) >= "a" && s.charAt(i) <= "z") ||
		       (s.charAt(i) >= "A" && s.charAt(i) <= "Z"))) {
			return false;
		}
	}
	return true;
}

var isNumericString = function(s) {
	var i;
	for (i = 0; i < s.length; i++) {
		if ( ! (s.charAt(i) >= '0' && s.charAt(i) <= '9') ) {
			return false;
		}
	}
	return true;
}

// isWhitespaceString: string -> boolean
var isWhitespaceString = (function() {
	var pat = new RegExp("^\\s*$");
	return function(s) {
		return (s.match(pat) ? true : false);
	}
}());




var isImmutable = function(x) {
	return ((isString(x) ||
		 isByteString(x) ||
		 isVector(x) ||
		 isBox(x)) &&
		!x.mutable);
};




// Every world configuration function (on-tick, stop-when, ...)
// produces a WorldConfigOption instance.
var WorldConfigOption = types.Class.extend({
	init: function(name) {
	    this.name = name;	    
	},

	configure: function(config) {
	    throw types.internalError("unimplemented", false);
	},

	toWrittenString: function(cache) {
	    return "(" + this.name + " ...)";
	},

	toDisplayedString: this.toWrittenString,
	toDomNode: function(cache) {
	    var div = document.createElement('div');
	    div.appendChild(document.createTextNode(this.toWrittenString()));
	    return div;
	}});


var isWorldConfigOption = function(x) { return x instanceof WorldConfigOption; };

var onEvent = function(funName, inConfigName, numArgs) {
    return function(aState, handler) {
		checkHandlerArity(aState, funName, numArgs, handler.numParams);

		return onEventBang(funName, inConfigName)(
			    aState,
				handler,
				new PrimProc('', numArgs, false, false, function(aState) { return types.EMPTY; }));
    };
};

var onEventBang = function(funName, inConfigName) {
    return function(aState, handler, effectHandler) {
		check(aState, handler, isFunction, funName, 'function', 1, arguments);
		check(aState, effectHandler, isFunction, funName, 'function', 2, arguments);
		return new (WorldConfigOption.extend({
			    init: function() {
				this._super(funName);
			    },
			    configure: function(config) {
				var newHash = {};
				newHash[inConfigName] = handler;
				newHash[inConfigName+'Effect'] = effectHandler;
				return config.updateAll(newHash);
			    }}))();
    };
};


var assocListToHash = helpers.assocListToHash;

var raise = helpers.raise;


var makeCaller = function(aState) {
	var onFail = function(e) {
		if (typeof(console) !== 'undefined' && console.log) {
			console.log('There was an error in a procedure converted from scheme to javascript');
			if (e.stack) {
				console.log(e.stack);
			}
			else {
				console.log(e);
			}
		}
		throw e;
	}
	return function(operator, operands, k) {
		return interpret.call(aState, operator, operands, k, onFail);
	}
};


var schemeProcToJs = function(aState, schemeProc) {
	var caller = function(operator, operands, k) {
		return interpret.call(aState, operator, operands, k, function(e) { throw e; });
	}
	return function(k) {
		var args = [];
		for (var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		caller(schemeProc, args, k);
	}
};


// Struct Procedure types
var StructProc = function(typeName, name, numParams, isRest, assignsToValueRegister, impl) {
	PrimProc.call(this, name, numParams, isRest, assignsToValueRegister, impl);
	this.typeName = typeName;
};
StructProc.prototype = PrimProc.prototype;

var StructConstructorProc = function() {
	StructProc.apply(this, arguments);
};
StructConstructorProc.prototype  = StructProc.prototype;

var StructPredicateProc = function() {
	StructProc.apply(this, arguments);
};
StructPredicateProc.prototype  = StructProc.prototype;

var StructAccessorProc = function() {
	StructProc.apply(this, arguments);
};
StructAccessorProc.prototype  = StructProc.prototype;

var StructMutatorProc = function() {
	StructProc.apply(this, arguments);
};
StructMutatorProc.prototype  = StructProc.prototype;

var getMakeStructTypeReturns = function(aStructType) {
	var name = aStructType.name;
	return new types.ValuesWrapper(
		[aStructType,
		 (new StructConstructorProc(name,
					    'make-'+name,
					    aStructType.numberOfArgs,
					    false,
					    false,
					    function(aState) { 
                                                return aStructType.constructor.apply(
                                                    null, [].slice.call(arguments, 1));
                                            })),
		 (new StructPredicateProc(name, name+'?', 1, false, false,
                                          function(aState, x) { 
                                              return aStructType.predicate(x);
                                          })),
		 (new StructAccessorProc(name,
					 name+'-ref',
					 2,
					 false,
					 false,
					 function(aState, x, i) {
						check(aState, x, aStructType.predicate, name+'-ref', 'struct:'+name, 1, arguments);
						check(aState, i, isNatural, name+'-ref', 'non-negative exact integer', 2, arguments);

						var numFields = aStructType.numberOfFields;
						if ( jsnums.greaterThanOrEqual(i, numFields) ) {
							var msg = (name+'-ref: slot index for <struct:'+name+'> not in ' +
								   '[0, ' + (numFields-1) + ']: ' + i);
							raise( types.incompleteExn(types.exnFailContract, msg, []) );
						}
						return aStructType.accessor(x, jsnums.toFixnum(i));
					 })),
		 (new StructMutatorProc(name,
					name+'-set!',
					3,
					false,
					false,
					function(aState, x, i, v) {
						check(aState, x, aStructType.predicate, name+'-set!', 'struct:'+name, 1, arguments);
						check(aState, i, isNatural, name+'-set!', 'non-negative exact integer', 2, arguments);

						var numFields = aStructType.numberOfFields;
						if ( jsnums.greaterThanOrEqual(i, numFields) ) {
							var msg = (name+'-set!: slot index for <struct'+name+'> not in ' +
								   '[0, ' + (numFields-1) + ']: ' + i);
							raise( types.incompleteExn(types.exnFailContract, msg, []) );
						}
						aStructType.mutator(x, jsnums.toFixnum(i), v)
					})) ]);
};




//////////////////////////////////////////////////////////////////////


var isNumber 	= jsnums.isSchemeNumber;
var isReal 		= jsnums.isReal;
var isRational 	= jsnums.isRational;
// TODO(Emmanuel): ugly hack - this should be exported properly by js-numbers
var isComplex 	= function(x) { return (x.i !== undefined)? types.TRUE : types.FALSE; }
var isInteger 	= jsnums.isInteger;

var isNatural = function(x) {
	return jsnums.isExact(x) && isInteger(x) && jsnums.greaterThanOrEqual(x, 0);
};

var isNonNegativeReal = function(x) {
	return isReal(x) && jsnums.greaterThanOrEqual(x, 0);
};

// Determines if x is an angle, namely a real number (except not +inf.0, -inf.0 or +nan.0).
// from: http://docs.racket-lang.org/teachpack/2htdpimage.html?q=rotate#%28def._%28%28lib._2htdp%2Fimage..rkt%29._angle~3f%29%29
var isAngle = function(x) {
	return isReal(x) && !(jsnums.equals(x, jsnums.inf) || jsnums.equals(x, jsnums.negative_inf))
		&& jsnums.lessThan(x, 180) && jsnums.greaterThan(x, 0);
};
var isSideCount = function(x) {
	return isInteger(x) && jsnums.greaterThanOrEqual(x, 3);
};
var isStepCount = function(x) {
	return isInteger(x) && jsnums.greaterThanOrEqual(x, 1);
};

var angleToProperRange = function(angle){
 return angle % 360;
};
 
var isSymbol = types.isSymbol;
var isChar = types.isChar;
var isString = types.isString;
var isPair = types.isPair;
var isEmpty = function(x) { return x === types.EMPTY; };
var isList = helpers.isList;
var isListOf = helpers.isListOf;

var isVector = types.isVector;
var isBox = types.isBox;
var isHash = types.isHash;
var isByteString = types.isByteString;

var isByte = function(x) {
	return (isNatural(x) &&
		jsnums.lessThanOrEqual(x, 255));
}

var isBoolean = function(x) {
	return (x === true || x === false);
}

var isFunction = types.isFunction;

var isEqual = function(x, y) {
	return types.isEqual(x, y, new types.UnionFind());
}

var isEq = function(x, y) {
	return x === y;
}

var isEqv = function(x, y) {
	if (isNumber(x) && isNumber(y)) {
		return jsnums.eqv(x, y);
	}
	else if (isChar(x) && isChar(y)) {
		return x.val === y.val;
	}
	return x === y;
}

var isImage = world.Kernel.isImage;
var isScene = world.Kernel.isScene;
var isColor = world.Kernel.isColor;
var nameToColor = world.Kernel.nameToColor;
var isFontFamily = function(x){
	return ((isString(x) || isSymbol(x)) &&
			(x.toString().toLowerCase() == "default" ||
			 x.toString().toLowerCase() == "decorative" ||
			 x.toString().toLowerCase() == "roman" ||
			 x.toString().toLowerCase() == "script" ||
			 x.toString().toLowerCase() == "swiss" ||
			 x.toString().toLowerCase() == "modern" ||
			 x.toString().toLowerCase() == "symbol" ||
			 x.toString().toLowerCase() == "system"))
	|| !x;		// false is also acceptable
};
var isFontStyle = function(x){
	return ((isString(x) || isSymbol(x)) &&
			(x.toString().toLowerCase() == "normal" ||
			 x.toString().toLowerCase() == "italic" ||
			 x.toString().toLowerCase() == "slant"))
	|| !x;		// false is also acceptable
};
var isFontWeight = function(x){
	return ((isString(x) || isSymbol(x)) &&
			(x.toString().toLowerCase() == "normal" ||
			 x.toString().toLowerCase() == "bold" ||
			 x.toString().toLowerCase() == "light"))
	|| !x;		// false is also acceptable
};
var colorDb = world.Kernel.colorDb;
var isMode = function(x) {
	return ((isString(x) || isSymbol(x)) &&
          (x.toString().toLowerCase() == "solid" ||
           x.toString().toLowerCase() == "outline")) ||
         ((isReal(x)) &&
          (jsnums.greaterThanOrEqual(x, 0) &&
           jsnums.lessThanOrEqual(x, 255)));
};

var isPlaceX = function(x) {
	return ((isString(x) || isSymbol(x)) &&
			(x.toString().toLowerCase() == "left"  ||
			 x.toString().toLowerCase() == "right" ||
			 x.toString().toLowerCase() == "center" ||
			 x.toString().toLowerCase() == "middle"));
};

var isPlaceY = function(x) {
	return ((isString(x) || isSymbol(x)) &&
			(x.toString().toLowerCase() == "top"	  ||
			 x.toString().toLowerCase() == "bottom"   ||
			 x.toString().toLowerCase() == "baseline" ||
			 x.toString().toLowerCase() == "center"   ||
			 x.toString().toLowerCase() == "middle"));
};

var isStyle = function(x) {
	return ((isString(x) || isSymbol(x)) &&
		(x.toString().toLowerCase() == "solid" ||
		 x.toString().toLowerCase() == "outline"));
};


var isAssocList = function(x) {
	return isPair(x) && isPair(x.rest()) && isEmpty(x.rest().rest());
};

var isMouseEvent = function(x){
 return ["button-down", "button-up", "drag", "move", "enter", "leave"].indexOf(x) > -1;
};

var isCompoundEffect = function(x) {
	return ( types.isEffect(x) || isListOf(x, isCompoundEffect) );
};

var isJsObject = types.isJsObject;
var isJsFunction = function(x) {
	return isJsObject(x) && typeof(x.obj) == 'function';
};



var arrayEach = function(arr, f) {
	for (var i = 0; i < arr.length; i++) {
		f.call(null, arr[i], i);
	}
}

// Useful trigonometric functions based on htdp teachpack

// excess : compute the Euclidean excess
//  Note: If the excess is 0, then C is 90 deg.
//        If the excess is negative, then C is obtuse.
//        If the excess is positive, then C is acuse.
function excess(sideA, sideB, sideC) {
   return sideA*sideA + sideB*sideB - sideC*sideC;
}

// return c^2 = a^2 + b^2 - 2ab cos(C)
function cosRel(sideA, sideB, angleC) {
    return (sideA*sideA) + (sideB*sideB) - (2*sideA*sideB*Math.cos(angleC * Math.PI/180));
}
 
var less = function(lhs, rhs) {
    return (rhs - lhs) > 0.00001;
}
 
//var throwCheckError = helpers.throwCheckError;
var check = helpers.check;
var checkVarArity = helpers.checkVarArity;

var checkList = function(aState, x, functionName, position, args) {
	if ( !isList(x) ) {
		helpers.throwCheckError(aState,
					{ functionName: functionName,
					  typeName: 'list',
					  ordinalPosition: helpers.ordinalize(position),
					  actualValue: x },
					position,
					args);
	}
}

var checkListOf = helpers.checkListOf;

var checkListOfLength = function(aState, lst, n, functionName, position, args) {
	if ( !isList(lst) || (length(lst) < n) ) {
		helpers.throwCheckError(aState,
							{functionName: functionName,
							 typeName: 'list with ' + n + ' or more elements',
							 ordinalPosition: helpers.ordinalize(position),
							 actualValue: lst},
							 position,
							 args);
	}
}

var checkAllSameLength = function(aState, lists, functionName, args) {
	if (lists.length === 0)
		return;

	var len = length(lists[0]);
	arrayEach(lists,
		  function(lst, i) {
			if (length(lst) != len) {
				var argStr = helpers.map(function(x) { return " ~s"; }, args).join('');
				var msg = helpers.format(functionName + ': all lists must have the same size; arguments were:' + argStr,
							 args);
				raise( types.incompleteExn(types.exnFailContract, msg, []) );
			}
		});
}

 
// A hook for notifying the outside world about file loading
 var notifyLoading = function(url){
    if(window.plt && window.plt.wescheme && plt.wescheme.WeSchemeIntentBus){
      var shortenedUrl = url.substring(0,20)+"..."+url.substring(url.length-20);
      plt.wescheme.WeSchemeIntentBus.notify("load-file", shortenedUrl);
    } else {
      console.log("Loading from "+url);
    }
 };

//////////////////////////////////////////////////////////////////////


// Special moby-specific primitives

PRIMITIVES['verify-boolean-branch-value'] =
	new PrimProc('verify-boolean-branch-value',
		     4,
		     false,
		     false,
		     function(aState, name, nameLoc, x, aLoc) { 
			 if (x !== true && x !== false) {
		
       			var positionStack = 
        			state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
       
       			var locationList = positionStack[positionStack.length - 1];
			     raise(types.incompleteExn(
                                 types.exnFailContract,
				 new types.Message([new types.ColoredPart(name, nameLoc), 
						    ": expected a boolean value, but found: ",
						    new types.ColoredPart(types.toWrittenString(x),
                                                                          aLoc)
                                                    
						   ]),
                                 []));  
			 }
			 return x;
		     })

PRIMITIVES['throw-cond-exhausted-error'] = 
	new PrimProc('throw-cond-exhausted-error',
		     1,
		     false,
		     false,
		     function(aState, aLoc) {
			     // FIXME: should throw structure
			     // make-moby-error-type:conditional-exhausted
			     // instead.
			// throw types.schemeError(types.incompleteExn(types.exnFail, "cond: all question results were false", []));
			 raise(types.incompleteExn(
			     types.exnFailContract,
			     new types.Message([new types.ColoredPart("cond", aLoc), 
						": all question results were false"
					       ]),
			     []));
			 
		     });


PRIMITIVES['print-values'] = 
    new PrimProc('print-values',
		 0,
		 true,
		 false,
		 function(aState, values) {
		     var printed = false;
		     for (var i = 0; i < values.length; i++) {
			 if (values[i] !== types.VOID) {
			     aState.getPrintHook()(values[i]);
			     printed = true;
			 }
		     }
		     if (printed) {
			 aState.getDisplayHook()("\n");
		     }
		     return types.VOID;
		 });





PRIMITIVES['check-expect'] =
    new PrimProc('check-expect',
		 2,
		 false, false,
		 function(aState, actual, expected) {
		 	if ( isFunction(actual) || isFunction(expected) ) {
				var msg = 'check-expect cannot compare functions';
				raise( types.incompleteExn(types.exnFailContract, msg, []) );
			}
		 	if ( !isEqual(actual, expected) ) {
				var msg = helpers.format('check-expect: actual value ~s differs from ~s, the expected value.\n',
							 [actual, expected]);
			        aState.getDisplayHook()(msg);
			    var stackTrace = state.getStackTraceFromContinuationMarks(
									state.captureCurrentContinuationMarks(aState));
			    for (var i = 0; i < stackTrace.length; i++) {
			        aState.getPrintHook()(helpers.makeLocationDom(stackTrace[i]));
			    }
			}
			return types.VOID;
		});
PRIMITIVES['EXAMPLE'] = 
    new PrimProc('EXAMPLE',
		 2,
		 false, false,
		 function(aState, actual, expected) {
		 	if ( isFunction(actual) || isFunction(expected) ) {
				var msg = 'EXAMPLE cannot compare functions';
				raise( types.incompleteExn(types.exnFailContract, msg, []) );
			}
			// special-case if it's two images
		 	if ( !isEqual(actual, expected) ) {
		 		var msg = 'EXAMPLE failed: '; 
		 		if(types.toWrittenString(actual) === '<image>' && 
		 		   types.toWrittenString(expected) === "<image>"){
		 			msg += 'Expected the two <image>s to match.'
		 		} else {
					msg += helpers.format('Got ~s, but expected ~s.\n', [actual, expected]);
				}
			    aState.getDisplayHook()(msg);
			    var stackTrace = state.getStackTraceFromContinuationMarks(
									state.captureCurrentContinuationMarks(aState));
			    for (var i = 0; i < stackTrace.length; i++) {
			        aState.getPrintHook()(helpers.makeLocationDom(stackTrace[i]));
			    }
			}
			return types.VOID;
		});


PRIMITIVES['check-within'] =
    new PrimProc('check-within',
		 3,
		 false, false,
		 function(aState, actual, expected, range) {
		 	if ( !isNonNegativeReal(range) ) {
				var msg = helpers.format('check-within requires a non-negative real number for range, but given ~s.',
							 [range]);
				raise( types.incompleteExn(types.exnFailContract, msg, []) );
			}
		 	if ( isFunction(actual) || isFunction(expected) ) {
				var msg = 'check-within cannot compare functions';
				raise( types.incompleteExn(types.exnFailContract, msg, []) );
			}
			
		 	if ( !( isEqual(actual, expected) ||
			        (isReal(actual) && isReal(expected) &&
				 jsnums.lessThanOrEqual(jsnums.abs(jsnums.subtract(actual, expected)),
					 		range)) ) ) {
				var msg = helpers.format('check-within: actual value ~s is not within ~s of expected value ~s.',
							 [actual, range, expected]);

			        aState.getDisplayHook()(msg);
			    var stackTrace = state.getStackTraceFromContinuationMarks(
				state.captureCurrentContinuationMarks(aState));
			    for (var i = 0; i < stackTrace.length; i++) {
			        aState.getPrintHook()(helpers.makeLocationDom(stackTrace[i]));
			    }
			}
			return types.VOID;
		});
				


//////////////////////////////////////////////////////////////////////

var defaultPrint = 
    new PrimProc('print', 
		 1, 
		 false, 
		 false, 
		 function(aState, x) {
		     aState.getPrintHook()(types.toWrittenString(x));
		     return types.VOID;
		 });


PRIMITIVES['write'] =
    new CasePrimitive('write',
	[new PrimProc('write', 1, false, false, function(aState, x) {
			aState.getPrintHook()(x);
			return types.VOID;
		}),
	 new PrimProc('write', 2, false, true, function(aState, x, port) {
		 	throw types.internalError("write to a port not implemented yet.", state.captureCurrentContinuationMarks(aState));
		}) ]);



PRIMITIVES['display'] = 
	new CasePrimitive('display',
		      [new PrimProc('display', 1, false, false, function(aState, x) {
			  aState.getDisplayHook()(types.toDisplayedString(x));
			  return types.VOID;
	}),
			  new PrimProc('display', 2, false, true, function(aState, x, port) {
	     // FIXME
	     throw types.internalError("display to a port not implemented yet.", state.captureCurrentContinuationMarks(aState));
	 } )]);



PRIMITIVES['newline'] = 
	new CasePrimitive('newline',
                          [new PrimProc('newline', 0, false, true, function(aState) {
	    aState.getDisplayHook()('\n');
	    aState.v = types.VOID;
	}),
	 new PrimProc('newline', 1, false, false, function(aState, port) {
	     // FIXME
	     throw types.internalError("newline to a port not implemented yet.", state.captureCurrentContinuationMarks(aState));
	 } )]);



PRIMITIVES['current-print'] =
    new PrimProc('current-print', 
		 0, 
		 false, false,
		 function(aState) {
		     return defaultPrint;
		 });


PRIMITIVES['current-continuation-marks'] =
    // FIXME: should be CasePrimitive taking either 0 or 1 arguments
    new PrimProc('current-continuation-marks',
		 0,
		 false, false,
		 function(aState) {
		     return state.captureCurrentContinuationMarks(aState);
		 });

PRIMITIVES['continuation-mark-set->list'] = 
    new PrimProc('continuation-mark-set->list',
		 2,
		 false,
		 false,
		 function(aState, markSet, keyV) {
		     check(aState, markSet, 
			   types.isContinuationMarkSet, 
			   'continuation-mark-set->list',
			   'continuation-mark-set',
			   1,
			   [markSet, keyV]);
		     return types.list(markSet.ref(keyV));
		 });



PRIMITIVES['for-each'] =
        new PrimProc('for-each', 
		     2, 
		     true, false,
		     function(aState, f, firstArg, arglists) {
		 	 var allArgs = [f, firstArg].concat(arglists);
		 	 arglists.unshift(firstArg);
			 check(aState, f, isFunction, 'for-each', 'function', 1, allArgs);
			 arrayEach(arglists, function(lst, i) {checkList(aState, lst, 'for-each', i+2, allArgs);});
			 checkAllSameLength(aState, arglists, 'for-each', allArgs);

			 var forEachHelp = function(args) {
			     if (args[0].isEmpty()) {
				 return types.VOID;
			     }

			     var argsFirst = [];
			     var argsRest = [];
			     for (var i = 0; i < args.length; i++) {
				 argsFirst.push(args[i].first());
				 argsRest.push(args[i].rest());
			     }

			     return CALL(f, argsFirst,
					 function(result) {return forEachHelp(argsRest);});
			 }

			 return forEachHelp(arglists);
		     });


PRIMITIVES['make-thread-cell'] = 
	new CasePrimitive('make-thread-cell', [
	new PrimProc("make-thread-cell",
		     1, false, false,
		     function(aState, x) {
			  return new types.ThreadCell(x, false);
		     }
		    ),
	new PrimProc("make-thread-cell",
		     2, false, false,
		     function(aState, x, y) {
			  return new types.ThreadCell(x, y);
		     }
		    )]);



PRIMITIVES['make-continuation-prompt-tag'] = 
	new CasePrimitive('make-continuation-prompt-tag', 
			  [
	new PrimProc("make-continuation-prompt-tag",
		     0, false, false,
		     function(aState) {
			  return new types.ThreadCell();
		     }
		    ),
	new PrimProc("make-continuation-prompt-tag",
		     1, false, false,
		     function(aState, x) {
			  return new types.ThreadCell(x);
		     }
		    )]);



var makeOptionPrimitive = function(name,
				   numArgs,
				   defaultVals,
				   assignsToValueRegister,
				   bodyF) {
    var makeNthPrimitive = function(n) {
	return new PrimProc(name,
			     numArgs + n,
			     false,
			     assignsToValueRegister,
			     function(aState) {
				 var expectedNumArgs = numArgs + n + 1;
				 assert.equal(arguments.length, expectedNumArgs);
				 var args = [arguments];
				 for (var i = 0; i < arguments.length; i++) {
				     args.push(arguments[i]);
				 }
				 var startDefaults = i - numArgs - 1;
				 return bodyF.apply(
				     bodyF,
				     args.concat(defaultVals.slice(startDefaults)));
			     });
    };
	
    var cases = [];
    for (var i = 0; i <= defaultVals.length; i++) {
	cases.push(makeNthPrimitive(i));
    }
    return new CasePrimitive(name, cases);
};




PRIMITIVES['make-struct-type'] =
	makeOptionPrimitive(
	    'make-struct-type',
	    4,
	    [false, 
	     types.EMPTY,
	     types.symbol("prefab"),
	     false,
	     types.EMPTY,
	     false],
	    false,
	    function(userArgs,
		     aState,
		     name,
		     superType,
		     initFieldCnt,
		     autoFieldCnt,
		     autoV,
		     props,	 // FIXME: currently ignored
		     inspector,  // FIXME: currently ignored
		     procSpec,	 // FIXME: currently ignored
		     immutables, // FIXME: currently ignored
		     guard) {
		check(aState, name, isSymbol, 'make-struct-type', 'symbol', 1, userArgs);
		check(aState, superType, function(x) { return x === false || types.isStructType(x); },
		      'make-struct-type', 'struct-type or #f', 2, userArgs);
		check(aState, initFieldCnt, isNatural, 'make-struct-type', 'exact non-negative integer', 3, userArgs);
		check(aState, autoFieldCnt, isNatural, 'make-struct-type', 'exact non-negative integer', 4, userArgs);
		// TODO: check props
		// TODO: check inspector
		// TODO: check procSpect
		checkListOf(aState, immutables, isNatural, 'make-struct-type', 'exact non-negative integer', 9, userArgs);
		check(aState, guard, function(x) { return x === false || isFunction(x); },
		      'make-struct-type', 'procedure or #f', 10, userArgs);
		// Check the number of arguments on the guard
		var numberOfGuardArgs = initFieldCnt + 1 + (superType ? superType.numberOfArgs : 0);
		if ( guard && !procArityContains(numberOfGuardArgs)(guard) ) {
			raise(types.incompleteExn(
				types.exnFailContract,
				helpers.format(
					'make-struct-type: guard procedure does not accept ~a arguments '
					+ '(one more than the number constructor arguments): ~s',
					[numberOfGuardArgs, guard]),
				[]));
		}
		var jsGuard = (guard ? schemeProcToJs(aState, guard) : false);
		var aStructType = 
		    types.makeStructureType(name.toString(),
					    superType,
					    jsnums.toFixnum(initFieldCnt),
					    jsnums.toFixnum(autoFieldCnt),
					    autoV,
					    jsGuard);

		return getMakeStructTypeReturns(aStructType);
	    });
			    
PRIMITIVES['make-struct-field-accessor'] =
	makeOptionPrimitive(
	    'make-struct-field-accessor',
	    2,
	    [false],
	    false,
	    function(userArgs, aState, accessor, fieldPos, fieldName) {
	    	check(aState, accessor, function(x) { return x instanceof StructAccessorProc && x.numParams > 1; },
		      'make-struct-field-accessor', 'accessor procedure that requires a field index', 1, userArgs);
		check(aState, fieldPos, isNatural, 'make-struct-field-accessor', 'exact non-negative integer', 2, userArgs);
		check(aState, fieldName, function(x) { return x === false || isSymbol(x); },
		      'make-struct-field-accessor', 'symbol or #f', 3, userArgs);
	    	var fixnumPos = jsnums.toFixnum(fieldPos);
	    	var procName = accessor.typeName + '-'
			+ (fieldName ? fieldName.toString() : 'field' + fixnumPos);

		return new StructAccessorProc(accessor.typeName, procName, 1, false, false,
					      function(aState, x) {
						  return accessor.impl(aState, x, fixnumPos);
					      });
	    });




PRIMITIVES['make-struct-field-mutator'] =
	makeOptionPrimitive(
	    'make-struct-field-mutator',
	    2,
	    [false],
	    false,
	    function(userArgs, aState, mutator, fieldPos, fieldName) {
	    	check(aState, mutator, function(x) { return x instanceof StructMutatorProc && x.numParams > 1; },
		      'make-struct-field-mutator', 'mutator procedure that requires a field index', 1, userArgs);
		check(aState, fieldPos, isNatural, 'make-struct-field-mutator', 'exact non-negative integer', 2, userArgs);
		check(aState, fieldName, function(x) { return x === false || isSymbol(x); },
		      'make-struct-field-mutator', 'symbol or #f', 3, userArgs);
	    	var fixnumPos = jsnums.toFixnum(fieldPos);
	    	var procName = mutator.typeName + '-'
			+ (fieldName ? fieldName.toString() : 'field' + fixnumPos);

		return new StructMutatorProc(mutator.typeName, procName, 2, false, false,
					     function(x, v) {
						 return mutator.impl(aState, x, fixnumPos, v);
					     });
	    });


PRIMITIVES['struct-type?'] = new PrimProc('struct-type?', 1, false, false, function(aState, x) { return types.isStructType(x); });

PRIMITIVES['struct-constructor-procedure?'] =
    new PrimProc('struct-constructor-procedure?', 1, false, false,
		 function(aState, x) { return x instanceof StructConstructorProc; });

PRIMITIVES['struct-predicate-procedure?'] =
    new PrimProc('struct-predicate-procedure?', 1, false, false,
		 function(aState, x) { return x instanceof StructPredicateProc; });

PRIMITIVES['struct-accessor-procedure?'] =
    new PrimProc('struct-accessor-procedure?', 1, false, false,
		 function(aState, x) { return x instanceof StructAccessorProc; });

PRIMITIVES['struct-mutator-procedure?'] =
    new PrimProc('struct-mutator-procedure?', 1, false, false,
		 function(aState, x) { return x instanceof StructMutatorProc; });



PRIMITIVES['procedure-arity'] = new PrimProc('procedure-arity', 1, false, false, 
                                             function(aState, proc){ return procedureArity(aState, proc); });


PRIMITIVES['apply'] =
    new PrimProc('apply',
		 2,
		 true, false,
		 function(aState, f, firstArg, args) {
		 	var allArgs = [f, firstArg].concat(args);
		 	check(aState, f, isFunction, 'apply', 'function', 1, allArgs);
		 	args.unshift(firstArg);

			var lastArg = args.pop();
			checkList(aState, lastArg, 'apply', args.length+2, allArgs);
			var args = args.concat(helpers.schemeListToArray(lastArg));

			return CALL(f, args, id);
		 });


PRIMITIVES['values'] =
    new PrimProc('values',
		 0,
		 true, false,
		 function(aState, args) {
		 	if (args.length === 1) {
				return args[0];
			}
		 	return new types.ValuesWrapper(args);
		 });


PRIMITIVES['call-with-values'] =
    new PrimProc('call-with-values',
		 2,
		 false, false,
		 function(aState, g, r) {
		 	check(aState, g, procArityContains(0), 'call-with-values', 'procedure (arity 0)', 1, arguments);
			check(aState, r, isFunction, 'call-with-values', 'function', 2, arguments);
			return CALL(g, [],
				function(res) {
					return callWithValues(r, res);
				});
		 });


PRIMITIVES['compose'] =
    new PrimProc('compose',
		 0,
		 true, false,
		 function(aState, procs) {
		 	arrayEach(procs, function(p, i) {check(aState, p, isFunction, 'compose', 'function', i+1, procs);});

			if (procs.length == 0) {
				return PRIMITIVES['values'];
			}
			var funList = types.list(procs).reverse();
			
			var composeHelp = function(x, fList) {
				if ( fList.isEmpty() ) {
					return x;
				}

				return CALL(new PrimProc('', 1, false, false,
						         function(aState, args) {
							     return callWithValues(fList.first(), args);
							 }),
					    [x],
					    function(result) {
						return composeHelp(result, fList.rest());
					    });
			}
			return  new PrimProc('', 0, true, false,
					     function(aState, args) {
						if (args.length === 1) {
							return composeHelp(args[0], funList);
						}
					        return composeHelp(new types.ValuesWrapper(args), funList);
					    });
		 });


PRIMITIVES['current-inexact-milliseconds'] =
    new PrimProc('current-inexact-milliseconds',
		 0,
		 false, false,
		 function(aState) {
			return jsnums.makeFloat((new Date()).valueOf());
		 });


PRIMITIVES['current-seconds'] =
    new PrimProc('current-seconds',
		 0,
		 false, false,
		 function(aState) {
		 	return Math.floor( (new Date()).getTime() / 1000 );
		 });


PRIMITIVES['not'] =
    new PrimProc('not',
		 1,
		 false, false,
		 function(aState, x) {
		 	return x === false;
		 });


PRIMITIVES['void'] =
    new PrimProc('void', 0, true, false,
		 function(aState, args) {
		 	return types.VOID;
		 });


PRIMITIVES['random'] =
	new CasePrimitive('random',
	[new PrimProc('random', 0, false, false,
		      function(aState) {return types['float'](Math.random());}),
	 new PrimProc('random', 1, false, false,
		      function(aState, n) {
			  check(aState, n, isNatural, 'random', 'non-negative exact integer', 1, arguments);
			  return Math.floor(Math.random() * jsnums.toFixnum(n));
		      }) ]);


PRIMITIVES['sleep'] =
    new CasePrimitive('sleep',
	[new PrimProc('sleep', 0, false, false, function(aState) { return types.VOID; }),
	 new PrimProc('sleep',
		      1,
		      false, false,
		      function(aState, secs) {
			  check(aState, secs, isNonNegativeReal, 'sleep', 'non-negative real number', 1);
			  
			  var millisecs = jsnums.toFixnum(jsnums.multiply(secs, 1000) );
			  return PAUSE(function(restarter, caller) {
				  setTimeout(function() { restarter(types.VOID); },
					     millisecs);
			  });
		      }) ]);


PRIMITIVES['identity'] = new PrimProc('identity', 1, false, false, function(aState, x) { return x; });



PRIMITIVES['raise'] = new PrimProc('raise', 1, false, false, function(aState, v) { return raise(v);} );

PRIMITIVES['error'] =
    new PrimProc('error',
		 1,
		 true, true,
		 function(aState, arg1, args) {
		 	var allArgs = [arg1].concat(args);
		 	check(aState, arg1, function(x) {return isSymbol(x) || isString(x);},
			      'error', 'symbol or string', 1, allArgs);

			if ( isSymbol(arg1) ) {
				if ( args.length === 0 ) {
					raise( types.incompleteExn(types.exnFail, "error: " + arg1.val, []) );
				}
				var formatStr = args.shift();
				check(aState, formatStr, isString, 'error', 'string', 2, allArgs);

				args.unshift(arg1);
				raise( types.incompleteExn(types.exnFail, helpers.format('~s: '+formatStr.toString(), args), []) );
			}
			else {
				var msgBuffer = [arg1.toString()];
				for (var i = 0; i < args.length; i++) {
					msgBuffer.push( types.toWrittenString(args[i]) );
				}
				raise( types.incompleteExn(types.exnFail, msgBuffer.join(''), []) );
			}
		 });


PRIMITIVES['make-exn'] = new PrimProc('make-exn', 2, false, false, function(aState, msg, marks){ return types.exn(msg, marks); } );

PRIMITIVES['exn-message'] =
    new PrimProc('exn-message',
		 1,
		 false, false,
		 function(aState, exn) {
		 	check(aState, exn, types.isExn, 'exn-message', 'exn', 1, [exn]);
			return ''+types.exnMessage(exn);
		 });


PRIMITIVES['exn-continuation-marks'] =
    new PrimProc('exn-continuation-marks',
		 1,
		 false, false,
		 function(aState, exn) {
		 	check(aState, exn, types.isExn, 'exn-continuation-marks', 'exn', 1, [exn]);
			return types.exnContMarks(exn);
		 });


PRIMITIVES['make-exn:fail'] = new PrimProc('make-exn:fail', 2, false, false,
                                           function(aState, msg, marks) { return types.exnFail(msg, marks); });
                                     

PRIMITIVES['make-exn:fail:contract'] = new PrimProc('make-exn:fail:contract', 2, false, false,
                                                    function(aState, msg, marks) { return types.exnFailContract(msg, marks); });


PRIMITIVES['make-exn:fail:contract:division-by-zero'] =
    new PrimProc('make-exn:fail:contract:division-by-zero', 2, false, false,
                 function(aState, msg, marks) { return types.exnFailContractDivisionByZero(msg, marks); });



/***********************
 *** Math Primitives ***
 ***********************/


PRIMITIVES['*'] = 
    new PrimProc('*',
		 0,
		 true, false,
		 function(aState, args) {
		     arrayEach(args, function(x, i) {check(aState, x, isNumber, '*', 'number', i+1, args);});

		     var result = types.rational(1);
		     var i;
		     for(i = 0; i < args.length; i++) {
			  result = jsnums.multiply(args[i], result);
		     }
		     return result;
		 });



PRIMITIVES['-'] = 
    new PrimProc("-",
		 1,
		 true, false,
		 function(aState, x, args) {
		     var allArgs = [x].concat(args);
		     check(aState, x, isNumber, '-', 'number', 1, allArgs);
		     arrayEach(args, function(y, i) {check(aState, y, isNumber, '-', 'number', i+2, allArgs);});

		     if (args.length == 0) { 
			  return jsnums.subtract(0, x);
		     }
		     var result = x;
		     for (var i = 0; i < args.length; i++) {
			  result = jsnums.subtract(result, args[i]);
		     }
		     return result;
		 });


PRIMITIVES['+'] = 
    new PrimProc("+",
		 0,
		 true, false,
		 function(aState, args) {
		     arrayEach(args, function(x, i) {check(aState, x, isNumber, '+', 'number', i+1, args);});

		     if (args.length == 0) { 
			 return 0;
		     }
		     var result = args[0];
		     for (var i = 1; i < args.length; i++) {
			  result = jsnums.add(result, args[i]);
		     }
		     return result;
		 });


PRIMITIVES['='] = 
    new PrimProc("=",
		 2,
		 true, false,
		 function(aState, x, y, args) {
		 	args.unshift(y);
		 	args.unshift(x);
		 	arrayEach(args, function(z, i) {check(aState, z, isNumber, '=', 'number', i+1, args);});

		 	return compare(args, jsnums.equals);
		 });


PRIMITIVES['<>'] = 
    new PrimProc("<>",
		 2,
		 true, false,
		 function(aState, x, y, args) {
		 	args.unshift(y);
		 	args.unshift(x);
		 	arrayEach(args, function(z, i) {check(aState, z, isNumber, '<>', 'number', i+1, args);});

		 	return !compare(args, jsnums.equals);
		 });

PRIMITIVES['=~'] =
    new PrimProc('=~',
		 3,
		 false, false,
		 function(aState, x, y, range) {
		 	check(aState, x, isReal, '=~', 'real', 1, arguments);
			check(aState, y, isReal, '=~', 'real', 2, arguments);
			check(aState, range, isNonNegativeReal, '=~', 'non-negative-real', 3, arguments);

			return jsnums.lessThanOrEqual(jsnums.abs(jsnums.subtract(x, y)), range);
		 });


PRIMITIVES['/'] =
        new PrimProc('/',
		     2,
		     true, false,
		     function(aState, x, y, args) {
		 	 var allArgs = [x, y].concat(args);
		 	 arrayEach(allArgs, 
                                   function(y, i) {
                                       check(aState, y, isNumber, '/', 'number', i+1, allArgs);
                                   });
       		         var handleError = function(offset) {
       			     var i, positionStack, locationList, func, exnMessage;
                             try {
       			         positionStack = 
        			     state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
       			         locationList = positionStack[positionStack.length - 1];
       			         func = locationList.first();
                                 locationList = locationList.rest();
       			         for(i = 0; i < offset; i++) {
       				     locationList = locationList.rest();
       			         }
       			         exnMessage = new types.Message(
                                         [new types.ColoredPart('/', func),
					  ": cannot divide by ",
					  new types.ColoredPart("zero", locationList.first())]);
                             } catch(e) {
       			         exnMessage = new types.Message(["/: cannot divide by zero"]);
                             }
                             raise(types.incompleteExn(
                                 types.exnFailContractDivisionByZero, 
				 exnMessage,
				 []))
       		         };
                         if (jsnums.equals(y, 0)) {
                             handleError(1);
                         }
		 	 var res = jsnums.divide(x, y);		 	 

		 	 for (var i = 0; i < args.length; i++) {
			     if (jsnums.equals(args[i], 0)) {
				 handleError(2+i);
			     }	
			     res = jsnums.divide(res, args[i]);
		 	 }
		 	 return res;
		     });

 

PRIMITIVES['sub1'] =
    new PrimProc("sub1",
		 1,
		 false, false,
		 function(aState, v){ 
	             check(aState, v, isNumber, 'sub1', 'number', 1, arguments);
	             return jsnums.subtract(v, 1);
                 });


PRIMITIVES['add1'] =
    new PrimProc("add1",
		 1,
		 false, false,
		 function(aState, v) {
	             check(aState, v, isNumber, 'add1', 'number', 1, arguments);
	             return jsnums.add(v, 1);
                 });


PRIMITIVES['<'] = 
    new PrimProc('<',
		 2,
		 true, false,
		 function(aState, x, y, args) {
		 	args.unshift(y);
		 	args.unshift(x);
		 	arrayEach(args, function(z, i) {check(aState, z, isNumber, '<', 'number', i+1, args);});

		 	return compare(args, jsnums.lessThan);
		 });


PRIMITIVES['>'] =
    new PrimProc('>',
		 2,
		 true, false,
		 function(aState, x, y, args) {
		 	args.unshift(y);
		 	args.unshift(x);
		 	arrayEach(args, function(z, i) {check(aState, z, isNumber, '>', 'number', i+1, args);});

		 	return compare(args, jsnums.greaterThan);
		 });


PRIMITIVES['<='] = 
    new PrimProc('<=',
		 2,
		 true, false,
		 function(aState, x, y, args) {
		 	args.unshift(y);
		 	args.unshift(x);
		 	arrayEach(args, function(z, i) {check(aState, z, isNumber, '<=', 'number', i+1, args);});

		 	return compare(args, jsnums.lessThanOrEqual);
		 });


PRIMITIVES['>='] =
    new PrimProc('>=',
		 2,
		 true, false,
		 function(aState, x, y, args) {
		 	args.unshift(y);
		 	args.unshift(x);
		 	arrayEach(args, function(z, i) {check(aState, z, isNumber, '>=', 'number', i+1, args);});

		 	return compare(args, jsnums.greaterThanOrEqual);
		 });




PRIMITIVES['abs'] =
    new PrimProc('abs',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isReal, 'abs', 'real', 1);
			return jsnums.abs(x);
		 });


PRIMITIVES['quotient'] =
    new PrimProc('quotient',
		 2,
		 false, false,
		 function(aState, x, y) {
		 	check(aState, x, isInteger, 'quotient', 'integer', 1, arguments);
			check(aState, y, isInteger, 'quotient', 'integer', 2, arguments);

			return jsnums.quotient(x, y);
		 });


PRIMITIVES['remainder'] =
    new PrimProc('remainder',
		 2,
		 false, false,
		 function(aState, x, y) {
		 	check(aState, x, isInteger, 'remainder', 'integer', 1, arguments);
			check(aState, y, isInteger, 'remainder', 'integer', 2, arguments);

			return jsnums.remainder(x, y);
		 });


PRIMITIVES['modulo'] =
    new PrimProc('modulo',
		 2,
		 false, false,
		 function(aState, x, y) {
		 	check(aState, x, isInteger, 'modulo', 'integer', 1, arguments);
			check(aState, y, isInteger, 'modulo', 'integer', 2, arguments);

			return jsnums.modulo(x, y);
		 });


PRIMITIVES['max'] =
    new PrimProc('max',
		 1,
		 true, false,
		 function(aState, x, args) {
			args.unshift(x);
//		 	check(aState, x, isReal, 'max', 'real', 1, allArgs);
			arrayEach(args, function(y, i) {check(aState, y, isReal, 'max', 'real', i+1, args);});

			var curMax = x;
			for (var i = 1; i < args.length; i++) {
				if ( jsnums.greaterThan(args[i], curMax) ) {
					curMax = args[i];
				}
			}
			return curMax;
		 });


PRIMITIVES['min'] =
    new PrimProc('min',
		 1,
		 true, false,
		 function(aState, x, args) {
		 	args.unshift(x);
//		 	check(aState, x, isReal, 'min', 'real', 1);
			arrayEach(args, function(y, i) {check(aState, y, isReal, 'min', 'real', i+1, args);});

			var curMin = x;
			for (var i = 1; i < args.length; i++) {
				if ( jsnums.lessThan(args[i], curMin) ) {
					curMin = args[i];
				}
			}
			return curMin;
		 });


PRIMITIVES['gcd'] =
    new PrimProc('gcd',
		 1,
		 true, false,
		 function(aState, x, args) {
		 	var allArgs = [x].concat(args);
		 	check(aState, x, isInteger, 'gcd', 'integer', 1, allArgs);
		 	arrayEach(args, function(y, i) {check(aState, y, isInteger, 'gcd', 'integer', i+2, allArgs);});

		 	return jsnums.gcd(x, args);
		 });

PRIMITIVES['lcm'] =
    new PrimProc('lcm',
		 1,
		 true, false,
		 function(aState, x, args) {
		 	var allArgs = [x].concat(args);
		 	check(aState, x, isInteger, 'lcm', 'integer', 1, allArgs);
		 	arrayEach(args, function(y, i) {check(aState, y, isInteger, 'lcm', 'integer', i+2, allArgs);});

		 	return jsnums.lcm(x, args);
		 });


PRIMITIVES['floor'] =
    new PrimProc('floor',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isReal, 'floor', 'real', 1);
			return jsnums.floor(x);
		 });


PRIMITIVES['ceiling'] =
    new PrimProc('ceiling',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isReal, 'ceiling', 'real', 1);
			return jsnums.ceiling(x);
		 });


PRIMITIVES['round'] =
    new PrimProc('round',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isReal, 'round', 'real', 1);
			return jsnums.round(x);
		 });


PRIMITIVES['numerator'] =
    new PrimProc('numerator',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isRational, 'numerator', 'rational number', 1);
			return jsnums.numerator(x);
		 });


PRIMITIVES['denominator'] =
    new PrimProc('denominator',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isRational, 'denominator', 'rational number', 1);
			return jsnums.denominator(x);
		 });


PRIMITIVES['expt'] = 
    new PrimProc("expt",
		 2,
		 false, false,
		 function(aState, x, y) {
		 	check(aState, x, isNumber, 'expt', 'number', 1, arguments);
			check(aState, y, isNumber, 'expt', 'number', 2, arguments);
		 	return jsnums.expt(x, y);
		 });


PRIMITIVES['exp'] =
    new PrimProc('exp',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'exp', 'number', 1);
			return jsnums.exp(x);
		 });


PRIMITIVES['log'] =
    new PrimProc('log',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'log', 'number', 1);
			return jsnums.log(x);
		 });


PRIMITIVES['sin'] =
    new PrimProc('sin',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'sin', 'number', 1);
			return jsnums.sin(x);
		 });


PRIMITIVES['cos'] =
    new PrimProc('cos',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'cos', 'number', 1);
			return jsnums.cos(x);
		 });


PRIMITIVES['tan'] =
    new PrimProc('tan',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'tan', 'number', 1);
			return jsnums.tan(x);
		 });


PRIMITIVES['asin'] =
    new PrimProc('asin',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'asin', 'number', 1);
			return jsnums.asin(x);
		 });


PRIMITIVES['acos'] =
    new PrimProc('acos',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'acos', 'number', 1);
			return jsnums.acos(x);
		 });


PRIMITIVES['atan'] =
    new PrimProc('atan',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'atan', 'number', 1);
			return jsnums.atan(x);
		 });


PRIMITIVES['sinh'] =
    new PrimProc('sinh',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'sinh', 'number', 1);
			return jsnums.sinh(x);
		 });


PRIMITIVES['cosh'] =
    new PrimProc('cosh',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'cosh', 'number', 1);
			return jsnums.cosh(x);
		 });


PRIMITIVES['sqr'] =
 new PrimProc('sqr',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'sqr', 'number', 1);
			return jsnums.sqr(x);
		 });


PRIMITIVES['sqrt'] =
    new PrimProc('sqrt',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'sqrt', 'number', 1);
			return jsnums.sqrt(x);
		 });

PRIMITIVES['nth-root'] =
    new PrimProc('nth-root',
		 2,
		 false, false,
		 function(aState, x, r) {
		 	check(aState, x, isNumber, 'nth-root', 'number', 1, arguments);
		 	check(aState, r, isNumber, 'nth-root', 'number', 2, arguments);
			var result = jsnums.expt(x, jsnums.divide(1, r));
			var rounded = jsnums.round(result);
			var diffFromRounded = jsnums.subtract(result, rounded);
			return jsnums.lessThan(diffFromRounded, 0.00000000001)?
				jsnums.toExact(rounded) : result;
		 });

PRIMITIVES['integer-sqrt'] =
    new PrimProc('integer-sqrt',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isInteger, 'integer-sqrt', 'integer', 1);
			return jsnums.integerSqrt(x);
		 });


PRIMITIVES['make-rectangular'] =
    new PrimProc('make-rectangular',
		 2,
		 false, false,
		 function(aState, x, y) {
		 	check(aState, x, isReal, 'make-rectangular', 'real', 1, arguments);
			check(aState, y, isReal, 'make-rectangular', 'real', 2, arguments);
			return types.complex(x, y);
		 });

PRIMITIVES['make-polar'] =
    new PrimProc('make-polar',
		 2,
		 false, false,
		 function(aState, x, y) {
		 	check(aState, x, isReal, 'make-polar', 'real', 1, arguments);
			check(aState, y, isReal, 'make-polar', 'real', 2, arguments);
			return jsnums.makeComplexPolar(x, y);
		 });


PRIMITIVES['real-part'] =
    new PrimProc('real-part',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'real-part', 'number', 1);
			return jsnums.realPart(x);
		 });


PRIMITIVES['imag-part'] =
    new PrimProc('imag-part',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'imag-part', 'number', 1);
			return jsnums.imaginaryPart(x);
		 });


PRIMITIVES['angle'] =
    new PrimProc('angle',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'angle', 'number', 1);
			return jsnums.angle(x);
		 });


PRIMITIVES['magnitude'] =
    new PrimProc('magnitude',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'magnitude', 'number', 1);
			return jsnums.magnitude(x);
		 });


PRIMITIVES['conjugate'] =
    new PrimProc('conjugate',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'conjugate', 'number', 1);
			return jsnums.conjugate(x);
		 });


PRIMITIVES['sgn'] =
    new PrimProc('sgn',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isReal, 'sgn', 'real number', 1);
			if ( jsnums.greaterThan(x, 0) ) {
				return 1;
			}
			else if ( jsnums.lessThan(x, 0) ) {
				return -1;
			}
			else {
				return 0;
			}
		 });


PRIMITIVES['inexact->exact'] =
    new PrimProc('inexact->exact',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'inexact->exact', 'number', 1);
			try {
			        return jsnums.toExact(x);
			} catch(e) {
				raise( types.exnFailContract('inexact->exact: no exact representation for '
							     + types.toWrittenString(x),
							     false) );
			}
		 });


PRIMITIVES['exact->inexact'] =
    new PrimProc('exact->inexact',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'exact->inexact', 'number', 1);
			return jsnums.toInexact(x);
		 });


PRIMITIVES['number->string'] =
    new PrimProc('number->string',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'number->string', 'number', 1);
			return types.string(x+'');
		 });


PRIMITIVES['string->number'] =
    new PrimProc('string->number',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string->number', 'string', 1);
		 	var num = jsnums.fromString(str);		// will be false if it's invalid
			return num? jsnums.toExact(num) : num; 	// make it a number or just return false
		 });


PRIMITIVES['xml->s-exp'] =
    new PrimProc('xml->s-exp',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'xml->s-exp', 'string', 1);
			if (str.length == 0) {
				return types.string('');
			}

			var xmlDoc;
			try {
				//Internet Explorer
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = "false";
				xmlDoc.loadXML(s);
				// FIXME: check parse errors
			}
			catch(e) {
				var parser = new DOMParser();
				xmlDoc = parser.parseFromString(s, "text/xml");
				// FIXME: check parse errors
			}

			var parseAttributes = function(attrs) {
				var result = types.EMPTY;
				for (var i = 0; i < attrs.length; i++) {
					var keyValue = types.cons(types.symbol(attrs.item(i).nodeName),
								  types.cons(attrs.item(i).nodeValue,
									     types.EMPTY));
					result = types.cons(keyValue, result);
				}
				return types.cons(types.symbol("@"), result).reverse();
			};

			var parse = function(node) {
				if (node.nodeType == Node.ELEMENT_NODE) {
					var result = types.EMPTY;
					var child = node.firstChild;
					while (child != null) {
						var nextResult = parse(child);
						if (isString(nextResult) && 
						    !result.isEmpty() &&
						    isString(result.first())) {
							result = types.cons(result.first() + nextResult,
									    result.rest());
						} else {
							result = types.cons(nextResult, result);
						}
						child = child.nextSibling;
					}
					result = result.reverse();
					result = types.cons(parseAttributes(node.attributes),
							    result);
					result = types.cons(
						types.symbol(node.nodeName),
						result);
					return result;
				} else if (node.nodeType == Node.TEXT_NODE) {
					return node.textContent;
				} else if (node.nodeType == Node.CDATA_SECTION_NODE) {
					return node.data;
				} else {
					return types.EMPTY;
				}
			};
			return parse(xmlDoc.firstChild);
		 });




/******************
 *** Predicates ***
 ******************/

PRIMITIVES['procedure?'] = new PrimProc('procedure?', 1, false, false, 
                                        function(aState, v) { return isFunction(v); });

PRIMITIVES['pair?'] = new PrimProc('pair?', 1, false, false, 
                                   function(aState, v) { return isPair(v); } );
PRIMITIVES['cons?'] = new PrimProc('cons?', 1, false, false, 
                                   function(aState, v) { return isPair(v); });
PRIMITIVES['empty?'] = new PrimProc('empty?', 1, false, false,
                                    function(aState, v) { return isEmpty(v); });
PRIMITIVES['null?'] = new PrimProc('null?', 1, false, false,
                                   function(aState, v) { return isEmpty(v); });

PRIMITIVES['undefined?'] = new PrimProc('undefined?', 1, false, false, function(aState, x) { return x === types.UNDEFINED; });
PRIMITIVES['void?'] = new PrimProc('void?', 1, false, false, function(aState, x) { return x === types.VOID; });

PRIMITIVES['symbol?'] = new PrimProc('symbol?', 1, false, false, 
                                     function(aState, v) { return isSymbol(v); });
PRIMITIVES['string?'] = new PrimProc('string?', 1, false, false,
                                     function(aState, v) { return isString(v); });
PRIMITIVES['char?'] = new PrimProc('char?', 1, false, false, 
                                   function(aState, v){ return isChar(v); });
PRIMITIVES['boolean?'] = new PrimProc('boolean?', 1, false, false, 
                                      function(aState, v){ return isBoolean(v); });
PRIMITIVES['vector?'] = new PrimProc('vector?', 1, false, false,
                                     function(aState, v) { return isVector(v); });
PRIMITIVES['struct?'] = new PrimProc('struct?', 1, false, false, 
                                     function(aState, v) { return types.isStruct(v); });
PRIMITIVES['eof-object?'] = new PrimProc('eof-object?', 1, false, false,
                                         function(aState, x) { return x === types.EOF; });
PRIMITIVES['color?'] = new PrimProc('color?', 1, false, false,
                                    function(aState, v){ return types.isColor(v); });
PRIMITIVES['posn?'] = new PrimProc('posn?', 1, false, false,
                                   function(aState, v){ return types.isPosn(v); });
PRIMITIVES['bytes?'] = new PrimProc('bytes?', 1, false, false, 
                                    function(aState, v){ return isByteString(v); });
PRIMITIVES['byte?'] = new PrimProc('byte?', 1, false, false,
                                   function(aState, v) { return isByte(v); });

PRIMITIVES['number?'] = new PrimProc('number?', 1, false, false, 
                                     function(aState, v) { return isNumber(v); });
PRIMITIVES['complex?'] = new PrimProc('complex?', 1, false, false, 
                                      function(aState, v) { return isComplex(v); });
PRIMITIVES['real?'] = new PrimProc('real?', 1, false, false,
                                   function(aState, v) { return isReal(v); });
PRIMITIVES['rational?'] = new PrimProc('rational?', 1, false, false, 
                                       function(aState, v) { return isRational(v); });
PRIMITIVES['integer?'] = new PrimProc('integer?', 1, false, false, 
                                      function(aState, v) { return isInteger(v); });

PRIMITIVES['exact?'] =
    new PrimProc('exact?', 1, false, false,
		 function(aState, x) {
			check(aState, x, isNumber, 'exact?', 'number', 1);
			return jsnums.isExact(x);
		 });
PRIMITIVES['inexact?'] =
    new PrimProc('inexact?', 1, false, false,
		 function(aState, x) {
			check(aState, x, isNumber, 'inexact?', 'number', 1);
			return jsnums.isInexact(x);
		 });

PRIMITIVES['odd?'] =
    new PrimProc('odd?',
		 1,
		 false, false,
		 function(aState, x) {
			check(aState, x, isInteger, 'odd?', 'integer', 1);
			return jsnums.equals(jsnums.modulo(x, 2), 1);
		 });
PRIMITIVES['even?'] =
    new PrimProc('even?',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isInteger, 'even?', 'integer', 1);
			return jsnums.equals(jsnums.modulo(x, 2), 0);
		 });

PRIMITIVES['zero?'] =
    new PrimProc("zero?",
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isNumber, 'zero?', 'number', 1);
		     return jsnums.equals(0, x)
		 });

PRIMITIVES['positive?'] =
    new PrimProc('positive?',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isReal, 'positive?', 'real', 1);
			return jsnums.greaterThan(x, 0);
		 });
PRIMITIVES['negative?'] =
    new PrimProc('negative?',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, isReal, 'negative?', 'real', 1);
			return jsnums.lessThan(x, 0);
		 });

PRIMITIVES['box?'] = new PrimProc('box?', 1, false, false, 
                                  function(aState, v) { return isBox(v); });

PRIMITIVES['hash?'] = new PrimProc('hash?', 1, false, false,
                                   function(aState, v) { return isHash(v); });


PRIMITIVES['eq?'] = new PrimProc('eq?', 2, false, false, 
                                 function(aState, x, y) { return isEq(x, y); } );
PRIMITIVES['eqv?'] = new PrimProc('eqv?', 2, false, false, 
                                  function(aState, x, y) { return isEqv(x, y); });
PRIMITIVES['equal?'] = new PrimProc('equal?', 2, false, false, 
                                    function(aState, x, y) { return isEqual(x, y); });
PRIMITIVES['equal~?'] =
    new PrimProc('equal~?',
		 3,
		 false, false,
		 function(aState, x, y, range) {
		 	check(aState, range, isNonNegativeReal, 'equal~?', 'non-negative number', 3, arguments);

			return (isEqual(x, y) ||
				(isReal(x) && isReal(y) &&
				 jsnums.lessThanOrEqual(jsnums.abs(jsnums.subtract(x, y)), range)));
		 });


PRIMITIVES['false?'] = new PrimProc('false?', 1, false, false, function(aState, x) { return x === false; });
PRIMITIVES['boolean=?'] =
    new PrimProc('boolean=?',
		 2,
		 false, false,
		 function(aState, x, y) {
		 	check(aState, x, isBoolean, 'boolean=?', 'boolean', 1, arguments);
			check(aState, y, isBoolean, 'boolean=?', 'boolean', 2, arguments);
  		        return (x === y);
		 });

PRIMITIVES['symbol=?'] =
    new PrimProc('symbol=?',
		 2,
		 false, false,
		 function(aState, x, y) {
		 	check(aState, x, isSymbol, 'symbol=?', 'symbol', 1, arguments);
			check(aState, y, isSymbol, 'symbol=?', 'symbol', 2, arguments);
			return isEqual(x, y);
		 });


PRIMITIVES['js-object?'] = new PrimProc('js-object?', 1, false, false, 
                                        function(aState, v) { return isJsObject(v); });


/***********************
 *** List Primitives ***
 ***********************/

PRIMITIVES['cons'] =
    new PrimProc('cons',
		 2,
		 false, false,
		 function(aState, f, r) {
//		 	checkList(aState, r, "cons", 2);
		 	return types.cons(f, r);
		 });


PRIMITIVES['car'] =
    new PrimProc('car',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, isPair, 'car', 'pair', 1);
			return lst.first();
		 });

PRIMITIVES['cdr'] =
    new PrimProc('cdr',
		 1,
		 false, false,
		 function(aState, lst) {
			check(aState, lst, isPair, 'cdr', 'pair', 1);
			return lst.rest();
		 });

PRIMITIVES['caar'] =
    new PrimProc('caar',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return (isPair(x) && isPair(x.first())); },
			      'caar', 'caarable value', 1);
		 	return lst.first().first();
		 });

PRIMITIVES['cadr'] =
    new PrimProc('cadr',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return isPair(x) && isPair(x.rest()); },
			      'cadr', 'cadrable value', 1);
			return lst.rest().first();
		 });

PRIMITIVES['cdar'] =
    new PrimProc('cdar',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return isPair(x) && isPair(x.first()); },
			      'cdar', 'cdarable value', 1);
		 	return lst.first().rest();
		 });

PRIMITIVES['cddr'] =
    new PrimProc('cddr',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return isPair(x) && isPair(x.rest()); },
			      'cddr', 'cddrable value', 1);
		 	return lst.rest().rest();
		 });

PRIMITIVES['caaar'] =
    new PrimProc('caaar',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return ( isPair(x) &&
							  isPair(x.first()) &&
							  isPair(x.first().first()) ); },
			      'caaar', 'caaarable value', 1);
		 	return lst.first().first().first();
		 });

PRIMITIVES['caadr'] =
    new PrimProc('caadr',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return ( isPair(x) &&
							  isPair(x.rest()) &&
							  isPair(x.rest().first()) ); },
			      'caadr', 'caadrable value', 1);
		 	return lst.rest().first().first();
		 });

PRIMITIVES['cadar'] =
    new PrimProc('cadar',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return ( isPair(x) &&
							  isPair(x.first()) &&
							  isPair(x.first().rest()) ); },
			      'cadar', 'cadarable value', 1);
		 	return lst.first().rest().first();
		 });

PRIMITIVES['cdaar'] =
    new PrimProc('cdaar',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return ( isPair(x) &&
							  isPair(x.first()) &&
							  isPair(x.first().first()) ); },
			      'cdaar', 'cdaarable value', 1);
		 	return lst.first().first().rest();
		 });

PRIMITIVES['cdadr'] =
    new PrimProc('cdadr',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return ( isPair(x) &&
							  isPair(x.rest()) &&
							  isPair(x.rest().first()) ); },
			      'cdadr', 'cdadrable value', 1);
		 	return lst.rest().first().rest();
		 });

PRIMITIVES['cddar'] =
    new PrimProc('cddar',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return ( isPair(x) &&
							  isPair(x.first()) &&
							  isPair(x.first().rest()) ); },
			      'cddar', 'cddarable value', 1);
		 	return lst.first().rest().rest();
		 });

PRIMITIVES['caddr'] =
    new PrimProc('caddr',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return ( isPair(x) &&
							  isPair(x.rest()) &&
							  isPair(x.rest().rest()) ); },
			      'caddr', 'caddrable value', 1);
		 	return lst.rest().rest().first();
		 });

PRIMITIVES['cdddr'] =
    new PrimProc('cdddr',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return ( isPair(x) &&
							  isPair(x.rest()) &&
							  isPair(x.rest().rest()) ); },
			      'cdddr', 'cdddrable value', 1);
		 	return lst.rest().rest().rest();
		 });

PRIMITIVES['cadddr'] =
    new PrimProc('cadddr',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return ( isPair(x) &&
							  isPair(x.rest()) &&
							  isPair(x.rest().rest()) &&
				       			  isPair(x.rest().rest().rest()) ); },
			      'cadddr', 'cadddrable value', 1);
		 	return lst.rest().rest().rest().first();
		 });


PRIMITIVES['rest'] =
    new PrimProc('rest',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return isList(x) && !isEmpty(x); },
			      'rest', 'non-empty list', 1);
			return lst.rest();
		 });

PRIMITIVES['first'] =
    new PrimProc('first',
		 1,
		 false, false,
		 function(aState, lst) {
		 	check(aState, lst, function(x) { return isList(x) && !isEmpty(x); },
			      'first', 'non-empty list', 1);
			return lst.first();
		 });

PRIMITIVES['second'] =
    new PrimProc('second',
		 1,
		 false, false,
		 function(aState, lst) {
			checkListOfLength(aState, lst, 2, 'second', 1);
			return lst.rest().first();
		 });

PRIMITIVES['third'] =
    new PrimProc('third',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkListOfLength(aState, lst, 3, 'third', 1);
			return lst.rest().rest().first();
		 });

PRIMITIVES['fourth'] =
    new PrimProc('fourth',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkListOfLength(aState, lst, 4, 'fourth', 1);
			return lst.rest().rest().rest().first();
		 });

PRIMITIVES['fifth'] =
    new PrimProc('fifth',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkListOfLength(aState, lst, 5, 'fifth', 1);
		 	return lst.rest().rest().rest().rest().first();
		 });

PRIMITIVES['sixth'] =
    new PrimProc('sixth',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkListOfLength(aState, lst, 6, 'sixth', 1);
		 	return lst.rest().rest().rest().rest().rest().first();
		 });

PRIMITIVES['seventh'] =
    new PrimProc(
		 'seventh',
		 1,
		 false, false,
 	         function(aState, lst) {
		 	checkListOfLength(aState, lst, 7, 'seventh', 1);
		 	return lst.rest().rest().rest().rest().rest().rest().first();
		 });

PRIMITIVES['eighth'] =
    new PrimProc('eighth',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkListOfLength(aState, lst, 8, 'eighth', 1);
		 	return lst.rest().rest().rest().rest().rest().rest().rest().first();
		 });


PRIMITIVES['length'] =
    new PrimProc('length',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkList(aState, lst, 'length', 1, arguments);
		  	return jsnums.makeRational(length(lst));
		 });


PRIMITIVES['list?'] = new PrimProc('list?', 1, false, false,
                                   function(aState, v) { return isList(v); });


PRIMITIVES['list'] =
    new PrimProc('list',
		 0,
		 true, false,
		 function(aState, v) { return types.list(v); });


PRIMITIVES['make-list'] =
    new PrimProc('make-list',
		 2,
		 false, false,
		 function(aState, i, v) {
			check(aState, i, isNatural, 'make-list', 'non-negative exact integer', 1, arguments);
			var values = [];
			for(var x = 0; x<i; x++){ values.push(v); }
			return types.list(values);
		 });

PRIMITIVES['range'] =
    new PrimProc('range',
		 3,
		 false, false,
		 function(aState, start, end, step) {
	        check(aState, start, isNumber, 'range', 'number', 1, arguments);
	        check(aState, end,   isNumber, 'range', 'number', 2, arguments);
	        check(aState, step,  isNumber, 'range', 'number', 3, arguments);
        
        var values = [];
    	// if we'll eventually count up, do so
        if(jsnums.lessThan(start, end) && jsnums.greaterThan(step, 0)) { 
        	for(var i=start; jsnums.lessThanOrEqual(i, end); i=jsnums.add(i, step)) { values.push(i); }
		// if we'll eventually count down, do so
		} else if(jsnums.greaterThan(start, end) && jsnums.lessThan(step, 0)) { 
        	for(var i=start; jsnums.greaterThanOrEqual(i,end); i=jsnums.add(i,step)) { values.push(i); }
        }
        // return the constructed list, or the empty list if neither condition was met
        return types.list(values);
    });


PRIMITIVES['list*'] =
    new PrimProc('list*',
		 1,
		 true, false,
		 function(aState, items, otherItems) {
		 	var allArgs = [items].concat(otherItems);
		 	if (otherItems.length == 0) {
				return items;
			}
		 
		 	var lastListItem = otherItems.pop();
		 	checkList(aState, lastListItem, 'list*', otherItems.length+2, allArgs);

		 	otherItems.unshift(items);
		 	return append(aState, [types.list(otherItems), lastListItem]);
		 });


PRIMITIVES['list-ref'] =
    new PrimProc('list-ref',
		 2,
		 false, false,
		 function(aState, origList, num) {
		 	checkList(aState, origList, 'list-ref', 1, arguments);
		 	check(aState, num, isNatural, 'list-ref', 'non-negative exact integer', 2, arguments);

		 	var positionStack = 
        		state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
        
       
       		  var locationList = positionStack[positionStack.length - 1];

			var lst = origList;
			var n = jsnums.toFixnum(num);
		 	for (var i = 0; i < n; i++) {
		 		if (lst.isEmpty() || lst.rest().isEmpty()) { //fixing off by one error
					/*var msg = ('list-ref: index ' + n +
						   ' is too large for list: ' +
						   types.toWrittenString(origList));*/
					raise( types.incompleteExn(types.exnFailContract, 
												new types.Message([
													new types.ColoredPart('list-ref', locationList.first()),
													": index ",
													new types.ColoredPart(n, locationList.rest().rest().first()) ,
													' is too large for list: ',
													new types.ColoredPart(types.toWrittenString(origList), locationList.rest().first())]), 
												[]) );
		 		}
	  			lst = lst.rest();
		 	}
		        return lst.first();
		 });
///////////////////////////////////////
PRIMITIVES['list-tail'] =
    new PrimProc('list-tail',
		 2,
		 false, false,
		 function(aState, lst, num) {
		 	checkList(aState, lst, 'list-tail', 1, arguments);
			check(aState, x, isNatural, 'list-tail', 'non-negative exact integer', 2, arguments);

			var lst = origList;
			var n = jsnums.toFixnum(num);
		 	for (var i = 0; i < n; i++) {
				if (lst.isEmpty()) {
					var msg = ('list-tail: index ' + n +
						   ' is too large for list: ' +
						   types.toWrittenString(origList));
					raise( types.incompleteExn(types.exnFailContract, msg, []) );
				}
				lst = lst.rest();
			}
			return lst;
		 });


PRIMITIVES['append'] =
    new PrimProc('append',
		 0,
		 true, false,
		 function(aState, args) { return append(aState, args); });


PRIMITIVES['reverse'] =
    new PrimProc('reverse',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkList(aState, lst, 'reverse', 1);
		 	return lst.reverse();
		 });


PRIMITIVES['map'] =
    new PrimProc('map',
		 2,
		 true, false,
		 function(aState, f, lst, arglists) {
		 	var allArgs = [f, lst].concat(arglists);
		 	arglists.unshift(lst);
		 	check(aState, f, isFunction, 'map', 'function', 1, allArgs);
		 	arrayEach(arglists, function(x, i) {checkList(aState, x, 'map', i+2, allArgs);});
			checkAllSameLength(aState, arglists, 'map', allArgs);

			var mapHelp = function(f, args, acc) {
				if (args[0].isEmpty()) {
				    return acc.reverse();
				}
				
				var argsFirst = [];
				var argsRest = [];
				for (var i = 0; i < args.length; i++) {
					argsFirst.push(args[i].first());
					argsRest.push(args[i].rest());
				}
				var result = CALL(f, argsFirst,
					function(result) {
						return mapHelp(f, argsRest, types.cons(result, acc));
					});
				return result;
			}
			return mapHelp(f, arglists, types.EMPTY);
		});


PRIMITIVES['andmap'] =
    new PrimProc('andmap',
		 2,
		 true, false,
		 function(aState, f, lst, arglists) {
		 	var allArgs = [f, lst].concat(arglists);
		 	arglists.unshift(lst);
		  	check(aState, f, isFunction, 'andmap', 'function', 1, allArgs);
		  	arrayEach(arglists, function(x, i) {checkList(aState, x, 'andmap', i+2, allArgs);});
			checkAllSameLength(aState, arglists, 'andmap', allArgs);
  
			var andmapHelp = function(f, args) {
				if ( args[0].isEmpty() ) {
					return true;
				}

				var argsFirst = [];
				var argsRest = [];
				for (var i = 0; i < args.length; i++) {
					argsFirst.push(args[i].first());
					argsRest.push(args[i].rest());
				}

				return CALL(f, argsFirst,
					function(result) {
						return result && andmapHelp(f, argsRest);
					});
			}
			return andmapHelp(f, arglists);
		 });


PRIMITIVES['ormap'] =
    new PrimProc('ormap',
		 2,
		 true, false,
		 function(aState, f, lst, arglists) {
		 	var allArgs = [f, lst].concat(arglists);
		 	arglists.unshift(lst);
		  	check(aState, f, isFunction, 'ormap', 'function', 1, allArgs);
		  	arrayEach(arglists, function(x, i) {checkList(aState, x, 'ormap', i+2, allArgs);});
			checkAllSameLength(aState, arglists, 'ormap', allArgs);

			var ormapHelp = function(f, args) {
				if ( args[0].isEmpty() ) {
					return false;
				}

				var argsFirst = [];
				var argsRest = [];
				for (var i = 0; i < args.length; i++) {
					argsFirst.push(args[i].first());
					argsRest.push(args[i].rest());
				}

				return CALL(f, argsFirst,
					function(result) {
						return result || ormapHelp(f, argsRest);
					});
			}
			return ormapHelp(f, arglists);
		});


PRIMITIVES['memq'] =
    new PrimProc('memq',
		 2,
		 false, false,
		 function(aState, item, lst) {
		 	checkList(aState, lst, 'memq', 2, arguments);
			while ( !lst.isEmpty() ) {
				if ( isEq(item, lst.first()) ) {
					return lst;
				}
				lst = lst.rest();
			}
			return false;
		 });


PRIMITIVES['memv'] =
    new PrimProc('memv',
		 2,
		 false, false,
		 function(aState, item, lst) {
		 	checkList(aState, lst, 'memv', 2, arguments);
			while ( !lst.isEmpty() ) {
				if ( isEqv(item, lst.first()) ) {
					return lst;
				}
				lst = lst.rest();
			}
			return false;
		 });


PRIMITIVES['member'] =
    new PrimProc('member',
		 2,
		 false, false,
		 function(aState, item, lst) {
		 	checkList(aState, lst, 'member', 2, arguments);
		 	while ( !lst.isEmpty() ) {
		 		if ( isEqual(item, lst.first()) ) {
		 			return lst;
		 		}
		 		lst = lst.rest();
		 	}
		 	return false;
		 });

PRIMITIVES['member?'] =
    new PrimProc('member?',
		 2,
		 false, false,
		 function(aState, item, lst) {
		 	checkList(aState, lst, 'member?', 2, arguments);
		 	while ( !lst.isEmpty() ) {
		 		if ( isEqual(item, lst.first()) ) {
		 			return true;
		 		}
		 		lst = lst.rest();
		 	}
		 	return false;
		 });


PRIMITIVES['memf'] =
    new PrimProc('memf',
		 2,
		 false, true,
		 function(aState, f, initList) {
		 	check(aState, f, isFunction, 'memf', 'function', 1, arguments);
			checkList(aState, initList, 'memf', 2, arguments);

			var memfHelp = function(lst) {
				if ( lst.isEmpty() ) {
					return false;
				}

				return CALL(f, [lst.first()],
					function(result) {
						if (result) {
							return lst;
						}
						return memfHelp(lst.rest());
					});
			}
			return memfHelp(initList);
		 });


PRIMITIVES['assq'] =
    new PrimProc('assq',
		 2,
		 false, false,
		 function(aState, item, lst) {
		 	checkListOf(aState, lst, isPair, 'assq', 'pair', 2, arguments);
			while ( !lst.isEmpty() ) {
				if ( isEq(item, lst.first().first()) ) {
					return lst.first();
				}
				lst = lst.rest();
			}
			return false;
		 });


PRIMITIVES['assv'] =
    new PrimProc('assv',
		 2,
		 false, false,
		 function(aState, item, lst) {
		 	checkListOf(aState, lst, isPair, 'assv', 'pair', 2, arguments);
			while ( !lst.isEmpty() ) {
				if ( isEqv(item, lst.first().first()) ) {
					return lst.first();
				}
				lst = lst.rest();
			}
			return false;
		 });


PRIMITIVES['assoc'] =
    new PrimProc('assoc',
		 2,
		 false, false,
		 function(aState, item, lst) {
		 	checkListOf(aState, lst, isPair, 'assoc', 'pair', 2, arguments);
			while ( !lst.isEmpty() ) {
				if ( isEqual(item, lst.first().first()) ) {
					return lst.first();
				}
				lst = lst.rest();
			}
			return false;
		 });


PRIMITIVES['remove'] =
    new PrimProc('remove',
		 2,
		 false, false,
		 function(aState, item, lst) {
		 	checkList(aState, lst, 'remove', 2, arguments);
		 	var originalLst = lst;
		 	var result = types.EMPTY;
		 	while ( !lst.isEmpty() ) {
		 		if ( isEqual(item, lst.first()) ) {
		 			return append(aState, [result.reverse(), lst.rest()]);
		 		} else {
		 			result = types.cons(lst.first(), result);
		 			lst = lst.rest();
		 		}
		 	}
		 	return originalLst;
		 });

PRIMITIVES['remove-all'] =
new PrimProc('remove-all',
	 2,
	 false, false,
	 function(aState, item, lst) {
	 	checkList(aState, lst, 'remove-all', 2, arguments);
	 	var originalLst = lst;
	 	var result = types.EMPTY;
	 	while ( !lst.isEmpty() ) {
	 		if (!isEqual(item, lst.first())){
	 			result = types.cons(lst.first(), result);
	 		}
	 		lst = lst.rest();
	 	}
	 	return result.reverse();
	 });


PRIMITIVES['filter'] =
    new PrimProc('filter',
		 2,
		 false, false,
		 function(aState, f, lst) {
		 	check(aState, f, procArityContains(1), 'filter', 'function (arity 1)', 1, arguments);
			checkList(aState, lst, 'filter', 2);

			var filterHelp = function(f, lst, acc) {
				if ( lst.isEmpty() ) {
					return acc.reverse();
				}

				return CALL(f, [lst.first()],
					function(result) {
						if (result) {
							return filterHelp(f, lst.rest(),
								types.cons(lst.first(), acc));
						}
						else {
							return filterHelp(f, lst.rest(), acc);
						}
					});
			}
			return filterHelp(f, lst, types.EMPTY);
		 });

PRIMITIVES['foldl'] =
    new PrimProc('foldl',
		 3,
		 true, false,
		 function(aState, f, initAcc, lst, arglists) {
		 	arglists.unshift(lst);
			var allArgs = [f, initAcc].concat(arglists);
		 	check(aState, f, isFunction, 'foldl', 'function', 1, allArgs);
			arrayEach(arglists, function(x, i) {checkList(aState, x, 'foldl', i+3, allArgs);});
			checkAllSameLength(aState, arglists, 'foldl', allArgs);
	
			return foldHelp(f, initAcc, arglists);
		});

PRIMITIVES['foldr'] =
    new PrimProc('foldr',
		 3,
		 true, false,
		 function(aState, f, initAcc, lst, arglists) {
		 	arglists.unshift(lst);
			var allArgs = [f, initAcc].concat(arglists);
		 	check(aState, f, isFunction, 'foldr', 'function', 1, allArgs);
			arrayEach(arglists, function(x, i) {checkList(aState, x, 'foldr', i+3, allArgs);});
			checkAllSameLength(aState, arglists, 'foldr', allArgs);

			for (var i = 0; i < arglists.length; i++) {
				arglists[i] = arglists[i].reverse();
			}
			
			return foldHelp(f, initAcc, arglists);
		});


PRIMITIVES['quicksort'] = new PrimProc('quicksort', 2, false, false, quicksort('quicksort'));
PRIMITIVES['sort'] = new PrimProc('sort', 2, false, false, quicksort('sort'));



PRIMITIVES['argmax'] =
    new PrimProc('argmax',
		 2,
		 false, false,
		 function(aState, f, initList) {
		 	var args = arguments
		 	check(aState, f, isFunction, 'argmax', 'function', 1, args);
			check(aState, initList, isPair, 'argmax', 'non-empty list', 2, args);

			var argmaxHelp = function(lst, curMaxVal, curMaxElt) {
				if ( lst.isEmpty() ) {
					return curMaxElt;
				}

				return CALL(f, [lst.first()],
					function(result) {
						check(aState, result, isReal, 'argmax',
						      'procedure that returns real numbers', 1, args);
						if (jsnums.greaterThan(result, curMaxVal)) {
							return argmaxHelp(lst.rest(), result, lst.first());
						}
						else {
							return argmaxHelp(lst.rest(), curMaxVal, curMaxElt);
						}
					});
			}
			return CALL(f, [initList.first()],
				function(result) {
					check(aState, result, isReal, 'argmax', 'procedure that returns real numbers', 1, args);
					return argmaxHelp(initList.rest(), result, initList.first());
				});
		 });


PRIMITIVES['argmin'] =
    new PrimProc('argmin',
		 2,
		 false, false,
		 function(aState, f, initList) {
		 	var args = arguments;
		 	check(aState, f, isFunction, 'argmin', 'function', 1, args);
			check(aState, initList, isPair, 'argmin', 'non-empty list', 2, args);

			var argminHelp = function(lst, curMaxVal, curMaxElt) {
				if ( lst.isEmpty() ) {
					return curMaxElt;
				}

				return CALL(f, [lst.first()],
					function(result) {
						check(aState, result, isReal, 'argmin',
						      'procedure that returns real numbers', 1, args);
						if (jsnums.lessThan(result, curMaxVal)) {
							return argminHelp(lst.rest(), result, lst.first());
						}
						else {
							return argminHelp(lst.rest(), curMaxVal, curMaxElt);
						}
					});
			}
			return CALL(f, [initList.first()],
				function(result) {
					check(aState, result, isReal, 'argmin', 'procedure that returns real numbers', 1, args);
					return argminHelp(initList.rest(), result, initList.first());
				});
		 });


PRIMITIVES['build-list'] =
    new PrimProc('build-list',
		 2,
		 false, false,
		 function(aState, num, f) {
		 	check(aState, num, isNatural, 'build-list', 'non-negative exact integer', 1, arguments);
			check(aState, f, isFunction, 'build-list', 'function', 2, arguments);

			var buildListHelp = function(n, acc) {
				if ( jsnums.greaterThanOrEqual(n, num) ) {
					return acc.reverse();
				}

				return CALL(f, [n],
					function (result) {
						return buildListHelp(n+1, types.cons(result, acc));
					});
			}
			return buildListHelp(0, types.EMPTY);
		 }); 


/**********************
 *** Box Primitives ***
 **********************/


PRIMITIVES['box'] = new PrimProc('box', 1, false, false, 
                                 function(aState, v) { return types.box(v); });

PRIMITIVES['box-immutable'] = new PrimProc('box-immutable', 1, false, false,
                                           function(aState, v) { return types.boxImmutable(v); });

PRIMITIVES['unbox'] =
    new PrimProc('unbox',
		 1,
		 false, false,
		 function(aState, box) {
		 	check(aState, box, isBox, 'unbox', 'box', 1);
			return box.unbox();
		 });


PRIMITIVES['set-box!'] =
    new PrimProc('set-box!',
		 2,
		 false, false,
		 function(aState, box, newVal) {
		 	check(aState, box, function(x) { return isBox(x) && x.mutable; }, 'set-box!', 'mutable box', 1, arguments);
			box.set(newVal);
			return types.VOID;
		 });



/****************************
 *** Hashtable Primitives ***
 ****************************/


PRIMITIVES['make-hash'] =
	new CasePrimitive('make-hash', 
	[new PrimProc('make-hash', 0, false, false, function() { return types.hash(types.EMPTY); }),
	 new PrimProc('make-hash',
		      1,
		      false, false,
		      function(aState, lst) {
			  checkListOf(aState, lst, isPair, 'make-hash', 'list of pairs', 1);
			  return types.hash(lst);
		      }) ]);

PRIMITIVES['make-hasheq'] =
	new CasePrimitive('make-hasheq',
        [new PrimProc('make-hasheq', 0, false, false, function(aState) { return types.hashEq(types.EMPTY); }),
	 new PrimProc('make-hasheq',
		      1,
		      false, false,
		      function(aState, lst) {
			  checkListOf(aState, lst, isPair, 'make-hasheq', 'list of pairs', 1);
			  return types.hashEq(lst);
		      }) ]);

PRIMITIVES['hash-set!'] =
    new PrimProc('hash-set!',
		 3,
		 false, false,
		 function(aState, obj, key, val) {
		 	check(aState, obj, isHash, 'hash-set!', 'hash', 1, arguments);
			obj.hash.put(key, val);
			return types.VOID;
		 });

PRIMITIVES['hash-ref'] =
	new CasePrimitive('hash-ref',
	[new PrimProc('hash-ref',
		      2,
		      false, false,
		      function(aState, obj, key) {
			  check(aState, obj, isHash, 'hash-ref', 'hash', 1, arguments);

			  if ( !obj.hash.containsKey(key) ) {
			  	//var msg = 'hash-ref: no value found for key: ' + types.toWrittenString(key);
			  	var positionStack = 
					state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
			    var locationList = positionStack[positionStack.length - 1];

			  	raise( types.incompleteExn(types.exnFailContract, 
			  		new types.Message([new types.ColoredPart("hash-ref", locationList.first()),
			  							": no value found for key ",
			  							new types.ColoredPart(types.toWrittenString(key), locationList.rest().rest().first())]), 
			  		[]) );
			  }
			  return obj.hash.get(key);
		      }),
	 new PrimProc('hash-ref',
		      3,
		      false, false,
		      function(aState, obj, key, defaultVal) {
			  check(aState, obj, isHash, 'hash-ref', 'hash', 1, arguments);

			  if (obj.hash.containsKey(key)) {
				return obj.hash.get(key);
			  }
			  else {
				if (isFunction(defaultVal)) {
					//window.call = CALL;
					return CALL(defaultVal, [], id);
				}
				return defaultVal;
			  }
		      })]);

PRIMITIVES['hash-remove!'] =
    new PrimProc('hash-remove',
		 2,
		 false, false,
		 function(aState, obj, key) {
		 	check(aState, obj, isHash, 'hash-remove!', 'hash', 1, arguments);
			obj.hash.remove(key);
			return types.VOID;
		 });

PRIMITIVES['hash-map'] =
    new PrimProc('hash-map',
		 2,
		 false, false,
		 function(aState, ht, f) {
		 	check(aState, ht, isHash, 'hash-map', 'hash', 1, arguments);
			check(aState, f, isFunction, 'hash-map', 'function', 2, arguments);
			
			var keys = ht.hash.keys();
			var hashMapHelp = function(i, acc) {
				if (i >= keys.length) {
					return acc;
				}

				var val = ht.hash.get(keys[i]);
				return CALL(f, [keys[i], val],
					function(result) {
						return hashMapHelp(i+1, types.cons(result, acc));
					});
			}
			return hashMapHelp(0, types.EMPTY);
		 });


PRIMITIVES['hash-for-each'] =
    new PrimProc('hash-for-each',
		 2,
		 false, false,
		 function(aState, ht, f) {
		 	check(aState, ht, isHash, 'hash-for-each', 'hash', 1, arguments);
			check(aState, f, isFunction, 'hash-for-each', 'function', 2, arguments);
		     
		 	var keys = ht.hash.keys();

		 	var hashForEachHelp = function(i) {
		 		if (i >= keys.length) {
					return types.VOID;
				}

				var val = ht.hash.get(keys[i]);
				return CALL(f, [keys[i], val],
					function(result) {
						return hashForEachHelp(i+1);
					});
			}
			return hashForEachHelp(0);
		 });



/*************************
 *** String Primitives ***
 *************************/


PRIMITIVES['make-string'] =
    new PrimProc('make-string',
		 2,
		 false, false,
		 function(aState, n, c) {
		 	check(aState, n, isNatural, 'make-string', 'non-negative exact integer', 1, arguments);
			check(aState, c, isChar, 'make-string', 'character', 2, arguments);

			var ret = [];
			for (var i = 0; jsnums.lessThan(i, n); i++) {
				ret.push(c.val);
			}
			return types.string(ret);
		 });


PRIMITIVES['replicate'] =
    new PrimProc('replicate',
		 2,
		 false, false,
		 function(aState, n, str) {
		 	check(aState, n, isNatural, 'replicate', 'non-negative exact integer', 1, arguments);
			check(aState, str, isString, 'replicate', 'string', 2, arguments);

			var ret = "";
			var primStr = str.toString();
			for (var i = 0; jsnums.lessThan(i, n); i++) {
				ret += primStr;
			}
			return types.string(ret);
		 });


PRIMITIVES['string'] =
    new PrimProc('string',
		 0,
		 true, false,
		 function(aState, chars) {
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'string', 'character', i+1, chars);});

			var ret = [];
			for (var i = 0; i < chars.length; i++) {
				ret.push(chars[i].val);
			}
			return types.string(ret);
		 });


PRIMITIVES['string-length'] =
    new PrimProc('string-length', 1, false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string-length', 'string', 1);
			return str.length;
		 });

PRIMITIVES['string-contains?'] =
    new PrimProc('string-contains?', 2, false, false,
		 function(aState, str, search) {
		 	check(aState, str, isString, 'string-contains?', 'string', 1);
		 	check(aState, search, isString, 'string-contains?', 'string', 2);
			return str.toString().indexOf(search.toString()) > -1;
		 });


PRIMITIVES['string-ref'] =
    new PrimProc('string-ref',
		 2,
		 false, false,
		 function(aState, str, num) {
		 	check(aState, str, isString, 'string-ref', 'string', 1, arguments);
			check(aState, num, isNatural, 'string-ref', 'non-negative exact integer', 2, arguments);

			var n = jsnums.toFixnum(num);
			if (n >= str.length) {
				var msg = ('string-ref: index ' + n + ' out of range ' +
					   '[0, ' + (str.length-1) + '] for string: ' +
					   types.toWrittenString(str));
				var positionStack = 
					state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
			    var locationList = positionStack[positionStack.length - 1];

			  	raise( types.incompleteExn(types.exnFailContract, 
			  		new types.Message([new types.ColoredPart("string-ref", locationList.first()),
			  							": index ",
			  							n,
			  							' out of range [0, ',
										(str.length-1),
										'] for string: ',
			  							new types.ColoredPart(types.toWrittenString(str), locationList.rest().first())]), 
			  		[]) );
			}
			return types['char'](str.charAt(n));
		 });


PRIMITIVES['string=?'] =
    new PrimProc('string=?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
		 	strs.unshift(str1);
		 	arrayEach(strs, function(str, i) {check(aState, str, isString, 'string=?', 'string', i+1, strs);});
		 	
			return compare(strs, function(strA, strB) {return strA.toString() === strB.toString();});
		 });

PRIMITIVES['string<>?'] =
    new PrimProc('string<>?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
		 	strs.unshift(str1);
		 	arrayEach(strs, function(str, i) {check(aState, str, isString, 'string<>?', 'string', i+1, strs);});
		 	
			return !compare(strs, function(strA, strB) {return strA.toString() === strB.toString();});
		 });


PRIMITIVES['string-ci=?'] =
    new PrimProc('string-ci=?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);

			var i;
			for(i = 0; i < strs.length; i++) {
				check(aState, strs[i], isString, 'string-ci=?', 'string', i+1, strs);
				strs[i] = strs[i].toString().toLowerCase();
			}

			return compare(strs, function(strA, strB) {return strA === strB;});
		 });


PRIMITIVES['string-ci<>?'] =
    new PrimProc('string-ci<>?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);

			var i;
			for(i = 0; i < strs.length; i++) {
				check(aState, strs[i], isString, 'string-ci<>?', 'string', i+1, strs);
				strs[i] = strs[i].toString().toLowerCase();
			}

			return !compare(strs, function(strA, strB) {return strA === strB;});
		 });

PRIMITIVES['string<?'] =
    new PrimProc('string<?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);
			arrayEach(strs, function(str, i) {check(aState, str, isString, 'string<?', 'string', i+1, strs);});

			return compare(strs, function(strA, strB) {return strA.toString() < strB.toString();});
		 });


PRIMITIVES['string>?'] =
    new PrimProc('string>?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);
			arrayEach(strs, function(str, i) {check(aState, str, isString, 'string>?', 'string', i+1, strs);});

			return compare(strs, function(strA, strB) {return strA.toString() > strB.toString();});
		 });


PRIMITIVES['string<=?'] =
    new PrimProc('string<=?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);
			arrayEach(strs, function(str, i) {check(aState, str, isString, 'string<=?', 'string', i+1, strs);});

			return compare(strs, function(strA, strB) {return strA.toString() <= strB.toString();});
		 });


PRIMITIVES['string>=?'] =
    new PrimProc('string>=?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);
			arrayEach(strs, function(str, i) {check(aState, str, isString, 'string>=?', 'string', i+1, strs);});

			return compare(strs, function(strA, strB) {return strA.toString() >= strB.toString();});
		 });


PRIMITIVES['string-ci<?'] =
    new PrimProc('string-ci<?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);

			for (var i = 0; i < strs.length; i++) {
				check(aState, strs[i], isString, 'string-ci<?', 'string', i+1, strs);
				strs[i] = strs[i].toString().toLowerCase();
			}

			return compare(strs, function(strA, strB) {return strA < strB;});
		 });


PRIMITIVES['string-ci>?'] =
    new PrimProc('string-ci>?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);

			for (var i = 0; i < strs.length; i++) {
				check(aState, strs[i], isString, 'string-ci>?', 'string', i+1, strs);
				strs[i] = strs[i].toString().toLowerCase();
			}

			return compare(strs, function(strA, strB) {return strA > strB;});
		 });


PRIMITIVES['string-ci<=?'] =
    new PrimProc('string-ci<=?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);

			for (var i = 0; i < strs.length; i++) {
				check(aState, strs[i], isString, 'string-ci<=?', 'string', i+1, strs);
				strs[i] = strs[i].toString().toLowerCase();
			}

			return compare(strs, function(strA, strB) {return strA <= strB;});
		 });


PRIMITIVES['string-ci>=?'] =
    new PrimProc('string-ci>=?',
		 2,
		 true, false,
		 function(aState, str1, str2, strs) {
		 	strs.unshift(str2);
			strs.unshift(str1);

			for (var i = 0; i < strs.length; i++) {
				check(aState, strs[i], isString, 'string-ci>=?', 'string', i+1, strs);
				strs[i] = strs[i].toString().toLowerCase();
			}

			return compare(strs, function(strA, strB) {return strA >= strB;});
		 });


PRIMITIVES['substring'] =
	new CasePrimitive('substring', 
	[new PrimProc('substring',
		      2,
		      false, false,
		      function(aState, str, theStart) {
			  check(aState, str, isString, 'substring', 'string', 1, arguments);
			  check(aState, theStart, isNatural, 'substring', 'non-negative exact integer', 2, arguments);
			  
			  var positionStack = 
        		state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
        
       
       		  var locationList = positionStack[positionStack.length - 1];

			  var start = jsnums.toFixnum(theStart);
			  if (start > str.length) {
			   /*	var msg = ('substring: starting index ' + start + ' out of range ' +
					   '[0, ' + str.length + '] for string: ' + types.toWrittenString(str)); */
				raise( types.incompleteExn(types.exnFailContract,
											new types.Message([ new types.ColoredPart('substring', locationList.first()),
																': starting index ',
																new types.ColoredPart(start, locationList.rest().rest().first()),
																' out of range ',
																'[0, ',
																 str.length, 
																 '] for string: ',
																 new types.ColoredPart(types.toWrittenString(str), locationList.rest().first())
												]), 
											[]) );
			  }
			  else {
			  	return types.string( str.substring(jsnums.toFixnum(start)) );
			  }
		      }),
	 new PrimProc('substring',
		      3,
		      false, false,
		      function(aState, str, theStart, theEnd) {
			  check(aState, str, isString, 'substring', 'string', 1, arguments);
			  check(aState, theStart, isNatural, 'substring', 'non-negative exact integer', 2, arguments);
			  check(aState, theEnd, isNatural, 'substring', 'non-negative exact integer', 3, arguments);

			  var positionStack = 
        		state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
        
       		  var locationList = positionStack[positionStack.length - 1];

			  var start = jsnums.toFixnum(theStart);
			  var end = jsnums.toFixnum(theEnd);
			  if (start > str.length) {
			   /*	var msg = ('substring: starting index ' + start + ' out of range ' +
					   '[0, ' + str.length + '] for string: ' + types.toWrittenString(str)); */
				raise( types.incompleteExn(types.exnFailContract,
											new types.Message([ new types.ColoredPart('substring', locationList.first()),
																': starting index ',
																new types.ColoredPart(start, locationList.rest().rest().first()),
																' out of range ',
																'[0, ',
																 str.length, 
																 '] for string: ',
																 new types.ColoredPart(types.toWrittenString(str), locationList.rest().first())
												]), 
											[]) );
			  }
			  if (end < start || end > str.length) {
			   	/*var msg = ('substring: ending index ' + end + ' out of range ' + '[' + start +
					   ', ' + str.length + '] for string: ' + types.toWrittenString(str));*/ 
				raise( types.incompleteExn(types.exnFailContract,
											new types.Message([ new types.ColoredPart('substring', locationList.first()),
																': ending index ',
																new types.ColoredPart(end, locationList.rest().rest().rest().first()),
																' out of range ',
																'[0, ',
																 str.length, 
																 '] for string: ',
																 new types.ColoredPart(types.toWrittenString(str), locationList.rest().first())
												]), 
											[]) );
			  }
			  return types.string( str.substring(start, end) );
		      }) ]);


PRIMITIVES['string-append'] = 
    new PrimProc("string-append",
		 0,
		 true, false,
		 function(aState, args) {
		 	arrayEach(args,
				function(str, i) {
					check(aState, str, isString, 'string-append', 'string', i+1, args);
				});
			
			for (var i = 0; i < args.length; i++) {
				args[i] = args[i].toString();
			}
			return types.string(args.join(""));
		 });


PRIMITIVES['string->list'] =
    new PrimProc('string->list',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string->list', 'string', 1);

			var lst = types.EMPTY;
			for (var i = str.length-1; i >= 0; i--) {
				lst = types.cons(types['char'](str.charAt(i)), lst);
			}
			return lst;
		 });


PRIMITIVES['list->string'] =
    new PrimProc('list->string',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkListOf(aState, lst, isChar, 'list->string', 'character', 1);

			var ret = [];
			while( !lst.isEmpty() ) {
				ret.push(lst.first().val);
				lst = lst.rest();
			}
			return types.string(ret);
		 });


PRIMITIVES['string-copy'] =
    new PrimProc('string-copy',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string-copy', 'string', 1);
			return types.string(str.toString());
		 });



PRIMITIVES['string->symbol'] =
    new PrimProc('string->symbol',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string->symbol', 'string', 1);
			return types.symbol(str.toString());
		 });


PRIMITIVES['symbol->string'] =
    new PrimProc('symbol->string',
		 1,
		 false, false,
		 function(aState, symb) {
		 	check(aState, symb, isSymbol, 'symbol->string', 'symbol', 1);
			return types.string(symb.toString());
		 });


PRIMITIVES['format'] =
    new PrimProc('format', 1, true, false,
		 function(aState, formatStr, args) {
		 	check(aState, formatStr, isString, 'format', 'string', 1, [formatStr].concat(args));
			return types.string( helpers.format(formatStr, args, 'format') );
		 });


PRIMITIVES['printf'] =
    new PrimProc('printf', 1, true, false,
		 function(aState, formatStr, args) {
		 	check(aState, formatStr, isString, 'printf', 'string', 1, [formatStr].concat(args));
			var msg = helpers.format(formatStr, args, 'printf');
			aState.getDisplayHook()(msg);
			return types.VOID;
		 });


PRIMITIVES['string->int'] =
    new PrimProc('string->int',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, function(s) {return isString(s) && s.length == 1;},
			      'string->int', '1-letter string', 1);
			return str.charCodeAt(0);
		 });


PRIMITIVES['int->string'] =
    new PrimProc('int->string',
		 1,
		 false, false,
		 function(aState, num) {
		 	check(aState, num, function(x) {
					if ( !isInteger(x) ) {
						return false;
					}
					var n = jsnums.toFixnum(x);
					return ((n >= 0 && n < 55296) ||
						(n > 57343 && n <= 1114111));
				},
				'int->string',
				'exact integer in [0,55295] or [57344,1114111]',
				1);

			return types.string( String.fromCharCode(jsnums.toFixnum(num)) );
		 });


PRIMITIVES['explode'] =
    new PrimProc('explode',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'explode', 'string', 1);
			var ret = types.EMPTY;
			for (var i = str.length-1; i >= 0; i--) {
				ret = types.cons( types.string(str.charAt(i)), ret );
			}
			return ret;
		 });

PRIMITIVES['implode'] =
    new PrimProc('implode',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkListOf(aState, lst, function(x) { return isString(x) && x.length == 1; },
				    'implode', '1-letter strings', 1);
			var ret = [];
			while ( !lst.isEmpty() ) {
				ret.push( lst.first().toString() );
				lst = lst.rest();
			}
			return types.string(ret);
		 });


PRIMITIVES['string-alphabetic?'] =
    new PrimProc('string-alphabetic?',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string-alphabetic?', 'string', 1);
			return isAlphabeticString(str);
		 });


PRIMITIVES['string-ith'] =
    new PrimProc('string-ith',
		 2,
		 false, false,
		 function(aState, str, num) {
		 	check(aState, str, isString, 'string-ith', 'string', 1, arguments);
			check(aState, num, function(x) { return isNatural(x) && jsnums.lessThan(x, str.length); }, 'string-ith',
			      'exact integer in [0, length of the given string minus 1 (' + (str.length-1) + ')]', 2, arguments);
			return types.string( str.charAt(jsnums.toFixnum(num)) );
		 });


PRIMITIVES['string-lower-case?'] =
    new PrimProc('string-lower-case?',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string-lower-case?', 'string', 1);
			var primStr = str.toString();
			return isAlphabeticString(str) && primStr.toLowerCase() === primStr;
		 });


PRIMITIVES['string-numeric?'] =
    new PrimProc('string-numeric?',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string-numeric?', 'string', 1);
			return isNumericString(str);
		 });


PRIMITIVES['string-upper-case?'] =
    new PrimProc('string-upper-case?',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string-upper-case?', 'string', 1);
			var primStr = str.toString();
			return isAlphabeticString(str) && primStr.toUpperCase() === primStr;
		 });


PRIMITIVES['string-whitespace?'] =
    new PrimProc('string-whitespace?',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string-whitespace?', 'string', 1);
			return isWhitespaceString(str);
		 });


PRIMITIVES['build-string'] =
    new PrimProc('build-string',
		 2,
		 false, false,
		 function(aState, num, f) {
		 	check(aState, num, isNatural, 'build-string', 'non-negative exact integer', 1, arguments);
			check(aState, f, isFunction, 'build-string', 'function', 2, arguments);

			var buildStringHelp = function(n, acc) {
				if ( jsnums.greaterThanOrEqual(n, num) ) {
					return types.string(acc);
				}

				return CALL(f, [n],
					function(res) {
						check(aState, res, isChar, 'build-string',
						      'procedure that returns a char', 2);
						return buildStringHelp(n+1, acc.push(res.val));
					});
			}
			return buildStringHelp(0, []);
		 });


PRIMITIVES['string->immutable-string'] =
    new PrimProc('string->immutable-string',
		 1,
		 false, false,
		 function(aState, str) {
		 	check(aState, str, isString, 'string->immutable-string', 'string', 1);
			return str.toString();
		 });


PRIMITIVES['string-set!'] =
    new PrimProc('string-set!',
		 3,
		 false, false,
		 function(aState, str, k, c) {
		 	check(aState, str, function(x) { return isString(x) && typeof x != 'string'; },
			      'string-set!', 'mutable string', 1, arguments);
			check(aState, k, isNatural, 'string-set!', 'non-negative exact integer', 2, arguments);
			check(aState, c, isChar, 'string-set!', 'character', 3, arguments);

			if ( jsnums.greaterThanOrEqual(k, str.length) ) {
				var msg = ('string-set!: index ' + n + ' out of range ' +
					   '[0, ' + (str.length-1) + '] for string: ' +
					   types.toWrittenString(str));
				raise( types.incompleteExn(types.exnFailContract, msg, []) );
			}
			str.set(jsnums.toFixnum(k), c.val);
			return types.VOID;
		 });


PRIMITIVES['string-fill!'] =
    new PrimProc('string-fill!',
		 2,
		 false, false,
		 function(aState, str, c) {
		 	check(aState, str, function(x) { return isString(x) && typeof x != 'string'; },
			      'string-fill!', 'mutable string', 1, arguments);
			check(aState, c, isChar, 'string-fill!', 'character', 2, arguments);

			for (var i = 0; i < str.length; i++) {
				str.set(i, c.val);
			}
			return types.VOID;
		 });

/*************************
 *** Vector Primitives ***
 *************************/


PRIMITIVES['make-vector'] =
    new PrimProc('make-vector',
		 2,
		 false, false,
		 function(aState, size, content) {
		 	check(aState, size, isNatural, 'make-vector', 'non-negative exact integer', 1, arguments);
			var s = jsnums.toFixnum(size);
			var ret = [];
			for (var i = 0; i < s; i++) {
				ret.push(content);
			}
			return types.vector(ret);
		 });


PRIMITIVES['vector'] =
    new PrimProc('vector',
		 0,
		 true, false,
		 function(aState, args) {
		 	return types.vector(args);
		 });


PRIMITIVES['vector-length'] =
    new PrimProc('vector-length',
		 1,
		 false, false,
		 function(aState, vec) {
		 	check(aState, vec, isVector, 'vector-length', 'vector', 1);
			return vec.length();
		 });


PRIMITIVES['vector-ref'] =
    new PrimProc('vector-ref',
		 2,
		 false, false,
		 function(aState, vec, index) {
		 	check(aState, vec, isVector, 'vector-ref', 'vector', 1, arguments);
			check(aState, index, isNatural, 'vector-ref', 'non-negative exact integer', 2, arguments);

			var i = jsnums.toFixnum(index);
			if (i >= vec.length()) {
				var msg = ('vector-ref: index ' + i + ' out of range ' +
					   '[0, ' + (vec.length()-1) + '] for vector: ' +
					   types.toWrittenString(vec));
				raise( types.incompleteExn(types.exnFailContract, msg, []) );
			}
			return vec.ref(i);
		 });


PRIMITIVES['vector-set!'] =
    new PrimProc('vector-set!',
		 3,
		 false, false,
		 function(aState, vec, index, val) {
		 	check(aState, vec, isVector, 'vector-set!', 'vector', 1, arguments);
			check(aState, index, isNatural, 'vector-set!', 'non-negative exact integer', 2, arguments);

			var i = jsnums.toFixnum(index);
			if (i >= vec.length()) {
				var msg = ('vector-set!: index ' + i + ' out of range ' +
					   '[0, ' + (vec.length()-1) + '] for vector: ' +
					   types.toWrittenString(vec));
				raise( types.incompleteExn(types.exnFailContract, msg, []) );
			}
			vec.set(i, val);
			return types.VOID;
		 });


PRIMITIVES['vector->list'] =
    new PrimProc('vector->list',
		 1,
		 false, false,
		 function(aState, vec) {
		 	check(aState, vec, isVector, 'vector->list', 'vector', 1);
			return vec.toList();
		 });


PRIMITIVES['list->vector'] =
    new PrimProc('list->vector',
		 1,
		 false, false,
		 function(aState, lst) {
		 	checkList(aState, lst, 'list->vector', 1);
			return types.vector( helpers.schemeListToArray(lst) );
		 });


PRIMITIVES['build-vector'] =
    new PrimProc('build-vector',
		 2,
		 false, false,
		 function(aState, num, f) {
		 	check(aState, num, isNatural, 'build-vector', 'non-negative exact integer', 1, arguments);
			check(aState, f, isFunction, 'build-vector', 'function', 2, arguments);

			var buildVectorHelp = function(n, acc) {
				if ( jsnums.greaterThanOrEqual(n, num) ) {
					return types.vector(acc);
				}

				return CALL(f, [n],
					function (result) {
						acc.push(result);
						return buildVectorHelp(n+1, acc);
					});
			}
			return buildVectorHelp(0, []);
		 });



/***********************
 *** Char Primitives ***
 ***********************/


PRIMITIVES['char=?'] =
    new PrimProc('char=?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char=?', 'character', i+1, chars);});

			return compare(chars, function(c1, c2) {return c1.val === c2.val;});
		 });


PRIMITIVES['char<?'] =
    new PrimProc('char<?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char<?', 'character', i+1, chars);});

			return compare(chars, function(c1, c2) {return c1.val < c2.val;});
		 });


PRIMITIVES['char>?'] =
    new PrimProc('char>?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char>?', 'character', i+1, chars);});

			return compare(chars, function(c1, c2) {return c1.val > c2.val;});
		 });


PRIMITIVES['char<=?'] =
    new PrimProc('char<=?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char<=?', 'character', i+1, chars);});

			return compare(chars, function(c1, c2) {return c1.val <= c2.val;});
		 });


PRIMITIVES['char>=?'] =
    new PrimProc('char>=?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char>=?', 'character', i+1, chars);});

			return compare(chars, function(c1, c2) {return c1.val >= c2.val;});
		 });


PRIMITIVES['char-ci=?'] =
    new PrimProc('char-ci=?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char-ci=?', 'character', i+1, chars);});

			return compare(chars,
				function(c1, c2) {
					return c1.val.toLowerCase() === c2.val.toLowerCase();
				});
		 });


PRIMITIVES['char-ci<?'] =
    new PrimProc('char-ci<?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char-ci<?', 'character', i+1, chars);});

			return compare(chars,
				function(c1, c2) {
					return c1.val.toLowerCase() < c2.val.toLowerCase();
				});
		 });


PRIMITIVES['char-ci>?'] =
    new PrimProc('char-ci>?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char-ci>?', 'character', i+1, chars);});

			return compare(chars,
				function(c1, c2) {
					return c1.val.toLowerCase() > c2.val.toLowerCase();
				});
		 });


PRIMITIVES['char-ci<=?'] =
    new PrimProc('char-ci<=?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char-ci<=?', 'character', i+1, chars);});

			return compare(chars,
				function(c1, c2) {
					return c1.val.toLowerCase() <= c2.val.toLowerCase();
				});
		 });


PRIMITIVES['char-ci>=?'] =
    new PrimProc('char-ci>=?',
		 2,
		 true, false,
		 function(aState, char1, char2, chars) {
		 	chars.unshift(char2);
			chars.unshift(char1);
			arrayEach(chars, function(c, i) {check(aState, c, isChar, 'char-ci>=?', 'character', i+1, chars);});

			return compare(chars,
				function(c1, c2) {
					return c1.val.toLowerCase() >= c2.val.toLowerCase();
				});
		 });


PRIMITIVES['char-alphabetic?'] =
    new PrimProc('char-alphabetic?',
		 1,
		 false, false,
		 function(aState, c) {
		 	check(aState, c, isChar, 'char-alphabetic?', 'character', 1);
			return isAlphabeticString(c.val);
		 });


PRIMITIVES['char-numeric?'] =
    new PrimProc('char-numeric?',
		 1,
		 false, false,
		 function(aState, c) {
		 	check(aState, c, isChar, 'char-numeric?', 'character', 1);
			return (c.val >= '0' && c.val <= '9');
		 });


PRIMITIVES['char-whitespace?'] =
    new PrimProc('char-whitespace?',
		 1,
		 false, false,
		 function(aState, c) {
		 	check(aState, c, isChar, 'char-whitespace?', 'character', 1);
			return isWhitespaceString(c.val);
		 });


PRIMITIVES['char-upper-case?'] =
    new PrimProc('char-upper-case?',
		 1,
		 false, false,
		 function(aState, c) {
		 	check(aState, c, isChar, 'char-upper-case?', 'character', 1);
			return (isAlphabeticString(c.val) && c.val.toUpperCase() === c.val);
		 });


PRIMITIVES['char-lower-case?'] =
    new PrimProc('char-lower-case?',
		 1,
		 false, false,
		 function(aState, c) {
		 	check(aState, c, isChar, 'char-lower-case?', 'character', 1);
			return (isAlphabeticString(c.val) && c.val.toLowerCase() === c.val);
		 });


PRIMITIVES['char->integer'] =
    new PrimProc('char->integer',
		 1,
		 false, false,
		 function(aState, c) {
		 	check(aState, c, isChar, 'char->integer', 'character', 1);
			return c.val.charCodeAt(0);
		 });


PRIMITIVES['integer->char'] =
    new PrimProc('integer->char',
		 1,
		 false, false,
		 function(aState, num) {
		 	check(aState, num, function(x) {
					if ( !isInteger(x) ) {
						return false;
					}
					var n = jsnums.toFixnum(x);
					return ((n >= 0 && n < 55296) ||
						(n > 57343 && n <= 1114111));
				},
				'integer->char',
				'exact integer in [0,#x10FFFF], not in [#xD800,#xDFFF]',
				1);

			return types['char']( String.fromCharCode(jsnums.toFixnum(num)) );
		 });


PRIMITIVES['char-upcase'] =
    new PrimProc('char-upcase',
		 1,
		 false, false,
		 function(aState, c) {
		 	check(aState, c, isChar, 'char-upcase', 'character', 1);
			return types['char']( c.val.toUpperCase() );
		 });


PRIMITIVES['char-downcase'] =
    new PrimProc('char-downcase',
		 1,
		 false, false,
		 function(aState, c) {
		 	check(aState, c, isChar, 'char-downcase', 'character', 1);
			return types['char']( c.val.toLowerCase() );
		 });



/***********************
 *** Posn Primitives ***
 ***********************/


PRIMITIVES['make-posn'] =
    new PrimProc('make-posn',
		 2,
		 false, false,
		 function(aState, x, y) {
		 	return types.posn(x, y);
		 });


PRIMITIVES['posn-x'] =
    new PrimProc('posn-x',
		 1,
		 false, false,
		 function(aState, p) {
		 	check(aState, p, types.isPosn, 'posn-x', 'posn', 1);
			return types.posnX(p);
		 });


PRIMITIVES['posn-y'] =
    new PrimProc('posn-y',
		 1,
		 false, false,
		 function(aState, p) {
		 	check(aState, p, types.isPosn, 'posn-y', 'posn', 1);
			return types.posnY(p);
		 });


PRIMITIVES['key=?'] =
    new PrimProc('key=?',
		 2,
		 false, false,
		 function(aState, key1, key2) {
		     if (types.isChar(key1)) {
			 key1 = key1.getValue();
		     }
		     if (types.isChar(key2)) {
			 key2 = key2.getValue();
		     }
		     return (key1.toString().toLowerCase() === key2.toString().toLowerCase());
		 });



/************************
 *** Image Primitives ***
 ************************/



PRIMITIVES['image?'] = new PrimProc('image?', 1, false, false,
                                    function(aState, v) { return isImage(v); });

PRIMITIVES['image=?'] =
    new PrimProc('image=?',
		 2,
		 false, false,
		 function(aState, img1, img2) {
		 	check(aState, img1, isImage, 'image=?', 'image', 1);
			check(aState, img2, isImage, 'image=?', 'image', 2);
			return isEqual(img1, img2);
		 });


PRIMITIVES['make-color'] =
        new CasePrimitive('make-color',
                          [new PrimProc('make-color',
		                        3,
		                        false, false,
		                        function(aState, r, g, b) {
		 	                    check(aState, r, isByte, 'make-color', 'exact number between 0 and 255', 1, arguments);
		 	                    check(aState, g, isByte, 'make-color', 'exact number between 0 and 255', 2, arguments);
		 	                    check(aState, b, isByte, 'make-color', 'exact number between 0 and 255', 3, arguments);
                                            
			                    return types.color(jsnums.toFixnum(r),
					                       jsnums.toFixnum(g),
					                       jsnums.toFixnum(b));
		                        }),
                           new PrimProc('make-color',
		                        4,
		                        false, false,
		                        function(aState, r, g, b, a) {
		 	                    check(aState, r, isByte, 'make-color', 'exact number between 0 and 255', 1, arguments);
		 	                    check(aState, g, isByte, 'make-color', 'exact number between 0 and 255', 2, arguments);
		 	                    check(aState, b, isByte, 'make-color', 'exact number between 0 and 255', 3, arguments);
		 	                    check(aState, a, isByte, 'make-color', 'exact number between 0 and 255', 4, arguments);
                                            
			                    return types.color(jsnums.toFixnum(r),
					                       jsnums.toFixnum(g),
					                       jsnums.toFixnum(b),
					                       jsnums.toFixnum(a));
		                        })
                          ]);

PRIMITIVES['color-red'] =
    new PrimProc('color-red',
		 1,
		 false, false,
		 function(aState, col) {
		 	check(aState, col, types.isColor, 'color-red', 'color', 1);
			return types.colorRed(col);
		 });

PRIMITIVES['color-green'] =
    new PrimProc('color-green',
		 1,
		 false, false,
		 function(aState, col) {
		 	check(aState, col, types.isColor, 'color-green', 'color', 1);
			return types.colorGreen(col);
		 });

PRIMITIVES['color-blue'] =
    new PrimProc('color-blue',
		 1,
		 false, false,
		 function(aState, col) {
		 	check(aState, col, types.isColor, 'color-blue', 'color', 1);
			return types.colorBlue(col);
		 });

PRIMITIVES['color-alpha'] =
    new PrimProc('color-alpha',
		 1,
		 false, false,
		 function(aState, col) {
		 	check(aState, col, types.isColor, 'color-alpha', 'color', 1);
			return types.colorAlpha(col);
		 });

PRIMITIVES['empty-scene'] = new CasePrimitive('empty-scene',
  [new PrimProc('empty-scene',
		 2,
		 false, false,
		 function(aState, width, height) {
		 	check(aState, width, isNonNegativeReal, 'empty-scene', 'non-negative number', 1, arguments);
			check(aState, height, isNonNegativeReal, 'empty-scene', 'non-negative number', 2, arguments);
			var white = colorDb.get("white");
	        return world.Kernel.sceneImage(jsnums.toFixnum(width), jsnums.toFixnum(height), [], true, white);
		 }),
   new PrimProc('empty-scene',
		 3,
		 false, false,
		 function(aState, width, height, c) {
		 	check(aState, width, isNonNegativeReal, 'empty-scene', 'non-negative number', 1, arguments);
			check(aState, height, isNonNegativeReal, 'empty-scene', 'non-negative number', 2, arguments);
			check(aState, c, isColor, 'empty-scene', 'color', 3, arguments);
      if (colorDb.get(c)) { c = colorDb.get(c); }
      return world.Kernel.sceneImage(jsnums.toFixnum(width), jsnums.toFixnum(height), [], true, c);
		 })
   ]);

// just like place-image, but we flip the y-coordinate
PRIMITIVES['put-image'] =
    new PrimProc('put-image',
     4,
     false, false,
     function(aState, picture, x, y, background) {
      check(aState, picture, isImage, "put-image", "image", 1, arguments);
      check(aState, x, isReal, "put-image", "real", 2, arguments);
      check(aState, y, isReal, "put-image", "real", 3, arguments);
      check(aState, background, function(x) { return isScene(x) || isImage(x) },
            "put-image", "image", 4, arguments);
      x = jsnums.toFixnum(x); y = jsnums.toFixnum(y);
      if (isScene(background)) {
          return background.add(picture, x, background.getHeight() - y);
      } else {
          var newScene = world.Kernel.sceneImage(background.getWidth(),
                                                 background.getHeight(),
                                                 [],
                                                 false,
                                                 null);
          newScene = newScene.add(background, background.getWidth()/2, background.getHeight()/2);
          newScene = newScene.add(picture, x, background.getHeight() - y);
          return newScene;
      }
    });


PRIMITIVES['place-image'] =
    new PrimProc('place-image',
		 4,
		 false, false,
		 function(aState, picture, x, y, background) {
			check(aState, picture, isImage, "place-image", "image", 1, arguments);
			check(aState, x, isReal, "place-image", "real", 2, arguments);
			check(aState, y, isReal, "place-image", "real", 3, arguments);
			check(aState, background, function(x) { return isScene(x) || isImage(x) },
			      "place-image", "image", 4, arguments);
			x = jsnums.toFixnum(x); y = jsnums.toFixnum(y);
			if (isScene(background)) {
			    return background.add(picture, x, y);
			} else {
			    var newScene = world.Kernel.sceneImage(background.getWidth(),
                                                 background.getHeight(),
                                                 [],
                                                 false,
                                                 null);
          newScene = newScene.add(background, background.getWidth()/2, background.getHeight()/2);
          newScene = newScene.add(picture, x, y);
			    return newScene;
			}
		 });


PRIMITIVES['place-image/align'] =
        new PrimProc('place-image/align',
		     6,
		     false, false,
		     function(aState, img, x, y, placeX, placeY, background) {
			 check(aState, img,		isImage,	"place-image/align", "image",	1, arguments);
			 check(aState, x,		isReal,		"place-image/align", "real number",	2, arguments);
			 check(aState, y,		isReal,		"place-image/align", "real number",	3, arguments);
			 check(aState, placeX,	isPlaceX,	"place-image/align", "x-place", 4, arguments);
			 check(aState, placeY,	isPlaceY,	"place-image/align", "y-place", 5, arguments);
			 check(aState, background, function(x) { return isScene(x) || isImage(x) },
			       "place-image/align", "image",	6, arguments);

      		 // calculate x and y based on placeX and placeY
      		 x = jsnums.toFixnum(x); y = jsnums.toFixnum(y);
			 if		 (placeX == "left"  )  x = x + img.getWidth()/2;
			 else if (placeX == "right" ) x = x - img.getWidth()/2;
			 if		 (placeY == "top"   )  y = y + img.getHeight()/2;
			 else if (placeY == "bottom") y = y - img.getHeight()/2;
			 if (isScene(background)) {
			     return  background.add(img, x, y);
			 } else {
			     var newScene = world.Kernel.sceneImage(background.getWidth(),
                                                  background.getHeight(),
                                                  [],
                                                  false,
                                                  null);
			     newScene = newScene.add(background, background.getWidth()/2, background.getHeight()/2);
			     newScene = newScene.add(img, x, y);
			     return  newScene;
			 }
		     });


PRIMITIVES['scene+line'] =
        new PrimProc('scene+line',
		     6,
		     false, false,
		     function(aState, img, x1, y1, x2, y2, c) {
			 check(aState, img,		isImage,	"scene+line", "image",				1, arguments);
			 check(aState, x1,		isReal,		"scene+line", "finite real number", 2, arguments);
			 check(aState, y1,		isReal,		"scene+line", "finite real number", 3, arguments);
			 check(aState, x2,		isReal,		"scene+line", "finite real number", 4, arguments);
			 check(aState, y2,		isReal,		"scene+line", "finite real number", 5, arguments);
			 check(aState, c,     isColor,	"scene+line", "color",				6, arguments);
			 if (colorDb.get(c)) {
			     c = colorDb.get(c);
			 }
			 // make a scene containing the image
       newScene = world.Kernel.sceneImage(jsnums.toFixnum(img.getWidth()),
                                          jsnums.toFixnum(img.getHeight()),
                                          [],
                                          false,
                                          null);
			 newScene = newScene.add(img, img.getWidth()/2, img.getHeight()/2);
			 // make an image containing the line
			 line = world.Kernel.lineImage(jsnums.toFixnum(x2-x1),
                                     jsnums.toFixnum(y2-y1),
                                     c);
       leftMost = Math.min(x1,x2),
       topMost = Math.min(y1,y2);
			 // add the line to scene, offset by the original amount
			 return newScene.add(line, line.getWidth()/2+leftMost, line.getHeight()/2+topMost);
		     });

PRIMITIVES['put-pinhole'] =
    new PrimProc('put-pinhole',
		 3,
		 false, false,
		 function(aState, img, x, y) {
      check(aState, img, isImage, "put-pinhole", "image", 1, arguments);
			check(aState, x, isReal, "put-pinhole", "real", 2, arguments);
			check(aState, y, isReal, "put-pinhole", "real", 3, arguments);
			return img.updatePinhole(jsnums.toFixnum(x), jsnums.toFixnum(y));
    		 });

PRIMITIVES['circle'] =
    new PrimProc('circle',
		 3,
		 false, false,
		 function(aState, aRadius, aStyle, aColor) {
			check(aState, aRadius, isNonNegativeReal, "circle", "non-negative number", 1, arguments);
			check(aState, aStyle, isMode, "circle", 'style ("solid" / "outline") or an opacity value [0-255])', 2, arguments);
			check(aState, aColor, isColor, "circle", "color", 3, arguments);


			if (colorDb.get(aColor)) {
				aColor = colorDb.get(aColor);
			}
		     return world.Kernel.circleImage(jsnums.toFixnum(aRadius), aStyle.toString(), aColor);
		 });


PRIMITIVES['star'] =
    new CasePrimitive(
	'star',
	// implementation to match htdp/image
	[new PrimProc('star',
		      5,
		      false, false,		      
		      function(aState, n, outer, inner, m, c) {
			  check(aState, n, isSideCount, "star", 
				"positive integer greater than or equal to 3", 
				1, arguments);
			  check(aState, outer, isNonNegativeReal, "star", 
				"non-negative number", 
				2, arguments);
			  check(aState, inner, 
				isNonNegativeReal, "star",
				"non-negative number", 3, arguments);
			  check(aState, m, isMode, "star", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
			  check(aState, c, isColor, "star", "color", 5, arguments);
			  if (colorDb.get(c)) {
			      c = colorDb.get(c);
			  }
			  return world.Kernel.starImage(jsnums.toFixnum(n),
							jsnums.toFixnum(outer),
							jsnums.toFixnum(inner),
							m.toString(),
							c);
		      }),
	 // implementation to match 2htdp/image
	 new PrimProc('star', 
		      3,
		      false, false,
		      function(aState, sideLength, mode, color) {
			  check(aState, sideLength, isNonNegativeReal,
				"star", "non-negative number", 1, arguments);
			  check(aState, mode, isMode, "star", 'style ("solid" / "outline") or an opacity value [0-255])', 2, arguments);
			  check(aState, color, isColor, "star", "color", 3, arguments);
			  if (colorDb.get(color)) {
			      color = colorDb.get(color);
			  }
			  return world.Kernel.polygonImage(
			  					jsnums.toFixnum(sideLength), 
							   	jsnums.toFixnum(5), 
							   	jsnums.toFixnum(2), 
							   	mode.toString(), 
							   	color,
							   	"star");
		      })]);



PRIMITIVES['radial-star'] =
new PrimProc('radial-star',
			 5,
			 false, false,
			 function(aState, aPoints, anOuter, anInner, aStyle, aColor) {
			 check(aState, aPoints, function(x) { return isNatural(x) && jsnums.greaterThanOrEqual(x, 2); },
									"radial-star", "positive integer greater than or equal to 2", 1, arguments);
			 check(aState, anOuter, function(x) { return isReal(x) && jsnums.greaterThan(x, 0); },
									"radial-star", "positive number", 2, arguments);
			 check(aState, anInner, function(x) { return isReal(x) && jsnums.greaterThan(x, 0); },
									"radial-star", "positive number", 3, arguments);
			 check(aState, aStyle, isMode, "radial-star", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
			 check(aState, aColor, isColor, "radial-star", "color", 5, arguments);
			 
			 if (colorDb.get(aColor)) {
			 aColor = colorDb.get(aColor);
			 }
			 return world.Kernel.starImage(jsnums.toFixnum(aPoints),
										   jsnums.toFixnum(anOuter),
										   jsnums.toFixnum(anInner),
										   aStyle.toString(),
										   aColor);
			 });

PRIMITIVES['rectangle'] =
    new PrimProc('rectangle',
		 4,
		 false, false,
		 function(aState, w, h, s, c) {
			check(aState, w, isNonNegativeReal, "rectangle", "non-negative number", 1, arguments);
			check(aState, h, isNonNegativeReal, "rectangle", "non-negative number", 2, arguments);
			check(aState, s, isMode, "rectangle", 'style ("solid" / "outline") or an opacity value [0-255])', 3, arguments);
			check(aState, c, isColor, "rectangle", "color", 4, arguments);

			if (colorDb.get(c)) {
				c = colorDb.get(c);
			}
			return world.Kernel.rectangleImage(jsnums.toFixnum(w),
							   jsnums.toFixnum(h),
							   s.toString(), c);
		 });

PRIMITIVES['polygon'] =
new PrimProc('polygon',
			 3,
			 false, false,
			 function(aState, points, s, c) {
       function isPosnList(lst){ return isListOf(lst, types.isPosn); }
       checkListOfLength(aState, points, 3, 'polygon', 1);
			 check(aState, points,	isPosnList,	"polygon", "list of posns", 1, arguments);
			 check(aState, s,		isMode, "polygon", 'style ("solid" / "outline") or an opacity value [0-255])', 2, arguments);
			 check(aState, c,		isColor, "polygon", "color", 3, arguments);
			 
			 if (colorDb.get(c)) { c = colorDb.get(c); }
			 return world.Kernel.posnImage(helpers.flattenSchemeListToArray(points),
											  s.toString(),
											  c);
			 });

PRIMITIVES['regular-polygon'] =
new PrimProc('regular-polygon',
			 4,
			 false, false,
			 function(aState, length, count, s, c) {
			 check(aState, length,	isNonNegativeReal,	"regular-polygon", "non-negative number", 1, arguments);
			 check(aState, count,	isSideCount,		"regular-polygon", "positive integer greater than or equal to 3", 2, arguments);
			 check(aState, s,		isMode, "regular-polygon", 'style ("solid" / "outline") or an opacity value [0-255])', 3, arguments);
			 check(aState, c,		isColor, "regular-polygon", "color", 4, arguments);
			 
			 if (colorDb.get(c)) {
			 c = colorDb.get(c);
			 }
			 return world.Kernel.polygonImage(jsnums.toFixnum(length), 
											  jsnums.toFixnum(count), 
											  jsnums.toFixnum(1), 
											  s.toString(), 
											  c);
			 });

PRIMITIVES['add-polygon'] =
new PrimProc('add-polygon',
			 4,
			 false, false,
			 function(aState, bg, points, s, c) {
       function isPosnList(lst){ return isListOf(lst, types.isPosn); }
       checkListOfLength(aState, points, 3, 	'add-polygon', 1);
			 check(aState, bg,		isImage,	"add-polygon", "image", 1, arguments);
			 check(aState, points,	isPosnList,	"add-polygon", "list of posns", 2, arguments);
			 check(aState, s,		isMode, 	"add-polygon", 'style ("solid" / "outline") or an opacity value [0-255])', 3, arguments);
			 check(aState, c,		isColor, 	"add-polygon", "color", 4, arguments);
			 
			 if (colorDb.get(c)) { c = colorDb.get(c); }
			 var posnArray = helpers.flattenSchemeListToArray(points);
			 var xs = posnArray.map(function(p){ return p._fields[0]; });
			 var ys = posnArray.map(function(p){ return p._fields[1]; });
			 xs = xs.map(function(x){ return jsnums.toFixnum(x); }); // convert xs to fixnums
			 ys = ys.map(function(y){ return jsnums.toFixnum(y); }); // convert ys to fixnums
			 var deltaX = -Math.round(Math.min.apply(null, xs));
			 var deltaY = -Math.round(Math.min.apply(null, ys));
			 console.log('deltaX', deltaX, 'deltaY', deltaY);
			 var polygon = world.Kernel.posnImage(posnArray, s.toString(), c);
			 console.log('primitve is passing posns', posnArray);
			 return world.Kernel.overlayImage(polygon, bg, deltaX, deltaY);
			 });

PRIMITIVES['star-polygon'] =
new PrimProc('star-polygon',
			 5,
			 false, false,
			 function(aState, length, count, step, s, c) {
			 check(aState, length,	isNonNegativeReal,	"star-polygon", "non-negative number", 1, arguments);
			 check(aState, count,	isSideCount,		"star-polygon", "positive integer greater than or equal to 3", 2, arguments);
			 check(aState, step,	isStepCount,		"star-polygon", "positive integer greater than or equal to 1", 3, arguments);
			 check(aState, s,		isMode,				"star-polygon", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
			 check(aState, c,		isColor,			"star-polygon", "color", 5, arguments);
			 
			 if (colorDb.get(c)) {
				c = colorDb.get(c);
			 }
			 return world.Kernel.polygonImage(jsnums.toFixnum(length), 
											  jsnums.toFixnum(count), 
											  jsnums.toFixnum(step), 
											  s.toString(), 
											  c);
			 });

PRIMITIVES['rhombus'] =
new PrimProc('rhombus',
			 4,
			 false, false,
			 function(aState, l, a, s, c) {
			 check(aState, l, isNonNegativeReal, "rhombus", "non-negative number", 1, arguments);
			 check(aState, a, isNonNegativeReal, "rhombus", "non-negative number", 2, arguments);
			 check(aState, s, isMode, "rhombus", 'style ("solid" / "outline") or an opacity value [0-255])', 3, arguments);
			 check(aState, c, isColor, "rhombus", "color", 4, arguments);
			 
			 if (colorDb.get(c)) {
			 c = colorDb.get(c);
			 }
			 return world.Kernel.rhombusImage(jsnums.toFixnum(l), jsnums.toFixnum(a), s.toString(), c);
			 });

PRIMITIVES['square'] =
new PrimProc('square',
			 3,
			 false, false,
			 function(aState, l, s, c) {
			 check(aState, l, isNonNegativeReal, "square", "non-negative number", 1, arguments);
			 check(aState, s, isMode, "square", 'style ("solid" / "outline") or an opacity value [0-255])', 2, arguments);
			 check(aState, c, isColor, "square", "color", 3, arguments);
			 
			 if (colorDb.get(c)) {
			 c = colorDb.get(c);
			 }
			 return world.Kernel.squareImage(jsnums.toFixnum(l), s.toString(), c);
			 });

PRIMITIVES['triangle'] =
    new PrimProc('triangle',
		 3,
		 false, false,
		 function(aState, s, m, c) {
			check(aState, s, isNonNegativeReal, "triangle", "non-negative number", 1, arguments);
			check(aState, m, isMode, "triangle", 'style ("solid" / "outline") or an opacity value [0-255])', 2, arguments);
			check(aState, c, isColor, "triangle", "color", 3, arguments);
			if (colorDb.get(c)) {c = colorDb.get(c);}
      // Angle makes triangle point up
      return world.Kernel.triangleImage(jsnums.toFixnum(s), jsnums.toFixnum(360-60), jsnums.toFixnum(s),
                                        m.toString(),
                                        c);
      });
 
PRIMITIVES['triangle/sas'] =
    new PrimProc('triangle/sas',
      5,
      false, false,
      function(aState, sideA, angleB, sideC, style, color) {
       check(aState, sideA, isNonNegativeReal, "triangle/sas", "non-negative number", 1, arguments);
       check(aState, angleB, isAngle, "triangle/sas", "angle less than 180 degrees and greater than 0 degrees", 2, arguments);
       check(aState, sideC, isNonNegativeReal, "triangle/sas", "non-negative number", 3, arguments);
       check(aState, style, isMode, "triangle/sas", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
       check(aState, color, isColor, "triangle/sas", "color", 5, arguments);
       if (colorDb.get(color)) { color = colorDb.get(color); }

       // cast to fixnums
       sideA = jsnums.toFixnum(sideA);
       angleB = jsnums.toFixnum(angleToProperRange(angleB));
       sideC = jsnums.toFixnum(sideC);
       var sideB2 = cosRel(sideA, sideC, angleB);
       var sideB  = Math.sqrt(sideB2);
              
       if (sideB2 <= 0) {
         raise( types.incompleteExn(types.exnFailContract, "The given side, angle and side will not form a triangle: "
                                    + sideA + ", " + angleB + ", " + sideC, []) );
       } else {
        if (less(sideA + sideC, sideB) ||
            less(sideB + sideC, sideA) ||
            less(sideA + sideB, sideC)) {
         raise( types.incompleteExn(types.exnFailContract, "The given side, angle and side will not form a triangle: "
                                    + sideA + ", " + angleB + ", " + sideC, []) );
        }
       }

       var angleA = Math.acos(excess(sideB, sideC, sideA) / (2 * sideB * sideC)) * (180 / Math.PI);

       return world.Kernel.triangleImage(jsnums.toFixnum(sideC),
                                         jsnums.toFixnum(angleA),
                                         jsnums.toFixnum(sideB),
                                         style.toString(),
                                         color);
      });
 
PRIMITIVES['triangle/sss'] =
    new PrimProc('triangle/sss',
      5,
      false, false,
      function(aState, sideA, sideB, sideC, style, color) {
        check(aState, sideA, isNonNegativeReal, "triangle/sss", "non-negative number", 1, arguments);
        check(aState, sideB, isNonNegativeReal, "triangle/sss", "non-negative number", 2, arguments);
        check(aState, sideC, isNonNegativeReal, "triangle/sss", "non-negative number", 3, arguments);
        check(aState, style, isMode, "triangle/sss", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
        check(aState, color, isColor, "triangle/sss", "color", 5, arguments);
        if (colorDb.get(color)) { color = colorDb.get(color); }
        // cast to fixnums
        sideA = jsnums.toFixnum(sideA); sideB = jsnums.toFixnum(sideB); sideC = jsnums.toFixnum(sideC);
        if (less(sideA + sideB, sideC) ||
            less(sideC + sideB, sideA) ||
            less(sideA + sideC, sideB)) {
         raise( types.incompleteExn(types.exnFailContract, "The given sides will not form a triangle: "
                                    + sideA+", "+sideB+", "+sideC, []) );
        }

        var angleA = Math.acos(excess(sideB, sideC, sideA) / (2 * sideB * sideC)) * (180 / Math.PI);
        return world.Kernel.triangleImage(jsnums.toFixnum(sideC),
                                         jsnums.toFixnum(angleA),
                                         jsnums.toFixnum(sideB),
                                         style.toString(),
                                         color);
      });
 
PRIMITIVES['triangle/ass'] =
    new PrimProc('triangle/ass',
      5,
      false, false,
      function(aState, angleA, sideB, sideC, style, color) {
       check(aState, angleA, isAngle, "triangle/ass", "angle less than 180 degrees and greater than 0 degrees", 1, arguments);
       check(aState, sideB, isNonNegativeReal, "triangle/ass", "non-negative number", 2, arguments);
       check(aState, sideC, isNonNegativeReal, "triangle/ass", "non-negative number", 3, arguments);
       check(aState, style, isMode, "triangle/ass", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
       check(aState, color, isColor, "triangle/ass", "color", 5, arguments);
       // cast to fixnums
       angleA = jsnums.toFixnum(angleToProperRange(angleA));
       sideB = jsnums.toFixnum(sideB);
       sideC = jsnums.toFixnum(sideC);
       
       if (colorDb.get(color)) { color = colorDb.get(color); }
       if (less(180, angleA)) {
         raise( types.incompleteExn(types.exnFailContract, "The given angle, side and side will not form a triangle: "
                                    + angleA + ", " + sideB + ", " + sideC, []) );
       }
       return world.Kernel.triangleImage(jsnums.toFixnum(sideC),
                                        jsnums.toFixnum(angleA),
                                        jsnums.toFixnum(sideB),
                                        style.toString(),
                                        color);
      });
 
PRIMITIVES['triangle/ssa'] =
    new PrimProc('triangle/ssa',
      5,
      false, false,
      function(aState, sideA, sideB, angleC, style, color) {
         check(aState, sideA, isNonNegativeReal, "triangle/ssa", "non-negative number", 1, arguments);
         check(aState, sideB, isNonNegativeReal, "triangle/ssa", "non-negative number", 2, arguments);
         check(aState, angleC, isAngle, "triangle/ssa", "angle less than 180 degrees and greater than 0 degrees", 3, arguments);
         check(aState, style, isMode, "triangle/ssa", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
         check(aState, color, isColor, "triangle/ssa", "color", 5, arguments);
         if (colorDb.get(color)) { color = colorDb.get(color); }
         // cast to fixnums
         sideA = jsnums.toFixnum(sideA);
         sideB = jsnums.toFixnum(sideB);
         angleC = jsnums.toFixnum(angleToProperRange(angleC));
         if (less(180, angleC)) {
           raise( types.incompleteExn(types.exnFailContract, "The given side, side and angle will not form a triangle: "
                                      + sideA + ", " + sideB + ", " + angleC, []) );
         }
         var sideC2 = cosRel(sideA, sideB, angleC);
         var sideC  = Math.sqrt(sideC2);
        
         if (sideC2 <= 0) {
           raise( types.incompleteExn(types.exnFailContract, "The given side, side and angle will not form a triangle: "
                                      + sideA + ", " + sideB + ", " + angleC, []) );
         } else {
           if (less(sideA + sideB, sideC) ||
               less(sideC + sideB, sideA) ||
               less(sideA + sideC, sideB)) {
           raise( types.incompleteExn(types.exnFailContract, "The given side, side and angle will not form a triangle: "
                                      + sideA + ", " + sideB + ", " + angleC, []) );
           }
         }

         var angleA = Math.acos(excess(sideB, sideC, sideA) / (2 * sideB * sideC)) * (180 / Math.PI);
              return world.Kernel.triangleImage(jsnums.toFixnum(sideC),
                                          jsnums.toFixnum(angleA),
                                          jsnums.toFixnum(sideB),
                                          style.toString(),
                                          color);
      });
 
PRIMITIVES['triangle/aas'] =
      new PrimProc('triangle/aas',
        5,
        false, false,
        function(aState, angleA, angleB, sideC, style, color) {
         check(aState, angleA, isAngle, "triangle/aas", "angle less than 180 degrees and greater than 0 degrees", 1, arguments);
         check(aState, angleB, isAngle, "triangle/aas", "angle less than 180 degrees and greater than 0 degrees", 2, arguments);
         check(aState, sideC, isNonNegativeReal, "triangle/aas", "non-negative number", 3, arguments);
         check(aState, style, isMode, "triangle/aas", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
         check(aState, color, isColor, "triangle/aas", "color", 5, arguments);
        if (colorDb.get(color)) { color = colorDb.get(color); }
        // cast to fixnums
        angleA = jsnums.toFixnum(angleToProperRange(angleA));
        angleB = jsnums.toFixnum(angleToProperRange(angleB));
        sideC = jsnums.toFixnum(sideC);
        var angleC = (180 - angleA - angleB);
        if (less(angleC, 0)) {
           raise( types.incompleteExn(types.exnFailContract, "The given angle, angle and side will not form a triangle: "
                                      + angleA + ", " + angleB + ", " + sideC, []) );
        }
        var hypotenuse = sideC / (Math.sin(angleC*Math.PI/180))
        var sideB = hypotenuse * Math.sin(angleB*Math.PI/180);
        return world.Kernel.triangleImage(jsnums.toFixnum(sideC),
                                         angleA,
                                         jsnums.toFixnum(sideB),
                                         style.toString(),
                                         color);
        });
 
PRIMITIVES['triangle/asa'] =
       new PrimProc('triangle/asa',
          5,
          false, false,
          function(aState, angleA, sideB, angleC, style, color) {
            check(aState, angleA, isAngle, "triangle/asa", "angle less than 180 degrees and greater than 0 degrees", 1, arguments);
            check(aState, sideB, isNonNegativeReal, "triangle/asa", "non-negative number", 2, arguments);
            check(aState, angleC, isAngle, "triangle/asa", "angle less than 180 degrees and greater than 0 degrees", 3, arguments);
            check(aState, style, isMode, "triangle/asa", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
            check(aState, color, isColor, "triangle/asa", "color", 5, arguments);
            if (colorDb.get(color)) { color = colorDb.get(color); }
            // cast to fixnums
            angleA = jsnums.toFixnum(angleToProperRange(angleA));
            sideB = jsnums.toFixnum(sideB);
            angleC = jsnums.toFixnum(angleToProperRange(angleC));
            var angleB = (180 - (angleA + angleC));
            if (less(angleB, 0)) {
              raise( types.incompleteExn(types.exnFailContract, "The given angle, side and angle will not form a triangle: "
                                         + angleA + ", " + sideB + ", " + angleC, []) );
            }
            var base = (sideB * Math.sin(angleA*Math.PI/180)) / (Math.sin(angleB*Math.PI/180));
            var sideC = (sideB * Math.sin(angleC*Math.PI/180)) / (Math.sin(angleB*Math.PI/180));
            return world.Kernel.triangleImage(jsnums.toFixnum(sideC),
                                             angleA,
                                             jsnums.toFixnum(sideB),
                                             style.toString(),
                                             color);
          });
 
PRIMITIVES['triangle/saa'] =
        new PrimProc('triangle/saa',
            5,
            false, false,
            function(aState, sideA, angleB, angleC, style, color) {
             check(aState, sideA, isNonNegativeReal, "triangle/saa", "non-negative number", 1, arguments);
             check(aState, angleB, isAngle, "triangle/saa", "angle less than 180 degrees and greater than 0 degrees", 2, arguments);
             check(aState, angleC, isAngle, "triangle/saa", "angle less than 180 degrees and greater than 0 degrees", 3, arguments);
             check(aState, style, isMode, "triangle/saa", 'style ("solid" / "outline") or an opacity value [0-255])', 4, arguments);
             check(aState, color, isColor, "triangle/saa", "color", 5, arguments);
             if (colorDb.get(color)) { color = colorDb.get(color); }
             // cast to fixnums
             sideA = jsnums.toFixnum(sideA);
             angleB = jsnums.toFixnum(angleToProperRange(angleB));
             angleC = jsnums.toFixnum(angleToProperRange(angleC));
             var angleA = (180 - angleC - angleB);
             var hypotenuse = sideA / (Math.sin(angleA*Math.PI/180));
             var sideC = hypotenuse * Math.sin(angleC*Math.PI/180);
             var sideB = hypotenuse * Math.sin(angleB*Math.PI/180);
             return world.Kernel.triangleImage(jsnums.toFixnum(sideC),
                                               angleA,
                                               jsnums.toFixnum(sideB),
                                               style.toString(),
                                               color);
            });

PRIMITIVES['right-triangle'] =
new PrimProc('right-triangle',
			 4,
			 false, false,
			 function(aState, side1, side2, s, c) {
			 check(aState, side1, isNonNegativeReal, "right-triangle", "non-negative number", 1, arguments);
			 check(aState, side2, isNonNegativeReal, "right-triangle", "non-negative number", 2, arguments);
			 check(aState, s, isMode, "right-triangle", 'style ("solid" / "outline") or an opacity value [0-255])', 3, arguments);
			 check(aState, c, isColor, "right-triangle", "color", 4, arguments);
			 if (colorDb.get(c)) { c = colorDb.get(c); }
       return world.Kernel.triangleImage(jsnums.toFixnum(side1),
                                         jsnums.toFixnum(360-90),
                                         jsnums.toFixnum(side2),
                                         s.toString(),
                                         c);
			 });


PRIMITIVES['isosceles-triangle'] =
new PrimProc('isosceles-triangle',
			 4,
			 false, false,
			 function(aState, side, angleC, s, c) {
			 check(aState, side, isNonNegativeReal, "isosceles-triangle", "non-negative number", 1, arguments);
			 check(aState, angleC, isAngle, "isosceles-triangle", "angle less than 180 degrees and greater than 0 degrees", 2, arguments);
			 check(aState, s, isMode, "isosceles-triangle", 'style ("solid" / "outline") or an opacity value [0-255])', 3, arguments);
			 check(aState, c, isColor, "isosceles-triangle", "color", 4, arguments);
			 if (colorDb.get(c)) { c = colorDb.get(c); }
       // cast to fixnums
       var isNegative = angleC < 0? -1 : 1,
       angleAB    = (180-Math.abs(angleC))/2,
       base       = 2*side*Math.sin((Math.abs(angleC)*Math.PI/180)/2);
       return world.Kernel.triangleImage(jsnums.toFixnum(base),
                                         jsnums.toFixnum(360-angleAB) * isNegative,
                                         jsnums.toFixnum(side),
                                         s.toString(),
                                         c);
			 });


PRIMITIVES['ellipse'] =
    new PrimProc('ellipse',
		 4,
		 false, false,
		 function(aState, w, h, s, c) {
			check(aState, w, isNonNegativeReal, "ellipse", "non-negative number", 1, arguments);
			check(aState, h, isNonNegativeReal, "ellipse", "non-negative number", 2, arguments);
			check(aState, s, isMode, "ellipse", 'style ("solid" / "outline") or an opacity value [0-255])', 3, arguments);
			check(aState, c, isColor, "ellipse", "color", 4, arguments);
			
			if (colorDb.get(c)) {
				c = colorDb.get(c);
			}
			return world.Kernel.ellipseImage(jsnums.toFixnum(w),
							 jsnums.toFixnum(h),
							 s.toString(),
							 c);
		 });


PRIMITIVES['line'] =
    new PrimProc('line',
		 3,
		 false, false,
		 function(aState, x, y, c) {
			check(aState, x, isReal, "line", "finite real number", 1, arguments);
			check(aState, y, isReal, "line", "finite real number", 2, arguments);
			check(aState, c, isColor, "line", "color", 3, arguments);
			if (colorDb.get(c)) {
				c = colorDb.get(c);
			}
			var line = world.Kernel.lineImage(jsnums.toFixnum(x),
                                        	  jsnums.toFixnum(y),
                                       	 	  c);
		    return line;
		 });


PRIMITIVES['add-line'] =
    new PrimProc('add-line',
	     6,
	     false, false,
	     function(aState, img, x1, y1, x2, y2, c) {
			check(aState, img, 	isImage,	"add-line", "image",              1, arguments);
			check(aState, x1,	isReal,		"add-line", "finite real number", 2, arguments);
			check(aState, y1,	isReal,		"add-line", "finite real number", 3, arguments);
			check(aState, x2,	isReal,		"add-line", "finite real number", 4, arguments);
			check(aState, y2,	isReal,		"add-line", "finite real number", 5, arguments);
			check(aState, c,	isColor,	"add-line", "color",              6, arguments);
			if (colorDb.get(c)) {
				c = colorDb.get(c);
			}
		 	x1 = jsnums.toFixnum(x1);
		 	x2 = jsnums.toFixnum(x2);
		 	y1 = jsnums.toFixnum(y1);
		 	y2 = jsnums.toFixnum(y2);
			var lineImg  = world.Kernel.lineImage(x2-x1, y2-y1, c),
           		leftMost = Math.min(x1, x2),
           		topMost  = Math.min(y1, y2);
		 	return world.Kernel.overlayImage(lineImg, img, -leftMost, -topMost);
		 });


PRIMITIVES['overlay'] =
    new PrimProc('overlay',
		 2,
		 true, false,
		 function(aState, img1, img2, restImages) {
		 	//fixme
		 	var allArgs = [img1, img2].concat(restImages);
			check(aState, img1, isImage, "overlay", "image", 1, allArgs);
			check(aState, img2, isImage, "overlay", "image", 2, allArgs);
			arrayEach(restImages, function(x, i) { check(aState, x, isImage, "overlay", "image", i+3); }, arguments);

			var img = world.Kernel.overlayImage(img1, img2, "middle", "middle");
			for (var i = 0; i < restImages.length; i++) {
				img = world.Kernel.overlayImage(img, restImages[i], "middle", "middle");
			}
			return img;
		 });


PRIMITIVES['overlay/xy'] =
    new PrimProc('overlay/xy',
		 4,
		 false, false,
		 function(aState, img1, deltaX, deltaY, img2) {
		     check(aState, img1, isImage, "overlay/xy", "image", 1, arguments);
		     check(aState, deltaX, isReal, "overlay/xy", "finite real number", 2, arguments);
		     check(aState, deltaY, isReal, "overlay/xy", "finite real number", 3, arguments);
		     check(aState, img2, isImage, "overlay/xy", "image", 4, arguments);
		     return world.Kernel.overlayImage(img1,
                                          	  img2,
                                          	  jsnums.toFixnum(deltaX),
                                         	  jsnums.toFixnum(deltaY));
		 });


PRIMITIVES['overlay/align'] =
new PrimProc('overlay/align',
			 4,
			 true, false,
			 function(aState, placeX, placeY, img1, img2, restImages) {
			 checkVarArity(aState, placeX, isPlaceX, "overlay/align", "x-place", 1, arguments);
			 checkVarArity(aState, placeY, isPlaceY, "overlay/align", "y-place", 2, arguments);
			 checkVarArity(aState, img1, isImage, "overlay/align", "image", 3, arguments);
			 checkVarArity(aState, img2, isImage, "overlay/align", "image", 4, arguments);
			 arrayEach(restImages, function(x, i) { check(aState, x, isImage, "overlay/align", "image", i+4); }, arguments);
			 
			 var img = world.Kernel.overlayImage(img1,
							            img2,
							            placeX.toString(),
							            placeY.toString());
			 
			 for (var i = 0; i < restImages.length; i++)
				img = world.Kernel.overlayImage(img,
								       restImages[i], 
								       placeX.toString(), 
								       placeY.toString());

		     return img;
			 });

PRIMITIVES['underlay'] =
    new PrimProc('underlay',
		 2,
		 true, false,
		 function(aState, img1, img2, restImages) {
			checkVarArity(aState, img1, isImage, "underlay", "image", 1, arguments);
			checkVarArity(aState, img2, isImage, "underlay", "image", 2, arguments);
			arrayEach(restImages, function(x, i) { check(aState, x, isImage, "underlay", "image", i+3); }, arguments);

			var img = world.Kernel.overlayImage(img2, img1, "middle", "middle");
			for (var i = 0; i < restImages.length; i++) {
				img = world.Kernel.overlayImage(restImages[i], img, "middle", "middle");
			}
			return img;
		 });


PRIMITIVES['underlay/xy'] =
    new PrimProc('underlay/xy',
		 4,
		 false, false,
		 function(aState, img1, deltaX, deltaY, img2) {
		     check(aState, img1, isImage, "underlay/xy", "image", 1, arguments);
		     check(aState, deltaX, isReal, "underlay/xy", "finite real number", 2, arguments);
		     check(aState, deltaY, isReal, "underlay/xy", "finite real number", 3, arguments);
		     check(aState, img2, isImage, "underlay/xy", "image", 4, arguments);                     
		     return world.Kernel.overlayImage(img2,
                                          img1,
                                          -jsnums.toFixnum(deltaX),
                                          -jsnums.toFixnum(deltaY));
		 });


PRIMITIVES['underlay/align'] =
        new PrimProc('underlay/align',
		     4,
		     true, false,
	             function(aState, placeX, placeY, img1, img2, restImages) {
			 checkVarArity(aState, placeX, isPlaceX, "underlay/align", "x-place", 1, arguments);
			 checkVarArity(aState, placeY, isPlaceY, "underlay/align", "y-place", 2, arguments);
			 checkVarArity(aState, img1, isImage, "underlay/align", "image", 3, arguments);
			 checkVarArity(aState, img2, isImage, "underlay/align", "image", 4, arguments);
			 arrayEach(restImages, function(x, i) { check(aState, x, isImage, "underlay/align", "image", i+4); }, arguments);
			 
		         var img = world.Kernel.overlayImage(img2,
						             img1,
						             placeX.toString(),
						             placeY.toString());
		         
		         for (var i = 0; i < restImages.length; i++)
		             img = world.Kernel.overlayImage(restImages[i], 
						             img,
						             placeX.toString(), 
						             placeY.toString());
		         
		         return img;
	             });
    

PRIMITIVES['beside'] =
new PrimProc('beside',
			 2,
			 true, false,
			 function(aState, img1, img2, restImages) {
			 checkVarArity(aState, img1, isImage, "beside", "image", 1, arguments);
			 checkVarArity(aState, img2, isImage, "beside", "image", 2, arguments);
			 arrayEach(restImages, function(x, i) { check(aState, x, isImage, "beside", "image", i+4); }, arguments);
			 
			 var img = world.Kernel.overlayImage(img1,
												 img2,
												 "beside",
												 "middle");
			 
			 for (var i = 0; i < restImages.length; i++)
			 img = world.Kernel.overlayImage(img,restImages[i], "beside", "middle");
			 
		     return img;
			 });

PRIMITIVES['beside/align'] =
new PrimProc('beside/align',
			 3,
			 true, false,
			 function(aState, placeY, img1, img2, restImages) {
			 checkVarArity(aState, placeY, isPlaceY, "beside/align", "y-place", 1, arguments);
			 checkVarArity(aState, img1, isImage, "beside/align", "image", 2, arguments);
			 checkVarArity(aState, img2, isImage, "beside/align", "image", 3, arguments);
			 arrayEach(restImages, function(x, i) { check(aState, x, isImage, "beside", "image", i+3); }, arguments);
			 
			 var img = world.Kernel.overlayImage(img1,
												 img2,
												 "beside",
												 placeY.toString());
			 
			 for (var i = 0; i < restImages.length; i++)
			 img = world.Kernel.overlayImage(img,
											 restImages[i], 
											 "beside",
											 placeY.toString());
			 
		     return img;
			 });

PRIMITIVES['above'] =
new PrimProc('above',
			 2,
			 true, false,
			 function(aState, img1, img2, restImages) {
			 checkVarArity(aState, img1, isImage, "above", "image", 1, arguments);
			 checkVarArity(aState, img2, isImage, "above", "image", 2, arguments);
			 arrayEach(restImages, function(x, i) { check(aState, x, isImage, "above", "image", i+4); }, arguments);
			 
			 var img = world.Kernel.overlayImage(img1,
												 img2,
												 "middle",
												 "above");
			 
			 for (var i = 0; i < restImages.length; i++)
			 img = world.Kernel.overlayImage(img,
											 restImages[i], 
											 "middle",
											 "above");
			 
		     return img;
			 });

PRIMITIVES['above/align'] =
        new PrimProc('above/align',
		     3,
		     true, false,
		     function(aState, placeX, img1, img2, restImages) {
			 checkVarArity(aState, placeX, isPlaceX, "above/align", "x-place", 1, arguments);
			 checkVarArity(aState, img1, isImage, "above/align", "image", 1, arguments);
			 checkVarArity(aState, img2, isImage, "above/align", "image", 2, arguments);
			 arrayEach(restImages, function(x, i) { check(aState, x, isImage, "above/align", "image", i+4); }, arguments);
			 var i;
			 var img = world.Kernel.overlayImage(img1,
							     img2,
							     placeX.toString(),
							     "above");
			 
			 for (i = 0; i < restImages.length; i++)
			     img = world.Kernel.overlayImage(img,
							     restImages[i], 
							     placeX.toString(),
							     "above");
			 
		         return img;
		     });

PRIMITIVES['rotate'] =
new PrimProc('rotate',
			 2,
			 false, false,
			 function(aState, angle, img) {
			 check(aState, angle, isReal, "rotate", "finite real number", 1, arguments);
			 check(aState, img, isImage, "rotate", "image", 2, arguments);
       angle = angleToProperRange(jsnums.toFixnum(angle));
       // negate the angle, to make it a counterclockwise rotation
       return world.Kernel.rotateImage(-1 * angle, img);
			 });

PRIMITIVES['scale/xy'] =
new PrimProc('scale/xy',
			 3,
			 false, false,
			 function(aState, xFactor, yFactor, img) {
			 check(aState, xFactor, isNonNegativeReal, "scale/xy", "non-negative number", 1, arguments);
			 check(aState, yFactor, isNonNegativeReal, "scale/xy", "non-negative number", 2, arguments);
			 check(aState, img, isImage, "scale/xy", "image", 3, arguments);
			 return world.Kernel.scaleImage(jsnums.toFixnum(xFactor),
							jsnums.toFixnum(yFactor),
							img);

			 });

PRIMITIVES['scale'] =
new PrimProc('scale',
			 2,
			 false, false,
			 function(aState, factor, img) {
			 check(aState, factor, isNonNegativeReal, "scale", "non-negative number", 1, arguments);
			 check(aState, img, isImage, "scale", "image", 2, arguments);
			 return world.Kernel.scaleImage(jsnums.toFixnum(factor),
											jsnums.toFixnum(factor),
											img);
			 });

PRIMITIVES['crop'] =
new PrimProc('crop',
			 5,
			 false, false,
			 function(aState, x, y, width, height, img) {
			 check(aState, x,	  isReal, "crop", "finite real number", 1, arguments);
			 check(aState, y,	  isReal, "crop", "finite real number", 2, arguments);
			 check(aState, width, isNonNegativeReal, "crop", "non-negative number", 3, arguments);
			 check(aState, height,isNonNegativeReal, "crop", "non-negative number", 4, arguments);
			 check(aState, img,   isImage,"crop", "image", 5, arguments);
			 return world.Kernel.cropImage(jsnums.toFixnum(x),
										   jsnums.toFixnum(y),
										   jsnums.toFixnum(width),
										   jsnums.toFixnum(height),
										   img);
			 });

PRIMITIVES['frame'] =
new PrimProc('frame',
			 1,
			 false, false,
			 function(aState, img) {
			 check(aState, img,   isImage,"frame", "image", 1, arguments);
			 return world.Kernel.frameImage(img);
			 });

PRIMITIVES['flip-vertical'] =
new PrimProc('flip-vertical',
			 1,
			 false, false,
			 function(aState, img) {
			 check(aState, img, isImage, "flip-vertical", "image", 1, arguments);
			 return world.Kernel.flipImage(img, "vertical");
			 });


PRIMITIVES['flip-horizontal'] =
new PrimProc('flip-horizontal',
			 1,
			 false, false,
			 function(aState, img) {
			 check(aState, img, isImage, "flip-horizontal", "image", 1, arguments);
			 return world.Kernel.flipImage(img, "horizontal");
			 });

PRIMITIVES['reflect-x'] =
new PrimProc('reflect-x',
			 1,
			 false, false,
			 function(aState, img) {
			 check(aState, img, isImage, "reflect-x", "image", 1, arguments);
			 return world.Kernel.flipImage(img, "vertical");
			 });


PRIMITIVES['reflect-y'] =
new PrimProc('reflect-y',
			 1,
			 false, false,
			 function(aState, img) {
			 check(aState, img, isImage, "reflect-y", "image", 1, arguments);
			 return world.Kernel.flipImage(img, "horizontal");
			 });


PRIMITIVES['text'] =
    new PrimProc('text',
		 3,
		 false, false,
		 function(aState, aString, aSize, aColor) {
		     check(aState, aString, isString, "text", "string", 1, arguments);
		     check(aState, aSize, function(x) { return isNatural(x) && jsnums.greaterThan(x, 0) && isByte(x); },
			   "text", "exact integer between 1 and 255", 2, arguments);
		     check(aState, aColor, isColor, "text", "color", 3, arguments);
                     
		     if (colorDb.get(aColor)) {
			 aColor = colorDb.get(aColor);
		     }
		     return world.Kernel.textImage(aString.toString(), jsnums.toFixnum(aSize), aColor,
						   "normal", "Arial","","",false);
		 });


PRIMITIVES['text/font'] =
    new CasePrimitive('text/font',
  // implementation to match htdp/image
	[new PrimProc('text/font',
			 8,
			 false, false,
			 function(aState, aString, aSize, aColor, aFace, aFamily, aStyle, aWeight, aUnderline) {
			 check(aState, aString, isString,		"text/font", "string",	1, arguments);
		     check(aState, aSize,	function(x) { return isNatural(x) && jsnums.greaterThan(x, 0) && isByte(x); },
				   "text/font", "exact integer between 1 and 255",	2, arguments);
			 check(aState, aColor,	isColor,		"text/font", "color",	3, arguments);
			 check(aState, aFace,	function(x) {return isString(x) || !x;},		
											"text/font", "face",	4, arguments);
			 check(aState, aFamily,	isFontFamily,	"text/font", "family",	5, arguments);
			 check(aState, aStyle,	isFontStyle,	"text/font", 'style ("solid" or "outline")',	6, arguments);
			 check(aState, aWeight,	isFontWeight,	"text/font", "weight",	7, arguments);
			 check(aState, aUnderline,isBoolean,	"text/font", "underline?",8, arguments);
			 
			 if (colorDb.get(aColor)) { aColor = colorDb.get(aColor); }
       return world.Kernel.textImage(aString.toString(), jsnums.toFixnum(aSize), aColor,
                                     aFace.toString(), aFamily.toString(), aStyle.toString(),
                                     aWeight.toString(), aUnderline);
    }),
   // new, meme-generating version
   new PrimProc('text/font',
			 9,
			 false, false,
			 function(aState, aString, aSize, aColor, aFace, aFamily, aStyle, aWeight, aUnderline, outline) {
			 check(aState, aString, isString,		"text/font", "string",	1, arguments);
		     check(aState, aSize,	function(x) { return isNatural(x) && jsnums.greaterThan(x, 0) && isByte(x); },
				   "text/font", "exact integer between 1 and 255",	2, arguments);
			 check(aState, aColor,	isColor,		"text/font", "color",	3, arguments);
			 check(aState, aFace,	function(x) {return isString(x) || !x;},		
											"text/font", "face",	4, arguments);
			 check(aState, aFamily,	isFontFamily,	"text/font", "family",	5, arguments);
			 check(aState, aStyle,	isFontStyle,	"text/font", 'style ("solid" or "outline")',	6, arguments);
			 check(aState, aWeight,	isFontWeight,	"text/font", "weight",	7, arguments);
			 check(aState, aUnderline,isBoolean,	"text/font", "underline?",8, arguments);
       check(aState, outline, isBoolean,	"text/font", "outline?",9, arguments);
			 
			 if (colorDb.get(aColor)) { aColor = colorDb.get(aColor); }
       return world.Kernel.textImage(aString.toString(), jsnums.toFixnum(aSize), aColor,
                                     aFace.toString(), aFamily.toString(), aStyle.toString(),
                                     aWeight.toString(), aUnderline, outline);
    })
   ]);
 
PRIMITIVES['play-sound'] =
    new PrimProc('play-sound',
		 2,
		 false, false,
		 function(aState, path, async) {
		     check(aState, path, isString, "play-sound", "string", 1);
         check(aState, async, isBoolean, "play-sound", "boolean", 2);
			     return PAUSE(function(restarter, caller) {
                    notifyLoading(path.toString());
										var rawAudio = document.createElement('audio');
										rawAudio.src = path.toString();
                    // return true at 'canplay' if we're using async, or at 'ended' if we're not
                    rawAudio.addEventListener('canplay', function() {
                        var temp = new world.Kernel.fileAudio(path.toString(), false, rawAudio);
                        function pause(){ temp.audio.pause(); return true;};
                        aState.addBreakRequestedListener(pause);
                        if(async){ return restarter(true); }
                        else { rawAudio.addEventListener('ended', function(){return restarter(true);}); }
                    });
										rawAudio.addEventListener('error', function(e) { restarter(false);	});
										rawAudio.src = path.toString();
          });
		 });
 
PRIMITIVES['bitmap/url'] = 
PRIMITIVES['image-url'] =
    new PrimProc('bitmap/url',
		 1,
		 false, false,
		 function(aState, path) {
		    check(aState, path, isString, "bitmap/url", "string", 1);
			var originalPath = path.toString();
		    if (aState.getImageProxyHook()) {
			 	path = (aState.getImageProxyHook() + "?url=" + encodeURIComponent(path.toString()));
		    } else {
			 	path = path.toString();
		    }
		    return PAUSE(function(restarter, caller) {
	       		notifyLoading(originalPath);
				var rawImage = new Image();
				rawImage.onload = function() {
				    world.Kernel.fileImage(
					path,
					rawImage,
				    restarter);
				};
			rawImage.onerror = function(e) {
			    restarter(types.schemeError(types.incompleteExn(
					types.exnFail,
					" (unable to load: " + originalPath + ")",
					[])));
			};
			rawImage.src = path;
		    });
		 });

PRIMITIVES['video/url'] =
	new PrimProc('video/url',
			 1,
			 false, false,
			 function(aState, path) {
		     check(aState, path, isString, "video-url", "string", 1);
			     return PAUSE(function(restarter, caller) {
                      notifyLoading(path.toString());
										var rawVideo = document.createElement('video');
										rawVideo.src = path.toString();
										rawVideo.addEventListener('canplay', function() {
                                              restarter(world.Kernel.fileVideo(path.toString(), rawVideo));
                                              function pause(){ rawVideo.pause(); return true;};
                                              aState.addBreakRequestedListener(pause);
                                              });
										rawVideo.addEventListener('error', function(e) {
                                              restarter(types.schemeError(types.incompleteExn(
																				   types.exnFail,
																				   " (unable to load: " + path + ")",
																				   [])));
										});
										rawVideo.src = path.toString();
										});
			 });

PRIMITIVES['image-width'] =
    new PrimProc('image-width',
		 1,
		 false, false,
		 function(aState, img) {
		     check(aState, img, isImage, 'image-width', 'image', 1);
		     return img.getWidth();
		 });


PRIMITIVES['image-height'] =
    new PrimProc('image-height',
		 1,
		 false, false,
		 function(aState, img) {
		     check(aState, img, isImage, 'image-height', 'image', 1);
		     return img.getHeight();
		 });


PRIMITIVES['image-baseline'] =
new PrimProc('image-baseline',
			 1,
			 false, false,
			 function(aState, img) {
			 check(aState, img, isImage, 'image-baseline', 'image', 1);
			 return img.getBaseline();
			 });


PRIMITIVES['image->color-list'] = 
   new PrimProc('image->color-list',
		 1,
		 false, false,
		 function(aState, img) {
		     check(aState, img, isImage, 'image->color-list', 'image', 1);
		     var width = img.getWidth(),
                         height = img.getHeight(),
		         canvas = world.Kernel.makeCanvas(width, height),
		         ctx = canvas.getContext("2d"),
                         imageData,
                         data,
                         i,
		         r, g, b, a;
		     img.render(ctx, 0, 0);
		     imageData = ctx.getImageData(0, 0, width, height);
		     data = imageData.data;
		     var colors = [];
		     for (i = 0 ; i < data.length; i += 4) {
			 r = data[i];
			 g = data[i+1];
			 b = data[i+2];
			 a = data[i+3];
			 colors.push(types.color(r, g, b, a));
		     }
		     return types.list(colors);
		 });



// Note: this has to be done asynchonously.
var colorListToImage = function(aState, listOfColors, width, height, pinholeX, pinholeY) {
    checkListOf(aState, listOfColors, isColor, 'color-list->image', 'image', 1);
    check(aState, width, isNonNegativeReal, 'color-list->image', 'non-negative number', 2);
    check(aState, height, isNonNegativeReal, 'color-list->image', 'non-negative number', 3);
    check(aState, pinholeX, isNatural, 'color-list->image', 'natural', 4);
    check(aState, pinholeY, isNatural, 'color-list->image', 'natural', 5);
    var width = Math.max(jsnums.toFixnum(width), 1);
    var height = Math.max(jsnums.toFixnum(height), 1);
    var canvas 	= world.Kernel.makeCanvas(width, height),
		ctx 	= canvas.getContext("2d"),
    	imageData = ctx.createImageData(width, height),
    	data 	= imageData.data,
    	aColor, i = 0;
    while (listOfColors !== types.EMPTY) {
		aColor = listOfColors.first();
		data[i] = jsnums.toFixnum(types.colorRed(aColor));
		data[i+1] = jsnums.toFixnum(types.colorGreen(aColor));
		data[i+2] = jsnums.toFixnum(types.colorBlue(aColor));
		data[i+3] = jsnums.toFixnum(types.colorAlpha(aColor));
		i += 4;
		listOfColors = listOfColors.rest();
    };
    ctx.putImageData(imageData, 0, 0);
    var path = canvas.toDataURL("image/png");
    return PAUSE(function(restarter, caller) {
	var rawImage = new Image();
	rawImage.onload = function() {
	    world.Kernel.fileImage(
		path,
		rawImage,
		restarter);
	};
	rawImage.onerror = function(e) {
	    restarter(types.schemeError(types.incompleteExn(
		types.exnFail,
		" (unable to load image from color-list)",
		[])));
	};
	rawImage.src = path;
    });
};


PRIMITIVES['color-list->image'] = 
    new PrimProc('color-list->image',
		 5,
		 false, false,
                 function(aState, colorList, width, height, x, y){
                     return colorListToImage(aState, colorList, width, height, x, y);
                 });

PRIMITIVES['color-list->image'] = 
    new PrimProc('color-list->image',
		 5,
		 false, false,
                 function(aState, colorList, width, height, x, y){
                     return colorListToImage(aState, colorList, width, height, x, y);
                 });


PRIMITIVES['color-list->bitmap'] = 
    new PrimProc('color-list->bitmap',
		 3,
		 false, false,
		 function(aState, colorList, width, height) {
                     return colorListToImage(aState, colorList, width, height, 0, 0);
                 });




PRIMITIVES['mode?']		= new PrimProc('mode?', 1, false, false, 
                                               function(aState, v) { return isMode(v); });
PRIMITIVES['image-color?']      = new PrimProc('image-color?', 1, false, false, 
                                               function(aState, v) { return isColor(v); });
PRIMITIVES['name->color']       = new PrimProc('name->color', 1, false, false,
                                               function(aState, x) { 
                                                   return nameToColor(x) || false; 
                                               });
PRIMITIVES['x-place?']		= new PrimProc('x-place?', 1, false, false,
                                               function(aState, v) { return isPlaceX(v); });
PRIMITIVES['y-place?']		= new PrimProc('y-place?', 1, false, false,
                                               function(aState, v) { return isPlaceY(v); });
PRIMITIVES['angle?']		= new PrimProc('angle?', 1, false, false,
                                               function(aState, v) { return isAngle(v); });
PRIMITIVES['side-count?']	= new PrimProc('side-count?', 1, false, false, 
                                               function(aState, v) { return isSideCount(v); });
PRIMITIVES['step-count?']	= new PrimProc('step-count?', 1, false, false, 
                                               function(aState, v) { return isStepCount(v); });





/************************
 *** World Primitives ***
 ************************/
var StopWhen = WorldConfigOption.extend({
	init: function(handler, last_picture) {
	    this._super('stop-when');
      this.handler = handler;
      this.last_picture = last_picture;
	},
                                            
  configure: function(config) {
      var newVals = {
        stopWhen: this.handler,
        lastPicture: this.last_picture
      };
      return config.updateAll(newVals);
  }});


var OnTickBang = WorldConfigOption.extend({
	init: function(handler, effectHandler, aDelay) {
	    this._super('on-tick');
	    this.handler = handler;
	    this.effectHandler = effectHandler;
	    this.aDelay = aDelay;
	},

	configure: function(config) {
	    var newVals = { 
        onTick: this.handler,
        onTickEffect: this.effectHandler,
        tickDelay: jsnums.toFixnum(jsnums.multiply(1000, this.aDelay))
	    };
	    return config.updateAll(newVals);
	}});

var ToDraw = WorldConfigOption.extend({
   init: function(handler) {
       this._super('on-redraw');
       this.handler = handler;
   },

   configure: function(config) {
       return config.updateAll({onRedraw: this.handler});
   }});

 // The default tick delay is 28 times a second.
 // On slower browsers, we'll force all delays to be >= 1/10
var slow_browser = false;
if(window.plt !== undefined){
   var clientInfo  = plt.wescheme.BrowserDetect,
       slow_browser= (clientInfo.browser==="Explorer") && (clientInfo.version<11);
}
var DEFAULT_TICK_DELAY = slow_browser? (types.rational(1, 8)) : (types.rational(1, 28));

PRIMITIVES['on-tick'] =
	new CasePrimitive(
	    'on-tick',
	    [new PrimProc('on-tick',
			  1,
			  false, false,
			  function(aState, handler) {
			      check(aState, handler, isFunction, "on-tick", "function", 1);
			      checkHandlerArity(aState, 'on-tick', 1, handler.numParams);
			      return new OnTickBang(handler,
						    new PrimProc('', 1, false, false,
								 function(aState, w) { return types.effectDoNothing(); }),
						    DEFAULT_TICK_DELAY);
			  }),
	     new PrimProc('on-tick',
			  2,
			  false, false,
			  function(aState, handler, aDelay) {
			      check(aState, handler, isFunction, "on-tick", "function", 1, arguments);
			      checkHandlerArity(aState, 'on-tick', 1, handler.numParams);
			      check(aState, aDelay, isNonNegativeReal, "on-tick", "non-negative number", 2, arguments);
			      return new OnTickBang(handler,
						    new PrimProc('', 1, false, false,
								 function(aState, w) { return types.effectDoNothing(); }),
                slow_browser? Math.max(jsnums.toFixnum(aDelay), jsnums.toFixnum(DEFAULT_TICK_DELAY)) : aDelay);
			  }) ]);



PRIMITIVES['on-tick!'] =
    new CasePrimitive('on-tick!',
	[new PrimProc('on-tick!',
		      2,
		      false, false,
		      function(aState, handler, effectHandler) {
				  check(aState, handler, isFunction, "on-tick!", "function", 1, arguments);
			      checkHandlerArity(aState, 'on-tick!', 1, handler.numParams);
				  check(aState, effectHandler, isFunction, "on-tick!","function", 2, arguments);
			  return new OnTickBang(handler, effectHandler, DEFAULT_TICK_DELAY);
		      }),
	 new PrimProc('on-tick!',
		      3,
		      false, false,
		      function(aState, handler, effectHandler, aDelay)  {
			  check(aState, handler, isFunction, "on-tick!", "function", 1, arguments);
			  checkHandlerArity(aState, 'on-tick!', 1, handler.numParams);
			  check(aState, effectHandler, isFunction, "on-tick!","function", 2, arguments);
			  check(aState, aDelay, isNonNegativeReal, "on-tick!", "non-negative number", 3, arguments);
			  return new OnTickBang(handler, effectHandler,
                              slow_browser? Math.max(jsnums.toFixnum(aDelay), jsnums.toFixnum(DEFAULT_TICK_DELAY)) : aDelay);
		      }) ]);


PRIMITIVES['on-tap'] = new PrimProc('on-tap', 1, false, false, onEvent('on-tap', 'onTap', 3));
PRIMITIVES['on-tilt'] = new PrimProc('on-tilt', 1, false, false, onEvent('on-tilt', 'onTilt', 3));


PRIMITIVES['on-key'] = new PrimProc('on-key', 1, false, false, onEvent('on-key', 'onKey', 2));
PRIMITIVES['on-key!'] = new PrimProc('on-key!', 2, false, false, onEventBang('on-key!', 'onKey'));
 
PRIMITIVES['on-mouse'] = new PrimProc('on-mouse', 1, false, false, onEvent('on-mouse', 'onMouse', 4));


PRIMITIVES['mouse-event?'] =
    new PrimProc('mouse-event?',
		 1,
		 true, false,
     function(aState, v) { return isMouseEvent(v); });
 
 
PRIMITIVES['mouse=?'] =
    new PrimProc('mouse=?',
		 2,
		 true, false,
		 function(aState, mouseA, mouseB) {
		 	check(aState, mouseA, isMouseEvent, 'mouse-event?', 'mouse-event', 1);
		 	check(aState, mouseB, isMouseEvent, 'mouse-event?', 'mouse-event', 2);
			return mouseA===mouseB;
});

PRIMITIVES['stop-when'] =
 new CasePrimitive('stop-when',
    [new PrimProc('stop-when',
			  1,
			  false, false,
			  function(aState, handler) {
			      check(aState, handler, isFunction, "stop-when", "function", 1);
			      checkHandlerArity(aState, 'stop-when', 1, handler.numParams);
	            // by default, there's an empty last picture handler
	            return new StopWhen(handler, null);
        }),
    new PrimProc('stop-when',
			  2,
			  false, false,
			  function(aState, handler, lastPicture) {
		      check(aState, handler, isFunction, "stop-when", "function", 1);
		      checkHandlerArity(aState, 'stop-when', 1, handler.numParams);
            check(aState, lastPicture, isFunction, "stop-when", "function", 2);
            return new StopWhen(handler, lastPicture);
        })
     ]);
 
PRIMITIVES['stop-when!'] = new PrimProc('stop-when!', 2, false, false,
					onEventBang('stop-when!', 'stopWhen'));


PRIMITIVES['on-redraw'] =
    new PrimProc('on-redraw',
		 1,
		 false, false,
		 function(aState, handler) {
		     check(aState, handler, isFunction, 'on-redraw', "function", 1);
		     checkHandlerArity(aState, 'on-redraw', 1, handler.numParams);
         return new ToDraw(handler);
		 });


PRIMITIVES['to-draw'] =
    new PrimProc('to-draw',
		 1,
		 false, false,
		 function(aState, handler) {
		     check(aState, handler, isFunction, 'to-draw', "function", 1);
		     checkHandlerArity(aState, 'to-draw', 1, handler.numParams);
         return new ToDraw(handler);
		 });


PRIMITIVES['on-draw'] =
    new CasePrimitive('on-draw',
	[new PrimProc('on-draw',
		      1,
		      false, false,
		      function(aState, handler) {
			  check(aState, handler, isFunction, 'on-draw', "function", 1);
		      checkHandlerArity(aState, 'on-draw', 1, handler.numParams);
			  return new (WorldConfigOption.extend({
				    init: function() {
					this._super('on-draw');
				    },
				    configure: function(config) {
					return config.updateAll({'onDraw': handler});
				    }
				}))();
		      }),
	 new PrimProc('on-draw',
		      2,
		      false, false,
		      function(aState, handler, styleHandler) {
		 	  check(aState, handler, isFunction, 'on-draw', "function", 1, arguments);
			  check(aState, styleHandler, isFunction, 'on-draw', "function", 2, arguments);
			  checkHandlerArity(aState, 'on-draw', 1, handler.numParams);
			  return new (WorldConfigOption.extend({
				    init: function() {
					this._super('on-draw');
				    },
				    configure: function(config) {
					return config.updateAll({'onDraw': handler,
								 'onDrawCss': styleHandler});
				    }
				}))();
		      }) ]);


PRIMITIVES['initial-effect'] =
    new PrimProc('initial-effect',
		 1,
		 false, false,
		 function(aState, effect) {
		     return new (WorldConfigOption.extend({
				 init: function() {
				     this._super("initial-effect");
				 },
				 configure: function(config) {
					return config.updateAll({'initialEffect': effect});
				 }
			     }))();
		 });



/**************************
 *** Jsworld Primitives ***
 **************************/

//fixme pass in aState?
var jsp = function(attribList) {
	checkListOf(undefined, attribList, function(x) { return isList(x) && length(x) == 2; },
		    'js-p', 'list of (list of X Y)', 1);
	var attribs = assocListToHash(attribList);
	var node = jsworld.MobyJsworld.p(attribs);
	node.toWrittenString = function(cache) { return "(js-p)"; };
	node.toDisplayedString = node.toWrittenString;
	node.toDomNode = function(cache) { return node; };
	return helpers.wrapJsObject(node);
};
PRIMITIVES['js-p'] =
    new CasePrimitive('js-p',
	[new PrimProc('js-p', 0, false, false, function(aState) { return jsp(types.EMPTY); }),
	 new PrimProc('js-p', 1, false, false, 
                      function(aState, v) { return jsp(v); })]);


var jsdiv = function(attribList) {
	checkListOf(undefined, attribList, isAssocList, 'js-div', '(listof X Y)', 1);

	var attribs = assocListToHash(attribList);
	var node = jsworld.MobyJsworld.div(attribs);
	
	node.toWrittenString = function(cache) { return "(js-div)"; };
	node.toDisplayedString = node.toWrittenString;
	node.toDomNode = function(cache) { return node; };
	return helpers.wrapJsObject(node);
};
PRIMITIVES['js-div'] =
    new CasePrimitive('js-div',
	[new PrimProc('js-div', 0, false, false, function(aState) { return jsdiv(types.EMPTY); }),
	 new PrimProc('js-div', 1, false, false, 
                      function(aState, v) { return jsdiv(v); })]);


var jsButtonBang = function(funName) {
    return function(aState, worldUpdateF, effectF, attribList) {
		check(aState, worldUpdateF, isFunction, funName, "function", 1);
		check(aState, effectF, isFunction, funName, "function", 2);
		checkListOf(undefined, attribList, isAssocList, funName, '(listof X Y)', 3);

		var attribs = attribList ? assocListToHash(attribList) : {};
		var node = jsworld.MobyJsworld.buttonBang(worldUpdateF, effectF, attribs);

		node.toWrittenString = function(cache) { return '(' + funName + ' ...)'; };
		node.toDisplayedString = node.toWrittenString;
		node.toDomNode = function(cache) { return node; };
		return helpers.wrapJsObject(node);
	}
};
var jsButton = function(aState, updateWorldF, attribList) {
    var noneF = new types.PrimProc('', 1, false, false, function(aState, w) { return types.EMPTY; });
        return jsButtonBang('js-button')(aState, updateWorldF, noneF, attribList);
};
PRIMITIVES['js-button'] =
    new CasePrimitive('js-button',
	[new PrimProc('js-button', 1, false, false,
                      function(aState, v) { return jsButton(aState, v); }),
	 new PrimProc('js-button', 2, false, false,
                      function(aState, v, w) { return jsButton(aState, v, w); })]);

PRIMITIVES['js-button!'] =
    new CasePrimitive('js-button!',
	[new PrimProc('js-button!', 2, false, false, jsButtonBang('js-button!')),
	 new PrimProc('js-button!', 3, false, false, jsButtonBang('js-button!'))]);



var jsInput = function(type, updateF, attribList) {
	check(aState, type, isString, 'js-input', 'string', 1);
	check(aState, updateF, isFunction, 'js-input', "function", 2);
	checkListOf(undefined, attribList, isAssocList, 'js-input', '(listof X Y)', 3);

	var attribs = attribList ? assocListToHash(attribList) : {};
	var node = jsworld.MobyJsworld.input(type, updateF, attribs);

	node.toWrittenString = function(cache) { return "(js-input ...)"; }
	node.toDisplayedString = node.toWrittenString;
	node.toDomNode = function(cache) { return node; }
	return helpers.wrapJsObject(node);
};
PRIMITIVES['js-input'] =
	new CasePrimitive('js-input', 
	[new PrimProc('js-input', 2, false, false, 
                      function(aState, type, updateF) { return jsInput(type, updateF); }),
	 new PrimProc('js-input', 3, false, false,
                      function(aState, type, udpateF, attribList) { return jsInput(type, updateF, attribList); })]);



var jsImg = function(src, attribList) {
	check(aState, src, isString, "js-img", "string", 1);
	checkListOf(undefined, attribList, isAssocList, 'js-img', '(listof X Y)', 2);

	var attribs = assocListToHash(attribList);
	var node = jsworld.MobyJsworld.img(src, attribs);

	node.toWrittenString = function(cache) { return "(js-img ...)"; }
	node.toDisplayedString = node.toWrittenString;
	node.toDomNode = function(cache) { return node; }
	return helpers.wrapJsObject(node);
};
PRIMITIVES['js-img'] =
    new CasePrimitive('js-img',
        [new PrimProc('js-img', 1, false, false, function(aState, src) { return jsImg(src, types.EMPTY); }),
	 new PrimProc('js-img', 2, false, false, function(aState, src, l) { return jsImg(src, l); })]);



PRIMITIVES['js-text'] =
    new PrimProc('js-text',
		 1,
		 false, false,
		 function(aState, s) {
		 	check(aState, s, isString, 'js-text', 'string', 1);

			var node = jsworld.MobyJsworld.text(s, []);
			node.toWrittenString = function(cache) { return "(js-text ...)"; }
			node.toDisplayedString = node.toWrittenString;
			node.toDomNode = function(cache) { return node; }
			return helpers.wrapJsObject(node);
		 });


var jsSelect = function(optionList, updateF, attribList) {
	checkListOf(undefined, optionList, isString, 'js-select', 'listof string', 1);
	check(aState, updateF, isFunction, 'js-select', "function", 2);
	checkListOf(undefined, attribList, isAssocList, 'js-select', '(listof X Y)', 3);

	var attribs = attribList ? assocListToHash(attribList) : {};
	var options = helpers.deepListToArray(optionList);
	var node = jsworld.MobyJsworld.select(options, updateF, attribs);

	node.toWrittenString = function(cache) { return '(js-select ...)'; };
	node.toDisplayedString = node.toWrittenString;
	node.toDomNode = function(cache) { return node; };
	return helpers.wrapJsObject(node);
};
PRIMITIVES['js-select'] =
    new CasePrimitive('js-select',
                      [new PrimProc('js-select', 2, false, false, function(aState, optionList, updateF) { return jsSelect(optionList, updateF); }),
                       new PrimProc('js-select', 3, false, false, function(aState, optionList, updateF, attribList) { return jsSelect(optionList, updateF, attribList); })]);


PRIMITIVES['big-bang'] =
PRIMITIVES['js-big-bang'] =
    new PrimProc('big-bang',
		 1,
		 true, false,
		 function(aState, initW, handlers) {
		 	arrayEach(handlers,
				function(x, i) {
					check(aState, x, function(y) { return isWorldConfigOption(y) || isList(y) || types.isWorldConfig(y); },
					      'big-bang', 'handler', i+2, [aState, initW].concat(handlers));
				});
		     var unwrappedConfigs = 
			 helpers.map(function(x) {
					if ( isWorldConfigOption(x) ) {
						return function(config) { return x.configure(config); };
					}
					else {
						return x;
					}
			 	     },
				     handlers);
		     return PAUSE(function(restarter, caller) {
			 var bigBangController;
			 var onBreak = function() {
			     bigBangController.breaker();
			 }
			 aState.addBreakRequestedListener(onBreak);
			 bigBangController = jsworld.MobyJsworld.bigBang(initW, 
						     aState.getToplevelNodeHook()(),
						     unwrappedConfigs,
						     caller, 
						     function(v) {
							 aState.removeBreakRequestedListener(onBreak);
							 restarter(v);
						     });
		     })
		 });

PRIMITIVES['animate'] =
 new PrimProc('animate',
		 1,
		 false, false,
		 function(aState, f) {
        check(aState, f, isFunction, "animate", "function", 1);
        check(aState, f, procArityContains(1), "animate", "1-argument function", 1);
       // on-tick is just add1, to-draw is f
       var handlers = [new OnTickBang(PRIMITIVES['add1'],
                                     new PrimProc('', 1, false, false,
                                                  function(aState, w) { return types.effectDoNothing(); }),
                                     DEFAULT_TICK_DELAY),
                       new ToDraw(f)];
       var unwrappedConfigs =
           helpers.map(function(x) {
             return isWorldConfigOption(x)? function(config) { return x.configure(config); } : x; },
             handlers);
		     return PAUSE(function(restarter, caller) {
           var bigBangController;
           var onBreak = function() { bigBangController.breaker(); }
           aState.addBreakRequestedListener(onBreak);
           bigBangController = jsworld.MobyJsworld.bigBang(1,
                     aState.getToplevelNodeHook()(),
                     unwrappedConfigs,
                     caller, 
                     function(v) {
                       aState.removeBreakRequestedListener(onBreak);
                       restarter(v);
                     });
             })
		 });


//////////////////////////////////////////////////////////////////////


    var emptyPage = function(attribList) {
	checkListOf(undefined, attribList, isAssocList, 'empty-page', '(listof X Y)', 1);

	var attribs = assocListToHash(attribList);
	var node = jsworld.MobyJsworld.emptyPage(attribs);
	
// 	node.toWrittenString = function(cache) { return "(js-div)"; };
// 	node.toDisplayedString = node.toWrittenString;
// 	node.toDomNode = function(cache) { return node; };
// 	return helpers.wrapJsObject(node);
	return node;
    };

    PRIMITIVES['empty-page'] =
	new CasePrimitive('empty-page',
			  [new PrimProc('empty-page', 0, false, false, 
					function(aState) {  return emptyPage(types.EMPTY); }),
			   new PrimProc('empty-page', 1, false, false,
                                        function(aState, v) { return emptyPage(v); })]);

    
    PRIMITIVES['place-on-page'] = 
	new PrimProc('empty-page',
		     4,
		     false, false,
		     function(aState, elt, left, top, page) {
			 // FIXME: add type checking
			 return jsworld.MobyJsworld.placeOnPage(
			     elt, left, top, page);
		     });
					    




//////////////////////////////////////////////////////////////////////





PRIMITIVES['make-world-config'] =
    new PrimProc('make-world-config',
		 2,
		 true, false,
		 function(aState, startup, shutdown, handlers) {
		 	var allArgs = [startup, shutdown].concat(handlers);
		 	check(aState, startup, isFunction, 'make-world-config', "function", 1, allArgs);
			check(aState, shutdown, procArityContains(1), 'make-world-config', 'function (arity 1)', 2, allArgs);
			arrayEach(handlers, function(x, i) { check(aState, x, isFunction, 'make-world-config', 'handler', i+3, allArgs); });

			if ( !procArityContains(handlers.length)(startup) ) {
				raise( types.incompleteExn(
					types.exnFailContract,
					'make-world-config: 1st argument must have arity equal to '
					+ 'the number of arguments after the second',
					[]) );
			}

			return types.worldConfig(startup, shutdown, handlers);
		 });


PRIMITIVES['make-effect-type'] =
	makeOptionPrimitive(
	    'make-effect-type',
	    4,
	    [false],
	    false,
	    function(userArgs, aState, name, superType, fieldCnt, impl, guard) {
		check(aState, name, isSymbol, 'make-effect-type', 'string', 1, userArgs);
		check(aState, superType, function(x) { return x === false || types.isEffectType(x) },
		      'make-effect-type', 'effect type or #f', 2, userArgs);
		check(aState, fieldCnt, isNatural, 'make-effect-type', 'exact non-negative integer', 3, userArgs);
		check(aState, impl, isFunction, 'make-effect-type', "function", 4, userArgs);
//		checkListOf(aState, handlerIndices, isNatural, 'make-effect-type', 'exact non-negative integer', 5);
		check(aState, guard, function(x) { return x === false || isFunction(x); }, 'make-effect-type', 'procedure or #f', 6, userArgs);
		// Check the number of arguments on the guard
		var numberOfGuardArgs = fieldCnt + 1 + (superType ? superType.numberOfArgs : 0);
		if ( guard && !procArityContains(numberOfGuardArgs)(guard) ) {
			raise(types.incompleteExn(
				types.exnFailContract,
				helpers.format(
					'make-effect-type: guard procedure does not accept ~a arguments '
					+ '(one more than the number constructor arguments): ~s',
					[numberOfGuardArgs, guard]),
				[]));
		}

//		var jsImpl = schemeProcToJs(aState, impl);
		var jsGuard = (guard ? schemeProcToJs(aState, guard) : false);
//		var handlerIndices_js = helpers.map(jsnums.toFixnum, helpers.schemeListToArray(handlerIndices));

//		var caller = makeCaller(aState);
//		var wrapHandler = function(handler, changeWorld) {
//			return types.jsObject('function', function() {
//				var externalArgs = arguments;
//				changeWorld(function(w, k) {
//					var args = [w];
//					for (var i = 0; i < externalArgs.length; i++) {
//						args.push( helpers.wrapJsObject(externalArgs[i]) );
//					}
//					caller(handler, args, k);
//				});
//			});
//		}

		var anEffectType = types.makeEffectType(name.toString(),
							superType,
							fieldCnt,
							impl,
//							handlerIndices_js,
							jsGuard,
							makeCaller(aState));
		return getMakeStructTypeReturns(anEffectType);
	    });


PRIMITIVES['effect-type?'] = new PrimProc('effect-type?', 1, false, false,
                                          function(aState, v) { return types.isEffectType(v); });
PRIMITIVES['effect?'] = new PrimProc('effect?', 1, false, false, 
                                     function(aState, v) { return types.isEffect(v); });

//PRIMITIVES['make-effect:do-nothing'] = new PrimProc('make-effect:do-nothing', 0, false, false, types.EffectDoNothing.constructor);
//PRIMITIVES['effect:do-nothing?'] = new PrimProc('effect:do-nothing?', 1, false, false, types.EffectDoNothing.predicate);


PRIMITIVES['make-render-effect-type'] =
	makeOptionPrimitive(
	    'make-render-effect-type',
	    4,
	    [false],
	    false,
	    function(userArgs, aState, name, superType, fieldCnt, impl, guard) {
		check(aState, name, isSymbol, 'make-render-effect-type', 'string', 1, userArgs);
		check(aState, superType, function(x) { return x === false || types.isEffectType(x) },
		      'make-render-effect-type', 'effect type or #f', 2, userArgs);
		check(aState, fieldCnt, isNatural, 'make-render-effect-type', 'exact non-negative integer', 3, userArgs);
		check(aState, impl, isFunction, 'make-render-effect-type', "function", 4, userArgs);
		check(aState, guard, function(x) { return x === false || isFunction(x); }, 'make-render-effect-type', 'procedure or #f', 6, userArgs);
		// Check the number of arguments on the guard
		var numberOfGuardArgs = fieldCnt + 1 + (superType ? superType.numberOfArgs : 0);
		if ( guard && !procArityContains(numberOfGuardArgs)(guard) ) {
			raise(types.incompleteExn(
				types.exnFailContract,
				helpers.format(
					'make-effect-type: guard procedure does not accept ~a arguments '
					+ '(one more than the number constructor arguments): ~s',
					[numberOfGuardArgs, guard]),
				[]));
		}
		var jsGuard = (guard ? schemeProcToJs(aState, guard) : false);

		var aRenderEffectType = types.makeRenderEffectType(name.toString(),
								   superType,
								   fieldCnt,
								   impl,
								   jsGuard);
		return getMakeStructTypeReturns(aRenderEffectType);
	    });


PRIMITIVES['render-effect-type?'] = new PrimProc('render-effect-type?', 1, false, false,
                                                 function(aState, v) { return types.isRenderEffectType(v); });
PRIMITIVES['render-effect?'] = new PrimProc('render-effect?', 1, false, false,
                                            function(aState, v) { return types.isRenderEffect(v); });


PRIMITIVES['world-with-effects'] =
    new PrimProc('world-with-effects',
		 2,
		 false, false,
		 function(aState, effects, w) {
		 	check(aState, effects, isCompoundEffect, 'world-with-effects', 'compound effect', 1, arguments);

			return jsworld.Jsworld.with_multiple_effects(w, helpers.flattenSchemeListToArray(effects));
		 });



PRIMITIVES['make-render-effect'] = new PrimProc('make-render-effect', 2, false, false, 
                                                function(aState, x, y) { return types.makeRenderEffect(x, y); });

PRIMITIVES['render-effect?'] = new PrimProc('render-effect?', 1, false, false,
                                            function(aState, v) { return types.isRenderEffect(v); });

PRIMITIVES['render-effect-dom-node'] =
    new PrimProc('render-effect-dom-node',
		 1,
		 false, false,
		 function(aState, effect) {
		 	check(aState, effect, types.isRenderEffect, 'render-effect-dom-node', 'render-effect', 1);
			return types.renderEffectDomNode(effect);
		 });

PRIMITIVES['render-effect-effects'] =
    new PrimProc('render-effect-effects',
		 1,
		 false, false,
		 function(aState, effect) {
		 	check(aState, effect, types.isRenderEffect, 'render-effect-effects', 'render-effect', 1);
			return types.renderEffectEffects(effect);
		 });





/********************************
 *** Scheme -> Javascript FFI ***
 ********************************/

PRIMITIVES['scheme->prim-js'] =
    new PrimProc('scheme->prim-js',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, function(y) { return ( isReal(y) ||
							isString(y) ||
							isSymbol(y) ||
							isChar(y) ||
							isBoolean(y) ) ||
							isVector(y); },
			      'scheme->prim-js', 'real number, string, symbol, char, boolean, or vector', 1);

			var returnVal;
		 	if ( isReal(x) ) {
				if ( !( jsnums.equals(x, jsnums.nan) ||
					jsnums.equals(x, jsnums.inf) ||
					jsnums.equals(x, jsnums.negative_inf) ) &&
				     ( jsnums.greaterThan(x, 9e15) ||
				       jsnums.lessThan(x, -9e15) ) ) {
					raise(types.incompleteExn(
						types.exnFailContract,
						helpers.format('scheme->primitive-js: only numbers in [-9e15, 9e15] '
								+ 'are accurately representable in javascript; given: ~s',
							       [x]),
						[]));
				}
				returnVal = jsnums.toFixnum(x);
			}
			else if ( isString(x) ) {
				returnVal = x.toString();
			}
			else if ( isSymbol(x) || isChar(x) ) {
				returnVal = x.val;
			}
			else if ( isBoolean(x) ) {
				returnVal = x;
			}
			else if ( isVector(x) ) {
				returnVal = x.elts.slice(0);
			}
			return helpers.wrapJsObject(returnVal);
		 });


PRIMITIVES['prim-js->scheme'] =
    new PrimProc('prim-js->scheme',
		 1,
		 false, false,
		 function(aState, x) {
		 	check(aState, x, function(y) { return isJsObject(y) &&
						      ( typeof(y.obj) == 'number' ||
							typeof(y.obj) == 'string' ||
							typeof(y.obj) == 'boolean' ||
							typeof(y.obj) == 'function' ||
							y.obj instanceof Array ); },
			      'prim-js->scheme', 'javascript number, string, boolean, function, or array', 1);

		 	if ( typeof(x.obj) === 'number' ) {
				return types['float'](x.obj);
			}
			else if ( typeof(x.obj) === 'string' || typeof(x.obj) === 'boolean' ) {
				return x.obj;
			}
			else if ( typeof(x.obj) === 'function' ) {
				return new PrimProc('', 0, true, false, function(args) { return x.obj.apply(null, args); });
			}
			else if ( x.obj instanceof Array ) {
				return types.vector(x.obj.slice(0));
			}
		 });


PRIMITIVES['procedure->cps-js-fun'] =
    new PrimProc('procedure->cps-js-fun',
		 1,
		 false, false,
		 function(aState, proc) {
		 	check(aState, proc, isFunction, 'procedure->cps-js-fun', "function", 1);

			var caller = makeCaller(aState);
			return types.jsObject(proc.name + ' (cps)', function() {
				var args = helpers.map(helpers.wrapJsObject, arguments);
				var k = (args.length == 0 ? function() {} : args.shift());

				caller(proc, args, k);
			});
		 });


PRIMITIVES['procedure->void-js-fun'] =
    new PrimProc('procedure->void-js-fun',
		 1,
		 false, false,
		 function(aState, proc) {
		 	check(aState, proc, isFunction, 'procedure->void-js-fun', "function", 1);

			var caller = makeCaller(aState);
			return types.jsObject(proc.name + ' (void)', function() {
				var args = helpers.map(helpers.wrapJsObject, arguments);
				caller(proc, args, function() {});
			});
		 });


PRIMITIVES['js-==='] =
    new PrimProc('js-===',
		 2,
		 false, false,
		 function(aState, v1, v2) {
		 	check(aState, v1, isJsObject, 'js-===', 'javascript value', 1);
			check(aState, v2, isJsObject, 'js-===', 'javascript value', 2);

		     return (v1.obj === v2.obj);
		 });


PRIMITIVES['js-get-named-object'] =
    new PrimProc('js-get-named-object',
		 1,
		 false, false,
		 function(aState, name) {
		 	check(aState, name, isString, 'js-get-named-object', 'string', 1);

			var nameStr = name.toString();
			var obj = (nameStr === 'window') ? window : window[nameStr];
			return types.jsObject(nameStr, obj);
		 });


PRIMITIVES['js-get-field'] =
    new PrimProc('js-get-field',
		 2,
		 true, false,
		 function(aState, root, firstSelector, selectors) {
		 	selectors.unshift(firstSelector);
			var allArgs = [root].concat(selectors);
		 	check(aState, root, isJsObject, 'js-get-field', 'js-object', 1, allArgs);
			arrayEach(selectors, function(x, i) { check(aState, x, isString, 'js-get-field', 'string', i+2, allArgs); });

			var name = [root.name];
			var obj = root.obj;

			for (var i = 0; i < selectors.length; i++) {
				if ( obj === undefined ) {
					var joinedName = name.join('');
					raise(types.incompleteExn(
						types.exnFailContract,
						helpers.format('js-get-field: tried to access field ~a of ~a, but ~a was undefined',
							       [selectors[i], joinedName, joinedName]),
						[]));
				}
				name.push( '["' + selectors[i].toString() + '"]' );
				obj = obj[selectors[i].toString()];
			}
			return types.jsObject(name.join(''), obj);
		 });


PRIMITIVES['js-set-field!'] =
    new PrimProc('js-set-field!',
		 3,
		 false, false,
		 function(aState, obj, field, val) {
		 	check(aState, obj, function(x) { return isJsObject(x) && typeof(x.obj) == 'object'; },
			      'js-set-field!', 'javascript object', 1, arguments);
			check(aState, field, isString, 'js-set-field!', 'string', 2, arguments);

			obj.obj[field.toString()] = (isJsObject(val) ? val.obj : val);
			return types.VOID;
		 });


PRIMITIVES['js-typeof'] =
    new PrimProc('js-typeof',
		 1,
		 false, false,
		 function(aState, jsObj) {
		 	check(aState, jsObj, isJsObject, 'js-typeof', 'js-object', 1);
			return typeof(jsObj.obj);
		 });


PRIMITIVES['js-instanceof'] =
    new PrimProc('js-instanceof',
		 2,
		 false, false,
		 function(aState, obj, type) {
		 	check(aState, obj, isJsObject, 'js-instanceof', 'js-object', 1, arguments);
			check(aState, type, isJsFunction, 'js-instanceof', 'javascript function', 2, arguments);

			return (obj.obj instanceof type.obj);
		 });


PRIMITIVES['js-call'] =
    new PrimProc('js-call',
		 2,
		 true, false,
		 function(aState, fun, parent, initArgs) {
		 	var allArgs = [fun, parent].concat(initArgs);
		 	check(aState, fun, isJsFunction, 'js-call', 'javascript function', 1, allArgs);
			check(aState, parent, function(x) { return (x === false ||
							    (isJsObject(x) && typeof(x.obj) == 'object')); },
			      'js-call', 'javascript object or false', 2, allArgs);
			
			var args = helpers.map(function(x) { return (isJsObject(x) ? x.obj : x); }, initArgs);
			var thisArg = parent ? parent.obj : null;
			var jsCallReturn = fun.obj.apply(thisArg, args);
			if ( jsCallReturn === undefined ) {
				return types.VOID;
			}
			else {
				return helpers.wrapJsObject(jsCallReturn);
			}
		 });


PRIMITIVES['js-new'] =
    new PrimProc('js-new',
		 1,
		 true, false,
		 function(aState, constructor, initArgs) {
		 	checkVarArity(aState, constructor, isJsFunction, 'js-new', 'javascript function', 1);

			var args = helpers.map(function(x) { return (isJsObject(x) ? x.obj : x); }, initArgs);
			var proxy = function() {
				constructor.obj.apply(this, args);
			};
			proxy.prototype = constructor.obj.prototype;

			return helpers.wrapJsObject(new proxy());
		 });


PRIMITIVES['js-make-hash'] =
    new CasePrimitive('js-make-hash',
	[new PrimProc('js-make-hash', 0, false, false, function() { return types.jsObject('hash', {}); }),
	 new PrimProc('js-make-hash',
		      1,
		      false, false,
		      function(aState, bindings) {
			  checkListOf(aState, bindings, function(x) { return isAssocList(x) && isString(x.first()); },
				      'js-make-hash', '(listof string X)', 1);

			  var ret = {};
			  while ( !bindings.isEmpty() ) {
			  	var key = bindings.first().first().toString();
				var val = bindings.first().rest().first();
				ret[key] = (isJsObject(val) ? val.obj : val);
				bindings = bindings.rest();
			  }
			  return types.jsObject('hash', ret);
		      }) ]);




/***************************
 *** Primitive Constants ***
 ***************************/


PRIMITIVES['eof'] = types.EOF;
PRIMITIVES['e'] = jsnums.e;
PRIMITIVES['empty'] = types.EMPTY;
PRIMITIVES['false'] = false;
PRIMITIVES['true'] = true;
PRIMITIVES['pi'] = jsnums.pi;
PRIMITIVES['null'] = types.EMPTY;
PRIMITIVES['empty-image'] = world.Kernel.sceneImage(0, 0, [], true);

//PRIMITIVES['effect:do-nothing'] = types.EffectDoNothing;

PRIMITIVES['js-undefined'] = types.jsObject('undefined', undefined);
PRIMITIVES['js-null'] = types.jsObject('null', null);




/////////////////////////////////////////////////////////////////////////////////////////////

// getPrimitive: string (string | undefined) -> scheme-value
primitive.getPrimitive = function(name, resolvedModuleName) {
    // FIXME: add special logic here for teachpacks.

    return PRIMITIVES[name];
};

primitive.isPrimitive = function(x) {
    return x instanceof PrimProc;
};

primitive.addPrimitive = function(name, aPrim) {
    PRIMITIVES[name] = aPrim;
};

primitive.Primitive = PrimProc;
primitive.CasePrimitive = CasePrimitive;


primitive.setCALL = setCALL;
primitive.setPAUSE = setPAUSE;

})();
// Control structures

/*
var sys = require('sys');
var types = require('./types');
var primitive = require('./primitive');
var types = require('./types');



var DEBUG_ON = false;

var setDebug = function(v) {
    DEBUG_ON = v;
}

var debug = function(s) {
    if (DEBUG_ON) {
	sys.debug(s);
    }
}

var debugF = function(f_s) {
    if (DEBUG_ON) {
	sys.debug(f_s());
    }
}
*/

var control = {};


(function() {


//////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////
// INTERNAL
// Set
// Setting stack values.

var SetControl = function(depth) {
    this.depth = depth;
};
SetControl.prototype.invoke = function(state) {
    debug("SET " + this.depth);
    if (state.vstack.length - 1 - (this.depth || 0) < 0) {
	throw types.internalError("vstack not long enough",
				  state.captureCurrentContinuationMarks(aState));
    }
    state.setn(this.depth, state.v);
};


//////////////////////////////////////////////////////////////////////
// INTERNAL
// Push a value into the nth position on the stack

var PushnControl = function(n) {
    this.n = n;
};
PushnControl.prototype.invoke = function(state) {
    state.pushn(this.n);
};


// INTERNAL
var SwapControl = function(depth) {
    this.depth = depth;
};

SwapControl.prototype.invoke = function(state) {
    debug("SWAP " + this.depth);
    if (state.vstack.length - 1 - (this.depth || 0) < 0) {
	throw types.internalError("vstack not long enough",
				  state.captureCurrentContinuationMarks(aState));
    }
    var tmp = state.vstack[state.vstack.length - 1 - (this.depth || 0)];
    state.vstack[state.vstack.length - 1 - (this.depth || 0)] = state.v;
    state.v = tmp;
};



// Internal
// Pop n values
var PopnControl = function(n) { 
    this.n = n;
};

PopnControl.prototype.invoke = function(state) {
    state.popn(this.n);
};





//////////////////////////////////////////////////////////////////////














//////////////////////////////////////////////////////////////////////
// Modules

var Prefix = function(params) {
    this.numLifts = params.numLifts;
    this.toplevels = params.toplevels;
};


var ModControl = function(prefix, body) {
    this.prefix = prefix;
    this.body = body;
};

ModControl.prototype.invoke = function(state) {
    processPrefix(state, this.prefix);
    var cmds = [];
    var i;
    for(i = 0; i < this.body.length; i++) {
      cmds.push(this.body[i]);
    }
    state.pushManyControls(cmds);
};


//////////////////////////////////////////////////////////////////////

var processPrefix = function(aState, prefix) {
  var numLifts = prefix.numLifts;
  var newPrefix = new types.PrefixValue();
  for (var i = 0; i < prefix.toplevels.length + numLifts; i++) {
    var top = prefix.toplevels[i];
    if (top === false) {
        newPrefix.addSlot();
    } else if (top['$'] === 'module-variable') {
        installModuleVariable(aState, newPrefix, top);
    } else if (top['$'] === 'global-bucket') {
        installGlobalBucket(aState, newPrefix, top);
    } else {
        throw types.internalError("unable to install toplevel element " + top,
                state.captureCurrentContinuationMarks(aState)); 
    }
  }
  aState.vstack.push(newPrefix);
};



// Module variables are looked up and installed into the prefix.
// To support interactive repls, these variables are also saved into
// the globals array so that subsequent compilations can refer to 
// variables that have already been mutated.
var installModuleVariable = function(aState, newPrefix, top) {
    var resolvedModuleName = resolveModuleName(top['modidx']);
    var primName = top.sym + '';

    var aPrim = primitive.getPrimitive(primName, resolvedModuleName);
    if (typeof(aPrim) !== 'undefined') {
      aState.globals[primName] = new types.GlobalBucket(primName, aPrim);
      newPrefix.addSlot(aState.globals[primName]);
    } else {
      aState.globals[primName] = new types.GlobalBucket(primName,
                                                        new types.ModuleVariableRecord(
                                                          resolvedModuleName, primName));
      newPrefix.addSlot(aState.globals[primName]);
    }
};


var installGlobalBucket = function(aState, newPrefix, top) {
    var name = top.value+'';
    if (! aState.globals[name]) {
      aState.globals[name] = new types.GlobalBucket(name, types.UNDEFINED);
    } else {
      // Otherwise, do nothing but reuse the global bucket.
    }
    newPrefix.addSlot(aState.globals[name]);
};




var resolveModuleName = function(modulePathIndex) {
    return modulePathIndex['path'];
    // FIXME: currently ignoring base
    //modulePathIndex['base']
};




//////////////////////////////////////////////////////////////////////
// Constants


var ConstantControl = function(value) {
    this.value = value;
};


ConstantControl.prototype.invoke = function(state) {
    state.v = this.value;
};





//////////////////////////////////////////////////////////////////////
// Branches


var BranchControl = function(test, thenPart, elsePart) {
    this.test = test;
    this.thenPart = thenPart;
    this.elsePart = elsePart;
};


BranchControl.prototype.invoke = function(state) {
    var cmds = [];
    cmds.push(this.test);
    cmds.push(new BranchRestControl(this.thenPart, this.elsePart));
    state.pushManyControls(cmds);
};

var BranchRestControl = function(thenPart, elsePart) {
    this.thenPart = thenPart;
    this.elsePart = elsePart;
};


BranchRestControl.prototype.invoke = function(state) {
    debug("BRANCH");
    if (state.v !== false && state.v !== undefined) {
      state.pushControl(this.thenPart);
    } else {
      state.pushControl(this.elsePart);
    }
};



//////////////////////////////////////////////////////////////////////
// Require statements
var RequireControl = function(resolvedModuleName) {
    this.name = resolvedModuleName;
};

RequireControl.prototype.invoke = function(state) {
    var that = this;
    var onPause = function(restart, call) {
	if (state.invokedModules[that.name]) {
	    // Already invoked.
	    restart(types.VOID);
	} else {
      // Otherwise, try to load and invoke it.

      // If has already been loaded, just invoke.
      var isLoaded = function(name) {
          return typeof(window.COLLECTIONS) !== 'undefined' && window.COLLECTIONS[name]
      };
      var doTheInvoke = function() {
        var moduleRecord = window.COLLECTIONS[that.name];
        invokeModuleAndRestart(state, moduleRecord, restart);
      };
      var raiseTheError = function() {
        restart(types.schemeError(types.incompleteExn(types.exn,
                                                      "unable to load " + that.name +
                                                      ": it isn't in the set of known collections",
                                                      [])));
      };

	    if (isLoaded(that.name)){
        doTheInvoke();
	    } else {
        // But if it hasn't been loaded, we must do that first, and then
        // invoke.
        // dynamic module loader:
        state.hooks.dynamicModuleLoader(
            that.name,
            function() {
                if (isLoaded(that.name)) {
                    doTheInvoke();
                } else {
                    raiseTheError();
                }
            },
            raiseTheError);
	    }
	}
    };
    throw new PauseException(onPause);
};


// invokeModuleAndRestart: state moduleRecord (-> void) -> void
// Invokes the given moduleRecord and restarts the parent evaluation.
// The invoked module is installed, along with its provides.
var invokeModuleAndRestart = function(state, moduleRecord, restart) {
    var modulePrefix;
    var onSuccess = function() {
      var providedValues = {};
      for (var i = 0; i < moduleRecord.provides.length; i++) {
          var providedName = moduleRecord.provides[i];
          var globalBucket = state.globals[providedName]
          if (! globalBucket) {
            restart(types.schemeError(
                types.exn("module " + moduleRecord.name +
                    " is missing an expected definition for " +
                    providedName)));
            return;
          } else {
            providedValues[providedName] = globalBucket.value;
          }
      }
      state.invokedModules[moduleRecord.name] = 
          { record: moduleRecord,
            providedValues: providedValues };
      restart(types.VOID);
    };
    var onFail = function(exn) { restart(exn); };
    state.clearForEval({preserveBreak: true, clearGlobals: true});
    interpret.load(moduleRecord.bytecode, state);
    modulePrefix = state.vstack[state.vstack.length-1];
    interpret.run(state, onSuccess, onFail);
};




//////////////////////////////////////////////////////////////////////
// Sequences


var SeqControl = function(forms) {
    this.forms = forms;
};


SeqControl.prototype.invoke = function(state) {
    var forms = this.forms;
    var cmds = [];
    for (var i = 0; i < forms.length; i++) { cmds.push(forms[i]); }
    state.pushManyControls(cmds);    
};



//////////////////////////////////////////////////////////////////////
// Beg0

var Beg0Control = function(seq) {
    this.seq = seq;
};

Beg0Control.prototype.invoke = function(state) {
    if (this.seq.length === 1) {
      state.pushControl(this.seq[0]);
    } else {
      var rest = [];
      for (var i = 1; i < this.seq.length; i++) {
          rest.push(this.seq[i]);
      }
      state.pushManyControls([this.seq[0], new Beg0RestControl(rest)]);
    }
};


var Beg0RestControl = function(rest) {
    this.rest = rest;
};

Beg0RestControl.prototype.invoke = function(state) {
    // Rearrange the control stack so the rest of the
    // begin sequence will evaluate, followed by 
    // bringing the first expression's value back into
    // the value register.
    state.pushControl(new ConstantControl(state.v));
    state.pushManyControls(this.rest);
};



//////////////////////////////////////////////////////////////////////
// Toplevel variable lookup

var ToplevelControl = function(depth, pos, loc) {
    this.depth = depth;
    this.pos = pos;
    this.loc = loc;
    // FIXME: use isConst and isReady 
};

ToplevelControl.prototype.invoke = function(state) {
    state.v = state.refPrefix(this.depth, this.pos, this.loc);
};



//////////////////////////////////////////////////////////////////////
// Local variable references

var LocalrefControl = function(pos, isUnbox) {
    this.pos = pos;
    this.isUnbox = isUnbox;
};

LocalrefControl.prototype.invoke = function(state) {
    var val = state.peekn(this.pos);
    if (this.isUnbox) { val = val.unbox(); }
    state.v = val;
};



//////////////////////////////////////////////////////////////////////
// Primitive value lookup

var PrimvalControl = function(name) {
    this.name = name + '';
};

PrimvalControl.prototype.invoke = function(aState) {
  var prim = primitive.getPrimitive(this.name, undefined);
  if (! prim) {
    throw types.internalError("Primitive " + this.name + " not implemented!",
                              state.captureCurrentContinuationMarks(aState));
  }
  aState.v = prim;
};



//////////////////////////////////////////////////////////////////////
// Lambdas

var LamControl = function(params) {
    this.name = params.name;
    this.locs = params.locs;
    this.numParams = params.numParams;
    this.paramTypes = params.paramTypes;
    this.isRest = params.isRest;
    this.closureMap = params.closureMap;
    this.closureTypes = params.closureTypes;
    this.body = params.body;
};


LamControl.prototype.invoke = function(state) {
    state.v = new types.ClosureValue(this.name,
				     this.locs,
				     this.numParams, 
				     this.paramTypes, 
				     this.isRest, 
				     makeClosureValsFromMap(state,
							    this.closureMap,
							    this.closureTypes), 
				     this.body);
};


// makeClosureValsFromMap: state [number ...] -> [scheme-value ...]
// Builds the array of closure values, given the closure map and its
// types.
var makeClosureValsFromMap = function(state, closureMap, closureTypes) {
    var closureVals = [];
    for (var i = 0; i < closureMap.length; i++) {
      var val, type;
      val = state.peekn(closureMap[i]);
      type = closureTypes[i];
      // FIXME: look at the type; will be significant?
      closureVals.push(val);
    }
    return closureVals;
};



//////////////////////////////////////////////////////////////////////
// Letrec
// Recursive definitions.

var LetRecControl = function(procs, body) {
    this.procs = procs;
    this.body = body;
};

LetRecControl.prototype.invoke = function(state) {
    var cmds = [];
    var n = this.procs.length;
    for (var i = 0; i < n; i++) {
	cmds.push(this.procs[i]);
	cmds.push(new SetControl(n - 1 - i));
    }
    cmds.push(new LetrecReinstallClosureControls(this.procs));
    cmds.push(this.body);
    state.pushManyControls(cmds);
};


var LetrecReinstallClosureControls = function(procs) {
    this.procs = procs;
};


LetrecReinstallClosureControls.prototype.invoke = function(state) {
    // By this point, all the closures in this.proc are installed, but
    // their closures need to be refreshed.
    var n = this.procs.length;
    for (var i = 0; i < n; i++) {
      var procRecord = this.procs[i];
      var closureVal = state.peekn(n - 1 - i);
      closureVal.closureVals = makeClosureValsFromMap(state, 
                  procRecord.closureMap,
                  procRecord.closureTypes);
    }
};



//////////////////////////////////////////////////////////////////////
// Define Values


var DefValuesControl = function(ids, body) {
    this.ids = ids;
    this.body = body;
};


DefValuesControl.prototype.invoke = function(state) {
    var cmds = [];
    cmds.push(this.body);
    cmds.push(new DefValuesInstallControl(this.ids))
    state.pushManyControls(cmds);
};


var DefValuesInstallControl = function(ids) {
    this.ids = ids;
};

DefValuesInstallControl.prototype.invoke = function(aState) {
    debug("DEF_VALUES");

    //the following two are empty, because aState does not have the information
    var positionStack = state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
    var locationList = positionStack[positionStack.length - 1];

    var bodyValue = aState.v;

    var idLength = this.ids.length;

    if (bodyValue instanceof types.ValuesWrapper) {
      if (this.ids.length !== bodyValue.elts.length) {
          helpers.raise(
            //   types.incompleteExn(types.exnFailContract,
            //    new types.Message([new types.ColoredPart("define-values", locationList.first()), 
            //                     ": expected ", 
                         //          [new types.MultiPart(idLength+'', 
            //it is impossible to find the locationList, due to how values is returning information.

        types.exnFailContractArity("define-values: expected " + this.ids.length 
                 + " values, but received " + bodyValue.elts.length,
                 state.captureCurrentContinuationMarks(aState)));
      }
      for (var i = 0; i < this.ids.length; i++) {
          aState.setPrefix(this.ids[i].depth,
              this.ids[i].pos,
              bodyValue.elts[i]);
      }
    } else {
      if (this.ids.length !== 1) {
          helpers.raise(
        types.exnFailContractArity("define-values: expected " + this.ids.length 
                 + " values, but only received one: " + bodyValue,
                 state.captureCurrentContinuationMarks(aState)));
      } else {
          aState.setPrefix(this.ids[0].depth,
              this.ids[0].pos,
              bodyValue);
      }
    }
};



//////////////////////////////////////////////////////////////////////
// Procedure application

var ApplicationControl = function(rator, rands) {
    this.rator = rator;
    this.rands = rands;
};


ApplicationControl.prototype.invoke = function(state) {
    var rator = this.rator;
    var rands = this.rands;

    var cmds = [];    
    // We allocate as many values as there are operands.
    if (rands.length !== 0) {
      cmds.push(new PushnControl(rands.length));
    }
    cmds.push(rator);    
    if (rands.length !== 0) {
      cmds.push(new SetControl(rands.length-1));
    }

    for (var i = 0; i < rands.length; i++) {
      if (i !== rands.length - 1) {
          cmds.push(rands[i]);
          cmds.push(new SetControl(i));
      } else {
          cmds.push(rands[rands.length-1]);
          cmds.push(new SwapControl(rands.length-1));
      }
    }
    cmds.push(new CallControl(rands.length));
    // CallControl will be responsible for popping off the 
    // value stack elements.

    state.pushManyControls(cmds);
};




var CallControl = function(n) {
    this.n = n;
};

CallControl.prototype.invoke = function(state) {
    debug("CALL " + this.n);
    var operandValues = state.popn(this.n);
    callProcedure(state, state.v, this.n, operandValues);
};


var callProcedure = function(aState, procValue, n, operandValues) {
    procValue = selectProcedureByArity(aState, n, procValue, operandValues);
    procValue.callProcedure(aState, procValue, n, operandValues);
/*
  if (primitive.isPrimitive(procValue)) {
	callPrimitiveProcedure(aState, procValue, n, operandValues);
    } else if (procValue instanceof types.ClosureValue) {
	callClosureProcedure(aState, procValue, n, operandValues);
    } else if (procValue instanceof types.ContinuationClosureValue) {
	callContinuationProcedure(aState, procValue, n, operandValues);
    } else {
	throw types.internalError("Something went wrong with checking procedures!",
				  state.captureCurrentContinuationMarks(aState));
    }
 */
};


var callPrimitiveProcedure = function(state, procValue, n, operandValues) {
    // Tail call optimization:
    if (state.cstack.length !== 0 && 
      state.cstack[state.cstack.length - 1] instanceof PopnControl) {
      state.cstack.pop().invoke(state);
    }
    var args = preparePrimitiveArguments(state, 
					 procValue, 
					 operandValues,
					 n);
    var result = procValue.impl.apply(procValue.impl, args);
    processPrimitiveResult(state, result, procValue);
};


var processPrimitiveResult = function(state, result, procValue) {
    if (result instanceof INTERNAL_CALL) {
      state.cstack.push(new InternalCallRestartControl(result.k, procValue));

      addNoLocationContinuationMark(state, result.operands.length);
      callProcedure(state,
              result.operator, 
              result.operands.length, 
              result.operands);
    } else if (result instanceof INTERNAL_PAUSE) {
      throw new PauseException(result.onPause);
    } else {
      if (! procValue.assignsToValueRegister) {
          state.v = result;
      }
    }
};



var PauseException = function(onPause) {
    this.onPause = onPause;
};




//////////////////////////////////////////////////////////////////////
// INTERNAL_CALL
// used for interaction between the Primitives and the interpreter (callPrimitiveProcedure).
// Don't confuse this with CallControl.
var INTERNAL_CALL = function(operator, operands, k) {
    this.operator = operator;
    this.operands = operands;
    this.k = k;
};


var InternalCallRestartControl = function(k, procValue) {
    this.k = k;
    this.procValue = procValue;
};

InternalCallRestartControl.prototype.invoke = function(state) {
    processPrimitiveResult(state,
			   this.k(state.v), 
			   this.procValue);
};

primitive.setCALL(INTERNAL_CALL);



// When we're doing an application, but we don't have source locations,
// we the following function to add the mark.
var addNoLocationContinuationMark = function(aState, n) {
    var i;
    var nonPositions = [types.NoLocation];
    for (i = 0; i < n; i++) { nonPositions.push(types.NoLocation); }
//    var aHash = types.makeLowLevelEqHash();
//    aHash.put('moby-application-position-key',
//              types.list(nonPositions));
    aHash = {};
    aHash["moby-application-position-key"] = types.list(nonPositions);
    aState.pushControl(types.contMarkRecordControl(aHash));
};






//////////////////////////////////////////////////////////////////////

// INTERNAL_PAUSE
// used for interaction between the Primitive functions and the
// interpreter.
// Halts the interpreter, but passing onPause the functions necessary
// to restart computation.
var INTERNAL_PAUSE = function(onPause) {
    this.onPause = onPause;
};


primitive.setPAUSE(INTERNAL_PAUSE);

//////////////////////////////////////////////////////////////////////








var callClosureProcedure = function(state, procValue, n, operandValues) {
    // Tail call optimization
    if (state.cstack.length !== 0 && 
	state.cstack[state.cstack.length - 1] instanceof PopnControl) {
	state.cstack.pop().invoke(state);
	var argCount = prepareClosureArgumentsOnStack(state, 
						      procValue, 
						      operandValues,
						      n);
	state.pushControl(new PopnControl(argCount));
	state.pushControl(procValue.body);

    } else if (state.cstack.length >= 2 &&
	       types.isContMarkRecordControl(state.cstack[state.cstack.length - 1]) &&
	       state.cstack[state.cstack.length - 2] instanceof PopnControl) {
	// Other tail call optimzation: if there's a continuation mark frame...
	state.cstack[state.cstack.length - 2].invoke(state);
	var argCount = prepareClosureArgumentsOnStack(state, 
						      procValue, 
						      operandValues,
						      n);
	state.cstack[state.cstack.length - 2] = new PopnControl(argCount);
	state.pushControl(procValue.body);
    } else {
	// General case:
	var argCount = prepareClosureArgumentsOnStack(state, 
						      procValue, 
						      operandValues,
						      n);
	state.pushControl(new PopnControl(argCount));
	state.pushControl(procValue.body);
    }
};


var callContinuationProcedure = function(state, procValue, n, operandValues) {
    if (n === 1) {
	state.v = operandValues[0];
    } else {
	state.v = new types.ValuesWrapper(operandValues);
    }
    state.vstack = procValue.vstack;
    state.cstack = procValue.cstack;
};




// selectProcedureByArity: state (CaseLambdaValue | CasePrimitive | Continuation | Closure | Primitive) -> (Continuation | Closure | Primitive)
var selectProcedureByArity = function(aState, n, procValue, operands) {
    var getArgStr = function() {
    	var argStr = '';
    	if (operands.length > 0) {
    		var argStrBuffer = [':'];
    		for (var i = 0; i < operands.length; i++) {
    			argStrBuffer.push( types.toWrittenString(operands[i]) );
    		}
    		argStr = argStrBuffer.join(' ');
    	}
    	return argStr;
    }
    
    var getArgColoredParts = function(locations) {
    	var argColoredParts = [];
    	var locs = locations;
        var space = "";
    	if (operands.length > 0) {
    	    for (var i = 0; i < operands.length; i++) {
    		argColoredParts.push(new types.ColoredPart(operands[i]+(i < operands.length -1 ? " " : ""),
                                                           locs.first()));
    		locs = locs.rest();
    	    }
    	}
    	return argColoredParts;
    }

    var procedureType = types.getProcedureType(procValue);
    if ( !procedureType ) {
	    var argStr = getArgStr('; arguments were:');
        var positionStack = state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
       
        var locationList = positionStack[positionStack.length - 1];
        var locs = locationList;
        var exprLoc;
        while(!locs.isEmpty()){
            exprLoc = locs.first().elts;
            locs = locs.rest();
        }

        var argColoredParts = getArgColoredParts(locationList.rest());

        var op = types.vector([exprLoc[0], exprLoc[1], exprLoc[2], exprLoc[3], 1]);
        var cp = types.vector([exprLoc[0], exprLoc[1] + exprLoc[4] - 1, exprLoc[2], exprLoc[3] + exprLoc[4] - 1, 1]);
        var procString = procValue.toWrittenString? procValue.toWrittenString() : procValue.toString();

	    helpers.raise(
		types.incompleteExn(types.exnFailContract,
            new types.Message([new types.MultiPart("function call", [op, cp], true),
                                ": expected function, given: ",
                                new types.ColoredPart(procString, locationList.first())
                                ]),
                             []));

    }

    if (procedureType  === "CaseLambdaValue") {
    	for (var j = 0; j < procValue.closures.length; j++) {
    	    if (n === procValue.closures[j].numParams ||
    		(n > procValue.closures[j].numParams && 
    		 procValue.closures[j].isRest)) {
        procValue.closures[j] = callClosureProcedure;
    		return procValue.closures[j];
    	    }
    	}
    	var acceptableParameterArity = [];
    	for (var i = 0; i < procValue.closures.length; i++) {
    	    acceptableParameterArity.push(procValue.closures[i].numParams + '');
    	}

        var positionStack = 
            state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
            
           
            var locationList = positionStack[positionStack.length - 1];
            var argColoredParts = getArgColoredParts(locationList.rest());


        //unable to test
    	helpers.raise(types.incompleteExn(
    		types.exnFailContractArity,
    		new types.Message([new types.ColoredPart(procValue.name ? procValue.name : "#<case-lambda-procedure>", locationList.first()),
                               ": expects [",
                               acceptableParameterArity.join(', '),
                               "] arguments, but given ",
                               n,
                               new types.GradientPart(argColoredParts)]),	
    		[]));
    } 
    else if (procedureType === "CasePrimitive") {
    	for (var j = 0; j < procValue.cases.length; j++) {
    	    if (n === procValue.cases[j].numParams ||
    		(n > procValue.cases[j].numParams && 
    		 procValue.cases[j].isRest)) {
        procValue.cases[j].callProcedure = callPrimitiveProcedure;
    		return procValue.cases[j];
    	    }
    	}
    	var acceptableParameterArity = [];
    	for (var i = 0; i < procValue.cases.length; i++) {
    	    acceptableParameterArity.push(procValue.cases[i].numParams + '');
    	}
        var positionStack = 
            state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
            
           
            var locationList = positionStack[positionStack.length - 1];
            var argColoredParts = getArgColoredParts(locationList.rest());


            //textchange
    	helpers.raise(types.incompleteExn(
    		types.exnFailContractArity,
    		new types.Message([new types.ColoredPart(procValue.name, locationList.first()),
                    ": expects ",
                    acceptableParameterArity.join(' or '),
                    " arguments, but given ",
                    n,
                ((argColoredParts.length > 0) ? ": " : ""),
                ((argColoredParts.length > 0) ? new types.GradientPart(argColoredParts) : "")]),
    		[]));
    }


    // At this point, procValue must be either a Continuation,
    // Closure, or Primitive.  We check to see that the number of
    // arguments n matches the acceptable number of arguments from the
    // procValue.
    if (procedureType === "ContinuationClosureValue") {
  procValue.callProcedure = callContinuationProcedure;
	// The continuation can accept any number of arguments
	return procValue;
    } else {
	if ((n === procValue.numParams) ||
	    (n > procValue.numParams && procValue.isRest)) {
      procValue.callProcedure = primitive.isPrimitive(procValue)?
        callPrimitiveProcedure : callClosureProcedure;
	    return procValue;
	} else {
	    var positionStack = 
		state.captureCurrentContinuationMarks(aState).ref('moby-application-position-key');
	    
	   
	    var locationList = positionStack[positionStack.length - 1];
	    var argColoredParts = getArgColoredParts(locationList.rest());


	    helpers.raise(types.incompleteExn(
		types.exnFailContractArityWithPosition,
		new types.Message([new types.ColoredPart((''+(procValue.name !== types.EMPTY ? procValue.name : "anonymous function")), locationList.first()),
			": expects ", 
			''+(procValue.isRest ? 'at least ' : ''),
			((procValue.locs != undefined) ? new types.MultiPart((procValue.numParams + " argument" + 
							                                             ((procValue.numParams == 1) ? '' : 's')), 
							                                             procValue.locs.slice(1),
                                                           false)
							:
							(procValue.numParams + " argument" + 
							  ((procValue.numParams == 1) ? '' : 's')))
					      ,
  		         ", but given ",
			n ,
            ((argColoredParts.length > 0) ? ": " : ""),
            ((argColoredParts.length > 0) ? new types.GradientPart(argColoredParts) : "")]),
		[]));
	}
    }
};


var prepareClosureArgumentsOnStack = function(state, procValue, operandValues, n) {
    var argCount = 0;
    if (procValue.isRest) {
	var restArg = types.EMPTY;
    var i;
	for (i = 0; i < n - procValue.numParams ; i++) {
	    restArg = types.cons(operandValues.pop(), restArg);
	}
	state.pushValue(restArg);
	argCount++;
    }	
    for (i = operandValues.length -1; i >= 0; i--) {
	state.pushValue(operandValues[i]);
	argCount++;
    }
    for(i = procValue.closureVals.length-1; i >= 0; i--) {
	state.pushValue(procValue.closureVals[i]);
	argCount++;
    }
    return argCount;
}




var preparePrimitiveArguments = function(state, primitiveValue, operandValues, n) {
    var args = [];

    args.push(state);

    if (n < primitiveValue.numParams) {
//	throw new Error("arity error: expected at least "
//			+ primitiveValue.numParams + " arguments, but "
//			+ "received " + n + " arguments instead.");
    var i;
    }
    if (primitiveValue.isRest) {
	for(i = 0; i < primitiveValue.numParams; i++) {
	    args.push(operandValues.shift());
	}
	var restArgs = [];
	for(i = 0; i < n - primitiveValue.numParams; i++) {
	    restArgs.push(operandValues.shift());
	}
	args.push(restArgs);
    } else {
	if (primitiveValue.numParams !== n) {
//	    throw new Error("arity error: expected " 
//			    + primitiveValue.numParams 
//			    + " but received " + n);
	}
	for(i = 0; i < primitiveValue.numParams; i++) {
	    args.push(operandValues.shift());
	}
    }
    return args;
};






//////////////////////////////////////////////////////////////////////
// Continuation marks
var WithContMarkControl = function(key, val, body) {
    this.key = key;
    this.val = val;
    this.body = body;
};

WithContMarkControl.prototype.invoke = function(state) {
    var cmds = [];
    cmds.push(this.key);
    cmds.push(new WithContMarkKeyControl(this.val,
					 this.body));
    state.pushManyControls(cmds);
};


var WithContMarkKeyControl = function(val, body) {
    this.val = val;
    this.body = body;
};

WithContMarkKeyControl.prototype.invoke = function(state) {
    var evaluatedKey = state.v;
    var cmds = [];
    cmds.push(this.val);
    cmds.push(new WithContMarkVal(evaluatedKey,
				  this.body));
    state.pushManyControls(cmds);
};

var WithContMarkVal = function(key, body) {
    this.key = key;
    this.body = body;
};

WithContMarkVal.prototype.invoke = function(state) {
    var evaluatedVal = state.v;
    // Check to see if there's an existing ContMarkRecordControl
    // if it is, replace the value with the one on the stack
    if (state.cstack.length !== 0 && 
        ( types.isContMarkRecordControl(state.cstack[state.cstack.length - 1]) )) {
      state.pushControl(state.cstack.pop().update(this.key, evaluatedVal));
    // if it's not, add a new ContMarkRecordControl
    } else {
//      var aHash = types.makeLowLevelEqHash();
//      aHash.put(this.key, evaluatedVal);
      var aHash = {};
      aHash[this.key.val] = evaluatedVal;
      state.pushControl(types.contMarkRecordControl(aHash));
    }
    state.pushControl(this.body);
};





//////////////////////////////////////////////////////////////////////
// Apply-values


var ApplyValuesControl = function(proc, argsExpr) {
    this.proc = proc;
    this.argsExpr = argsExpr;
};

ApplyValuesControl.prototype.invoke = function(state) {
    var cmds = [];
    cmds.push(this.proc);
    cmds.push(new ApplyValuesArgControl(this.argsExpr));
    state.pushManyControls(cmds);
};

var ApplyValuesArgControl = function(expr) {
    this.expr = expr;
};

ApplyValuesArgControl.prototype.invoke = function(state) {
    var cmds = [];
    cmds.push(this.expr);
    cmds.push(new ApplyValuesAppControl(state.v));
    state.pushManyControls(cmds);

};


var ApplyValuesAppControl = function(procVal) {
    this.procVal = procVal;
};

ApplyValuesAppControl.prototype.invoke = function(state) {
    var exprValue = state.v;
    state.v = this.procVal;
    var i;
    if (exprValue instanceof types.ValuesWrapper) {
	var elts = exprValue.elts;
	for(i = elts.length - 1; i >= 0; i--) {
	    state.pushValue(elts[i]);
	}
	state.pushControl(new CallControl(elts.length));
    } else {
	state.pushValue(exprValue);
	state.pushControl(new CallControl(1));
    }
};




//////////////////////////////////////////////////////////////////////
// Let one
var LetOneControl = function(rhs, body) {
    this.rhs = rhs;
    this.body = body;
};


LetOneControl.prototype.invoke = function(state) {
    var cmds = [];
    state.pushn(1);
    cmds.push(this.rhs);
    cmds.push(new SetControl(0));
    cmds.push(this.body);
    cmds.push(new PopnControl(1));
    state.pushManyControls(cmds);
};


//////////////////////////////////////////////////////////////////////
// Let void

var LetVoidControl = function(params) {
    this.count = params.count;
    this.isBoxes = params.isBoxes;
    this.body = params.body;
};

LetVoidControl.prototype.invoke = function(state) {
    var cmds = [];
    var n = this.count;
    state.pushn(n);
    if (this.isBoxes) {
	for (var i = 0; i < n; i++) {
	    state.setn(i, types.box(types.UNDEFINED));
	}
    }
    cmds.push(this.body);
    cmds.push(new PopnControl(n));
    state.pushManyControls(cmds);
};






//////////////////////////////////////////////////////////////////////

var BoxenvControl = function(pos, body) {
    this.pos = pos;
    this.body = body;
};


BoxenvControl.prototype.invoke = function(state) {
    state.setn(this.pos,
	       types.box(state.peekn(this.pos)));
    state.pushControl(this.body);
};



//////////////////////////////////////////////////////////////////////
// install-value

var InstallValueControl = function(params) {
    this.count = params.count;
    this.pos = params.pos;
    this.isBoxes = params.isBoxes;
    this.rhs = params.rhs;
    this.body = params.body;
};


InstallValueControl.prototype.invoke = function(state) {
    var cmds = [];
    cmds.push(this.rhs);
    cmds.push(new InstallValueRhsControl(this.count,
					 this.pos,
					 this.isBoxes,
					 this.body));
    state.pushManyControls(cmds);
};


var InstallValueRhsControl = function(count, pos, isBoxes, body) {
    this.count = count;
    this.pos = pos;
    this.isBoxes = isBoxes;
    this.body = body;
};

InstallValueRhsControl.prototype.invoke = function(state) {
    // The value's on the stack.  First check the proper number
    // of arguments.
    var aValue = state.v;
    var vals = [];
    if (aValue instanceof types.ValuesWrapper) {
	if (this.count !== aValue.elts.length) {  
	    helpers.raise(
		types.exnFailContractArity("expected " + this.count 
					   + " values, but received " + aValue.elts.length,
					   state.captureCurrentContinuationMarks(aState)));
	}
	vals = aValue.elts;
    } else {
	if (this.count !== 1) {
	    helpers.raise(
		types.exnFailContractArity("expected " + this.count 
					   + " values, but received one",
					   state.captureCurrentContinuationMarks(aState)));
	}
	vals = [aValue];
    }
    if (this.isBoxes) {
	for (var i = 0; i < this.count; i++) {
	    state.peekn(i + this.pos).set(vals[i]);
	}
    } else {
	for (var i = 0; i < this.count; i++) {
	    state.setn(i + this.pos, vals[i]);
	}
    }
    state.pushControl(this.body);
};









//////////////////////////////////////////////////////////////////////

var AssignControl = function(params) {
    this.id = params.id;
    this.rhs = params.rhs;
    this.isUndefOk = params.isUndefOk;
};


AssignControl.prototype.invoke = function(state) {
    var cmds = [];
    cmds.push(this.rhs);
    cmds.push(new SetToplevelControl(this.id.depth,
				     this.id.pos,
				     this.isUndefOk));
    state.pushManyControls(cmds);
};



var SetToplevelControl = function(depth, pos, isUndefOk) {
    this.depth = depth;
    this.pos = pos;
    this.isUndefOk = isUndefOk;
};

SetToplevelControl.prototype.invoke = function(aState) {
    debug("SET_TOPLEVEL " + this.depth + ", " + this.pos);
    if (aState.vstack.length - 1 - (this.depth || 0) < 0) {
	throw types.internalError("vstack not long enough",
				  state.captureCurrentContinuationMarks(aState));
    }
    aState.setPrefix(this.depth, this.pos, aState.v)
};




//////////////////////////////////////////////////////////////////////
// Variable references

var VarrefControl = function(toplevel) {
    this.toplevel = toplevel;
};

VarrefControl.prototype.invoke = function(state) {
    var depth, pos;
    depth = this.toplevel.depth;
    pos = this.toplevel.pos;
    state.v = new types.VariableReference(state.vstack[state.vstack.length - 1 - depth],
					  pos);
};

//////////////////////////////////////////////////////////////////////




var ClosureControl = function(genId) {
    this.genId = genId + '';
};

ClosureControl.prototype.invoke = function(state) {
    state.v = state.heap[this.genId];
};




//////////////////////////////////////////////////////////////////////
// Case lambda

var CaseLamControl = function(name, clauses) {
    this.name = name;
    this.clauses = clauses;
};

CaseLamControl.prototype.invoke = function(state) {
    var clauses = this.clauses;
    if (clauses.length === 0) {
	state.v = new types.CaseLambdaValue(this.name, []);
    } else {
	state.pushControl(new CaseLambdaComputeControl(this.name, 
						       types.list(clauses).rest(),
						       types.list([])));
	state.pushControl(clauses[0]);
    }
};


var CaseLambdaComputeControl = function(name, lamsToEvaluate, evaluatedLams) {
    this.name = name;
    this.lamsToEvaluate = lamsToEvaluate;
    this.evaluatedLams = evaluatedLams;
};


CaseLambdaComputeControl.prototype.invoke = function(state) {
    var nextEvaluatedLam = state.v;
    if (this.lamsToEvaluate.isEmpty()) {
	var clauseList = (types.cons(nextEvaluatedLam, this.evaluatedLams)).reverse();
	var clauses = [];
	while (!clauseList.isEmpty()) {
	    clauses.push(clauseList.first());
	    clauseList = clauseList.rest();
	}
	state.v = new types.CaseLambdaValue(this.name, clauses);
    } else {
	state.pushControl(new CaseLambdaComputeControl(
	    this.name,
	    this.lamsToEvaluate.rest(),
	    types.cons(nextEvaluatedLam,
		       this.evaluatedLams)));
	state.pushControl(this.lamsToEvaluate.first());
    }
};












//////////////////////////////////////////////////////////////////////
control.processPrefix = processPrefix;

control.ConstantControl = ConstantControl;
control.BranchControl = BranchControl;
control.SeqControl = SeqControl;
control.Beg0Control = Beg0Control;
control.ModControl = ModControl;
control.Prefix = Prefix;
control.ToplevelControl = ToplevelControl;
control.DefValuesControl = DefValuesControl;
control.LamControl = LamControl;
control.PrimvalControl = PrimvalControl;
control.ApplicationControl = ApplicationControl;
control.LocalrefControl = LocalrefControl;
control.ApplyValuesControl = ApplyValuesControl;
control.LetOneControl = LetOneControl;
control.LetVoidControl = LetVoidControl;
control.BoxenvControl = BoxenvControl;
control.InstallValueControl = InstallValueControl;
control.WithContMarkControl = WithContMarkControl;
control.AssignControl = AssignControl;
control.VarrefControl = VarrefControl;
control.ClosureControl = ClosureControl;
control.CaseLamControl = CaseLamControl;
control.LetRecControl = LetRecControl;
control.CallControl = CallControl;
control.RequireControl = RequireControl;


control.PauseException = PauseException;

})();

// Loader: take bytecode and translate to internal format.
/*
var control = require('./control');
var sys = require('sys');
*/

var loader = {};

(function() {



// loadCode: State code -> Control
var loadCode = function(aState, nextCode) {
    switch(nextCode.$) {
    case 'mod':
	return loadMod(aState, nextCode);
	break;
    case 'def-values':
	return loadDefValues(aState, nextCode);
	break;
    case 'indirect':
	return loadIndirect(aState, nextCode);
	break;
    case 'apply-values':
	return loadApplyValues(aState, nextCode);
	break;
    case 'toplevel':
	return loadToplevel(aState, nextCode);
	break;
    case 'constant':
	return loadConstant(aState, nextCode);
	break;
    case 'req':
	return loadReq(aState, nextCode);
	break;
    case 'seq':
	return loadSeq(aState, nextCode);
	break;
    case 'application':
	return loadApplication(aState, nextCode);
	break;
    case 'localref':
	return loadLocalRef(aState, nextCode);
	break;
    case 'primval':
	return loadPrimval(aState, nextCode);
	break;
    case 'branch':
	return loadBranch(aState, nextCode);
	break;
    case 'lam':
	return loadLam(aState, nextCode);
	break;
    case 'let-one':
	return loadLetOne(aState, nextCode);
	break;
    case 'let-void':
	return loadLetVoid(aState, nextCode);
	break;
    case 'beg0':
	return loadBeg0(aState, nextCode);
	break;
    case 'boxenv':
	return loadBoxenv(aState, nextCode);
	break;
    case 'install-value':
	return loadInstallValue(aState, nextCode);
	break;
    case 'with-cont-mark':
	return loadWithContMark(aState, nextCode);
	break;
    case 'assign':
	return loadAssign(aState, nextCode);
	break;
    case 'varref':
	return loadVarref(aState, nextCode);
	break;
    case 'closure':
	return loadClosure(aState, nextCode);
	break;
    case 'case-lam':
	return loadCaseLam(aState, nextCode);
	break;
    case 'let-rec':
	return loadLetRec(aState, nextCode);
	break;
    default:
	// FIXME: as soon as we implement topsyntax,
	// we should never get here.
	throw types.internalError("I don't know how to handle " + sys.inspect(nextCode),
				  state.captureCurrentContinuationMarks(aState));
    }
};



// loadCodes: state [code] -> [Control]
var loadCodes = function(state, codes) {
    var result = [];
    for (var i = 0; i < codes.length; i++) {
      result.push(loadCode(state, codes[i]));
    }
    return result;
};



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////


var loadMod = function(state, modCode) {
    return new control.ModControl(loadPrefix(modCode['prefix']),
				  loadCodes(state, modCode['body']));
};


var loadPrefix = function(aPrefix) {
    return new control.Prefix({numLifts : aPrefix['num-lifts'],
			       toplevels: aPrefix['toplevels']});
};


var loadDefValues = function(state, nextCode) {
    return new control.DefValuesControl(nextCode['ids'],
					loadCode(state, nextCode['body']));
};


var loadIndirect = function(state, nextCode) {
    return new control.ConstantControl(state.heap[nextCode['value']]);
};


var loadApplyValues = function(state, nextCode) {
    return new control.ApplyValuesControl(
	loadCode(state, nextCode['proc']),
	loadCode(state, nextCode['args-expr']));
};

var loadToplevel = function(state, nextCode) {
    return new control.ToplevelControl(nextCode['depth'],
				       nextCode['pos'],
				       nextCode['loc']);
    // FIXME: use isConst and isReady
    //    isConst: nextCode['const?']
    //    isReady: nextCode['ready?'];
};


var loadConstant = function(state, nextCode) {
    return new control.ConstantControl(nextCode['value']);
};


var loadReq = function(state, nextCode) {
    return new control.RequireControl(nextCode['reqs'] + '');
};

var loadSeq = function(state, nextCode) {
    var result = new control.SeqControl(loadCodes(state, nextCode['forms']));
    return result;
};

var loadApplication = function(state, nextCode) {
    return new control.ApplicationControl(
	loadCode(state, nextCode['rator']),
	loadCodes(state, nextCode['rands']));
};

var loadLocalRef = function(state, nextCode) {
    return new control.LocalrefControl(
	nextCode['pos'],
	nextCode['unbox?']);

    // FIXME: use the other attributes:
    // 	nextCode['clear'],
    // 	nextCode['other-clears?'],
    // 	nextCode['flonum?'];
};

var loadPrimval = function(state, nextCode) {
    return new control.PrimvalControl(nextCode['value']);
};

var loadBranch = function(state, nextCode) {
    return new control.BranchControl(loadCode(state, nextCode['test']),
				     loadCode(state, nextCode['then']),
				     loadCode(state, nextCode['else']));
};


var loadLam = function(state, nextCode) {
    var result =  new control.LamControl(
	{ name: nextCode['name'],
          locs: nextCode['locs'],
	  numParams: nextCode['num-params'],
	  paramTypes: nextCode['param-types'],
	  isRest: nextCode['rest?'],
	  closureMap: nextCode['closure-map'],
	  closureTypes: nextCode['closure-types'],
	  body: loadCode(state, nextCode['body']) 
	});
    return result;
    // FIXME: use nextCode['flags'],
    //            nextCode['max-let-depth'],
};


var loadLetOne = function(state, nextCode) {
    return new control.LetOneControl(
	loadCode(state, nextCode['rhs']),
	loadCode(state, nextCode['body']));
    // FIXME: use nextCode['flonum?']
};


var loadLetVoid = function(state, nextCode) {
    return new control.LetVoidControl({count: nextCode['count'],
				       isBoxes: nextCode['boxes?'],
				       body: loadCode(state, nextCode['body'])});
};

var loadBeg0 = function(state, nextCode) {
    return new control.Beg0Control(
	loadCodes(state, nextCode['seq']));
};

var loadBoxenv = function(state, nextCode) {
    return new control.BoxenvControl(
	nextCode['pos'],
	loadCode(state, nextCode['body']));
};



var loadInstallValue = function(state, nextCode) {
    return new control.InstallValueControl(
	{ count: nextCode['count'],
	  pos: nextCode['pos'],
	  isBoxes: nextCode['boxes?'],
	  rhs: loadCode(state, nextCode['rhs']),
	  body: loadCode(state, nextCode['body'] )});
};

var loadWithContMark = function(state, nextCode) {
    return new control.WithContMarkControl(
	loadCode(state, nextCode['key']),
	loadCode(state, nextCode['val']),
	loadCode(state, nextCode['body']));
};


var loadAssign = function(state, nextCode) {
    return new control.AssignControl(
	{ id: loadCode(state, nextCode['id']),
	  rhs: loadCode(state, nextCode['rhs']),
	  isUndefOk: nextCode['undef-ok?'] });
};


var loadVarref = function(state, nextCode) {
    return new control.VarrefControl(
	loadCode(state, nextCode['toplevel']));
};

var loadClosure = function(state, nextCode) {
    return new control.ClosureCommand(nextCode['gen-id']);
    // FIXME: use nextCode['lam']?
};


var loadCaseLam = function(state, nextCode) {
    return new control.CaseLamControl(nextCode['name'],
				      loadCodes(state, nextCode['clauses']));
};


var loadLetRec = function(state, nextCode) {
    return new control.LetRecControl(loadCodes(state, nextCode['procs']),
				     loadCode(state, nextCode['body']));
};



//////////////////////////////////////////////////////////////////////


loader.loadCode = loadCode;

loader.loadPrefix = loadPrefix;
})();

/*
// For node.js.
var sys = require('sys');
var types = require('./types');
var primitive = require('./primitive');
var loader = require('./loader');
var assert = require('assert');
var control = require('./control');
var state = require('./state');

var DEBUG_ON = false;

var setDebug = function(v) {
    DEBUG_ON = v;
}

var debug = function(s) {
    if (DEBUG_ON) {
	sys.debug(s);
    }
}

var debugF = function(f_s) {
    if (DEBUG_ON) {
	sys.debug(f_s());
    }
}
*/


//////////////////////////////////////////////////////////////////////







//////////////////////////////////////////////////////////////////////

var interpret = {};


(function() {

// load: compilationTop state? -> state
// Load up the bytecode into a state, ready for evaluation.  If
// an old state is given, then reuses it.  In particular, if the
// compilationTop uses global variables, we try to preserve the
// values of old globals.
var load = function(compilationTop, aState) {
    if (! aState) { aState = new state.State(); }

    try {
      // Install the indirects table.
      processIndirects(aState, compilationTop['compiled-indirects']);

      // Process the prefix.
      var prefix = loader.loadPrefix(compilationTop.prefix);
      control.processPrefix(aState, prefix);


      // Add the code form to the control stack.
      aState.pushControl(loader.loadCode(aState, compilationTop.code));
    } catch(e) {
      if (types.isSchemeError(e)) {
          // scheme exception
          if ( types.isExn(e.val) &&
              !types.isContinuationMarkSet( types.exnContMarks(e.val) ) ) {
            types.exnSetContMarks(e.val,
                                  state.captureCurrentContinuationMarks(aState));
          }
      }
      throw e;
    }

    return aState;

    // TODO: do some processing of the bytecode so that all the
    // constants are native, enable quick dispatching based on
    // bytecode type, rewrite the indirect loops, etc...
};




var processIndirects = function(state, indirects) {
    // First, install the shells
    for (var i = 0 ;i < indirects.length; i++) {
	var anIndirect = indirects[i];
	var lam = anIndirect['lam'];

	var numParams = lam['num-params'];
	var paramTypes = lam['param-types'];
	var isRest = lam['rest?'];
	var closureVals = makeClosureValsFromMap(state,
						 lam['closure-map'], 
						 lam['closure-types']);

	// Subtle: ignore the lam['body'] here: first install the lambdas in the heap.
	var sentinelBody = new control.ConstantControl(false)

	state.heap[anIndirect.id] = 
	    new types.ClosureValue(anIndirect.id,
				   numParams, 
				   paramTypes, 
				   isRest, 
				   closureVals, 
				   sentinelBody);
    }

    // Once the lambdas are there, we can load up the bodies.
    for (var i = 0 ;i < indirects.length; i++) {
      var anIndirect = indirects[i];
      var lam = anIndirect['lam'];

      var lamValue = state.heap[anIndirect.id];
      lamValue.body = loader.loadCode(state, lam['body'])
    }
};








// makeClosureValsFromMap: state [number ...] -> [scheme-value ...]
// Builds the array of closure values, given the closure map and its
// types.
var makeClosureValsFromMap = function(state, closureMap, closureTypes) {
    var closureVals = [];
    for (var i = 0; i < closureMap.length; i++) {
      var val, type;
      val = state.peekn(closureMap[i]);
      type = closureTypes[i];
      // FIXME: look at the type; will be significant?
      closureVals.push(val);
    }
    return closureVals;
};


// We bounce every so often to allow UI events to process.
var MAX_STEPS_BEFORE_BOUNCE = 50000;


// run: state (scheme-value -> void) (exn -> void) -> void
var run = function(aState, onSuccessK, onFailK) {
    if (! onSuccessK) { onSuccessK = function(lastResult) {} };
    if (! onFailK) { onFailK = function(exn) { throw exn; } };

    function doRunWork(){
      var gas = MAX_STEPS_BEFORE_BOUNCE;
      while( (! aState.isStuck()) && (gas > 0)) {
          step(aState);
          gas--;
      }
      if (aState.breakRequested) {
          onFailK(types.schemeError(
                    types.exnBreak("user break", 
                                   state.captureCurrentContinuationMarks(aState),
                                   captureContinuationClosure(aState))));
          return;
      } else if (gas <= 0) {
          var stateValues = aState.save();
          setTimeout(function(){ 
                       aState.restore(stateValues);
                       run(aState, onSuccessK, onFailK);
                     },
                     0);
      } else {
          onSuccessK(aState.v);
          return;
      }
    }
 
    try { doRunWork();
    } catch (e) {
      if (e instanceof control.PauseException) {
          var onRestart = makeOnRestart(aState, onSuccessK, onFailK);
          var onCall = makeOnCall(aState);
          e.onPause(onRestart, onCall);
          return;
      } else if (types.isSchemeError(e)) {
          // scheme exception
          // If the error is incomplete, finish constructing it
          if ( types.isIncompleteExn(e.val) ) {
        var contMarks = state.captureCurrentContinuationMarks(aState);
          e = types.schemeError(e.val.constructor.apply(null, [e.val.msg, contMarks].concat(e.val.otherArgs) ));
          }
          onFailK(e);
          return;
      } else {
          onFailK(e);
          return;
      }
    }
};

    

// call: state scheme-procedure (arrayof scheme-values) (scheme-value -> void) -> void
var call = function(state, operator, operands, k, onFail) {
    var stateValues = state.save();
    state.clearForEval({preserveBreak: true});

    state.pushControl(
      new control.ApplicationControl(
          new control.ConstantControl(operator), 
          helpers.map(function(op) {
              return new control.ConstantControl(op)},
          operands)));
    try {
      run(state,
          function(v)   { state.restore(stateValues); k(v) },
          function(exn) { state.restore(stateValues); onFail(exn); }
          );
    } catch (e) {
      state.restore(stateValues);
      throw e;
    }
};


var makeOnCall = function(state) {
    return function(operator, operands, k, onFail) {
	return call(state, operator, operands, k, onFail);
    };
};





// create function for restarting a run, given the state and the
// continuation k.
var makeOnRestart = function(aState, onSuccessK, onFailK) {
    var stateValues = aState.save();
    aState.clearForEval({preserveBreak: true});
    return function(v) {
      aState.restore(stateValues);
      if ( types.isSchemeError(v) ) {
          // on a scheme scheme exception, install the marks
          if ( types.isIncompleteExn(v.val) ) {
        var contMarks = state.captureCurrentContinuationMarks(aState);
        v = types.schemeError(
          v.val.constructor.apply(null, [v.val.msg, contMarks].concat(v.val.otherArgs) ));
          }

          onFailK(v);
      } else if ( types.isInternalError(v) ) {
          onFailK(v);
      } else {
          aState.v = v;
          run(aState, onSuccessK, onFailK);
      }
    }
};
    


// step: state -> void
// Takes one step in the abstract machine.
var step = function(aState) {
    var nextCode = aState.popControl();
    debugF(function() { return sys.inspect(nextCode) });
    if (nextCode['invoke']) {
      nextCode.invoke(aState);
    } else {
      // we should never get here.
      throw types.internalError("I don't know how to handle " + sys.inspect(nextCode),
              state.captureCurrentContinuationMarks(aState));
    }
};



//////////////////////////////////////////////////////////////////////



primitive.addPrimitive('call/cc', 
		       new primitive.Primitive('call/cc',
					       1,
					       false, true,
					       function(state, f) {
						   var continuationClosure = 
						       captureContinuationClosure(state);
						   state.pushValue(continuationClosure);
						   state.v = f;
						   state.pushControl(new control.CallControl(1));
					       }));


var captureContinuationClosure = function(state) {
    return new types.ContinuationClosureValue(state.vstack,
					      state.cstack);
};



//////////////////////////////////////////////////////////////////////


interpret.load = load;
interpret.step = step;
interpret.run = run;
interpret.call = call;
//interpret.setDebug = setDebug;

})();

