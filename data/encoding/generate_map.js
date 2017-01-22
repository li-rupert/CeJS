﻿// node generate_map.js

/*


 2017/1/11 16:15:36
 [[en:character encoding]]


 先以generate_original_map();生成original_map.txt
 以各種編碼轉換original_map.txt


 encoding.map.json規格書:包含map:
 {
 // to single byte / 2 bytes set, continuous, split by /./u:
 start_char_code_in_hex:'map',
 // to single byte / 2 bytes set, continuous, .split('split string'):
 start_char_code_in_hex:['map', 'split string'],
 // 2 bytes set, .split('split string'):
 start_char_code_in_hex:[start of second byte, 'map', 'split string'],
 // .split(''):
 start_char_code_in_hex:[start of second byte, 'map', ''],
 // split by /./u:
 start_char_code_in_hex:[start of second byte, 'map'],
 // convert single code to single string
 start_char_code_in_hex:['map', 0],
 // 這邊的count表示中間有count個字元，分別是自char開始，unicode編碼之後的序列。
 start_char_code_in_hex:['char', {Natural}count, 'char', {Natural}count],
 }

 e.g.,
 // split by .chars()
 {'A180':[0x80,'~~~~~~'],'A4B3':'##'}
 // .split('')
 {'A180':[0x80,'~~~~~~', ''],'A4B3':['#,#',',']}

 to_multi的不能跨越to_single的範圍。
 e.g.,
 {'A1FF':[0xFF,'abcde'],'A2FF':'12','A4B3':'~'}
 'A2FF','A4B3': 不在'A1FF'範圍內: A1FF:a, A2FF:b, A3FF:c, ...
 實作將直接以+1的方式配入 convert_map 中，因此A2FF之第二組"2"將被配入A300!


 @see https://github.com/ashtuchkin/iconv-lite/tree/master/encodings/tables

 */

/*

 // [[EUC-JP]], [[EUC-JIS-2004]]
 // 0x8Fに続く2バイト文字1文字分 (0xA1から0xFEまでの2バイト) は、JIS X 0213の第2面の文字である。
 node generate_map.js 8F
 node generate_map.js EUC-JP.txt EUC-JP.8F.txt


 */

'use strict';

// Load CeJS library and modules.
require('../../_for include/node.loader.js');
CeL.run([
// Add color to console messages. 添加主控端報告的顏色。
'interact.console',
// for string.chars()
'data.native' ]);

var BYTE_BASE = 0x100, original_map_file = 'original_map.txt',
//
default_config = {
	// 1バイト目: 一般從0x80起。
	start_char_code_1 : 0x80 - 2,
	// 2バイト目: 起始必須跳過 new_line, padding_character。
	start_char_code_2 : 0x20,
	// assert: new_line map to new_line, 不可使用 '\r'
	new_line : '\n',
	// 這應該是個轉換前後不會變化，且不會被納入其他字元組中的字元。
	padding_character : '\t',
	end_char_code : BYTE_BASE - 1
},

general_encoding = 'utf8',

/** node.js file system module */
node_fs = require('fs'),
// REPLACEMENT CHARACTER U+FFFD
UNKNOWN_CHARACTER = '�', HEX_BASE = 0x10;

console.assert(default_config.padding_character.length === 1);
console.assert(default_config.padding_character === '\t'
		|| 0x20 <= default_config.padding_character.charCodeAt(0)
		&& default_config.padding_character.charCodeAt(0) < 0x40
		&& default_config.padding_character !== '?'
		&& default_config.padding_character !== ' ');

// generate_original_map();

// parse_converted_file('Big5.txt');
// parse_converted_file('EUC-JP.txt');
// parse_converted_file('GBK.txt');
// parse_converted_file('Shift_JIS.txt');

// 效能測試。
// array_vs_charAt();

(function() {
	var file_list = process.argv[2];
	if (!file_list || /^[A-F\d]{0,2}$/i.test(file_list)) {
		generate_original_map(file_list);
		return;
	}

	file_list = [ file_list ];
	for (var index = 3; index < process.argv.length; index++) {
		if (process.argv[index])
			file_list.push(process.argv[index]);
	}
	parse_converted_file(file_list);
})();

