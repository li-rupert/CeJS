/**
 * @name convert Excel .xlsx file to Unicode text
 * 
 * This script file MUST encoding as UTF-16LE to execute as JScript (by CScript
 * or WScript)!
 * 
 * usage: CScript Excel_to_text.js data_file_path sheet_name save_to_file
 * 
 * @since 2018/9/28
 */

var WshShell = WScript.CreateObject("WScript.Shell");

var fso = WScript.CreateObject("Scripting.FileSystemObject");

// 跳脫
function exit(r) {
	WScript.Quit(r || 0);
}

// 顯示訊息視窗：改編from function.js for 程式執行時間
function alert(x, c, t, d) {
	WScript.Echo(x);
	return;
	// WScript.Echo()
	// if (!date) return WshShell.Popup(x, c, t, d);
	WshShell.Popup(x, c, t, d);
}

var objXL;
try {
	objXL = WScript.CreateObject("Excel.Application");
} catch (e) {
	alert('No Automate Objects');
	exit(2);
}

var data_file_path = WScript.Arguments.length > 0 && WScript.Arguments(0);

if (!data_file_path) {
	alert('No data_file_path specified!');
	exit(1);
}

// Excel常數設定
var xlV = {
	True : -1,
	False : 0,
	// XlFileFormat Enumeration (Excel)
	xlUnicodeText : 42
};

try {
	objXL.WorkBooks.Open(data_file_path, xlV.False, xlV.False);
} catch (e) {
	alert('Can not open data_file_path: ' + data_file_path);
	exit(3);
}
// objXL.Visible = true;

// https://docs.microsoft.com/en-us/office/vba/api/excel.application.sheets
// Sheets.Count
var sheet_name = WScript.Arguments.length > 1 && WScript.Arguments(1), sheet = sheet_name
// Sheets(i).Name
? objXL.Sheets(sheet_name) : objXL.ActiveSheet;

var save_to_file = WScript.Arguments.length > 2 && WScript.Arguments(2)
		|| data_file_path.replace(/(?:\.[^.]+)?$/, '.tsv');

if (!/:\\/.test(save_to_file) && !/^\.\.[\\\/]/.test(save_to_file)) {
	// default: save to "%HOMEPATH%\Documents"
	save_to_file = '.\\' + save_to_file;
}

try {
	fso.DeleteFile(save_to_file);
} catch (e) {
	// TODO: handle exception
}

sheet.SaveAs(save_to_file, xlV.xlUnicodeText);
// alert(WshShell.CurrentDirectory);

// prevent the prompt box
// objXL.ActiveWorkBook.Saved = xlV.True;

// https://msdn.microsoft.com/zh-tw/vba/excel-vba/articles/workbook-close-method-excel
// Close( SaveChanges, Filename, RouteWorkbook )
objXL.WorkBooks.Close(xlV.False);
