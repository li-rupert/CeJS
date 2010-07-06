
/*	生成 郵局局號
	for net.form.bank_account
	2010/6/18 23:51:17

*/

//	[CeL]library_loader_by_registry
try{var o;try{o=new ActiveXObject('Microsoft.XMLHTTP')}catch(e){o=new XMLHttpRequest()}with(o)open('GET',(new ActiveXObject("WScript.Shell")).RegRead('HKCU\\Software\\Colorless echo\\CeL.path'),false),send(null),eval(responseText)}catch(e){}
//	[CeL]End

if(typeof CeL === 'undefined'){
	WScript.Echo("Can't load library!");
	WScript.Quit(1);
}

CeL.use('IO.Windows.file');

var data,zip=[],dir='prsb';

var fso = WScript.CreateObject("Scripting.FileSystemObject");
if(!fso.FolderExists(dir))fso.CreateFolder(dir);


//	郵局局號

//	首頁 > 全國營業據點 > 全國郵局分佈

var htm=CeL.read_file(dir+'/list.htm','utf-8'),
area,i,p,loc,j,list=[],L=[];

if(!htm)
	htm=CeL.get_file('http://www.post.gov.tw/post/internet/i_location/?ID=13'),
	CeL.write_file(dir+'/list.htm',htm,'utf-8');


area=htm.match(/search_type=\d{6}(-\d)?/g);

for(i=0;i<area.length;i++){
	loc=area[i].match(/\d{6}(-\d)?/)[0];
	p=0;
	while(++p){
		htm=CeL.read_file(dir+'/'+loc+'#'+p+'.htm','utf-8');
		if(!htm)
			htm=CeL.get_file('http://www.post.gov.tw/post/internet/i_location/aon_map_main.jsp?search_type='+loc+'&topage='+p),
			CeL.write_file(dir+'/'+loc+'#'+p+'.htm',htm,'utf-8');
		prsb=htm.match(/<td align="center">(\d{3,5})<\/td>\s+<td align="center">([^<]+)<\/td>\s+<td><a href="aon_dtl.jsp\?ID=1302\&prsb_no=([^"]+)"[^>]+><font color="#66CEA5">([^<]+)<\/font><\/a><\/td>\s+<td>([^<]+)<\/td>/g);
		if(!prsb||!prsb.length)break;
		for(j=0;j<prsb.length;j++){
			//	,郵遞區號,電話號碼,局號,局名,局址
			m=prsb[j].match(/<td align="center">(\d{3,5})<\/td>\s+<td align="center">([^<]+)<\/td>\s+<td><a href="aon_dtl.jsp\?ID=1302\&prsb_no=([^"]+)"[^>]+><font color="#66CEA5">([^<]+)<\/font><\/a><\/td>\s+<td>([^<]+)<\/td>/);
			//	局號,郵遞區號,局名,電話號碼,局址
			L.push(m=[m[3],m[1],m[4],m[2],m[5]]);
			list.push(m.join('	'));
		}
		CeL.write_file('prsb.csv',list.join('\n'),'utf-8');
	}
}

CeL.write_file('prsb.csv',list.join('\n'),'utf-8');


prsb=(CeL.read_file('id700.csv','utf-8')||'').replace(/\n+$/,'').split('\n');
for(i=0;i<L.length;i++)
	j=L[i],
	//"7000021","郵政存簿儲金","台北市金山南路二段５５號","02 23925432"
	prsb.push('"700'+j[0].replace(/-/,'')+'","'+j[2]+'","'+j[1]+' '+j[4]+'","'+j[3]+'"');

CeL.write_file('id700.csv',prsb.join('\n'),'utf-8');