// --------------------------------------------------------------------------------------

function generate_original_map(high_byte_hex) {
	var file_descriptor, char_buffer = Object.clone(default_config), new_line_Buffer = Buffer
			.from(default_config.new_line);
	if (high_byte_hex) {
		high_byte_hex = high_byte_hex.toUpperCase();
		char_buffer.high_byte_hex = high_byte_hex;
		file_descriptor = original_map_file.replace(/(\.[^.]+)$/, '.'
				+ high_byte_hex + '$1');
	} else {
		file_descriptor = original_map_file;
	}
	file_descriptor = node_fs.openSync(file_descriptor, 'w');

	// 寫入設定。
	char_buffer = JSON.stringify(char_buffer) + default_config.new_line
			+ '-'.repeat(80) + default_config.new_line;
	node_fs.writeSync(file_descriptor, Buffer.from(char_buffer));

	// 添加" "是為了預防有4bytes的字元組。若有6bytes,8bytes的字元組則須再加。
	// 最後的 +1 是為了確保能 .split(new RegExp('\\' + default_config.padding_character +
	// '+'))
	char_buffer = Buffer.from(default_config.padding_character.repeat(4 + 1));
	if (high_byte_hex) {
		char_buffer[0] = parseInt(high_byte_hex, HEX_BASE);
		high_byte_hex = 1;
	} else {
		high_byte_hex = 0;
	}

	for (var char_code_1 = default_config.start_char_code_1; char_code_1 <= default_config.end_char_code; char_code_1++) {
		node_fs.writeSync(file_descriptor, Buffer.from(to_hex(char_code_1)
				+ ':'));
		char_buffer[high_byte_hex] = char_code_1;
		for (var char_code_2 = default_config.start_char_code_2; char_code_2 <= default_config.end_char_code; char_code_2++) {
			char_buffer[high_byte_hex + 1] = char_code_2;
			node_fs.writeSync(file_descriptor, char_buffer);
		}
		node_fs.writeSync(file_descriptor, new_line_Buffer);
	}
	node_fs.closeSync(file_descriptor);
}

// --------------------------------------------------------------------------------------

/**
 * 效能測試。
 * 
 * @see http://jsperf.com/charat-vs-array/7
 *      http://stackoverflow.com/questions/5943726/string-charatx-or-stringx
 *      https://www.sitepoint.com/javascript-fast-string-concatenation/
 */
function array_vs_charAt() {
	var array = [];
	for (var i = 0; i < 0x80 * 0x80; i++) {
		array.push(String.fromCharCode(13000 + 42000 * Math.random() | 0));
	}
	var string = array.join(''), length = array.length, result, text_length = 1e7;
	console.assert(length === string.length);

	result = [];
	console.time('array→array');
	for (var i = 0; i < text_length; i++) {
		result.push(array[length * Math.random() | 0]);
	}
	result = result.join('');
	console.log(result.slice(0, 20));
	console.timeEnd('array→array');

	result = [];
	console.time('string→array');
	for (var i = 0; i < text_length; i++) {
		result.push(string.charAt(length * Math.random() | 0));
	}
	result = result.join('');
	console.log(result.slice(0, 20));
	console.timeEnd('string→array');

	result = '';
	console.time('array→string');
	for (var i = 0; i < text_length; i++) {
		result += array[length * Math.random() | 0];
	}
	console.log(result.slice(0, 20));
	console.timeEnd('array→string');

	result = '';
	console.time('string→string');
	for (var i = 0; i < text_length; i++) {
		result += string.charAt(length * Math.random() | 0);
	}
	console.log(result.slice(0, 20));
	console.timeEnd('string→string');

	// node.js 7.4.0 一般測試最快的是 'array→string'
}

function to_hex(char) {
	if (typeof char === 'string') {
		return char.chars().map(function(c) {
			return to_hex(c.codePointAt(0));
		});
	}
	// assert: {Natural}char code
	return char.toString(HEX_BASE).toUpperCase();
}

// --------------------------------------------------------------------------------------

