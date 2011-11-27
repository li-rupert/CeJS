
/**
 * @name	CeL function for compatibility
 * @fileoverview
 * 本檔案包含了相容性 test 專用的 functions。
 * @since	
 * @see
 * <a href="http://msdn.microsoft.com/en-us/library/s4esdbwz%28v=VS.85%29.aspx" accessdate="2010/4/16 20:4">Version Information (Windows Scripting - JScript)</a>
 */

if (typeof CeL === 'function')
CeL.setup_module('data.code.compatibility',
function(library_namespace, load_arguments) {
'use strict';

//	no requiring


/**
 * null module constructor
 * @class	相容性 test 專用的 functions
 */
var _// JSDT:_module_
= function() {
	//	null module constructor
};

/**
 * for JSDT: 有 prototype 才會將之當作 Class
 */
_// JSDT:_module_
.prototype = {
};




/*
 * In Edition 5, the following new properties are defined on built-in objects
 * that exist in Edition 3: Object.getPrototypeOf,
 * Object.getOwnPropertyDescriptor, Object.getOwnPropertyNames, Object.create,
 * Object.defineProperty, Object.defineProperties, Object.seal, Object.freeze,
 * Object.preventExtensions, Object.isSealed, Object.isFrozen,
 * Object.isExtensible, Object.keys, Function.prototype.bind,
 * Array.prototype.indexOf, Array.prototype.lastIndexOf, Array.prototype.every,
 * Array.prototype.some, Array.prototype.forEach, Array.prototype.map,
 * Array.prototype.filter, Array.prototype.reduce, Array.prototype.reduceRight,
 * String.prototype.trim, Date.now, Date.prototype.toISOString,
 * Date.prototype.toJSON.
 */

/*
http://www.comsharp.com/GetKnowledge/zh-CN/It_News_K875.aspx
8進制數字表示被禁止， 010 代表 10 而不是 8

Array 對象內置了一些標準函數，如 indexOf(), map(), filter(), reduce()
# Object.keys() 會列出對象中所有可以枚舉的屬性
# Object.getOwnPropertyNames() 會列出對象中所有可枚舉以及不可枚舉的屬性
# Object.getPrototypeof() 返回給定對象的原型

http://jquerymobile.com/gbs/
*/




var main_version = 0, full_version = '';
// for IE/NS only
if (typeof window != 'undefined' && window.ScriptEngine) {
	library_namespace.debug(library_namespace.is_type(ScriptEngineMajorVersion), 2);
	main_version = window.ScriptEngineMajorVersion() + '.' + window.ScriptEngineMinorVersion();
	full_version = window.ScriptEngine() + ' ' + main_version + '.' + window.ScriptEngineBuildVersion();
	main_version = Number(main_version);
}
//java test: 加了下面這段在 FF3 會召喚出 java! IE中沒有java object.
else if (typeof java == 'object' && java) {
	library_namespace.debug("Today is " + java.text.SimpleDateFormat("EEEE-MMMM-dd-yyyy").format(new java.util.Date()));
	if (main_version = java.lang.System.getProperty('os.name')
			+ java.lang.System.getProperty('os.version')
			+ java.lang.System.getProperty('os.arch'))
		full_version = main_version;
	else
		main_version = 0;
}
if(full_version)
	library_namespace.debug('Script engine: ' + full_version);

/**
 * 版本檢查.
 * 
 * @param version 最低 version
 */
function check_version(version) {
	if (!library_namespace.is_digits(version) || version < 5)
		version = 5;

	if (typeof WScript !== 'undefined' && WScript.Version < version) {
		// WScript.FullName, WScript.Path
		var Locale = library_namespace.env.locale, promptTitle = Locale == 0x411 ? 'アップグレードしませんか？' : '請升級',
				promptC = Locale == 0x411 ? "今使ってる " + WScript.Name + " のバージョンは古過ぎるから、\nMicrosoft Windows スクリプト テクノロジ Web サイトより\nバージョン "
				+ WScript.Version + " から " + version + " 以上にアップグレードしましょう。"
				: "正使用的 " + WScript.Name + " 版本過舊，\n請至 Microsoft Windows 網站將版本由 " + WScript.Version + " 升級到 " + version + " 以上。",
				url = /* Locale==0x411? */"http://www.microsoft.com/japan/developer/scripting/default.htm";
		if (1 == WScript.Popup(promptC, 0, promptTitle, 1 + 48))
			WshShell.Run(url);
		WScript.Quit(1);
	}
}




/*

adapter

不用 extend: extend 用覆蓋的.
library_namespace.extend( {
	apply : apply,
	call : call,
	bind : bind
}, Function.prototype);
*/
function add_method(target, methods) {
	if (typeof target === 'undefined')
		return;

	var i, m;
	for (i in methods)
		if (!(i in target)) {
			m = methods[i];
			if (typeof m !== 'undefined') {
				library_namespace.debug('add .[' + i + '] (' + (typeof m) + ') for ' + target);
				target[i] = m;
			}
		}
}

_// JSDT:_module_
.
add_method = add_method;

add_method(library_namespace.global, {
	encodeURI : escape,
	decodeURI : escape,
	isNaN : function(value) {
		//parseFloat(value)
		//var a = typeof value == 'number' ? value : parseInt(value);
		//alert(typeof a+','+a+','+(a===a));

		//	變數可以與其本身比較。如果比較結果不相等，則它會是 NaN。原因是 NaN 是唯一與其本身不相等的值。
		//	A reliable way for ECMAScript code to test if a value X is a NaN is an expression of the form X !== X. The result will be true if and only if X is a NaN.
		//return /*typeof value=='number'&&*/a != a;
		return value != value;
	},
	//	isFinite(null)===true
	isFinite : function(value) {
		return !isNaN(value)
		&& value !== Infinity
		&& value !== -Infinity;
	}
});

add_method(library_namespace.global, {
	encodeURIComponent : encodeURI,
	decodeURIComponent : decodeURI
});


/**
 * 對於舊版沒有 Array.push() 等函數時之判別及處置。
 * 不能用t=this.valueOf(); .. this.push(t);
 */
function push() {
	var i = 0, l = arguments.length, w = this.length;
	//	在 FF3 僅用 this[this.length]=o; 效率略好於 Array.push()，但 Chrome 6 相反。
	for (; i < l; i++)
		this[w++] = arguments[i];
	return w;
}


function pop() {
	// 不能用 return this[--this.length];
	var l = this.length, v;
	if (l) {
		v = this[l];
		this.length--;
	}
	return v;
}

function shift() {
	var v = this[0];
	//	ECMAScript 不允許設定 this=
	this.value = this.slice(1);
	return v;
}

function unshift() {
	// ECMAScript 不允許設定 this=
	this.value = Array.prototype.slice.call(arguments).concat(this);
	return this.length;
}

//	將 element_toPush 加入 array_pushTo 並篩選重複的（本來已經加入的並不會變更）
//	array_reverse[value of element_toPush]=index of element_toPush
function pushUnique(array_pushTo, element_toPush,
		array_reverse) {
	if (!array_pushTo || !element_toPush)
		return array_pushTo;
	var i;
	if (!array_reverse)
		for (array_reverse = new Array, i = 0; i < array_pushTo; i++)
			array_reverse[array_pushTo[i]] = i;

	if (typeof element_toPush != 'object')
		i = element_toPush, element_toPush = new Array,
		element_toPush.push(i);

	var l;
	for (i in element_toPush)
		if (!array_reverse[element_toPush])
			// array_pushTo.push(element_toPush),array_reverse[element_toPush]=array_pushTo.length;
			array_reverse[array_pushTo[l = array_pushTo.length] = element_toPush[i]] = l;

	return array_pushTo;
}

//	e.g., Array.prototype.concat does not change the existing arrays, it only returns a copy of the joined arrays.
function Aappend(a) {
	var t = this, s = t.length, i = 0, l = a && a.length || 0;
	for (; i < l; i++)
		t[s + i] = a[i];
	return t;
}


add_method(Array.prototype, {
	push : push,
	pop : pop,
	shift : shift,
	unshift : unshift
});



/*

クラスを継承する	
http://www.tohoho-web.com/js/object.htm#inheritClass
親のクラスが持っている機能をすべて使用することができます。

to make classChild inheritance classParent:	http://www.interq.or.jp/student/exeal/dss/ejs/3/2.html
function classChild(_args1,_args2,..){
 處理arguments：arguments.pop() or other way

 classParent.call(this,_args1,_args2,..);	//	way1
 classParent.apply(this,arguments);	//	way2
 //this.constructor=classChild;	//	maybe needless

 // ..
}
classChild.prototype=new classParent;	//	for (objChild instanceof objParent)	關鍵字: 繼承，原型
classChild.prototype.methodOfParent=function(..){..};	//	オーバーライド

var objChild=new classChild(_args);
classParent.prototype.methodOfParent.call(objChild, ..);	//	基底プロトタイプのメソッドを呼び出す。ただしこの呼び出し自体は Programmer が Person を継承しているかどうかを何も考慮していません。
*/


/**
 * apply & call: after ECMAScript 3rd Edition 不直接用 undefined: for JS5.
 * 
 * 傳回某物件的方法，以另一個物件取代目前的物件。
 * apply是將現在正在執行的function其this改成apply的引數。所有函數內部的this指針都會被賦值為oThis，這可實現將函數作為另外一個對象的方法運行的目的.
 * xxx.apply(oThis,arrayArgs): 執行xxx，執行時以 oThis 作為 this，arrayArgs作為 arguments.
 * 
 * @param apply_this_obj
 * @param apply_args
 * @returns apply 後執行的結果。
 * @see http://msdn.microsoft.com/en-us/library/4zc42wh1(VS.85).aspx
 *      http://www.cnblogs.com/sunwangji/archive/2007/06/26/791428.html
 *      http://www.cnblogs.com/sunwangji/archive/2006/08/21/482341.html
 *      http://msdn.microsoft.com/en-us/library/4zc42wh1(VS.85).aspx
 *      http://www.interq.or.jp/student/exeal/dss/ejs/3/1.html
 *      http://blog.mvpcn.net/fason/
 *      http://d.hatena.ne.jp/m-hiyama/20051017/1129510043
 *      http://noir.s7.xrea.com/archives/000203.html
 * 
 * @since 2011/11/20
 */
function apply(apply_this_obj, apply_args) {
	var temp_apply_key, _arg_list, r, i = 0,
	l = apply_args && apply_args.length;

	if (apply_this_obj)
		apply_this_obj[temp_apply_key = 'temp_apply'] = this;

	if (l) {
		for (; i < l; i++)
			_arg_list[i] = 'apply_args[' + i + ']';
		if (!temp_apply_key)
			apply_this_obj = this;
		r = eval('apply_this_obj'
				+ (temp_apply_key ? '.' + temp_apply_key : '')
				+ '(' + _arg_list.join(',') + ')');
	} else
		r = temp_apply_key ? apply_this_obj[temp_apply_key]() : this();

	if (temp_apply_key)
		delete apply_this_obj[temp_apply_key];
	return r;
}

/**
 * call 方法是用來呼叫代表另一個物件的方法。call 方法可讓您將函式的物件內容從原始內容變成由 thisObj 所指定的新物件。
 * 如果未提供 thisObj 的話，將使用 global 物件作為 thisObj。
 * @see
 * http://msdn.microsoft.com/library/CHT/jscript7/html/jsmthcall.asp
 * @since	2011/11/20
 */
function call(this_obj) {
	//	因 arguments 非 instanceof Array，arguments.slice(sp) → Array.prototype.slice.call(arguments, sp).
	return this.apply(this_obj, Array.prototype.slice.call(arguments, 1));
}

/**
 * @since	2011/11/20
 */
function bind(this_obj) {
	var func = this, args = Array.prototype.slice.call(arguments, 1);
	//	TODO: 對於少量 arguments，將 arguments 添入於 .concat() 以加快速度。
	return function() {
		var counter = arguments.length, arg = args.concat(), i = counter + args.length;
		while (counter--)
			arg[--i] = arguments[counter];
		return func.apply(this_obj, arg);
	};
}




add_method(Function.prototype, {
	apply : apply,
	call : call,
	bind : bind
});








/*	2008/12/21 18:53:42
value to json
JavaScript Object Notation	ECMA-262 3rd Edition

http://stackoverflow.com/questions/1500745/how-to-pass-parameters-in-eval-in-an-object-form
json={name:'~',values:..,description:'~'}
window[json.name].apply(null, json.values)


usage:
json(value)

parse:
data=eval('('+data+')');	//	字串的前後記得要加上刮號 ()，這是用來告知 Javascript Interpreter 這是個物件描述，不是要執行的 statement。
eval('data='+data);

TODO:

useObj
加入function object成員，.prototype可用with()。加入函數相依性(dependency)

array用name:
(function(){
var o;
o=[..];
var i,v={..};
for(i in v)o[i]=v[i];
return o; 
})()


recursion 循環參照
(function(){
var o;
o={a:[]};
o['b']=[o['a']],
o['a'].push([o['b']]);
return o; 
})()



BUG:
function 之名稱被清除掉了，這可能會產生問題！
(function(){
var f=function(){..};
f.a=..;
f.b=..;
f.prototype={
a:..,
b:..
}
return f; 
})()


*/



/*

test recursion 循環參照
(function(){
var o=[],_1=[o];
o.push(_1);
return o; 
})();

var a=[],b;a.push(b=[a]);json(a);
*/

//json[generateCode.dLK]='qNum,dQuote';
/**
 * 須判別來源是否為 String or Number!
 * @deprecated
 * 	改用 window.JSON, jQuery.parseJSON.
 * @param val
 * @param name
 * @param type
 * 	type==2: inside object, treat undefined as ''
 * @returns
 */
function json(val, name, type) {
	var _f = json, expA = [], expC = [], vType = typeof val, addE = function(
			o, l, n) {
		if (l) {
			o = _f(o, 0, 2);
			n = typeof n == 'undefined' || n === '' ? ''
					: (/^(\d{1,8})?(\.\d{1,8})?$/
							.test(n)
							|| /^[a-z_][a-z_\d]{0,30}$/i
							.test(n) ? n
									: dQuote(n))
									+ ':' + _f.separator;
			expA.push(n, o[1]);

			// expC.push(_f.indentString+n+o[0].join(_f.NewLine+_f.indentString)+',');
			o = o[0];
			o[0] = n
			+ (typeof o[0] == 'undefined' ? ''
					: o[0]);
			o[o.length - 1] += ',';
			for ( var i = 0; i < o.length; i++)
				o[i] = _f.indentString
				+ (typeof o[i] == 'undefined' ? ''
						: o[i]);
			expC = expC.concat(o);
		} else
			expA.push(o), expC.push(o);
	}
	// 去掉最後一組的 ',' 並作結
	, closeB = function(c) {
		var v = expC[expC.length - 1];
		if (v.charAt(v.length - 1) == ',')
			expC[expC.length - 1] = v.slice(0,
					v.length - 1);
		addE(c);
	};

	switch (vType) {
	case 'number':
		// http://msdn2.microsoft.com/zh-tw/library/y382995a(VS.80).aspx
		// isFinite(value) ? String(value)
		var k = 0, m = 'MAX_VALUE,MIN_VALUE,NEGATIVE_INFINITY,POSITIVE_INFINITY,NaN'
			.split(','), t = 0;
		if (val === NaN || val === Infinity
				|| val === -Infinity)
			t = '' + val;
		else
			for (; k < m.length; k++)
				if (val === Number[m[k]]) {
					t = 'Number.' + m[k];
					break;
				}
		if (!t) {
			// http://msdn2.microsoft.com/zh-tw/library/shydc6ax(VS.80).aspx
			for (k = 0, m = 'E,LN10,LN2,LOG10E,LOG2E,PI,SQRT1_2,SQRT2'
				.split(','); k < m.length; k++)
				if (val === Math[m[k]]) {
					t = 'Math.' + m[k];
					break;
				}
			if (!t)
				if (k = ('' + val)
						.match(/^(-?\d*[1-9])(0{3,})$/))
					t = k[1] + 'e' + k[2].length;
				else {

					// 有理數判別
					k = qNum(val);

					// 小數不以分數顯示. m==1:非分數
					m = k[1];
					while (m % 2 == 0)
						m /= 2;
					while (m % 5 == 0)
						m /= 5;

					t = k[2] == 0 && m != 1 ? k[0]
					+ '/' + k[1]
					:
						// TODO: 加速(?)
						(t = Math.floor(val)) == val
						&& ('' + t).length > (t = '0x'
							+ val
							.toString(16)).length ? t
									: val;
				}

		}
		addE(t);
		break;
	case 'null':
		addE('' + val);
		break;
	case 'boolean':
		addE(val);
		break;
	case 'string':
		addE(dQuote(val));
		break;
	case 'undefined':
		addE(type == 2 ? '' : 'undefined');
		break;

	case 'function':
		// 加入function
		// object成員，.prototype可用with()。加入函數相依性(dependency)
		var toS, f;
		// 這在多執行緒有機會出問題！
		if (typeof val.toString != 'undefined') {
			toS = val.toString;
			delete val.toString;
		}
		f = '' + val;
		if (typeof toS != 'undefined')
			val.toString = toS;

		f = f.replace(/\r?\n/g, _f.NewLine); // function
		// 才會產生
		// \r\n
		// 問題，所以先處理掉
		var r = /^function\s+([^(\s]+)/, m = f.match(r), t;
		if (m)
			m = m[1], addE('//	function [' + m + ']'),
			t = f.replace(r, 'function'
					+ _f.separator);
		if (m && t.indexOf(m) != -1)
			alert('function [' + m
					+ '] 之名稱被清除掉了，這可能會產生問題！');
		addE(t || f);
		// UNDO
		break;

	case 'object':
		try {
			if (val === null) {
				addE('' + val);
				break;
			}
			var c = val.constructor;
			if (c == RegExp) {
				addE(val);
				break;
			}
			if (c == Date || vType == 'date') { // typeof
				// val.getTime=='function'
				// 與 now 相隔過短(<1e7, 約3h)視為 now。但若是 new
				// Date()+3 之類的會出現誤差！
				addE('new Date'
						+ ((val - new Date) > 1e7 ? '('
								+ val.getTime() + ')'
								: '')); // date被當作object
				break;
			}
			if (('' + c).indexOf('Error') != -1) {
				addE('new Error'
						+ (val.number
								|| val.description ? '('
										+ (val.number || '')
										+ (val.description ? (val.number ? ','
												: '')
												+ dQuote(val.description)
												: '') + ')'
												: ''));
				break;
			}

			var useObj = 0;
			if (c == Array) {
				var i, l = 0;
				if (!_f.forceArray)
					for (i in val)
						if (isNaN(i)) {
							useObj = 1;
							break;
						} else
							l++;

				if (_f.forceArray || !useObj
						&& l > val.length * .8) {
					addE('[');
					for (i = 0; i < val.length; i++)
						addE(val[i], 1);
					closeB(']');
					break;
				} else
					useObj = 1;
			}

			if (useObj || c == Object) {// instanceof
				addE('{');
				for ( var i in val)
					addE(val[i], 1, i);
				closeB('}');
				break;
			}
			addE(dQuote(val));
			break;
		} catch (e) {
			if (28 == (e.number & 0xFFFF))
				alert('json: Too much recursion?\n循環參照？');
			return;
		}

	case 'unknown': // sometimes we have this kind of type
	default:
		alert('Unknown type: [' + vType
				+ '] (constructor: ' + val.constructor
				+ '), please contract me!\n' + val);
	break;
	// alert(vType);
	}
	return type ? [ expC, expA ] : expC
			.join(_f.NewLine);
}
json.dL = 'dependencyList'; // dependency List Key
json.forceArray = 1;

json.indentString = '	';
json.NewLine = '\n';
json.separator = ' ';



_.no_extend='add_method';


return (
	_// JSDT:_module_
);
}


);

