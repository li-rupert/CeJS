
/*	生成 zip5 data
	for net.form.address


3+2郵遞區號查詢
http://www.post.gov.tw/post/internet/f_searchzone/index.jsp?ID=190102

查詢國內快捷、包裹、掛號郵件
http://postserv.post.gov.tw/WebMailNslookup/domestic_bundle_register.html

http://www.moj.gov.tw/public/Attachment/68101428344.doc
*/

//	[function.js]_iF

function _iF(){}_iF.p='HKCU\\Software\\Colorless echo\\function.js.path';try{eval(getU((new ActiveXObject("WScript.Shell")).RegRead(_iF.p)));}catch(e){}
function getU(p,_e){var o;try{o=new ActiveXObject('Microsoft.XMLHTTP');}catch(e){o=new XMLHttpRequest();}if(o)with(o){open('GET',p,false);if(_e&&o.overrideMimeType)overrideMimeType('text/xml;charset='+_e);send(null);return responseText}}

//	[function.js]End

function sl(m){alert(m);}

var data,zip=[],dir='zip';

if(!fso.FolderExists(dir))fso.CreateFolder(dir);

try{data=simpleRead('zip32_9811.txt','big5');}catch(e){
 sl(e.message);
}

data=parseCSV(data);

for(var i=0,m;i<data.length;i++){
 m=data[i][0].match(/^(\d{3})/);
 if(!m){sl('Error data: '+data[i]);continue;}
 m=parseInt(m[1]);
 if(!(m in zip))zip[m]=[];
 zip[m].push(data[i].join('	'));
}

for(var i=0,t;i<zip.length;i++)if(zip[i])try{
 simpleWrite(dir+'/zip'+(i>99?'':i>9?'0':'00')+i+'.csv',zip[i].join('\n'),'utf-8');
}catch(e){sl('Error writing '+i+': '+e.message);}

