
/**
 * @name	CeL code reorganize function
 * @fileoverview
 * 本檔案包含了程式碼重整的 functions。
 * @since	
 */


if (typeof CeL === 'function'){

/**
 * 本 module 之 name(id)，<span style="text-decoration:line-through;">不設定時會從呼叫時之 path 取得</span>。
 * @type	String
 * @constant
 * @inner
 * @ignore
 */
var module_name = 'code.reorganize';

//===================================================
/**
 * 若欲 include 整個 module 時，需囊括之 code。
 * @type	Function
 * @param	{Function} library_namespace	namespace of library
 * @param	load_arguments	呼叫時之 argument(s)
 * @return
 * @_name	_module_
 * @constant
 * @inner
 * @ignore
 */
var code_for_including = function (library_namespace, load_arguments) {


var 
/**
 * null module constructor
 * @class 程式碼重整相關之 function。
 * @constructor
 */
_// JSDT:_module_
= function () {
	//	null module constructor
};

/**
 * for JSDT: 有 prototype 才會將之當作 Class
 */
_// JSDT:_module_
.prototype = {};




//class public interface	---------------------------

_// JSDT:_module_
.
/**
* 取得[script_filename].wsf中不包括自己（[script_filename].js），其餘所有 .js 的code。
* 若想在低版本中利用eval(get_all_functions(ScriptName))來補足，有時會出現奇怪的現象，還是別用好了。
* @param {String} script_filename
* @return
* @requires	ScriptName,simpleRead
*/
get_all_functions = function (script_filename) {
	if (!script_filename)
		script_filename = ScriptName;
	var t = '', i, a = simpleRead(script_filename + '.wsf'), l = a ? a
			.match(/[^\\\/:*?"<>|'\r\n]+\.js/gi) : [script_filename + '.js'];

	for (i in l)
		if (l[i] != script_filename + '.js' && (a = simpleRead(l[i])))
			t += a;
	return t;
};


//var OK = addCode('alert,simpleWrite', ['alert', 'NewLine', 'get_all_functions']);if (typeof OK == 'string') simpleWrite('try.js', OK), alert('done'); else alert('OK:' + OK);
//addCode('複製 -backup.js');
/*
{
	var ss = [23, 23.456, undefined, Attribute, null, Array, '567', 'abc'], l = 80, repF = 'tmp.txt', sa = ss, st = addCode('', ['ss']), t;
	ss = '(reseted)'; try { eval(st); } catch (e) { } t = (sa === ss) + ': ' + typeof sa + '→' + typeof ss + '\n';
	simpleWrite(repF, t + sa + '\n→\n' + ss + '\n\n◎eval:\n' + st);
	alert(t + (sa = '' + sa, sa.length < l ? sa : sa.slice(0, l / 2) + '\n..' + sa.slice(sa.length - l / 2)) + '\n→\n' + (ss = '' + ss, ss.length < l ? ss : ss.slice(0, l / 2) + '\n..' + ss.slice(ss.length - l / 2)) + '\n\n' + (ss = '' + st, ss.length < l ? ss : ss.slice(0, 200) + '\n..\n' + ss.slice(ss.length - 200)));
}
*/

/*	將各function加入檔案中，可做成HTML亦可用之格式
加入識別格式：
//	from function.js	-------------------------------------------------------------------

//e.g.,
//	[function.js](f1,f2,'string'	//	'string'或"string"中包含的需要是完整的敘述句
//	number var,string var,object var,date var,undefined  var)

//e.g.,
//	[function.js](OS,NewLine,dirSp,dirSpR,'var ScriptName=getScriptName();',ForReading,ForWriting,ForAppending,TristateUseDefault,TristateTrue,TristateFalse,WshShell,fso,args,'initWScriptObj();',initWScriptObj,setTool,JSalert,Str2Date,Date2Str,decplaces,dQuote,set_obj_value,getScriptFullName,getScriptName,'setTool();',WinEnvironment,SpecialFolder,Network,NetDrive,NetPrinter,getEnvironment,'getEnvironment();',dateUTCdiff,gDate)
//e.g.,
//	[function.js]("var NewLine='\n',OS='unix',dirSp=dirSpR='/';",dQuote,setTool,product,decplaces,countS,getText,turnUnicode,trimStr_,trimStr,StrToDate,DateToStr,reducePath,getPathOnly,getFN,getFP,dBasePath,trigger,setTopP,setAstatusOS,setAstatus,setAstatusOver,setAstatusOut,doAlertResize,doAlertInit,doAlert,doAlertAccess,doAlertScroll,setCookie,getCookie,scrollTo,disableKM,setCookieS,*disabledKM=0;,scrollToXY,scrollToInterval,scrollToOK,doAlertDivName,doAlertOldScrollLocation,parse_Function,dealPopup,sPopP,sPopF,sPopInit,sPopInit,sPop,setTextT,setText)

..(inclide code)
//	[function.js]End	-------------------------------------------------------------------
//	↑from function.js	-------------------------------------------------------------------


TODO:
.htm 加入 .replace(/\//g,'\\/')
*/
addCode.report = false; //	是否加入報告
//addCode[generate_code.dLK]='NewLine,isFile,simpleRead,autodetectEncode,generate_code,JSalert,setTool,*setTool();';
function addCode(FN, Vlist, startStr, endStr) {	//FN:filename(list),Vlist:多加添的function/var list
	if (!startStr) startStr = '//	[' + WScript.ScriptName + ']';
	if (!endStr) endStr = startStr + 'End';
	//alert(isFile(FN)+'\n'+startStr+'\n'+endStr);

	if (typeof FN == 'string') FN = [isFile(FN) ? FN : startStr + (FN ? '(' + FN + ')' : '') + NewLine + endStr + NewLine];
	if (typeof Vlist == 'string') Vlist = [Vlist]; else if (typeof Vlist != 'object') Vlist = [];

	var i, j, F, a, A, start, end, codeHead, b, c, d, f, m, OK = 0
, s = '()[]{}<>\u300c\u300d\u300e\u300f\u3010\u3011\u3008\u3009\u300a\u300b\u3014\u3015\uff5b\uff5d\ufe35\ufe36\ufe39\ufe3a\ufe37\ufe38\ufe3b\ufe3c\ufe3f\ufe40\ufe3d\ufe3e\ufe41\ufe42\ufe43\ufe44\uff08\uff09\u300c\u300d\u300e\u300f\u2018\u2019\u201c\u201d\u301d\u301e\u2035\u2032'//「」『』【】〈〉《》〔〕｛｝︵︶︹︺︷︸︻︼︿﹀︽︾﹁﹂﹃﹄（）「」『』‘’“”〝〞‵′
, endC, req, directInput = '*', tmpExt = '.tmp', encode, oriC;


	for (i in FN) try {
		if (a = oriC = isFile(FN[i]) ? simpleRead(FN[i], encode = autodetectEncode(FN[i])) : FN[i], !a) continue; A = '', dones = [], doneS = 0;
		//sl(a.slice(0,200));

		/*	判斷NL這段將三種資料作比較就能知道為何這麼搞。

		~\r:

		\r	123
		\n	1
		\r\n	2
		\n-\r	-120


		~\n:

		\r	1
		\n	123
		\r\n	2
		\n-\r	120


		~\r\n:

		\r	123
		\n	123
		\r\n	123
		\n-\r	-2~2
		*/
		NL = a.replace(/[^\n]+/g, '').length, b = a.replace(/[^\r]+/g, '').length;
		if (NL != b && NL && b) {
			alert("There're some encode problems in the file:\n" + FN[i] + '\n\\n: ' + NL + '\n\\r: ' + b);
			NL = Math.max(NL, b) > 10 * Math.abs(NL - b) ? '\r\n' : NL > b ? '\n' : '\r';
		} else NL = NL ? b ? '\r\n' : '\n' : '\r';

		//sl(a.indexOf(startStr)+'\n'+startStr+'\n'+a.slice(0,200));
		// TODO: a=a.replace(/(startReg)(.*?)(endReg)/g,function($0,$1,$2,$3){.. return $1+~+$3;});
		while ((start = a.indexOf(startStr)) != -1) {//&&(end=a.indexOf(endStr,start+startStr.length))!=-1
			//	initial reset
			codeHead = codeText = endC = '', req = [], j = 0;
			//	判斷 end index
			if ((end = a.indexOf(endStr, start + startStr.length)) == -1) {
				alert('addCode: There is start mark without end mark!\nendStr:\n' + endStr);
				//	未找到格式則 skip
				break;
			}
			//	b=inner text
			b = a.slice(start + startStr.length, end);
			b = b.split(NL); //b=b.split(NL=b.indexOf('\r\n')!=-1?'\r\n':b.indexOf('\n')!=-1?'\n':'\r');	//	test檔案型式：DOS or UNIX.最後一位元已被split掉
			if (c = b[0].match(/^\s*([^\w])/)) {
				codeHead += b[0].slice(0, RegExp.lastIndex), b[0] = b[0].slice(RegExp.lastIndex);
				if (s.indexOf(c = c[1]) % 2 == 0) endC = s.charAt(s.indexOf(c) + 1); else endC = c;
			}
			//NL=b[0].slice(-1)=='\r'?'\r\n':'\n';	//	移到前面：因為需要以NL作split	test檔案型式：DOS or UNIX.最後一位元已被split掉
			//alert('endC='+endC+',j='+j+',d='+d+'\n'+b[0]+'\nNewLine:'+(NL=='\n'?'\\n':NL=='\r\n'?'\\r\\n':'\\r')+'\ncodeHead:\n'+codeHead);

			do {
				if (!j) d = 0; else if (b[j].slice(0, 2) != '//') continue; else d = 2; //if(d==b[j].length)continue;	//	不需要d>=b[j].length
				for (; ; ) {
					//alert('search '+b[j].slice(d));
					if ((c = b[j].slice(d).match(/^[,\s]*([\'\"])/)) && (f = d + RegExp.lastIndex) <= b[j].length &&
					//	(c=c[1], f<b[j].length)
    		(c = c[1]) && f < b[j].length
     	) {	//	.search(
						//alert(b[j].charAt(f)+'\n'+c+'\n^(.*[^\\\\])['+c+']');
						if (b[j].charAt(f) == c) { alert('addCode: 包含[' + c + c + ']:\n' + b[j].slice(f)); continue; } //	'',""等
						if (c = b[j].slice(f).match(new RegExp('^(.+?[^\\\\])[' + c + ']'))) { d = f + RegExp.lastIndex; req.push(directInput/*+b[j].charAt(f-1) 改進後不需要了*/ + c[1]); continue; }
						alert('addCode: Can not find end quota:\n' + b[j].slice(f));
					}
					//alert(d+','+b[j].length+'\nsearch to '+b[j].slice(d));

					//	出現奇怪現象請加"()"
					//if((c=b[j].slice(d).match(/([^,\s]+)([,\s]*)/))&& ( (d+=RegExp.lastIndex)==b[j].length || /[,\n]/.test(c[2])&&d<b[j].length ) ){	//	不需要\s\r
					if ((c = b[j].slice(d).match(/([^,\s]+)[,\s]*/)) && (d += RegExp.lastIndex) <= b[j].length) {	//	不需要\s\r
						//if(!/[,\n]/.test(c[2])&&d<b[j].length)break;
						//alert(RegExp.index+','+d+','+b[j].length+','+endC+'\n['+c[1]+']\n['+c[2]+']\n'+b[j].slice(d));
						if (!endC || (m = c[1].indexOf(endC)) == -1) req.push(c[1]);
						else { if (m) req.push(c[1].slice(0, m)); endC = ''; break; }
					} else break;
				}
				codeHead += b[j] + NL;
				//alert('output startStr:\n'+startStr+'\ncodeHead:\n'+codeHead);
			} while (endC && ++j < b.length);
			//for(j=0,b=[];j<req.length;j++)b.push(req[j]);	//	不能用b=req：object是用參考的，這樣會改到req本身！
			//for(j=0;j<Vlist.length;j++)b.push(Vlist[j]);	//	加入附加的變數

			b = generate_code(req.concat(Vlist), NL, directInput);
			codeText = codeHead + (arguments.callee.report ? '/*	addCode @ ' + gDate('', 1)	//	report
+ (req.length ? NL + '	request variables [' + req.length + ']:	' + req : '')
+ (Vlist.length ? NL + '	addition lists [' + Vlist.length + ']:	' + Vlist : '')
+ (req.length && Vlist.length && b[2].length < req.length + Vlist.length ? NL + '	Total request [' + b[2].length + ']:	' + b[2] : '')
+ (b[4].length ? NL + '	really done [' + b[4].length + ']:	' + b[4] : '')
+ (b[5].length ? NL + '	cannot found [' + b[5].length + ']:	' + b[5] : '')
+ (b[6].length ? NL + '	all listed [' + b[6].length + ']:	' + b[6] : '')
			//+(b[3].length?NL+'	included function ['+b[3].length+']:	'+b[3]:'')
+ NL + '	*/' : '') + NL + reduceCode(b[0]).replace(/([};])function(\s)/g, '$1' + NL + 'function$2').replace(/}var(\s)/g, '}' + NL + 'var$1')/*.replace(/([;}])([a-z\._\d]+=)/ig,'$1'+NL+'$2')*/ + NL + b[1] + NL;
			//alert(start+','+end+'\n'+a.length+','+end+','+endStr.length+','+(end+endStr.length)+'\n------------\n'+codeText);//+a.slice(end+endStr.length)
			A += a.slice(0, start + startStr.length) + codeText + a.substr(end, endStr.length), a = a.substr(end + endStr.length);
		}

		if (FN.length == 1 && !isFile(FN[i]))
			return A;
		else if (A && oriC != A + a)	//	有變化才寫入
			if (!simpleWrite(FN[i] + tmpExt, A + a, encode))
				try { fso.DeleteFile(FN[i]); fso.MoveFile(FN[i] + tmpExt, FN[i]); OK++; } catch (e) { } //popErr(e);
			else try { fso.DeleteFile(FN[i] + tmpExt); } catch (e) { } //popErr(simpleFileErr);popErr(e);
		//else{alert('addCode error:\n'+e.message);continue;}
	} catch (e) {
		//popErr(e);
		throw e;
	}

	return FN.length == 1 && OK == 1 ? A : OK; //	A:成功的最後一個檔之內容
}


/*	script終結者…
try.wsf
<package><job id="try"><script type="text/javascript" language="JScript" src="function.js"></script><script type="text/javascript" language="JScript" src="try.js"></script></job></package>
try.js
destoryScript('WshShell=WScript.CreateObject("WScript.Shell");'+NewLine+NewLine+alert+NewLine+NewLine+'alert("資料讀取錯誤！\\n請檢查設定是否有錯！");');
*/
function destoryScript(code, addFN) {
	try {	//	input indepent code, additional files
		var SN = getScriptName(), F, a, listJs, i, len, self = SN + '.js';
		if (!code) code = ''; //SN='try';
		a = simpleRead(SN + '.wsf'); if (!a) a = '';
		listJs = a.match(/[^\\\/:*?"<>|'\r\n]+\.(js|vbs|hta|s?html?|txt|wsf|pac)/gi); //	一網打盡
		//,listWsf=(SN+'.wsf\n'+a).match(/[^\\\/:*?"<>|'\r\n]+\.wsf/gi);
		for (i = 0, F = {}; i < listJs.length; i++) F[listJs[i]] = 1;
		if (typeof addFN == 'object') for (i in addFN) F[addFN[i]] = 1;
		else if (addFN) F[addFN] = 1;
		listJs = []; for (i in F) listJs[listJs.length] = i; //	避免重複
		//alert(listJs.join('\n'));

		//done all .js @ .wsf & files @ additional list without self
		for (i = 0; i < listJs.length; i++) if (listJs[i] != self) try {	//	除了self外殺無赦
			if (!listJs[i].match(/\.js$/i) && listJs[i] != SN + '.wsf') { try { fso.DeleteFile(listJs[i], true); } catch (e) { } continue; } //	非.js就讓他死
			if (changeAttributes(F = fso.GetFile(listJs[i]), '-ReadOnly')) throw 0; //	取消唯讀
			a = addNullCode(F.size); //a=listJs[i].match(/\.js$/i)?addNullCode(F.size):'';	先確認檔案存在，再幹掉他
			//alert('done '+listJs[i]+'('+F.size+')\n'+(a.length<500?a:a.slice(0,500)+'..'));
			simpleWrite(listJs[i], a);
		} catch (e) {
			//popErr(e);
		}

		//done .wsf
		try {
			if (changeAttributes(F = fso.GetFile(SN + '.wsf'), '-ReadOnly')) throw 0;
			a = '<package><job id="' + SN + '"><script type="text/javascript" src="' + SN + '.js"><\/script><\/job><\/package>';
			//alert('done '+SN+'.wsf'+'('+F.size+')\n'+a);
			//a='<package><job id="'+SN+'"><script type="text/javascript" src="function.js"><\/script><script type="text/javascript" src="'+SN+'.js"><\/script><\/job><\/package>';
			simpleWrite(SN + '.wsf', a);
		} catch (e) {
			//popErr(e);
		}

		//done self
		if (listJs.length) try {
			if (changeAttributes(F = fso.GetFile(self), '-ReadOnly') < 0) throw 0;
			a = (F.size - code.length) / 2, a = addNullCode(a) + code + addNullCode(a);
			if (F.Attributes % 2) F.Attributes--; //	取消唯讀
			//alert('done '+self+'('+F.size+')\n'+(a.length<500?a:a.slice(0,500)+'..'));
			//a='setTool(),destoryScript();';
			simpleWrite(self, a);
		} catch (e) {
			//popErr(e);
		}

		//run self & WScript.Quit()
		//return WshShell.Run('"'+getScriptFullName()+'"');
		return 0;
	} catch (e) { return 1; }
}

/*	for version<5.1:因為不能用.wsf，所以需要合併成一個檔。
請將以下函數copy至.js主檔後做適當之變更
getScriptName(),mergeScript(FN),preCheck(ver)
*/
//	將script所需之檔案合併
//	因為常由preCheck()呼叫，所以所有功能亦需內含。
function mergeScript(FN) {
	var i, n, t, SN = getScriptName(), NewLine, fso, ForReading, ForWriting, ForAppending;
	if (!NewLine) NewLine = '\r\n';
	if (!fso) fso = WScript.CreateObject("Scripting.FileSystemObject");
	if (!ForReading) ForReading = 1, ForWriting = 2, ForAppending = 8;
	try {

		//	from .wsf
		/*var F=fso.OpenTextFile(SN+'.wsf',ForReading)
		//,R=new RegExp('src\s*=\s*["\']?(.+\.js)["\']?\s*','gi')
		,a=F.ReadAll();F.Close();*/
		a = simpleRead(SN + '.wsf'),
S = fso.OpenTextFile(FN, ForWriting, true/*create*/);

		try {
			//t=a.match(/<\s*resource\s+id=(['"].*['"])\s*>((.|\r\n)*?)<\/\s*resource\s*>/gi);
			//	5.1版以下果然還是不能成功實行，因為改變regexp不能達到目的：沒能找到t。所以在下面第一次test失敗後即放棄；改用.ini設定。
			var r = new RegExp("<\\s*resource\\s+id=(['\"].*['\"])\\s*>((.|\\r\\n)*?)<\\/\\s*resource\\s*>", "ig");
			t = a.match(r);
			S.WriteLine('//	mergeScript: from ' + SN + '.wsf');
			S.WriteLine("function getResource(id){");
			if (!t || !t.length) S.WriteLine(" return ''");
			else for (i = 0; i < t.length; i++) {
				//alert(i+':'+t[i]);
				//n=t[i].match(/<\s*resource\s+id=(['"].*['"])\s*>((.|\r\n)*?)<\/\s*resource\s*>/i);
				r = new RegExp("<\\s*resource\\s+id=(['\"].*['\"])\\s*>((.|\\r\\n)*?)<\\/\\s*resource\\s*>", "i");
				n = t[i].match(r);
				S.WriteLine(
" "
+ (i ? ":" : "return ")
+ "id==" + n[1]
+ "?'"
+ n[2].replace(/\r?\n/g, '\\n')
+ "'"
);
			}
			S.WriteLine(" :'';" + NewLine + "}" + NewLine);
		} catch (e) { }

		//	from .js
		t = a.match(/src\s*=\s*["']?(.+\.js)["']?\s*/gi);
		for (i = 0; i < t.length; i++) {
			//alert(i+':'+t[i].match(/src\s*=\s*["']?(.+\.js)["']?\s*/i)[1]);
			//try{F=fso.OpenTextFile(n=t[i].match(/src\s*=\s*["']?(.+\.js)["']?\s*/i)[1],ForReading);}
			//catch(e){continue;}
			//S.WriteLine('//	mergeScript: from script	'+n);S.WriteBlankLines(1);S.WriteLine(F.ReadAll());
			//S.WriteLine('//	mergeScript: from script	'+n+NewLine+NewLine+F.ReadAll());
			//F.Close();
			S.WriteLine('//	mergeScript: from script	' + (n = t[i].match(/src\s*=\s*["']?(.+\.js)["']?\s*/i)[1]) + NewLine + NewLine + simpleRead(n));
		}
		S.Close();
	} catch (e) { return 1; }
	return 0;
}





//var fa=function(a,s){return '"'+a+k+"'";},fb=function kk(a,t){return a;},fc=new Function('return b+b;'),Locale2=fa,Locale3=fb,Locale4=fc,r=generate_code(['fa','fb','fc','Locale2','Locale3','Locale4','kk']);alert(r.join('\n★'));try{eval(r[0]);alert(fa);}catch(e){alert('error!');}
/*	use for JSON (JavaScript Object Notation)
利用[*現有的環境*]及變數設定生成code，因此並不能完全重現所有設定，也無法判別函數間的相依關係。
DirectlyInput:	[directInput]string
輸出string1（可reduceCode）,輸出string2（主要為object definition，不需reduceCode，以.replace(/\r\n/g,'')即可reduce）,總共要求的變數（去掉重複）,包含的函數（可能因參考而有添加）,包含的變數（可能因參考而有添加）,未包含的變數

未來：對Array與Object能確實設定之	尚未對應：Object遞迴/special Object(WScript,Excel.Application,內建Object等)/special function(內建函數如Math.floor與其他如WScript.CreateObject等)
JScript中對應資料型態，應考慮到內建(intrinsic 或 built-in)物件(Boolean/Date/Function/Number/Array/Object(需注意遞迴:Object之值可為Object))/Time/Error/RegExp/Regular Expression/String/Math)/string/integer/Byte/number(float/\d[de]+-\d/Number.MAX_VALUE/Number.MIN_VALUE)/special number(NaN/正無限值:Number.POSITIVE_INFINITY/負無限值:Number.NEGATIVE_INFINITY/正零/負零)/date/Boolean/undefined(尚未設定值)/undcleared(尚未宣告)/Null/normal Array/normal Object/special Object(WScript,Automation物件如Excel.Application,內建Object等)/function(實體/參考/anonymous)/special function(內建函數如isNaN,Math之屬性&方法Math[.{property|method}]與其他如WScript.CreateObject等)/unknown(others)

**	需同步更改 json()


TODO:
Object.toSource()
Array.toSource()
json	http://www.json.org/json.js


XML Object

bug:
函數定義 .toString() 時無法使用。


使用 \uXXXX 使.js跨語系
含中文行
→
//turnBy	含中文行
\x..
考慮註解&執行時語系

to top BEFORE ANY FUNCTIONS:
generate_code.dLK='dependencyList';	//	dependency List Key
*/
//generate_code[generate_code.dLK]='set_obj_value,dQuote';
generate_code.ddI = '*'; //	default directInput symbol
generate_code.dsp = ','; //	default separator
function generate_code(Vlist, NL, directInput) {	//	變數list,NewLine,直接輸入用辨識碼
	var codeText = '', afterCode = '', vars = [], vari = [], func = [], done = [], undone = [], t, i = 0, c = 0, val, vName, vType; //	vars:處理過的variables（不論是合法或非合法）,c:陳述是否已完結
	if (!NL) NL = NewLine; if (!directInput) directInput = generate_code.ddI;
	if (typeof Vlist == 'string') Vlist = Vlist.split(generate_code.dsp);

	for (; i < Vlist.length; i++) if (!((vName = '' + Vlist[i]) in vars)) {	//	c(continue)=1:var未截止,vName:要加添的變數內容
		vars[vName] = vari.length, vari.push(vName); //	避免重複

		//	不加入的
		if (vName.charAt(0) == '-') {
			vars[vName.slice(1)] = -1;
			continue;
		}

		//	直接輸出
		if (vName.slice(0, directInput.length) == directInput) {
			if (c) codeText += ';' + NL, c = 0; codeText += val = vName.substr(directInput.length);
			done.push('(DirectlyInput)' + val); continue;
		}
		try { eval('vType=typeof(val=' + vName + ');'); } //void
		catch (e) { undone.push((vType ? '(' + vType + ')' : '') + vName + '(error ' + (e.number & 0xFFFF) + ':' + e.description + ')'); continue; } //	.constructor	b:type,c:已起始[var ];catch b:語法錯誤等,m:未定義


		if (vType == 'function') {	//	or use switch-case
			//	加入function object成員，.prototype可用with()。加入函數相依性(dependency)
			try { eval("var j,k;for(j in " + vName + ")if(j=='" + generate_code.dLK + "'&&(k=typeof " + vName + "." + generate_code.dLK + ",k=='string'||" + vName + "." + generate_code.dLK + " instanceof Array)){j=" + vName + "." + generate_code.dLK + ";if(k=='string')j=j.split(',');for(k in j)if(j[k])Vlist.push(j[k]);}else Vlist.push('" + vName + ".'+j);for(j in " + vName + ".prototype)Vlist.push('" + vName + ".prototype.'+j);"); }
			catch (e) { undone.push('(' + vType + ')' + vName + '.[child]' + '(error ' + (e.number & 0xFFFF) + ':' + e.description + ')'); }

			val = ('' + val).replace(/[\r\n]/g, NL); //	function 才會產生 \r\n 問題，所以先處理掉
			if ((t = val.match(/^\s*function\s*\(/)) || val.match(/^\s*function\s+([\w_]*)([^(]*)\(/))	//	這種判別法不好！
				if (t || (t = RegExp.$1) == 'anonymous') {
					func.push(vName); vType = (typeof t == 'string' ? t : 'no named') + ' ' + vType;
					if (t == 'anonymous') {	//	忠於原味（笑）anonymous是從new Function(文字列を使って)來的
						var m = val.match(/\(([^)]*)\)\s*{/), l = RegExp.lastIndex, q = val.match(/[^}]*$/); q = RegExp.index;
						if (!m) { undone.push('(anonymous function error:' + val + ')' + vName); continue; }
						if (t = m[1].replace(/,/g, "','")) t = "'" + t + "',"; t = 'new Function(' + t + dQuote(reduceCode(val.slice(l, q - 1))) + ')';
					} else t = val;
				} else if (t == vName) {	//	関数(function): http://www.interq.or.jp/student/exeal/dss/ejs/1/2.html
					if (c) codeText += ';' + NL, c = 0; func.push(vName), codeText += val + NL; continue;
				} else if (val.indexOf('[native code]') != -1) { undone.push('(native code function error:' + val + ')' + vName); continue; } //	內建(intrinsic 或 built-in)函數：這種判別法不好！
				else if (t in vars) done.push('(' + vType + ')' + vName), func.push(vName); //	已經登錄過了，所以就這麼下去..
				else { if (c) codeText += ';' + NL; codeText += val + NL; vars[t] = vari.length, done.push('(' + vType + ')' + t), func.push(t, vName), c = 0; }
			else { undone.push('(function error:' + val + ')' + vName); continue; } //unknown
		} else if (vType == 'number') {
			//	http://msdn2.microsoft.com/zh-tw/library/y382995a(VS.80).aspx
			var k = 0, m = 'MAX_VALUE,MIN_VALUE,NEGATIVE_INFINITY,POSITIVE_INFINITY,NaN'.split(',');
			if (val === NaN || val === Infinity || val === -Infinity) t = '' + val;
			else for (t = 0; k < m.length; k++) if (val === Number[m[k]]) { t = 'Number.' + m[k]; break; }
			if (!t) {
				//	http://msdn2.microsoft.com/zh-tw/library/shydc6ax(VS.80).aspx
				for (k = 0, m = 'E,LN10,LN2,LOG10E,LOG2E,PI,SQRT1_2,SQRT2'.split(','); k < m.length; k++) if (val === Math[m[k]]) { t = 'Math.' + m[k]; break; }
				if (!t) t = (t = Math.floor(val)) == val && ('' + t).length > (t = '0x' + val.toString(16)).length ? t : val;
			}
		} else if (vType == 'boolean' || val === null) t = val; //String(val)//val.toString()	//	typeof null is 'object'
		else if (vType == 'string') t = dQuote(val);
		else if (vType == 'object' && typeof val.getTime == 'function' || vType == 'date') t = 'new Date(' + ((val - new Date) > 999 ? val.getTime() : '') + ')'; //	date被當作object
		//	http://msdn2.microsoft.com/en-us/library/dww52sbt.aspx
		else if (vType == 'object' && /*val.constructor==Error  "[object Error]" */('' + val.constructor).indexOf('Error') != -1)
			t = 'new Error' + (val.number || val.description ? '(' + (val.number || '') + (val.description ? (val.number ? ',' : '') + dQuote(val.description) : '') + ')' : '');
		/*
		else if(vName=='set_obj_value.F'){	//	明白宣示在這裡就插入依存函數：不如用 set_obj_value.F,'set_obj_value();'
		if(!vars['set_obj_value']||!vars['dQuote'])Vlist=Vlist.slice(0,i).concat('set_obj_value','dQuote',Vlist.slice(i));
		Vlist[i--]=directInput+'var set_obj_value.F;';continue;
		}
		*/
		else if (vType == 'object' && (val.constructor == Object || val.constructor == Array)) {// instanceof
			var k, T = '', T_ = '', T_2 = '', _i = 0, cmC = '\\u002c', eqC = '\\u003d', NL_ = "'" + NL + "+'", maxLen = 300 - NL_.length; //	type;loop用,Text,間距,integer?
			if (val.constructor == Object) {
				t = '';
				//	http://fillano.blog.ithome.com.tw/post/257/59403
				//	** 一些內建的物件，他的屬性可能會是[[DontEnum]]，也就是不可列舉的，而自訂的物件在下一版的ECMA-262中，也可以這樣設定他的屬性。
				for (k in val)
					if (typeof val[k] == 'object' || typeof val[k] == 'function')
						Vlist.push(vName + '.' + k); //	簡單的Object遞迴
					else {
						T_2 = k.replace(/,/g, cmC).replace(/=/g, eqC) + '=' + ('' + val[k]).replace(/,/g, cmC).replace(/=/g, eqC) + ',';
						if (T_.length + T_2.length > maxLen) T += T_ + NL_, T_ = T_2; else T_ += T_2;
						if (!_i && parseInt(val[k]) == val[k]) _i = 1; else if (_i < 2 && parseFloat(val[k]) == val[k] && parseInt(val[k]) != val[k]) _i = 2;
					}
				T += T_;
			} else {// if(val.constructor==Array)
				var base = 16, d_, d = -1, k_, kA = [];
				for (k in val)
					if (typeof val[k] == 'object' || typeof val[k] == 'function')
						Vlist.push(vName + '.' + k); //	簡單的Object遞迴
					else kA.push(parseInt(k) == k ? parseInt(k) : k); //	因為Array中仍有可能存在非數字index
				kA.sort(), vType = 'Array', t = ',' + base;
				for (k_ = 0; k_ < kA.length; k_++) {
					if (!((k = kA[k_]) in val)) { if (d_ != '*') if (k - d == 1) d_ += ','; else d_ = '*'; }
					else {
						T_2 = (k - d == 1 ? '' : d_ != '*' && k - d < 3/*k.toString(base).length-1*/ ? d_ : (isNaN(k) ? k.replace(/,/g, cmC).replace(/=/g, eqC) : k.toString(base)) + '=') + ('' + val[k]).replace(/,/g, cmC).replace(/=/g, eqC) + ',', d_ = '';
						if (T_.length + T_2.length > maxLen) T += T_ + NL_, T_ = T_2; else T_ += T_2;
					}
					d = k; if (!_i && parseInt(val[k]) == val[k]) _i = 1; else if (_i < 2 && parseFloat(val[k]) == val[k] && parseInt(val[k]) != val[k]) _i = 2;
				}
				T += T_;
			}
			if (T) {
				if (!vars['set_obj_value'] || !vars['dQuote']) {
					Vlist.push('set_obj_value', 'dQuote'); //	假如沒有set_obj_value則須將之與其所依存之函數（dQuote）一同加入
					if (!vars['set_obj_value.F']) Vlist.push(directInput + 'var set_obj_value.F;');
				}
				afterCode += "set_obj_value('" + vName + "','" + T.slice(0, -1) + "'" + (_i ? _i == 1 ? ",1" : ",.1" : t ? ",1" : '') + t + ");" + NL, t = 1;
			} else t = vType == 'Object' ? '{}' : '[]'; //new Object(), new Array()
		} else if (vType == 'object' && val.constructor == RegExp) t = val;
		else if (vType == 'undefined') t = 1; //	有定義(var)但沒設定值，可計算undefined數目
		else if (t = 1, vType != 'unknown')
			if (('' + val).match(/^\s*\[[Oo]bject\s*(\w+)\]\s*$/)) t = RegExp.$1; //	僅對Math有效？
			else vType = 'unknown type: ' + vType + ' (constructor: ' + val.constructor + ')', alert(vName + ': ' + vType + ', please contract me!\n' + val); //	未知
		else alert('The type of ' + vName + ' is "' + vType + '"!'); //	unknown
		if (typeof t != 'undefined') {
			if (vName.indexOf('.') == -1) codeText += (c ? ',' : 'var ') + vName + (t === 1 && vType != 'number' ? '' : '=' + t), c = 1; //alert(codeText.substr(codeText.length-200));
			else if (t !== 1 || vType == 'number') codeText += (c ? ';' : '') + vName + '=' + t + ';', c = 0;
		}
		done.push('(' + vType + ')' + vName);
	}
	if (c) codeText += ';' + NL; //,c=0;//alert(codeText.substr(codeText.length-200));//alert(afterCode);
	return [codeText, afterCode, vari, func, done, undone, Vlist];
}



//	null code series
//simpleWrite('try.js',addNullCode(50000));
var nullCodeData, nullCodeDataL, addNullCodeD; //	處理nullCode的變數暫存,nullCodeData[變數名]=變數值,nullCodeDataL=length,addNullCodeD:addNullCode data,因為每次都重新執行nullCode()很費時間
function addNullCode(len, type) {	//	為了基底才能加入function而作
	var s = '', t, l, i, j; if (typeof addNullCodeD != 'object') addNullCodeD = []; qq = 0;
	while (s.length < len) {
		/*  t=Math.random()<.5?'function':'';
		s+=len-s.length>9?nullCode((len/2>999?999:len/2)+'-'+len,t):nullCode(len,t);*/
		l = len - s.length > 9 ? len > 2e3 ? 999 : len / 2 : len;
		j = 0; for (i in addNullCodeD) if (i > l) break; else j = i;
		if (j && j > 99) { if (len - s.length > 99) t = nullCode(nullCode(99, 0)), s += (addNullCodeD[t.length] = t); while (len - s.length > j) s += addNullCodeD[j]; }
		s += j && len - s.length - j < 50 ? addNullCodeD[j]
		//	:(t=nullCode(l),addNullCodeD[t.length]=t);
                                    : (t = nullCode(l) ? addNullCodeD[t.length] = t : '');
	}
	return s;
}
function nullCodeDataAdd(vari, val) {	//	variables,value
	if (vari) {
		if (typeof nullCodeData != 'object') nullCodeData = {}, nullCodeDataI = [], nullCodeDataL = 0;
		if (!(vari in nullCodeData)) nullCodeDataI.push(vari), nullCodeDataL++;
		nullCodeData[vari] = val;
	}
}
//var t=nullCode('230-513','function');alert(t.length+'\n'+t);
//	產生無用的垃圾碼
//	其他方法（有閒情逸致時再加）：/**/,//,var vari=num+-*/num,str+-str,if(typeof vari=='~'){},try{eval('~');}catch(e){},eval('try{}catch(e){}');if()WScript.Echo();
function nullCode(len, type) {	//	len:\d-\d
	var t = '', vari = [], u, d; //	variables;up,down:長度上下限
	if (typeof nullCodeData != 'object') nullCodeData = {}, nullCodeDataI = [], nullCodeDataL = 0;
	if (typeof len == 'number') u = d = Math.floor(len);
	else if (len = '' + len, (i = len.indexOf('-')) != -1) d = parseInt(len.slice(0, i)), u = parseInt(len.substr(i + 1));
	if (u < d) { var a = d; d = u, u = a; }
	if (!len || !u || len < 0)
		return '';
	if (typeof type != 'string') type = typeof type;

	//if(type=='boolean'){return Math.random()<.5?1:0;}
	if (type == 'number') { return Math.floor(Math.random() * (u - d) + d); }
	if (type == 'n2') { if (u < 9 && d < 9) d = Math.pow(10, d), u = Math.pow(10, u); return Math.floor(Math.random() * (u - d) + d); }
	if (type == 'string') {
		//	if(d<0&&(d=0,u<0))
		if (d < 0 && u < (d = 0))
			return ''; for (var i = 0, l = nullCode(d + '-' + u, 0), t = []; i < l; i++) t.push(nullCode('32-128', 0)); return fromCharCode(t);
	}
	if (type == 'vari') {	//	變數variables
		if (d) d--; u--; if (u > 32) u = 32; else if (u < 1) u = 1; //	最長變數:32
		var a, i, l, c = 0;
		do {
			t = [], a = nullCode('65-123', 0), i = 0, l = nullCode(d + '-' + u, 0);
			if (a > 90 && a < 97) a = 95; t.push(a);
			for (; i < l; i++) { a = nullCode('55-123', 0); if (a > 90 && a < 97) a = 95; else if (a < 65) a -= 7; t.push(a); } //	code:48-57,65-90,95,97-122;
			t = fromCharCode(t); try { eval('a=typeof ' + t + '!="undefined";'); } catch (e) { } //	確保是新的變數
			if (c % 9 == 0 && d < u) ++d;
		} while (++c < 99 && (a || (t in nullCodeData))); //	不能確保是新變數的話，給個新的：繼續作。★此作法可能導致長時間的迴圈delay！因此限制最多99次。
		//if(c==99){alert('重複：['+a+']'+t);WScript.Quit();}
		return t;
	}
	if (type == 'function') {
		var i = 0, l = nullCode('0-9', 0), fN = nullCode('2-30', 'vari'), a = NewLine + 'function ' + fN + '(', b = NewLine + '}' + NewLine, v, D = []; //	fN:函數名
		nullCodeDataAdd(fN, 'function'); //	只加入函數名
		if (l) { for (; i < l; i++) v = nullCode('2-30', 'vari'), a += v + ',', D.push(v); a = a.slice(0, -1); } a += '){';
		l = (a + b).length + NewLine.length;
		if (u < l) return nullCode(len);
		return a + (NewLine + nullCode((d < l ? 0 : d - l) + '-' + (u - l))).replace(/\n/g, '\n	') + b;
	}
	//	others:type=='code'
	var l = nullCode(len, 0);
	while (t.length < l) {
		var a, v, va = (Math.random() < .5 ? (va = nullCode('1-6', 0)) : dQuote(va = nullCode('5-' + (u - t.length > 50 ? 50 : u - t.length), 'string')));
		if (u - t.length > 20 && Math.random() < .9) {
			if (Math.random() < .7 && nullCodeDataL > 9) v = nullCodeDataI[nullCode(0 + '-' + nullCodeDataL, 0)], a = v + '=' + va;
			else v = nullCode('1-9', 'vari'), a = 'var ' + v + (Math.random() < .3 ? '' : '=' + va);
			a += ';' + (Math.random() < .4 ? NewLine : ''); nullCodeDataAdd(v, va);
		} else { a = Math.floor(Math.random() * 4); a = a == 1 ? '	' : a || u < t.length + NewLine.length ? ' ' : NewLine; }
		if (t.length + a.length <= u) t += a;
	}
	return t;
}
//	↑null code series



/*	tech.data:

string:
['"]~$1

RegExp:
[/]~$1[a-z]*
[/]~$1[gim]*
=RegExp.[source|test(|exec(]

.match(RegExp)
.replace(RegExp,)
.search(RegExp)

op[/]:
word/word
word/=word

~:
/\\{0,2,4,6,..}$/

註解comment:
/*~* /
//~\n

符號denotation:/[+-*=/()&^,<>|!~%\[\]?:{};]+/
+-
word:/[\w]+/

program:
((denotation|word|comment)+(string|RegExp)*)+

test:
i++ +
a+=++i+4
++a+i++==++j+ ++e
a++ += ++d
a++ + ++b

for(.*;;)


*/
/*	精簡程式碼部分：去掉\n,;前後的空白等，應由reduceCode()呼叫
http://dean.edwards.name/packer/
*/
function reduceCode_subR(code) {
	//code=code.replace(/\s*\n+\s/g,'');	//	比下一行快很多，但為了正確性而放棄。
	code = code.replace(/([^\s]?)\s*\n+\s*([^\s]?)/g, function ($0, $1, $2) { var a = $1, b = $2; return a + (a && b && a.match(/\w/) && b.match(/\w/) ? ' ' : '') + b; })	//	當每一行都去除\n也可時方能使用！否則會出現「需要;」的錯誤！
.replace(/\s+$|^\s+/g, '');
	//if(code.match(/\s+$/))code=code.slice(0,RegExp.index);
	//if(code.match(/^\s+/))code=code.substr(RegExp.lastIndex);

	/*	對喜歡將\n當作;的，請使用下面的；但這可能造成失誤，例如[a=(b+c)\nif(~)]與[if(~)\nif(~)]
	var m,a;
	while(m=code.match(/\s*\n+\s*(.?)/))
	a=RegExp.lastIndex,code=code.slice(0,RegExp.index)+(m[1].match(/\w/)?';':'')+code.substr(a-(m[1]?1:0));
	if(m=code.match(/\s+$/))code=code.slice(0,RegExp.index);
	if(m=code.match(/^\s+(.?)/)){code=code.substr(RegExp.lastIndex-1);if((m[0].indexOf('\n')!=-1&&m[1].match(/\w/)))code=';'+code;}
	*/
	code = code//.replace(/([^;])\s*\n+\s*/g,'$1;').replace(/\s*\n+\s*/g,'')	//	最後再作

	//.replace(/for\s*\(([^;]*);\s*;/g,'for;#$1#')	//	因為直接執行下行敘述會將for(~;;也變成for(~;，所以需先作處理。
	//.replace(/\s*;+\s*/g,';')	//	在''等之中執行此行可能出問題，因此另外置此函數。
	//.replace(/for;#([^#]*)#/g,'for($1;;')

	//.replace(/(.)\s+([+\-]+)/g,function($0,$1,$2){return $1+($1=='+'||$1=='-'?' ':'')+$2;}).replace(/([+-]+)\s+(.)/g,function($0,$1,$2){return $1+($2=='+'||$2=='-'?' ':'')+$2;})	//	+ ++ +
.replace(/([+\-])\s+([+\-])/g, '$1 $2').replace(/([^+\-])\s+([+-])/g, '$1$2').replace(/([+\-])\s+([^+\-])/g, '$1$2')	//	+ ++ +

.replace(/\s*([()\[\]&|^{*\/%<>,~!?:.]+)\s*/g, '$1')	//	.replace(/\s*([()\[\]&|{}/%,!]+)\s*/g,'$1')	//	去掉'}'，因為可能是=function(){};或={'ucC':1};
.replace(/([a-zA-Z])\s+([=+\-])/g, '$1$2').replace(/([=+\-])\s+([a-zA-Z])/g, '$1$2')
.replace(/\s*([+\-*\/%=!&^<>]+=)\s*/g, '$1')//.replace(/\s*([{}+\-*/%,!]|[+\-*\/=!<>]?=|++|--)\s*/g,'$1')

.replace(/for\(([^;]*);;/g, 'for;#$1#')	//	因為直接執行下行敘述會將for(~;;也變成for(~;，所以需先作處理。
	//.replace(/};+/g,'}')	/*.replace(/;{2,}{/g,'{')*/.replace(/{;+/g,'{')//.replace(/;*{;*/g,'{')//在quotation作修正成效不彰
.replace(/\s*([{;]);+\s*/g, '$1')//.replace(/\s*([{};]);+\s*/g,'$1')	//	去掉'}'，因為可能是=function(){};或={'ucC':1};
.replace(/for;#([^#]*)#/g, 'for($1;;')

.replace(/\s{2,}/g, ' ')
.replace(/([^)]);}/g, '$1}')	//	~;while(~);}	but: ~;i=(~);} , {a.b();}
;
	//if(code.charAt(0)=="'")code=(code.charAt(1)=='}'?'}':code.charAt(1)==';'?'':code.charAt(1))+code.substr(2);
	return code;
}
/*	精簡程式碼：去掉註解與\s\n	use for JSON (JavaScript Object Notation)
bug:
當每一行都去除\n也可時方能使用！否則會出現「需要;」的錯誤！
可能會lose條件式編譯（@cc_on等）的資訊或判別錯誤！另外，尚不保證不會lose或更改程式碼！

http://www.dreamprojections.com/syntaxhighlighter/Default.aspx

TODO:
將 local various 甚至 global 依頻率縮短，合併以字串組合代替。	selectable
safer cut '\r\n'
{_exp1_;_exp2_;}	→	_exp1_,_exp2_;
safer cut ';'	;}	→	}
compress: eval("~")

(function(~){~})(~);

var fascii2ascii = (function(){
var cclass
= '['+String.fromCharCode(0xff01)+'-'+String.fromCharCode(0xff5e)+']';
var re_fullwidth = new RegExp(cclass, 'g');
var substitution = function(m){
return String.fromCharCode(m.charCodeAt(0) - 0xfee0); // 0xff00 - 0x20
};
return function(s){ return s.replace(re_fullwidth, substitution) };
})();




/*@cc_on	OK
/*@ cc_on	error
/* @cc_on	無效


JSlint 可以協助您檢查出有問題的程式碼。
http://www.jslint.com/

Javascript compressor
http://dean.edwards.name/packer/
http://javascriptcompressor.com/
http://www.creativyst.com/Prod/3/
http://www.radok.com/javascript-compression.html
http://alex.dojotoolkit.org/shrinksafe/
http://www.saltstorm.net/depo/esc/introduction.wbm
*/
//reduceCode[generate_code.dLK]='reduceCode_subR';
function reduceCode(code, mode) {	//	code:輸入欲精簡之程式碼,mode=1:''中unicode轉\uHHHH
	if (!code) return ''; //sss=0,mmm=90;
	var A = '', a = '' + code, m, b, q, c, Begin, End;
	//reduceCodeM=[''];
	while (a.match(/['"\/]/)) {
		with (RegExp) Begin = index, End = lastIndex, m = lastMatch;
		//alert(a);
		if (Begin && a.charAt(Begin - 1) == '$') { A += reduceCode_subR(a.slice(0, Begin)) + m, a = a.substr(End); continue; } //	RegExp.$'等

		if (m == '/') if (m = a.charAt(RegExp.lastIndex), m == '*' || m == '/') {	//	comment
			//if(++sss>mmm-2&&alert('sss='+sss+NewLine+a),sss>mmm){alert('comment');break;}
			//A+=reduceCode_subR(a.slice(0,Begin)),b=m=='*'?'*/':'\n',m=a.indexOf(b,End+1);//A+=a.slice(0,RegExp.index),b=m=='*'?'*/':'\n',m=a.substr(RegExp.lastIndex).indexOf(b);//
			A += reduceCode_subR(a.slice(0, Begin)), b = m == '*' ? '*/' : '\n';
			m = End + 1;
			do { m = a.indexOf(b, m); if (a.charAt(m - 1) == '\\') m += 2; else break; } while (m != -1); //	預防「\*/」…其實其他地方（如["']）也需要預防，但沒那精力了。
			//reduceCodeM.push('find comment:	Begin='+Begin+',End='+End+',m='+m+',b='+b.replace(/\n/g,'\\n')+NewLine+(m-End>200||m==-1?a.substr(Begin,200)+'..':a.slice(Begin,m))+NewLine+NewLine+'continue:'+NewLine+a.substr(m+b.length,200)+'..');
			if (m == -1) if (b == '\n') { a = ''; break; /*return A;*/ } else throw new Error(1, '[/*] without [*/]!\n' + a.substr(Begin, 200));
			else if (7 + End < m && //	7: 最起碼應該有這麼多 char 的 comment 才列入查核
/^@[cei][a-z_]+/.test(a.substring(End + 1, m - 5))//a.substring(End+1,m-5).indexOf('@cc_on')==0	不一定只有 cc_on
)
			//alert('There is conditional compilation detected,\n you may need pay attention to:\n'+a.substring(End+1,m-5)),
				A += a.slice(End - 1, m + b.length).replace(/\s*(\/\/[^\r\n]*)?(\r?\n)\s*/g, '$2'), a = a.slice(m + b.length); //	對條件式編譯全選，預防資訊lose。僅有'/*@cc_on'才列入，\/*\s+@\s+cc_on不可！
			else if (a = a.substr(m + b.length), A.match(/\w$/) && a.match(/^\s*\w/)) A += ' '; //	預防return /*~*/a被轉為returna
		} else {	//	RegExp
			//reduceCodeM.push('find RegExp:	Begin='+Begin+NewLine+a.substr(Begin,200)+NewLine+'-'.x(20)+NewLine+A.substr(A.length-200)+'..');
			b = a.slice(0, Begin), m = 1; //c=Begin,q=End

			if (b.match(/(^|[(;+=!{}&|:\\\?,])\s*$/)) m = 1; //	RegExp:以起頭的'/'前面的字元作判別，前面是這些則為RegExp
			else if (b.match(/[\w)\]]\s*$/)) m = 0; //	前面是這些則為op
			else throw new Error(1, 'Unknown [/]! Please check it and add rules!\n' + b + '\n-------------\n' + a.slice(0, End + 80)
			//+'\n-------------\n'+A
); //	需再加強前兩項判別之處

			if (!m) A += reduceCode_subR(a.slice(0, End)), a = a.substr(End); //if(!m)A+=a.slice(0,q),a=a.substr(q);//	應該是op之類//
			else {
				A += reduceCode_subR(a.slice(0, Begin)), a = a.substr(Begin), c = 0; //else{A+=a.slice(0,c),a=a.substr(c),c=0;//
				//if(++sss>mmm-2&&alert('sss='+sss+'\n'+a),sss>mmm){alert('reg');break;}
				while (m = a.substr(c).match(/([^\\]|[\\]{2,})([[\/\n])/)) {	//	去掉[]
					//reduceCodeM.push('find RegExp [ or / or \\n :'+NewLine+a.substr(c+RegExp.index+1,20));
					if (m[1].length > 1 && m[1].length % 2 == 1) { c += RegExp.lastIndex - 1; continue; } //	奇數個[\]後
					else if (m = m[2], m == '/') break;
					if (m == '[')
						while ((m = a.substr(c += RegExp.lastIndex).match(/([^\\]|[\\]{2,})\]/))) {	//	不用c+=RegExp.index+1是因[]中一定得有字元
							if (m[1].length > 1 && m[1].length % 2 == 1) { c += RegExp.lastIndex - 1; continue; } //	奇數個[\]後
							c += RegExp.lastIndex - 1; m = 1; break; //	-1:因為偵測'['時需要前一個字元
							//if(++sss>mmm-2&&alert('sss='+sss+'\nc='+c+'\n'+a.substr(c)),sss>mmm){alert('reg 2');break;}
						}
					if (m != 1) throw new Error(1, 'RegExp error!\nbegin with:\n' + a.substr(Begin, 200));
				}
				//reduceCodeM.push('find RegExp 2:'+NewLine+a.slice(0,c+RegExp.lastIndex));
				A += a.slice(0, c += RegExp.lastIndex), a = a.substr(c); //q=RegExp.lastIndex,alert('reg:'+Begin+','+c+','+q+'\n'+a.slice(0,Begin)+'\n-------\n'+a.slice(Begin,c+q)+'\n-------\n'+a.substr(c+q,200));return A;
				//q=RegExp.lastIndex,A+=reduceCode_subR(a.slice(0,Begin))+a.slice(Begin,c+=q),a=a.substr(c);//A+=a.slice(0,c+=RegExp.lastIndex),a=a.substr(c);//
			}
		} else {	//	quotation
			//alert('quotation:\n'+a)
			//reduceCodeM.push('find quotation:'+NewLine+a.substr(RegExp.index,200));
			//if(++sss>mmm-2&&alert('sss='+sss+'\n'+a),sss>mmm){alert('quo');break;}
			//c=RegExp.index,b=a.substr(RegExp.lastIndex-1).match(new RegExp('[^\\\\]('+(q=m)+'|\\n)'));	較正式



			/*

			q=m;	//	2009/8/16 15:59:02 FAILED

			function test_quotation(){
			'\';		//	Error
			'\\\';		//	Error
			'\\\\\';	//	Error
			'';
			'n';
			'\\';
			'nn';
			'\\n';
			'n\\';
			'n\\n';
			'\\\\';
			'\\\\n';
			'n\\\\';
			'n\\\\n';
			'nn\\\\';
			'nn\\\\n';
			'nnn\\\\';
			'nnn\\\\n';
			}
			alert(reduceCode(test_quotation));

			alert(reduceCode(reduceCode));


			//	找到 '\n' 為止，考慮 [\\\\]\\r?\\n
			c=Begin+1,b='';
			while((c=a.indexOf('\n',c))!=-1){
			q=a.charAt(c-1);
			if(q=='\\'||q=='\r'&&a.charAt(c-2)=='\\'){
			c++;
			continue;
			}
     
			}
			;
			if(a.charAt(c-1))

			//alert('use RegExp: '+new RegExp('^([^\\\\\\r\\n]*|[\\\\][^\\r\\n]|[\\\\]\\r?\\n)*('+q+'|\\n)'));
			b=a.slice(Begin+1).match(new RegExp('^([^\\\\\\r\\n]*|[\\\\][^\\r\\n]|[\\\\]\\r?\\n)*('+q+'|\\n)'));	//	too slow!
			alert('test string:\n'+a.slice(Begin+1))
			if(!b||b[2]=='\n')
			throw new Error(1,'There is a start quotation mark ['+q+'] without a end quotation mark!\nbegin with:\n'+a.substr(Begin,200));	//	語法錯誤?
			q=RegExp.lastIndex+1;

			*/

			//	未考慮 '\n' (不能 check error!)
			c = Begin, q = m;
			while (b = a.substr(c).match(new RegExp('([^\\\\\\r]|\\\\{2,})(' + q + '|\\r?\\n)')))	//	考慮 [\\\\]\\r?\\n
				if (b[1].length > 1 && b[1].length % 2 == 1)
					c = RegExp.lastIndex - 1;
				else break;

			if (!b || b[2] == '\n')
				throw new Error(1, 'There is a start quotation mark [' + q + '] without a end quotation mark!\nget:[' + b + ']\nbegin with:\n' + a.substr(Begin, 200)); //	語法錯誤?
			//reduceCodeM.push('find quota ['+q+']:'+NewLine+a.substr(c,RegExp.lastIndex)+NewLine+'continue:'+NewLine+a.substr(c+RegExp.lastIndex,99));

			q = RegExp.lastIndex;



			//alert('q='+q+',['+b[0]+']');
			//alert(b[1]);
			//alert(b[2]);

			b = a.substr(Begin, q).replace(/\\\r?\n/g, '');
			//alert('mode='+mode);
			if (mode == 1) {
				m = '';
				for (var i = 0; i <= q; i++)
					m += b.charCodeAt(i) > 127 ? '\\u' + b.charCodeAt(i).toString(16) : b.charAt(i);
			}
			else m = b;

			A += reduceCode_subR(a.slice(0, Begin)) + m, a = a.substr(Begin + q); //A+=a.slice(0,c+=RegExp.lastIndex),a=a.substr(c);//

			//alert('A='+A);
			//alert('a='+a);

			//if(!/^[\s\r\n]*\}/.test(a))A+=';';	//	對於 ~';{ → ~'{ 或  ~';if → ~'if  不被接受。
		}
	}

	//	後續處理
	A += reduceCode_subR(a);
	//A=A.replace(/([^;])\s*\n+\s*/g,'$1;');	//	這兩行在reduceCode_subR()中已處理
	//A=A.replace(/\s*\n+\s*/g,'');//while(A.match(/\s*\n\s*/))A=A.replace(/\s*\n\s*/g,'');//

	return A;
}




/*	精簡整個檔的程式碼…and test程式是否有語法不全處（例如沒加';'）

flag={doTest:bool,doReport:bool,outEnc:(enc),copyOnFailed:bool,startFrom:// | '',addBefore:'',runBefore:function}

startFrom 若為 // 則應為 startAfter!!

@deprecated use <a href="http://closure-compiler.appspot.com/" accessdate="2009/12/3 12:13">Closure Compiler Service</a>

TODO:


*/
//reduceScript[generate_code.dLK]='autodetectEncode,simpleRead,simpleWrite,reduceCode,isFile';
function reduceScript(originScriptFileName, outScriptFileName, flag) {	//	origin javascript file name, target javascript file name
	if (!originScriptFileName)
		originScriptFileName = WScript.ScriptFullName;

	if (!outScriptFileName)
		outScriptFileName = originScriptFileName + '.reduced.js'; //.compressed.js	//	getFP(originScriptFileName.replace(/\.ori/,''),1);

	if (!flag) flag = {};

	if (!fso) fso = new ActiveXObject("Scripting.FileSystemObject");

	//	同檔名偵測（若自行把 .ori 改成標的檔等，把標的檔先 copy 成原來檔案。）
	if (originScriptFileName == outScriptFileName) {
		if (2 == WshShell.Popup('origin file and output file is the same!' + (flag.originFile ? "\nI'll try to copy it back." : ''), 0, 'Copy target as origin file', 1 + 48)) return;
		if (!flag.originFile) return;
		if (isFile(originScriptFileName = flag.originFile)) {
			alert('origin file is exist! Please rename the file!');
			return;
		}
		try { fso.CopyFile(outScriptFileName, originScriptFileName); } catch (e) { alert('Failed to copy file!'); return; }
	}

	if (!isFile(originScriptFileName)) {
		alert("Origin javascript file doesn't not found!\n" + originScriptFileName);
		return;
	}

	var sp = '='.x(80) + NewLine, reduceCodeM = [], enc = autodetectEncode(originScriptFileName), i, outenc = autodetectEncode(outScriptFileName);

	if (!flag.outEnc)
		flag.outEnc = outenc || enc || TristateTrue;


	try {
		var f = simpleRead(originScriptFileName, enc), ot = simpleRead(outScriptFileName, flag.outEnc), r = '';
		if (typeof f != 'string') throw new Error(1, "Can't read file [" + originScriptFileName + "]!");
		t = flag.runBefore ? flag.runBefore(f) || f : f;
		if (flag.startFrom)
			if (typeof flag.startFrom == 'string') {
				if ((i = t.indexOf(flag.startFrom)) != -1) t = t.slice(i);
			} else if (flag.startFrom instanceof RegExp)
				t = t.replace(flag.startFrom, '');
		t = reduceCode(t);
		t = (flag.addBefore || '') + t.replace(/([};])function(\s)/g, '$1\nfunction$2').replace(/}var(\s)/g, '}\nvar$1')/*.replace(/([;}])([a-z\._\d]+=)/ig,'$1\n$2')*/ + reduceCodeM.join(NewLine + sp);
		//	不相同才 run
		if (t) if (t != ot || outenc != flag.outEnc) simpleWrite(outScriptFileName, t, flag.outEnc); else r = '* 欲寫入之內容(' + t.length + ' chars)與標的檔相同。檔案並未變更。\n';

		if (flag.doTest) eval('if(0){if(0){if(0){' + t + '}}}'); //void	//should use windows.eval	//if(WScript.ScriptName!=outScriptFileName)eval(t);
		if (flag.doReport) alert('OK!\n' + r + '\n' + f.length + '→' + t.length + '(origin output: ' + ot.length + ') (' + (100 * t.length / f.length).decp(2) + '%)\n\n[' + enc + '] ' + originScriptFileName + '\n→\n[' + flag.outEnc + '] ' + outScriptFileName);
	} catch (e) {
		if (6 == alert('reduceScript: Error occured!\nDo you want to write error message to target file?\n' + outScriptFileName, 0, 0, 3 + 32))
			simpleWrite(outScriptFileName, popErr(e) + NewLine + NewLine + reduceCodeM.join(NewLine + sp), TristateTrue/*enc*/, 0, true);
		if (flag.copyOnFailed) try { fso.CopyFile(originScriptFileName, outScriptFileName); } catch (e) { alert('Failed to copy file!'); return; }
	}
}




/*	縮減 HTML 用 .js大小+自動判別	2008/7/31 17:40:40
!! arguments unfinished !!

usage: include code in front:
//	[function.js]_iF,rJS
//	[function.js]End

rJS({add:'/*\nCopyright 2008 kanashimi\n欲使用此工具功能者，請聯絡作者。\n*\/\n'});

//	code start

(main code)..

TODO:
自動選擇 target 之模式（不一定是 .ori）
*/
//rJS[generate_code.dLK]='reduceScript';
function rJS(f) {	//	flag
	if (typeof WScript == 'object') {
		var o = WScript, t, n;
		if (typeof reduceScript != 'function')
			o.Echo('Please include function.js to generate code.');
		else
			f = f || {}, n = o.ScriptFullName, t = n.replace(/\.ori/, ''),
reduceScript(n, t, {
doReport: 1,
outEnc: 'UTF-8',
startFrom: f.cut || /^(.|\n)+code\s+start\r?\n/,
addBefore: f.add,
originFile: t.replace(f.ori || /(\.[^.]+)$/, '.ori$1')
});
		o.Quit();
	}
}


/*
try{var　o;try{o=new ActiveXObject('Microsoft.XMLHTTP')}catch(e){o=new XMLHttpRequest()}with(o)open('GET',(new　ActiveXObject("WScript.Shell")).RegRead('HKCU\\Software\\Colorless echo\\CeL.path'),false),send(null),eval(responseText)}catch(e){}

*/
//(''+CeL.library_loader).replace(/^\s*function\s*\(\s*\)\s*{\s*/,'').replace(/\s*}\s*;\s*$/,'');
_// JSDT:_module_
.
/**
* for 引用：　include library 自 registry 中的 path
* @since	2009/11/25 22:59:02
* @_memberOf	_module_
*/
library_loader_by_registry = function () {
	//if (typeof WScript == "object")
	try {
		var o;
		try {
			o = new ActiveXObject('Microsoft.XMLHTTP');
		} catch (e) {
			o = new XMLHttpRequest();
		}
		with (o)
			open('GET', (new ActiveXObject("WScript.Shell")).RegRead(library_namespace.env.registry_key), false),
				send(null),
				eval(responseText);
	} catch (e) {
	}
};


_// JSDT:_module_
.
/**
* get various from code
* @param {String} code	程式碼
* @param {Boolean} fill_code	(TODO) 不只是定義，在 .code 填入程式碼。
* @return	{Object}	root namespace
* @since	2009/12/5 15:04:42, 2009/12/20 14:33:30, 2010/7/7 10:58:22
* @_memberOf	_module_
*/
get_various_from_code = function (code, fill_code) {
	//library_namespace.log(''+code.slice(0, 100));

	//	使用 .split(/\r?\n/) 應注意：這實際上等於 .split(/(\r?\n)+/) (??)
	code = code.split(/\r?\n/);

	var i, m, last_code = [],
	/**
	 * 現在所處之 line
	 * 
	 * @inner
	 * @ignore
	 */
	line = '',
	/**
	 * code.length, 加快速度用
	 * 
	 * @constant
	 * @inner
	 * @ignore
	 */
	l = code.length,
	/**
	 * root namespace
	 * 
	 * @inner
	 * @ignore
	 */
	ns = {},
	/**
	 * 暫存 code(變數定義)
	 * 
	 * @inner
	 * @ignore
	 */
	tmp_code,
	/**
	 * 名稱暫存變數
	 * 
	 * @inner
	 * @ignore
	 */
	name,
	/**
	 * arguments 暫存變數<br/>
	 * e.g., 變數 name
	 * 
	 * @inner
	 * @ignore
	 */
	various,
	/**
	 * 本變數之 properties。<br/>
	 * properties = { property: text contents of this property }
	 * 
	 * @inner
	 * @ignore
	 */
	properties,
	/**
	 * 最後一次定義的變數名，用於之後若有變數需要繼承 namespace 時。
	 * 
	 * @inner
	 * @ignore
	 */
	latest_name,
	/**
	 * 紀錄有意義的註解所在行號.
	 * 預防需要把註解之前的也讀進來。有 bug!
	 * 
	 * @inner
	 * @ignore
	 */
	origin_index,
	new_line=library_namespace.env.new_line,
	/**
	 * 將 jsdoc properties 轉換成 vsdoc
	 * 
	 * @inner
	 * @ignore
	 * @see
	 * http://weblogs.asp.net/bleroy/archive/2007/04/23/the-format-for-javascript-doc-comments.aspx
	 */
	jsdoc_to_vsdoc = function() {
		var p = [ '' ], n, V, a, i, l, t_p = function(v) {	
			//CeL.log(n + ':\n' + properties[n]);
			v = typeof v === 'string' ? v
					.replace(/^[\s\n]+|[\s\n]+$/g, '')
					.replace(/\r?\n\s+|\s+\r?\n/g, new_line)
					//.replace(/</g,'&lt;')
					: '';
			a = '';

			switch (n) {

			case 'description':
			case 'summary':
				if (!v || /^[\s\n]*$/.test(v))
					return;
				n = 'summary';
				break;

			case 'param':
				if (a = v.match(/^({([a-zA-Z_\d.$\|\s]+)}\s*)?([a-zA-Z_\d$]+|\[([a-zA-Z_\d.$]+)\])\s*(.*?)$/)){
					var t = a[2].replace(/\s+/g, '');
					v = a[5], a = ' name="' + (a[4] || a[3]) + '" type="' + t + '" optional="' + (!!a[4]) + '"';

					if (/integer/i.test(t))
						a += ' integer="true"';
					//	from CeL.net.web
					if (/HTML([A-U][A-Za-z]{1,15})?Element/i.test(t))
						a += ' domElement="true"';
				}else
					a = '';
				break;

			case 'type':
				return;

			case 'return':
				n += 's';
			case 'returns':
				if (a = v.match(/^({([a-zA-Z_\d$.\|\s]+)})?(.*)$/)){
					v = a[3].replace(/^[\s\n]+/g, '');
					a = a[2].replace(/\s+/g, '') || properties.type;

					a = a ? ' type="' + a + '"' : '';

					if (/integer/i.test(t))
						a += ' integer="true"';
					//	from CeL.net.web
					if (/HTML([A-U][A-Za-z]{1,15})?Element/i.test(t))
						a += ' domElement="true"';
				}else
					a = '';
				break;

			default:
			}

			if (v.indexOf(new_line) === -1 && a.indexOf(new_line) === -1)
				p.push('<' + n + a + (v ? '>' + v + '</' + n + '>' : '/>'));
			else{
				p.push('<' + n + a + '>');
				p = p.concat(v.split(new_line));
				p.push('</' + n + '>');
			}
		};

		for (n in properties)
			if (library_namespace.is_Array(V = properties[n]))
				for (i = 0, l = V.length; i < l; i++)
					t_p(V[i]);
			else
				t_p(V);

		return p.length>1 ? p.join(new_line + '	///	') + new_line
						+ new_line : '';
	},
	/**
	 * 從變數定義取得變數名。
	 * 
	 * @param {String} _
	 *            變數定義
	 * @inner
	 * @ignore
	 */
	set_name = function(_) {
		name = properties.name;
		if (!name) {
			name = [];
			var i = origin_index, l;
			while (i > 0)
				if (/[;{})]\s*$/.test(l = code[--i].replace(/\/\/.*$/, '')))
					if ((name = name.join(' ')
							// 除去註解後
							.replace(/\/\*(.*?)\*\//g, ' '))
							// 已無註解的話
							.indexOf('*/') === -1){
						_ = name.replace(/^\s*var(\s+|$)/, '') + _;
						break;
					} else
						name = [ l, name ];
				else if(l)
					name.unshift(l);

			//if(!i):	Error!
			//if(_.match(/var/)) library_namespace.warn(name+'\n'+_);

			name = properties.memberOf ?
							(_.replace(/[\s\n]+/g, '').indexOf(properties.memberOf + '.') === -1 ?
									properties.memberOf + '.' : '')
							+ _ /* .replace(/^(.+)\./,'') */
					: 'property' in properties ?
							latest_name ? latest_name + '.prototype.' + _.replace(/^(.+)\./, '') : ''
					: _;
		}

		// 除去 space
		name = name.replace(/[\s\n]+/g, '');
	},
	handle_name = function() {
		var m = name
		.match(/^([a-zA-Z_$\d]+)\.[^.].+[^.]\.([a-zA-Z_$\d]+)$/);
		return m && m[1] === library_namespace.Class ? m[1] + '.'
				+ m[2] + '=' + name : name;
	};

	for (i = 0; i < l; i++) {
		//	一行一行判斷
		//	TODO: 提升效率
		line = code[origin_index = i];

		if (/^\s*\/\*\*/.test(line)) {
			//	處理 '/**' 之註解（這些是有意義的）
			properties = {};
			//	都沒有 '@' 時，預設為 @description
			name = 'description';
			tmp_code = [];
			various=[];
			//library_namespace.log('' + line);
			while (i < l) {
				//library_namespace.log('' + line);
				tmp_code.push(line);

				//	判別
				if (line.indexOf('*/') !== -1 || (m = line.match(/^\s+\*\s+@([_a-zA-Z\d\$.]+)(\s+([^\s].*)?\s*)?$/))) {
					//	設定 name = various
					various = various.join(new_line);
					if (name in properties)
						if (library_namespace.is_Array(properties[name]))
							properties[name].push(various);
						else
							properties[name] = [ properties[name], various ];
					else
						properties[name] = various;

					if (line.indexOf('*/') !== -1)
						break;

					name = m[1], various = [ m[3] ];

				} else
					various.push((m = line.match(/^\s+\*\s+([^\s].+)$/)) ? m[1] : line.replace(/^(.*)\/\*\*/, ''));

				line = code[++i];
			}

			//library_namespace.log('[' + i + ']' + '\n' + tmp_code.join('\n') + '\n' + line);
			if (m = line.match(/(.*?\*\/)/)) {
				line = line.replace(/(.*?)\*\//, '');
				while (i < l
						&& !/=\s*[^\s]|{/.test(line = line.replace(
								/\s*\/\/[^\n]*/g, '').replace(
										/\/\*((.|\n)*?)\*\//g, '')))
					line += code[++i];

				//	初始化函式名
				name = '';

				/*
				* 註解處理完了，接下來是變數。先把整個定義區放到 line。
				* 這邊處理幾種定義法:
				* function name() {};
				* var name = function(){};
				* var name = new Function();
				* var name = 123;
				*/
				while (!/^\s*function\s$/.test(line) && !/[=;,]/.test(line))
					line += ' ' + code[++i];

				if (m = line.match(/^\s*function\s+([_a-zA-Z\d\$.]*)\s*\((.*)/)) {
					// function name() {};
					set_name(m[1]);
					various = m[2];
					while (i < l && various.indexOf(')') === -1)
						various += code[++i];
					m = various.match(/^[^)]*/);
					tmp_code.push(handle_name() + '=function(' + m[0] + '){'
									+ jsdoc_to_vsdoc() + '};');

				} else if (m = line
						.match(/^\s*(var\s+)?([_a-zA-Z\d\$.]+)\s*=\s*(.+)/)) {
					set_name(m[2]);
					various = m[3];
					if (/^\s*function(\s+[_a-zA-Z\d\$]+)?\s*\(/.test(various)) {
						// var name = function(){};
						while (i < l && various.indexOf(')') === -1)
							various += code[++i];
						m = various.match(/^[^)]+\)/);
						tmp_code.push(handle_name() + '=' + m[0] + '{' + jsdoc_to_vsdoc() + '};');

					} else if (/^\s*new\s+Function\s*\(/.test(various)) {
						// var name = new Function();
						if (m = various.match(/^\s*new\s+Function\s*\(.+\)\s*;?\s*$/)) {
							//	TODO
							tmp_code.push(handle_name() + '=new Function("");');
						} else
							tmp_code.push(handle_name() + '=new Function();');

					} else {
						// var name = 123;
						if (!properties.type)
							if (/^['"]/.test(various)) {
								properties.type = 'String';
							} else if (!isNaN(various)) {
								properties.type = 'number';
							} else if (/^(true|false)([\s;,]|$)/.test(various)) {
								properties.type = 'bool';
							} else if (various.charAt(0) === '[') {
								properties.type = 'array';
							} else if (various.charAt(0) === '{') {
								properties.type = 'object';
							} else if (various.charAt(0) === '/') {
								properties.type = 'regexp';
							} else if (/^regexp obj(ect)?$/.test(properties.type)) {
								properties.type = 'regexp';
							}

						//if (name === 'module_name');

						switch ((properties.type || '').toLowerCase()) {
							case 'string':
								m = various.replace(/\s*[,;]*\s*$/, '');
								//library_namespace.log('['+m+']');
								if (/^'[^\\']*'$/.test(m)
									|| /^"[^\\"]*"$/.test(m)) {
									various = '=' + m + ';';
								} else {
									various = '="";	//	' + various;
								}
								properties.type='String';
								break;

							case 'bool':
							case 'boolean':
								if (m = various.toLowerCase().match(
									/^(true|false)([\s,;]|$)/i)) {
									various = '=' + m[1] + ';';
								} else {
									various = '=true;	//	' + various;
								}
								properties.type='Boolean';
								break;

							case 'number':
								properties.type = 'Number';
							case 'int':
							case 'integer':
								if (/int(eger)?/i.test(properties.type))
									properties.type = 'Integer';

								if (!isNaN(various)) {
									various = '=' + various + ';';
								} else {
									various = '=0;	//	' + various;
								}
								break;

							case 'array':
								various = '=' + '[];';
								properties.type = 'Array';
								break;

							case 'object':
								if (various.charAt(0) === '{') {
									while (i < l) {
										if (various.lastIndexOf('}') !== -1) {
											m = various.slice(1, various.lastIndexOf('}'));
											if (m.lastIndexOf('/*') === -1
												|| m.lastIndexOf('/*') < m
														.lastIndexOf('*/'))
												break;
										}
										various += '\n' + code[++i];
									}
									m = various
										.replace(/\s*\/\/[^\n]*/g, '')
										.replace(/\/\*((.|\n)*?)\*\//g, '')
										.replace(/}(.*)$/,'}');
									if (0 && m.length > 3)
										library_namespace.log(name + '\n' + m
									// + '\n'+v
									);
									if (/^{([\s\n]*(('[^']*'|"[^"]*"|[_a-zA-Z\d\$.]+))[\s\n]*:('[^']*'|"[^"]*"|[\s\n\d+\-*\/()\^]+|true|false|null)+|,)*}/
										.test(m))
										various = '=' + various.replace(/}(.*)$/, '}') + ';';
									else
										various = '=' + '{};';
								} else
									various = '=' + '{};';
								properties.type = 'Object';
								break;

							case 'regexp':
								if (/^\/.+\/$/.test(various))
									various = '=' + various + ';';
								else {
									various = '=' + '/^regexp$/;	//	' + various;
								}
								properties.type = 'RegExp';
								break;

							default:
								//	TODO: T1|T2|..
								if (/^[_a-zA-Z\d\$.]/.test(various)) {
									// reference
									various = ';//' + (properties.type ? '[' + properties.type + ']' : '')
										+ various;
								} else {
									// unknown code
									various = ';	//	'
										+ (properties.type ? '[' + properties.type + ']' : '')
										+ various;
								}
						}

						tmp_code.push((/^=/.test(various) ? '' : '//') + handle_name() + various);
					}
				}

				if (name && !('ignore' in properties) && !('inner' in properties) && !('private' in properties)) {
					if (!('property' in properties))
						//	定義最後一次變數名
						latest_name = name;

					name = name.split(library_namespace.env.module_name_separator);

					//	對可能的錯誤發出警告
					if (name[0] !== library_namespace.Class && !('deprecated' in properties))
						library_namespace.warn(i + ': line [' + name.join(library_namespace.env.module_name_separator) + '] NOT initial as '+library_namespace.Class+'\n'
								+ code.slice(i - 6, i + 6).join('\n'));

					//	將變數定義設置到 ns
					var np = ns, nl = name.length - 1, n;
					for (m = 0; m < nl; m++) {
						n = name[m];
						if (!(n in np))
							// 初始設定 namespace
							np[n] = {
								'this': ''
							};
						else if (!library_namespace.is_Object(np[n]))
							np[n] = {
								'this': np[n]
							};
						np = np[n];
					}

					n = name[nl];
					//if (n in np) library_namespace.log('get_various_from_code: get duplicate various: [' + name.join(library_namespace.env.module_name_separator) + ']');

					np[n] = tmp_code.join(new_line);
				}
			}
		}
	}

	return ns;
};


_// JSDT:_module_
.
/**
* 把 get_various_from_code 生成的 namespace 轉成 code
* @param	{Object} ns	root namespace
* @param	{String} [prefix]	(TODO) prefix of root namespace
* @param	{Array}	[code_array]	inner use, please don't specify this value.
* @return	{String}	code
* @since	2009/12/20 14:51:52
* @_memberOf	_module_
*/
get_code_from_generated_various = function (ns, prefix, code_array) {
	var _s = _.get_code_from_generated_various, i, return_text = 0;

	if (!code_array)
		code_array = [], return_text = 1;

	//	先處理 'this'
	if (prefix) {
		if (!/\.prototype$/.test(prefix))
			if (i = ns['this']) {
				code_array.push(i);
				delete ns['this'];
			} else
				code_array.push('',
						'//	null constructor for [' + prefix + ']',
						prefix + '=function(){};',
						prefix + '.prototype={};');
		prefix += '.';
	} else
		prefix = '';


	for (i in ns)
		if (typeof ns[i] === 'string')
			code_array.push(ns[i]);
		else
			_s(ns[i], prefix + i, code_array);

	return return_text ? code_array
					.join(library_namespace.env.new_line)
	//.replace(/[\r\n]+/g,library_namespace.env.new_line)
					: code_array;
};



	return (
		_// JSDT:_module_
	);
};

//===================================================

CeL.setup_module(module_name, code_for_including);

};