// TODO: 將如padding_character,start_char_code_2之類的設定儲存在original_map_file中。
function parse_converted_file(file_path_list) {
	var convert_map = CeL.null_Object();

	if (!Array.isArray(file_path_list)) {
		file_path_list = [ file_path_list ];
	}

	file_path_list.forEach(function(file_path) {
		var code_lines = node_fs.readFileSync(file_path, general_encoding)
		// remove BOM
		.trimLeft().split(default_config.new_line),
		//
		line = code_lines[code_lines.length - 1],
		//
		config = Object.clone(default_config);
		if (line.replace(/\r$/, '') === '') {
			code_lines.pop();
		}
		// 取得設定。
		if (code_lines[0].startsWith('{')) {
			Object.assign(config, JSON.parse(code_lines.shift()));
		}
		// 去掉註解與分隔線。
		while (code_lines.length > 0 && (!code_lines[0]
		//
		|| code_lines[0].startsWith('#') || /^[-=\s]*$/.test(code_lines[0]))) {
			code_lines.shift();
		}
		if (code_lines.length === 0) {
			CeL.err(file_path + ': Nothing get.');
			return;
		}

		if (code_lines.length ===
		//
		config.end_char_code - config.start_char_code_1 + 1) {
			CeL.log(file_path + ': ' + code_lines.length + ' lines');
		} else {
			CeL.warn(file_path + ': ' + code_lines.length
					+ ' lines (should be '
					+ (config.end_char_code - config.start_char_code_1 + 1)
					+ ')');
		}

		parse_converted_data(code_lines, convert_map, config);
	});

	var result_data = [];
	// result_data = JSON.stringify(convert_map);
	Object.keys(convert_map).sort().forEach(function(key) {
		result_data.push((/^\d/.test(key) ? '_' + key : key)
		//
		+ ':' + JSON.stringify(convert_map[key]));
	});
	result_data = '// Auto generated by ' + CeL.get_script_name()
			+ "\ntypeof CeL==='function'&&CeL.encoding.add_map({\n"
			+ result_data.join(',\n') + '\n})';

	node_fs.writeFileSync(file_path_list[0].replace(/\..+/g, '.js'),
			result_data);
}

