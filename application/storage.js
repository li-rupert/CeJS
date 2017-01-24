/**
 * @name CeL function for storage.
 * @fileoverview 載入在不同執行環境與平台皆可使用的檔案操作功能公用API。
 * @since
 */

'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不採用 if 陳述式，可以避免 Eclipse JSDoc 與 format 多縮排一層。
typeof CeL === 'function' && CeL.run({
	// TODO: 使用此名稱，在 include 時可能沖到原先的 CeL.platform!!
	// module name
	name : 'application.storage',

	// 依照不同執行環境與平台載入可用的操作功能。
	require : detect_require,

	// 設定不匯出的子函式。
	// no_extend : '*',

	// 為了方便格式化程式碼，因此將 module 函式主體另外抽出。
	code : module_code
});

function detect_require() {
	if (library_namespace.platform.nodejs) {
		return 'application.platform.nodejs.';
	}

	// 理想作法應該偵測JScript與COM環境。
	// @see CeL.application.OS.Windows.file
	this.has_ActiveX = typeof WScript === 'object'
			|| typeof ActiveXObject === 'function'
			|| typeof Server === 'object' && Server.CreateObject;

	if (this.has_ActiveX) {
		return 'application.OS.Windows.file.';
	}
}

function module_code(library_namespace) {

	/**
	 * null module constructor
	 * 
	 * @class storage 的 functions
	 */
	var _// JSDT:_module_
	= function() {
		// null module constructor
	};

	/**
	 * for JSDT: 有 prototype 才會將之當作 Class
	 */
	_// JSDT:_module_
	.prototype = {};

	// -------------------------------------------------------------------------
	// 維護公用API。

	/**
	 * 公用API: 有些尚未完備，需要先確認。<code>

	CeL.storage.fso_status(fso_path)
	CeL.storage.file_exists(file_path)
	CeL.storage.read_file(file_path, character_encoding = 'UTF-8')
	CeL.storage.write_file(file_path, contents, character_encoding = 'UTF-8')
	// alias: delete
	CeL.storage.remove_file(file_path / directory_path_list)
	// alias: rename
	CeL.storage.move_file(move_from_path, move_to_path)
	CeL.storage.copy_file(copy_from_path, copy_to_path)

	CeL.storage.directory_exists(directory_path)
	// get files, sub-directory of the directory
	CeL.storage.read_directory(directory_path)
	// alias: mkdir
	CeL.storage.create_directory(directory_path / directory_path_list)
	// alias: delete
	CeL.storage.remove_directory(directory_path / directory_path_list)
	// alias: rename
	CeL.storage.move_directory(move_from_path, move_to_path)
	CeL.storage.copy_directory(copy_from_path, copy_to_path)
	
	// TODO: 以 data.file.file_system_structure 代替 traverse_file_system()
	CeL.storage.traverse_file_system(directory_path, handler)

	</code>
	 */

	// main module
	var storage_module;

	if (library_namespace.platform.nodejs) {
		storage_module = library_namespace.platform.nodejs;

		_.fso_status = storage_module.fs_status;

		_.read_file = storage_module.fs_read;

		_.write_file = storage_module.fs_write;

		_.copy_file = storage_module.fs_copySync;

		_.remove_file = _.remove_directory = storage_module.fs_remove;

		_.move_fso = storage_module.fs_move;

		_.create_directory = storage_module.fs_mkdir;

		_.storage.traverse_file_system = storage_module.traverse_file_system;

	} else if (this.has_ActiveX) {
		storage_module = library_namespace.application.OS.Windows.file;

		_.read_file = storage_module.read_file;

		_.write_file = storage_module.write_file;

		// TODO: many

		// others done @ CeL.application.OS.Windows.file

	}

	// -------------------------------------------------------------------------

	return (_// JSDT:_module_
	);
}