function parse_converted_data(code_lines, convert_map, config) {
	var last_map_key, last_key, last_convert_to,
	//
	last_char_code = config.start_char_code_1 - 1,
	//
	last_char_count = config.end_char_code - config.start_char_code_2 + 1;

	function add_map(hex_key, convert_to, single) {
		if (last_map_key) {
			if (hex_key
					&& !single
					&& (last_map_key.length === hex_key.length
							// 檢測last_key的下一個是否為hex_key
							&& (parseInt(hex_key, HEX_BASE)
									- parseInt(last_key, HEX_BASE) === 1)
					// hex_key為首個byte。
					|| hex_key.charCodeAt(0) % BYTE_BASE === parseInt(
							last_map_key.slice(-2), HEX_BASE))) {
				last_convert_to.push(convert_to);
				last_key = hex_key;
				return;
			}

			// map_key未接續。先登記last_map_key。
			if (last_map_key) {
				// 做點簡易壓縮。
				var buffer = '', lastest_char_code, _last_convert_to = [ '' ];
				function add_slice() {
					if (buffer.length === 0) {
						return;
					}
					// 結算連續的區段。
					// 3: 要採用 ["char",count]的方法，應該要夠長才有效益。
					if (buffer.length > 3) {
						_last_convert_to.push(buffer.length);
					} else {
						_last_convert_to
						//
						[_last_convert_to.length - 1] += buffer;
					}
					buffer = '';
				}
				last_convert_to.forEach(function(char) {
					if (char.length === 1 && char.charCodeAt(0)
					//
					=== lastest_char_code + buffer.length + 1) {
						buffer += char;
					} else {
						// char與之前的沒有連續。
						add_slice();
						if (typeof _last_convert_to
						//
						[_last_convert_to.length - 1] === 'string') {
							_last_convert_to
							//
							[_last_convert_to.length - 1] += char;
						} else {
							_last_convert_to.push(char);
						}
						// console.log([ buffer, char, lastest_char_code ]);
						lastest_char_code = char.charCodeAt(0);
					}
				});
				add_slice();
				last_convert_to = last_convert_to.length > _last_convert_to.length ? _last_convert_to.length === 1 ? _last_convert_to[0]
						: _last_convert_to
						: last_convert_to.join('');

				if (config.high_byte_hex) {
					last_map_key = config.high_byte_hex + last_map_key;
				}
				if (last_map_key in convert_map) {
					CeL.warn('Duplicate byte ' + last_map_key + ': '
					//
					+ convert_map[last_map_key] + '→' + last_convert_to);
				}
				convert_map[last_map_key] = last_convert_to;
			}
			if (single) {
				convert_map[hex_key] = [ convert_to, 0 ];
				last_map_key = null;
				return;
			}
		}

		last_map_key = last_key = hex_key;
		last_convert_to = [ convert_to ];
	}

	// ---------------------------------

	code_lines.forEach(function(line) {
		var matched = line.replace(/\r$/, '')
		//
		.match(/^([\dA-F]{2}):([\s\S]+)$/);
		if (!matched) {
			// comments?
			// console.log(line);
			return;
		}
		/** {Integer}雙字元(2バイト符号化文字集合)首位元/多位元組除high_byte_hex之外的第一位元 */
		var char_code_1 = parseInt(matched[1], HEX_BASE);
		if (char_code_1 !== last_char_code + 1) {
			CeL.log(last_char_code + '→' + char_code_1);
		}
		last_char_code = char_code_1;
		// CeL.log(new RegExp('\\' + config.padding_character + '+'));
		/** {String}[HEX]雙字元(2バイト符号化文字集合)首位元/多位元組除high_byte_hex之外的第一位元 */
		var hex_char_1 = matched[1],
		//
		char_list = matched[2].split(new RegExp('\\' + config.padding_character
				+ '+')),
		//
		char_tmp = char_list.pop();
		if (char_tmp) {
			// separator
			CeL.err(hex_char_1 + ': 應以分隔符號結尾，但去掉最後一個時非空: '
					+ JSON.stringify(char_tmp));
		}
		if (last_char_count !== char_list.length) {
			CeL.log(hex_char_1 + ': ' + last_char_count + '→'
					+ char_list.length + ' chars');
			last_char_count = char_list.length;
		}

		if (!config.high_byte_hex
		// 檢測此排是否皆相同。對high_byte_hex，此檢測之結果應該在更簡單之時已設定過，因此跳過此項。
		&& (char_tmp = char_list[0].chars()[0]) !== UNKNOWN_CHARACTER
		//
		&& char_list.every(function(char, index) {
			return char_tmp === char.chars()[0];
		})) {
			if (hex_char_1 === to_hex(char_tmp)[0]) {
				// 轉換到相同字元了。
				return;
			}
			if (char_tmp.codePointAt(0) !== char_code_1) {
				CeL.log('單字元轉換: [' + hex_char_1 + '] → [' + char_tmp + '] ('
						+ to_hex(char_tmp) + ')');
			}
			add_map(hex_char_1, char_tmp);
			return;
		}

		char_list.forEach(function(char, index) {
			if (char.startsWith(UNKNOWN_CHARACTER)) {
				// 不能轉換此char。
				return;
			}
			// 因為有[[en:Surrogate mechanism]]，不可用(char.length!==1)
			if (char.chars().length !== 1) {
				// assert: (char.codePointAt(0) !== char_code_1)

				var code_point_2 = char.chars()[1].codePointAt(0);
				if (code_point_2 >= 0x0300 &&
				// 檢測是否為[[en:Combining character#Unicode ranges]]
				code_point_2 <= 0x036F) {
					add_map(hex_char_1
							+ to_hex(index + config.start_char_code_2), char,
					// 對組合字符，需要以separator或一個個列出以對應，否則會解析錯誤。
					true);
					return;
				}

				CeL.warn(hex_char_1 + to_hex(index + config.start_char_code_2)
				//
				+ '[' + index + ']: ' + JSON.stringify(char)
				// + ' ' + char.length + ' (' + to_hex(char) +
				// ')'
				+ ' (' + to_hex(char) + ') will be skipped.');
				return;
			}
			// 轉換至雙字元/多字元:
			add_map(hex_char_1
			//
			+ to_hex(index + config.start_char_code_2), char);
		});
	});

	// 登記last_map_key。
	add_map();
}
