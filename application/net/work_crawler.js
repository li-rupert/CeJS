﻿/**
 * @name CeL function for downloading online works (novels, comics).
 * 
 * @fileoverview 本檔案包含了批量下載線上作品（小說、漫畫）的函式庫。 WWW work crawler.
 * 
 * <code>

流程:

// 取得伺服器列表。 start_downloading()
// 解析設定檔，判別所要下載的作品列表。 parse_work_id(), get_work_list()
// 解析 作品名稱 → 作品id get_work()
// 取得作品資訊與各章節資料。 get_work_data()
// 對於章節列表與作品資訊分列不同頁面(URL)的情況，應該另外指定.chapter_list_URL。 get_work_data()
// 取得每一個章節的內容與各個影像資料。 get_chapter_data()
// 取得各個章節的每一個影像內容。 get_images()
// finish_up()

TODO:
下載完畢後自動產生壓縮檔+自動刪除原始圖檔
預設介面語言繁體中文+...
在單一/全部任務完成後執行的外部檔+等待單一任務腳本執行的時間（秒數）
parse 圖像
自動搜尋不同的網站並選擇下載作品。
從其他的資料來源網站尋找取得作品以及章節的資訊。
檢核章節內容。
proxy

</code>
 * 
 * @see https://github.com/abcfy2/getComic,
 *      https://github.com/wellwind/8ComicDownloaderElectron
 * 
 * @since 2016/10/30 21:40:6
 * @since 2016/11/1 23:15:16 正式運用：批量下載腾讯漫画 qq。
 * @since 2016/11/5 22:44:17 正式運用：批量下載漫画台 manhuatai。
 * @since 2016/11/27 19:7:2 模組化。
 */

// More examples: see 各網站工具檔.js: https://github.com/kanasimi/work_crawler
'use strict';
// 'use asm';

// --------------------------------------------------------------------------------------------

// 不採用 if 陳述式，可以避免 Eclipse JSDoc 與 format 多縮排一層。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler',

	// .includes() @ CeL.data.code.compatibility
	require : 'data.code.compatibility.'
	// .between() @ CeL.data.native
	// .append() @ CeL.data.native
	// .pad() @ CeL.data.native
	// display_align() @ CeL.data.native
	+ '|data.native.'
	// for CeL.to_file_name()
	+ '|application.net.'
	//
	+ '|application.net.Ajax.get_URL'
	// for CeL.env.arg_hash, CeL.fs_mkdir()
	+ '|application.platform.nodejs.|application.storage.'
	// for CeL.storage.file.file_type()
	+ '|application.storage.file.'
	// for HTML_to_Unicode()
	+ '|interact.DOM.'
	// for Date.prototype.format()
	+ '|data.date.'
	// CeL.character.load(), 僅在有需要設定this.charset時才需要載入。
	+ '|data.character.'
	// for .detect_HTML_language(), .time_zone_of_language()
	// + '|application.locale.'
	,

	// 設定不匯出的子函式。
	no_extend : '*',

	// 為了方便格式化程式碼，因此將 module 函式主體另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring
	var get_URL = this.r('get_URL'),
	/** node.js file system module */
	node_fs = library_namespace.platform.nodejs && require('fs'),
	// @see CeL.application.net.wiki
	PATTERN_non_CJK = /^[\u0000-\u2E7F]*$/i,
	//
	path_separator = library_namespace.env.path_separator;

	// --------------------------------------------------------------------------------------------

	function Work_crawler(configurations) {
		Object.assign(this, configurations);
		if (!this.id) {
			// this.id 之後將提供給 this.site_id 使用。
			this.id = this.main_directory.replace(/\.*[\\\/]+$/, '')
			//
			|| this.base_URL.match(/\/\/([^\/]+)/)[1].toLowerCase().split('.')
			//
			.reverse().some(function(token, index) {
				if (index === 0) {
					// 頂級域名
					return false;
				}
				if (token !== 'www') {
					this.id = token;
				}
				if (token.length > 3 || index > 1) {
					// e.g., www.[id].co.jp
					return true;
				}
			}, this);
			if (this.id) {
				this.id = this.id.match(/[^\\\/]+$/)[0];
			} else {
				library_namespace.error('Can not detect .id from '
						+ this.base_URL);
			}
		}
		process.title = 'Starting ' + this.id;
		if (!configurations.MESSAGE_RE_DOWNLOAD) {
			this.MESSAGE_RE_DOWNLOAD = this.id + ': '
					+ this.MESSAGE_RE_DOWNLOAD;
		}

		this.get_URL_options = {
			// start_time : Date.now(),
			timeout : Work_crawler.timeout,
			headers : Object.assign({
				'User-Agent' : this.user_agent,
				Referer : this.base_URL
			}, this.headers)
		};
		this.default_agent = this.set_agent();
	}

	// 初始化 agent。
	// create and keep a new agent. 維持一個獨立的 agent。
	// 以不同 agent 應對不同 host。
	function set_agent(URL) {
		var agent;
		if (URL
		// restore
		|| !(agent = this.default_agent)) {
			agent = library_namespace.application.net.Ajax.setup_node_net(URL
					|| this.base_URL);
			agent.keepAlive = true;
		}
		return this.get_URL_options.agent = agent;
	}

	/** {Natural}下載失敗時重新嘗試下載的次數。同一檔案錯誤超過此數量則跳出。 */
	Work_crawler.MAX_ERROR = 4;
	/** {Natural}timeout in ms for get_URL() 逾時ms數。若逾時時間太小（如10秒），下載大檔案容易失敗。 */
	Work_crawler.timeout = 30 * 1000;

	Work_crawler.prototype = {
		// 所有的子檔案要修訂註解說明時，應該都要順便更改在CeL.application.net.work_crawler中Work_crawler.prototype內的母comments，並以其為主體。

		// 儲存路徑。圖片檔+紀錄檔下載位置。
		main_directory : (library_namespace.platform.nodejs
				&& process.mainModule ? process.mainModule.filename
				.match(/[^\\\/]+$/)[0].replace(/\.js$/i, '') : '.')
				// main_directory 必須以 path separator 作結。
				+ path_separator,
		// 錯誤紀錄檔
		error_log_file : 'error_files.txt',

		// id : '',
		// site_id : '',
		// base_URL : '',
		// charset : 'GBK',

		// 腾讯TT浏览器
		user_agent : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)',
		MAX_ERROR : Work_crawler.MAX_ERROR,
		MAX_EOI_ERROR : Math.min(3, Work_crawler.MAX_ERROR),
		// 應改成最小容許圖案檔案大小 (bytes)。
		MIN_LENGTH : 4e3,
		// 仙人拍鼓有時錯，跤步踏差啥人無？ 客語 神仙打鼓有時錯，腳步踏差麼人無
		MESSAGE_RE_DOWNLOAD : '神仙打鼓有時錯，腳步踏差誰人無。下載出錯了，例如服務器暫時斷線、檔案闕失(404)。請確認排除錯誤或錯誤不再持續後，重新執行以接續下載。',
		// 當圖像不存在EOI，或是被偵測出非圖像時，依舊強制儲存檔案。
		// allow image without EOI mark. default:false
		allow_EOI_error : library_namespace.env.arg_hash
				&& library_namespace.env.arg_hash.allow_EOI_error,
		// 圖像檔案下載失敗處理方式：忽略/跳過圖像錯誤。當404圖像不存在、檔案過小，或是被偵測出非圖像(如不具有EOI)時，依舊強制儲存檔案。default:false
		skip_error : library_namespace.env.arg_hash
				&& library_namespace.env.arg_hash.skip_error,
		//
		// 若已經存在壞掉的圖片，就不再嘗試下載圖片。default:false
		// skip_existed_bad_file : true,
		//
		// e.g., '2-1.jpg' → '2-1 bad.jpg'
		EOI_error_postfix : ' bad',
		// 加上有錯誤檔案之註記。
		EOI_error_path : EOI_error_path,
		// cache directory below this.main_directory.
		// MUST append path_separator!
		cache_directory_name : 'cache' + path_separator,
		// archive directory below this.main_directory for ebook. 封存舊電子書用的目錄。
		// MUST append path_separator!
		archive_directory_name : 'archive' + path_separator,

		// default start chapter index
		start_chapter : 1,
		// 是否重新取得每個章節內容chapter_page。
		// 警告: reget_chapter=false僅適用於小說之類不取得圖片的情形，
		// 因為若有圖片（parse_chapter_data()會回傳chapter_data.image_list），將把chapter_page寫入僅能從chapter_URL取得名稱的於目錄中。
		reget_chapter : true,
		// 是否保留chapter page
		// 注意: 若是沒有reget_chapter，則preserve_chapter_page不應發生效用。
		preserve_chapter_page : true,

		// for CeL.application.storage.EPUB
		// auto_create_ebook, automatic create ebook
		// MUST includes CeL.application.locale!
		// need_create_ebook : true,
		KEY_EBOOK : 'ebook',
		milestone_extension : true,
		add_ebook_chapter : add_ebook_chapter,
		pack_ebook : pack_ebook,
		/** 若需要留下/重複利用media如images，請勿remove。 */
		// remove_ebook_directory : true,
		/** 章節數量無變化時依舊利用 cache 重建資料(如ebook) */
		// regenerate : true,
		/** 進一步處理書籍之章節內容。例如繁簡轉換、裁剪廣告。 */
		contents_post_processor : function(contents) {
			return contents;
		} && null,

		full_URL : full_URL_of_path,
		// recheck:從頭檢測所有作品之所有章節與所有圖片。不會重新擷取圖片。對漫畫應該僅在偶爾需要從頭檢查時開啟此選項。default:false
		// recheck='changed': 若是已變更，例如有新的章節，則重新下載/檢查所有章節內容。否則只會自上次下載過的章節接續下載。
		recheck : library_namespace.env.arg_hash
				&& library_namespace.env.arg_hash.recheck,
		// 當無法取得chapter資料時，直接嘗試下一章節。在手動+監視下recheck時可併用此項。default:false
		// skip_chapter_data_error : true,

		image_types : {
			jpg : true,
			// 抓取到非JPG圖片
			gif : true,
			png : true,
			bmp : true
		},

		image_path_to_url : image_path_to_url,
		is_work_id : function(work_id) {
			return work_id > 0;
		},
		is_finished : function(work_data) {
			var status = work_data.status;
			return status
			// e.g., 连载中, 連載中, 已完结
			&& (/已完[結结]/.test(status)
			// e.g., http://www.23us.cc
			|| /^已?完[結结成]$/.test(status)
			//
			|| status.includes('完結済')
			// e.g., https://syosetu.org/?mode=ss_detail&nid=33378
			|| status.includes('(完結)')
			// http://book.qidian.com/
			|| status.includes('完本'));
		},
		pre_get_chapter_data : pre_get_chapter_data,
		// 對於章節列表與作品資訊分列不同頁面(URL)的情況，應該另外指定.chapter_list_URL。
		// chapter_list_URL : '',

		set_agent : set_agent,
		data_of : start_get_data_of,
		start : start_downloading,
		set_server_list : set_server_list,
		parse_work_id : parse_work_id,
		get_work_list : get_work_list,
		get_work : get_work,
		get_work_data : get_work_data,
		get_chapter_data : get_chapter_data,
		get_images : get_images
	};

	// --------------------------------------------------------------------------------------------

	function set_server_list(server_URL, callback, server_file) {
		if (Array.isArray(server_URL)) {
			// 直接設定。
			this.server_list = server_URL;
			typeof callback === 'function' && callback();
			return;
		}

		if (typeof server_URL === 'function') {
			server_URL = server_URL.call(this);
		}

		var _this = this;

		// 取得圖庫伺服器列表。
		get_URL(server_URL, function(XMLHttp) {
			var html = XMLHttp.responseText;
			_this.server_list = _this.parse_server_list(html)
			// 確保有東西。
			.filter(function(server) {
				return !!server;
			}).unique();
			library_namespace.log('Get ' + _this.server_list.length
					+ ' servers from [' + server_URL + ']: '
					+ _this.server_list);
			if (server_file) {
				node_fs.writeFileSync(server_file, JSON
						.stringify(_this.server_list));
			}

			typeof callback === 'function' && callback();
		}, this.charset, null, this.get_URL_options);
	}

	// front end #1: start downloading operation
	function start_downloading(work_id, callback) {
		if (!work_id) {
			library_namespace.log(this.id + ': 沒有輸入 work_id！');
			return;
		}

		if (this.charset
				&& !library_namespace.character.is_loaded(this.charset)) {
			// 載入需要的字元編碼。
			library_namespace.character.load(this.charset, start_downloading
					.bind(this, work_id, callback));
			return;
		}

		library_namespace.log(this.id + ': Strating ' + work_id);
		// prepare work directory.
		library_namespace.fs_mkdir(this.main_directory);

		if (!this.server_URL) {
			this.parse_work_id(work_id, callback);
			return;
		}

		var _this = this,
		// host_file
		server_file = this.main_directory + 'servers.json';

		if (this.use_server_cache
		// host_list
		&& (this.server_list = library_namespace.get_JSON(server_file))) {
			// use cache of host list
			this.parse_work_id(work_id, callback);
			return;
		}

		this.set_server_list(this.server_URL, function() {
			_this.parse_work_id(work_id, callback);
		}, server_file);
	}

	/**
	 * front end #2: start get work information operation.
	 * 
	 * @param {String}work_title
	 *            作品標題/作品名稱
	 * @param {Function}callback
	 *            callback function(work_data).
	 * @param {Object}[options]
	 *            附加參數/設定特殊功能與選項
	 * 
	 * @examples <code>

	var work_crawler = new CeL.work_crawler(configurations);
	work_crawler.data_of(work_id, function(work_data) {
		console.log(work_data);
	});

	 * </code>
	 */
	function start_get_data_of(work_title, callback, options) {
		function start_get_data_of_callback(work_data) {
			typeof callback === 'function' && callback.call(this, work_data);
		}
		start_get_data_of_callback.options = Object.assign({
			get_data_only : true
		}, options);

		// TODO: test
		this.start(work_id, start_get_data_of_callback);
	}

	// ----------------------------------------------------------------------------

	// modify from CeL.application.net.Ajax
	// 本函式將使用之 encodeURIComponent()，包含對 charset 之處理。
	// @see function_placeholder() @ module.js
	var encode_URI_component = function(string, encoding) {
		if (library_namespace.character) {
			library_namespace.debug('採用 ' + library_namespace.Class
			// 有則用之。 use CeL.data.character.encode_URI_component()
			+ '.character.encode_URI_component', 1, library_namespace.Class
			// module name
			+ 'application.net.work_crawler');
			return (encode_URI_component = library_namespace.character.encode_URI_component)
					(string, encoding);
		}
		return encodeURIComponent(string);
	};

	function full_URL_of_path(url, data) {
		if (typeof url === 'function') {
			url = url.call(this, data);
		} else if (data) {
			data = encode_URI_component(data, url.charset || this.charset);
			if (url.URL) {
				url.URL += data
			} else {
				url += data;
			}
		}
		if (typeof url === 'string' && !url.includes('://')) {
			if (url.startsWith('/')) {
				if (url.startsWith('//')) {
					return this.base_URL.match(/^(https?:)\/\//)[1] + url;
				}
				url = url.replace(/^[\\\/]+/g, '');
			}
			url = this.base_URL + url;
		}
		return url;
	}

	function parse_work_id(work_id, callback) {
		work_id = String(work_id);

		if (this.convert_id && typeof this.convert_id[work_id] === 'function') {
			// 因為 convert_id[work_id]() 可能回傳 list，因此需要以 get_work_list() 特別處理。
			this.get_work_list([ work_id ], callback);

		} else if (work_id.startsWith('l=') || node_fs.existsSync(work_id)) {
			// e.g.,
			// node 各漫畫網站工具檔.js l=各漫畫網站工具檔.txt
			// node 各漫畫網站工具檔.js 各漫畫網站工具檔.txt
			// @see http://ac.qq.com/Rank/comicRank/type/pgv
			if (work_id.startsWith('l=')) {
				work_id = work_id.slice('l='.length);
			}
			var work_list = (library_namespace.fs_read(work_id).toString() || '')
			//
			.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
			// 去掉BOM (byte order mark)
			.trim()
			// TODO: 處理title中包含"#"的作品
			.replace(/(?:^|\n)#[^\n]*/g, '').trim().split(/[\r\n]+/);
			this.get_work_list(work_list, callback);

		} else if (work_id
		// 跳過來自命令列參數的手動設定。
		&& !/^(?:allow_EOI_error|skip_error|recheck)=/.test(work_id)) {
			// e.g.,
			// node 各漫畫網站工具檔.js 12345
			// node 各漫畫網站工具檔.js ABC
			this.get_work(work_id, callback);
		}
	}

	function get_work_list(work_list, callback) {
		// console.log(work_list);
		// 真正處理的作品數。
		var work_count = 0, all_work_status = library_namespace.null_Object();

		// assert: Array.isArray(work_list)
		work_list.run_async(function for_each_title(get_next_work, work_title,
				this_index) {
			function insert_id(id_list) {
				if (Array.isArray(id_list) && id_list.length > 0) {
					// 插入list。
					id_list.unshift(this_index, 0);
					Array.prototype.splice.apply(work_list, id_list);
				}
				get_next_work();
			}

			// convert to next index
			this_index++;
			work_title = work_title.trim();
			if (!work_title) {
				// 直接進入下一個 work_title。
				get_next_work();

			} else if (this.convert_id
			// convert special work id: function(get_next_work, type)
			// 警告: 需要自行呼叫 get_next_work(id_list);
			&& typeof this.convert_id[work_title] === 'function') {
				// 提供異序(asynchronously,不同時)使用。
				library_namespace.debug('Using convert_id[' + work_title + ']',
						3, 'get_work_list');
				this.convert_id[work_title].call(this, insert_id, work_title);

			} else {
				work_count++;
				library_namespace.log('Download ' + work_count
						+ (work_count === this_index ? '' : '/' + this_index)
						+ '/' + work_list.length + ': ' + work_title);
				this.get_work(work_title, function(work_data) {
					var work_status = set_work_status(work_data);
					if (work_status) {
						// assert: typeof work_status === 'object'
						if (work_data.id)
							work_status.id = work_data.id;
						work_status.title = work_data.title || work_title;
						all_work_status[work_status.title] = work_status;
					}
					get_next_work();
				});
			}

		}, function all_work_done() {
			library_namespace.log(this.id + ': All ' + work_list.length
					+ ' works done.');
			var work_status_titles = Object.keys(all_work_status);
			if (work_status_titles.length > 0) {
				try {
					node_fs.writeFileSync(this.main_directory + 'report.json',
					//
					JSON.stringify({
						date : (new Date).toISOString(),
						status : all_work_status
					}));
				} catch (e) {
					// TODO: handle exception
				}
				var report_file = this.main_directory + 'report.htm',
				// 產生網頁形式的報告檔。
				reports = [ '<html>', '<head>', '<style>',
						'table{border-collapse:collapse}',
						'table,th,td{border:1px solid #55f;padding:.2em}',
						'</style>', '</head>', '<body>',
						'<h2>' + this.id + '</h2>', '<table>',
						'<tr><th>#</th><th>id</th>',
						'<th>title</th><th>status</th></tr>' ];
				library_namespace.info(this.id + ': '
				//
				+ work_status_titles.length + ' notes: ' + report_file);
				work_status_titles.forEach(function(work_title, index) {
					var work_status = all_work_status[work_title];
					library_namespace.info(work_title
							+ ': '
							+ (Array.isArray(work_status) ? work_status
									.join(', ') : work_status));
					reports.push('<tr><td>'
							+ (index + 1)
							+ '</td><td>'
							+ (work_status.id || '')
							+ '</td><td>'
							+ work_status.title
							+ '</td><td>'
							+ (Array.isArray(work_status) ? work_status
									.join('<br />') : work_status)
							+ '</td></tr>');
				});
				reports.push('</table>', '</body></html>');
				try {
					node_fs.writeFileSync(report_file, reports.join('\r\n'));
				} catch (e) {
					// TODO: handle exception
				}

			} else {
				all_work_status = undefined;
			}
			typeof callback === 'function' && callback(all_work_status);
		}, this);
	}

	// ----------------------------------------------------------------------------

	function set_work_status(work_data, status) {
		if (status) {
			if (!work_data.process_status)
				work_data.process_status = [];
			work_data.process_status.push(status);
		}
		return work_data.process_status;
	}

	// cache / save work data file
	function save_work_data_file(work_data) {
		if (work_data.data_file)
			try {
				node_fs.writeFileSync(work_data.data_file, JSON
						.stringify(work_data));
			} catch (e) {
				// TODO: handle exception
			}
	}

	function get_work(work_title, callback) {
		// 先取得 work id
		if (this.is_work_id(work_title)) {
			// is work id
			this.get_work_data(work_title, callback);
			return;
		}

		var _this = this, search_result_file = this.main_directory
				+ 'search.json',
		// search cache
		// 檢查看看之前是否有取得過。
		search_result = library_namespace.get_JSON(search_result_file)
				|| library_namespace.null_Object();

		// finish() → finish_up()
		function finish_up(work_data) {
			if (work_data && work_data.title) {
				// 最後紀錄。
				save_work_data_file(work_data);
				if (_this.need_create_ebook
				// 未找到時沒有 work_data。
				&& work_data.chapter_count >= 1) {
					_this.pack_ebook(work_data);
				}
			} else if (work_data && work_data.titles) {
				// @see ((approximate_title))
				set_work_status(work_data, 'found ' + work_data.titles
						+ ' titles: ' + work_data.titles);
			} else {
				var status = work_data;
				work_data = library_namespace.null_Object();
				set_work_status(work_data,
						status && typeof status === 'string' ? status
								: 'not found');
			}
			if (typeof _this.finish_up === 'function') {
				_this.finish_up(work_data);
			}
			typeof callback === 'function' && callback.call(_this, work_data);
		}
		if (callback && callback.options) {
			// e.g., for .get_data_only
			finish_up.options = callback.options;
		}

		function finish(no_cache) {
			if (!no_cache) {
				// write cache
				node_fs.writeFileSync(search_result_file, JSON
						.stringify(search_result));
			}
			search_result = search_result[work_title];
			var p = _this.id_of_search_result;
			if (p) {
				search_result = typeof p === 'function' ? p(search_result)
						: search_result ? search_result[p] : search_result;
			}
			_this.get_work_data({
				id : search_result,
				title : work_title
			}, finish_up);
		}

		// assert: work_title前後不應包含space
		if (search_result[work_title = work_title.trim()]) {
			library_namespace.log('Find cache: ' + work_title + '→'
					+ JSON.stringify(search_result[work_title]));
			finish(true);
			return;
		}

		var url = this.search_URL, URL, post_data;
		if (!url || typeof this.parse_search_result !== 'function') {
			throw '請手動設定/輸入 [' + work_title + '] 之 id 於 ' + search_result_file;
		}
		if (typeof url === 'function') {
			// url = url.call(this, work_title);
			url = this.search_URL(work_title);
			if (Array.isArray(url)) {
				post_data = url[1];
				url = url[0];
			}
			url = this.full_URL(url);
			URL = url.URL || url;
		} else {
			// default:
			// assert: typeof url==='string' || url==={URL:'',charset:''}
			// TODO: .replace(/%t/g, work_title)
			url = this.full_URL(url);
			// 對 {Object}url，不可動到 url。
			URL = (url.URL || url) + encode_URI_component(
			// e.g., 找不到"隔离带 2"，須找"隔离带"。
			work_title.replace(/\s+\d{1,2}$/, '')
			// e.g., "Knight's & Magic" @ 小説を読もう！ || 小説検索
			.replace(/&/g, ''), url.charset || this.charset);
		}

		// console.log(url);
		this.set_agent(URL);
		get_URL(URL, function(XMLHttp) {
			_this.set_agent();
			if (!XMLHttp.responseText) {
				library_namespace.error(
				//
				'get_work: Nothing got for searching [' + work_title + ']');
				finish_up('Nothing got for searching');
				return;
			}
			// this.parse_search_result() returns:
			// [ {Array}id_list, 與id_list相對應之{Array}或{Object} ]
			// e.g., [ [id,id,...], [title,title,...] ]
			// e.g., [ [id,id,...], [data,data,...] ]
			// e.g., [ [id,id,...], {id:data,id:data,...} ]
			var id_data;
			try {
				id_data = _this.parse_search_result(XMLHttp.responseText,
						get_label);
			} catch (e) {
				console.trace(e);
				library_namespace
						.error('get_work.parse_search_result: 無法解析搜尋作品['
								+ work_title + ']之結果！');
				finish_up('無法解析搜尋作品之結果');
				return;
			}
			// e.g., {id:data,id:data,...}
			if (library_namespace.is_Object(id_data)) {
				id_data = [ Object.keys(id_data), id_data ];
			}
			// {Array}id_list = [id,id,...]
			var id_list = id_data[0] || [];
			// console.log(id_data);
			id_data = id_data[1];
			if (id_list.length !== 1) {
				library_namespace.warn('[' + work_title + ']: Get '
				//
				+ id_list.length + ' works: ' + JSON.stringify(id_data));
			}

			// 近似的標題。
			var approximate_title = [];
			if (id_list.every(function(id, index) {
				var title = library_namespace.is_Object(id) ? id
				//
				: id_data[Array.isArray(id_data) && isNaN(id) ? index : id]
				//
				|| Array.isArray(id_data) && id_data[index],
				//
				p = _this.title_of_search_result;
				if (p) {
					title = typeof p === 'function' ? p(title)
							: title ? title[p] : title;
				}
				title = title.trim();
				// 找看看是否有完全相同的title。
				if (title !== work_title) {
					if (title.includes(work_title) || title.replace(/\s/g, '')
					//
					=== work_title.replace(/\s/g, '')) {
						approximate_title.push([ id, title ]);
					}
					return true;
				}
				id_list = id;
			})) {
				if (approximate_title.length !== 1) {
					library_namespace.error(
					// failed: not only one
					(approximate_title.length === 0 ? '未找到' : '找到'
							+ approximate_title.length + '個')
							+ '與[' + work_title + ']相符者。');
					finish_up(approximate_title.length > 0 && {
						titles : approximate_title
					});
					return;
				}
				approximate_title = approximate_title[0];
				library_namespace.warn(library_namespace.display_align({
					'Use title:' : work_title,
					'→' : approximate_title[1]
				}));
				work_title = approximate_title[1];
				id_list = approximate_title[0];
			}

			// 已確認僅找到唯一id。
			id_data = id_data[id_list];
			search_result[work_title] = typeof id_data === 'object'
			// {Array}或{Object}
			? id_data : id_list;
			if (typeof _this.post_get_work_id === 'function') {
				// post_get_work_id :
				// function(callback, work_title, search_result) {}
				_this.post_get_work_id(finish, work_title, search_result);
			} else {
				finish();
			}

		}, url.charset || this.charset, post_data, this.get_URL_options);
	}

	function get_label(html) {
		if (html) {
			return library_namespace.HTML_to_Unicode(
					html.replace(/<[^<>]+>/g, '')).trim();
		}
	}

	function exact_work_data(work_data, html, PATTERN_work_data) {
		var matched;
		// [ all, key, value ]
		while (matched = PATTERN_work_data.exec(html)) {
			matched[1] = get_label(matched[1]).replace(/[:：\s]+$/, '');
			work_data[matched[1]] = get_label(matched[2]);
		}
	}

	function get_work_data(work_id, callback, error_count) {
		var work_title;
		if (library_namespace.is_Object(work_id)) {
			work_title = work_id.title;
			work_id = work_id.id;
		}
		process.title = '下載' + work_title + ' - 資訊 @ ' + this.id;

		var _this = this, work_URL = this.full_URL(this.work_URL, work_id), work_data;
		library_namespace.debug('work_URL: ' + work_URL, 2, 'get_work_data');

		get_URL(work_URL, process_work_data, this.charset, null,
				this.get_URL_options);

		function process_work_data(XMLHttp) {
			// console.log(XMLHttp);
			var html = XMLHttp.responseText;
			if (!html) {
				library_namespace
						.error('Failed to get work data of ' + work_id);
				if (error_count === _this.MAX_ERROR) {
					throw _this.MESSAGE_RE_DOWNLOAD;
				}
				error_count = (error_count | 0) + 1;
				library_namespace.log('process_work_data: Retry ' + error_count
						+ '/' + _this.MAX_ERROR + '...');
				_this.get_work_data({
					// 书号
					id : work_id,
					title : work_title
				}, callback, error_count);
				return;
			}

			try {
				work_data = _this.parse_work_data(html, get_label,
						exact_work_data);
			} catch (e) {
				library_namespace.error(work_title + ': ' + e);
				typeof callback === 'function' && callback({
					title : work_title
				});
				return;
			}

			if (!work_data.title) {
				work_data.title = work_title;
			}
			// 基本檢測。
			if (PATTERN_non_CJK.test(work_data.title)
			// e.g., "THE NEW GATE", "Knight's & Magic"
			&& !/[a-z]+ [a-z\d&]/i.test(work_data.title)
			// e.g., "Eje(c)t"
			&& !/[()]/.test(work_data.title)
			// .title: 必要屬性：須配合網站平台更改。
			&& PATTERN_non_CJK.test(work_id)) {
				library_namespace.error('Did not set work title: ' + work_id
						+ ' (' + work_data.title + ')');
			}

			// 自動添加之作業用屬性：
			work_data.id = work_id;
			work_data.last_download = {
				date : (new Date).toISOString(),
				chapter : _this.start_chapter
			};
			// source URL of work
			work_data.url = work_URL;

			process.title = '下載' + work_data.title + ' - 目次 @ ' + _this.id;
			work_data.directory_name = library_namespace.to_file_name(
			// 允許自訂作品目錄名/命名資料夾。
			work_data.directory_name || work_data.id + ' ' + work_data.title);
			// 允許自訂作品目錄，但須自行escape並添加path_separator。
			// @see qq.js
			if (!work_data.directory) {
				work_data.directory = _this.main_directory
						+ work_data.directory_name + path_separator;
			}
			work_data.data_file = work_data.directory
					+ work_data.directory_name + '.json';

			// 先寫入作品資料cache。
			var directory = _this.main_directory + _this.cache_directory_name;
			library_namespace.fs_mkdir(directory);
			// .data.htm
			node_fs.writeFileSync(
					directory + work_data.directory_name + '.htm', html);

			// .status 選擇性屬性：須配合網站平台更改。
			// ja:種別,状態
			if (Array.isArray(work_data.status)) {
				// e.g., ジャンル
				work_data.status = work_data.status.filter(function(item) {
					return !!item;
				})
				// .sort()
				.join(', ');
			}
			// assert: typeof work_data.status === 'string'

			if (_this.is_finished(work_data)) {
				// 預防(work_data.directory)不存在。
				library_namespace.fs_mkdir(work_data.directory);
				node_fs.writeFileSync(work_data.directory
				//
				+ 'finished.txt', work_data.status);
				set_work_status(work_data, 'finished');
				if (work_data.last_saved) {
					set_work_status(work_data, 'last saved: '
							+ work_data.last_saved);
				}
			}
			// TODO: skip finished + no update works

			var matched = library_namespace.get_JSON(work_data.data_file);
			if (matched) {
				// 基本上以新資料為準，除非無法取得新資料，才改用舊資料。
				for ( var key in matched) {
					if (!work_data[key]) {
						work_data[key] = matched[key];

					} else if (typeof work_data[key] !== 'object'
							&& work_data[key] !== matched[key]) {
						var display_pair = CeL.null_Object();
						display_pair[key + ':'] = matched[key];
						display_pair['→'] = work_data[key];
						library_namespace.info(library_namespace
								.display_align(display_pair));
					}
				}
				matched = matched.last_download.chapter;
				if (matched > _this.start_chapter) {
					// 將開始/接續下載的start_chapter章节
					work_data.last_download.chapter = matched;
				}
			}

			if (_this.chapter_list_URL) {
				work_data.chapter_list_URL
				// this.chapter_list_URL(work_id, work_data);
				= work_URL = _this.full_URL(_this.chapter_list_URL, work_id);
				get_URL(work_URL, process_chapter_list_data, _this.charset,
						null, Object.assign({
							error_retry : _this.MAX_ERROR
						}, _this.get_URL_options));
			} else {
				process_chapter_list_data(XMLHttp);
			}
		}

		// get 目次/完整目錄列表/章節列表
		function process_chapter_list_data(XMLHttp) {
			var html = XMLHttp.responseText;
			if (!html) {
				var message = _this.id + ': Can not get chapter list page!';
				library_namespace.error(message);
				throw message;
			}

			// reset chapter_count. 此處 chapter (章節)
			// 指的為平台所給的id編號，並非"回"、"話"！且可能會跳號！
			/** {ℕ⁰:Natural+0}章節數量 */
			work_data.chapter_count = 0;

			// 注意: 這時可能尚未建立 work_data.directory。
			// 但this.get_chapter_count()若用到work_data[this.KEY_EBOOK].set_cover()，則會造成沒有建立基礎目錄的錯誤。
			library_namespace.debug('Create work_data.directory: '
					+ work_data.directory);
			library_namespace.fs_mkdir(work_data.directory);

			if (true || _this.need_create_ebook) {
				// 提供給 this.get_chapter_count() 使用。
				// e.g., 'ja-JP'
				if (!('language' in work_data)) {
					work_data.language
					// CeL.application.locale.detect_HTML_language()
					= library_namespace.detect_HTML_language(html);
				}
				if (!('time_zone' in work_data)) {
					// e.g., 9
					work_data.time_zone
					// CeL.application.locale.time_zone_of_language
					= library_namespace
							.time_zone_of_language(work_data.language);
				}
			}

			try {
				_this.get_chapter_count(work_data, html, get_label);
			} catch (e) {
				library_namespace.error(_this.id
						+ ': .get_chapter_count() throw error');
				throw e;
				typeof callback === 'function' && callback(work_data);
				return;
			}
			// 之前已設定 work_data.chapter_count=0
			if (!work_data.chapter_count
			// work_data.chapter_list 為非正規之 chapter data list。
			&& Array.isArray(work_data.chapter_list)) {
				// 自 work_data.chapter_list 計算章節數量。
				work_data.chapter_count = work_data.chapter_list.length;
			}

			if (!(work_data.chapter_count >= 1)) {
				library_namespace.error(work_id
						+ (work_data.title ? ' ' + work_data.title : '')
						+ ': Can not get chapter count!');

				// 無任何章節可供下載。刪掉前面預建的目錄。
				// 注意：僅能刪除本次操作所添加/改變的檔案。因此必須先確認裡面是空的。不能使用(library_namespace.fs_remove(work_data.directory,,true);)。
				library_namespace.fs_remove(work_data.directory);

				typeof callback === 'function' && callback(work_data);
				return;
			}

			if (_this.chapter_list_URL) {
				node_fs.writeFileSync(_this.main_directory
				//
				+ _this.cache_directory_name + work_data.directory_name
				// .TOC.htm
				+ '.list.htm', html);
			}

			var chapter_added = work_data.chapter_count
					- work_data.last_download.chapter;
			if (_this.recheck
			// _this.get_chapter_count() 中
			// 可能重新設定過 work_data.last_download.chapter。
			&& work_data.last_download.chapter !== _this.start_chapter) {
				// midified
				if (_this.recheck !== 'changed') {
					if (!_this.reget_chapter) {
						if (_this.hasOwnProperty('reget_chapter')) {
							library_namespace
									.warn('既然設定了 .recheck，則將 .reget_chapter 設定為 ['
											+ _this.reget_chapter
											+ '] 將無作用！自動把 .reget_chapter 轉為 true。');
						}
						_this.reget_chapter = true;
					}
					// 無論是哪一種，既然是recheck則都得要從頭check並生成資料。
					work_data.last_download.chapter = _this.start_chapter;

				} else if (_this.recheck > 0 ? chapter_added < 0
				// 這可避免太過經常更新。
				|| chapter_added >= _this.recheck : chapter_added !== 0
				// TODO: check .last_update
				) {
					library_namespace
							.info('因章節數量有變化，將重新下載/檢查所有章節內容: '
									+ work_data.last_download.chapter
									+ '→'
									+ work_data.chapter_count
									+ ' ('
									+ (work_data.chapter_count > work_data.last_download.chapter ? '+'
											: '')
									+ (work_data.chapter_count - work_data.last_download.chapter)
									+ ')');
					// 重新下載
					work_data.reget_chapter = true;
					// work_data.regenerate = true;
					work_data.last_download.chapter = _this.start_chapter;

				} else {
					// 採用依變更判定時，預設不重新擷取。
					// 不可用 ('reget_chapter' in _this)，會取得 .prototype 的屬性。
					if (!_this.hasOwnProperty('reget_chapter')) {
						work_data.reget_chapter = false;
					}
					library_namespace
							.log('章節數量無變化，皆為 '
									+ work_data.chapter_count
									+ '，'
									+ (work_data.reget_chapter ? '但已設定下載所有章節內容。'
											: _this.regenerate ? '僅利用 cache 重建資料(如ebook)，不重新下載所有章節內容。'
													: '跳過本作品不處理。'));
					if (work_data.reget_chapter || _this.regenerate) {
						// 即使是這一種，還是得要從頭 check cache 並生成資料(如.epub)。
						work_data.last_download.chapter = _this.start_chapter;
					}
				}
			}

			if (!('reget_chapter' in work_data)) {
				// .reget_chapter 為每個作品可能不同之屬性，非全站點共用屬性。
				work_data.reget_chapter = typeof _this.reget_chapter === 'function' ? _this
						.reget_chapter(work_data)
						: _this.reget_chapter;
			}

			if (work_data.last_download.chapter > work_data.chapter_count) {
				library_namespace.warn('章節數量 ' + work_data.chapter_count
						+ ' 比將開始/接續之下載章節編號 ' + work_data.last_download.chapter
						+ ' 還少，或許因為章節有經過重整。');
				if (_this.move_when_chapter_count_error) {
					var move_to = work_data.directory
					// 先搬移原目錄。
					.replace(/[\\\/]+$/, '.' + (new Date).format('%4Y%2m%2d'));
					// 常出現在 manhuatai, 2manhua。
					library_namespace.warn('將先備分舊內容、移動目錄，而後重新下載！\n'
							+ work_data.directory + '\n→\n' + move_to);
					// TODO: 成壓縮檔。
					library_namespace.fs_move(work_data.directory, move_to);
					// re-create work_data.directory
					library_namespace.fs_mkdir(work_data.directory);
				} else {
					library_namespace.info('將從頭檢查、重新下載。');
				}
				work_data.last_download.chapter = _this.start_chapter;
			}

			save_work_data_file(work_data);

			if (typeof callback === 'function' && callback.options
					&& callback.options.get_data_only) {
				// 最終廢棄動作，防止執行 work_data[this.KEY_EBOOK].pack()。
				delete work_data[_this.KEY_EBOOK];
				callback(work_data);
				return;
			}

			if (!work_data.reget_chapter && !_this.regenerate
			// 還必須已經下載到最新章節。
			&& work_data.last_download.chapter === work_data.chapter_count) {
				// 跳過本作品不處理。
				library_namespace.log('Skip '
						+ work_data.id
						+ (work_data.author ? ' [' + work_data.author + ']'
								: '') + ' ' + work_data.title);
				// 最終廢棄動作，防止執行 work_data[this.KEY_EBOOK].pack()。
				delete work_data[_this.KEY_EBOOK];
				if (typeof callback === 'function') {
					callback(work_data);
				}
				return;
			}

			if (_this.need_create_ebook) {
				create_ebook.call(_this, work_data);
			}

			var message = [
					work_data.id,
					work_data.author ? ' [' + work_data.author + ']' : '',
					' ',
					work_data.title,
					': ',
					work_data.chapter_count >= 0
					// assert: if chapter count unknown, typeof
					// _this.pre_chapter_URL === 'function'
					? work_data.chapter_count : 'Unknown',
					' chapters.',
					work_data.status ? ' ' + work_data.status : '',
					work_data.last_download.chapter > _this.start_chapter
					//
					? ' 自章節編號第 ' + work_data.last_download.chapter + ' 接續下載。'
							: '' ].join('');
			if (_this.is_finished(work_data)) {
				// 針對特殊狀況提醒。
				library_namespace.info(message);
			} else {
				library_namespace.log(message);
			}

			_this.get_URL_options.headers.Referer = work_URL;
			// 開始下載chapter。
			_this.pre_get_chapter_data(work_data,
					work_data.last_download.chapter, callback);
		}

	}

	// ----------------------------------------------------------------------------

	function pre_get_chapter_data(work_data, chapter, callback) {
		var _this = this;
		function next() {
			_this.get_chapter_data(work_data, chapter, callback);
		}
		if (typeof this.pre_chapter_URL === 'function') {
			// 在this.chapter_URL()之前執行this.pre_chapter_URL()，主要用途在取得chapter_URL之資料。
			try {
				this.pre_chapter_URL(work_data, chapter, next);
			} catch (e) {
				library_namespace.error(_this.id + ': ' + work_data.title
						+ ': Error on chapter ' + chapter);
				throw e;
			}
		} else {
			next();
		}
	}

	function get_chapter_data(work_data, chapter, callback) {
		var _this = this, left, image_list, waiting, chapter_label,
		//
		chapter_URL = this.chapter_URL(work_data, chapter);
		chapter_URL = this.full_URL(chapter_URL);
		library_namespace.debug(work_data.id + ' ' + work_data.title + ' #'
				+ chapter + '/' + work_data.chapter_count + ': ' + chapter_URL);
		process.title = chapter + ' @ ' + work_data.title + ' @ ' + this.id;

		function get_data() {
			process.stdout.write('Get data of chapter ' + chapter
			//
			+ (typeof _this.pre_chapter_URL === 'function' ? ''
			//
			: '/' + work_data.chapter_count) + '...\r');

			// default: 置於 work_data.directory 下
			var chapter_file_name = work_data.directory
					+ work_data.directory_name + ' ' + chapter.pad(3) + '.htm';

			function process_images(chapter_data, XMLHttp) {
				chapter_label = chapter_data.title;
				// 檔名NO的基本長度（不足補零）
				chapter_label = chapter.pad(4) + (chapter_label ? ' '
				//
				+ library_namespace.to_file_name(
				//
				library_namespace.HTML_to_Unicode(chapter_label)) : '');
				var chapter_directory = work_data.directory + chapter_label
				// 若是以 "." 結尾，在 Windows 7 中會出現問題，無法移動或刪除。
				.replace(/\.$/, '._') + path_separator;
				library_namespace.fs_mkdir(chapter_directory);
				// 注意: 若是沒有reget_chapter，則preserve_chapter_page不應發生效用。
				if (work_data.reget_chapter && _this.preserve_chapter_page) {
					node_fs.writeFileSync(chapter_directory
							+ work_data.directory_name + '-' + chapter_label
							+ '.htm', XMLHttp.buffer);
				}
				var message = [ chapter,
				//
				typeof _this.pre_chapter_URL === 'function' ? ''
				//
				: '/' + work_data.chapter_count,
				//
				' [', chapter_label, '] ', left, ' images.',
				// 例如需要收費的章節。
				chapter_data.limited ? ' (limited)' : '' ].join('');
				if (chapter_data.limited) {
					// 針對特殊狀況提醒。
					library_namespace.info(message);
					if (!work_data.some_limited) {
						work_data.some_limited = true;
						set_work_status(work_data, 'limited');
					}
				} else {
					library_namespace.log(message);
				}

				// console.log(image_list);
				// TODO: 當某 chapter 檔案過多，將一次 request 過多 connects 而造成問題。
				image_list.forEach(function(image_data, index) {
					// http://stackoverflow.com/questions/245840/rename-files-in-sub-directories
					// for /r %x in (*.jfif) do ren "%x" *.jpg

					// file_path
					image_data.file = chapter_directory + work_data.id + '-'
							+ chapter + '-' + (index + 1).pad(3) + '.jpg';
					// default: 同時下載本章節中所有圖像。
					// .one_by_one: 循序逐個、一個個下載圖像。 download one by one
					if (!_this.one_by_one) {
						_this.get_images(image_data, check_if_done);
					}
				});
				library_namespace.debug(chapter_label + ': 已派發完工作，開始等待。', 3,
						'get_data');
				waiting = true;
				if (!_this.one_by_one) {
					return;
				}

				_this.get_URL_options.headers.Referer = chapter_URL;
				image_list.index = 0;
				var get_next_image = function(first) {
					if (!first) {
						++image_list.index;
						check_if_done();
					}
					process.stdout.write(image_list.index + '/'
							+ image_list.length + '...\r');
					if (image_list.index < image_list.length) {
						_this.get_images(image_list[image_list.index],
								get_next_image);
					}
				};
				get_next_image(true);
			}

			function process_chapter_data(XMLHttp) {
				var html = XMLHttp.responseText;
				if (!html) {
					library_namespace.error('Failed to get chapter data of '
							+ work_data.directory + chapter);
					if (get_data.error_count === _this.MAX_ERROR) {
						if (_this.skip_chapter_data_error) {
							// Skip this chapter if do not throw
							library_namespace.warn('Skip ' + work_data.title
									+ ' #' + chapter + ' and continue next.');
							check_if_done();
							return;
						}
						throw _this.MESSAGE_RE_DOWNLOAD;
					}
					get_data.error_count = (get_data.error_count | 0) + 1;
					library_namespace.log('process_chapter_data: Retry '
							+ get_data.error_count + '/' + _this.MAX_ERROR
							+ '...');
					if (!work_data.reget_chapter) {
						library_namespace
								.warn('因cache file壞了(例如為空)，將重新取得chapter_URL，設定.reget_chapter。');
						work_data.reget_chapter = true;
					}
					get_data();
					return;
				}

				var chapter_data;
				if (_this.check_chapter_NO) {
					chapter_data = Array.isArray(_this.check_chapter_NO)
					// 檢測所取得內容的章節編號是否相符。
					? html.between(_this.check_chapter_NO[0],
							_this.check_chapter_NO[1])
					// {Function}return chapter NO is OK
					: _this.check_chapter_NO(html);
					var chapter_NO = null;
					if (typeof chapter_data !== 'boolean') {
						chapter_NO = get_label(chapter_data);
						chapter_data = chapter_NO == chapter
						// for yomou only
						|| (chapter_NO === '' || chapter_NO === undefined)
								&& work_data.status
								&& work_data.status.includes('短編')
					}
					if (!chapter_data) {
						// library_namespace.warn(html);
						library_namespace.warn(work_data.status);
						throw new Error(_this.id
								+ ': Bad chapter NO: Should be '
								+ chapter
								+ (chapter_NO === null ? '' : ', but get '
										+ JSON.stringify(chapter_NO))
								+ ' inside contents.');
					}
				}

				try {
					chapter_data = _this.parse_chapter_data(html, work_data,
							get_label, chapter);
				} catch (e) {
					library_namespace.error(_this.id
							+ ': Error on chapter url: ' + chapter_URL);
					throw e;
				}
				// console.log(JSON.stringify(chapter_data));
				if (!chapter_data || !(image_list = chapter_data.image_list)
				//
				|| !((left = chapter_data.image_count) >= 1)
				//
				&& !((left = image_list.length) >= 1)) {
					if (!_this.need_create_ebook
					// 雖然是漫畫，但是本章節沒有獲取到任何圖片。
					&& (!chapter_data || !chapter_data.limited)) {
						library_namespace.debug(work_data.directory_name + ' #'
								+ chapter + '/' + work_data.chapter_count
								+ ': No image get.');
						set_work_status(work_data, '#' + chapter
								+ ': no image get.');
					}
					// 注意: 若是沒有reget_chapter，則preserve_chapter_page不應發生效用。
					if (work_data.reget_chapter && _this.preserve_chapter_page) {
						node_fs.writeFileSync(
						// 依然儲存cache。例如小說網站，只有章節文字內容，沒有圖檔。
						chapter_file_name, XMLHttp.buffer);
					}

					// 模擬已經下載完最後一張圖。
					left = 1;
					check_if_done();
					return;
				}
				// console.log(chapter_data);
				if (left !== image_list.length) {
					library_namespace.error('所登記的圖形數量' + left + '與有資料的圖形數量'
							+ image_list.length + '不同！');
					if (left > image_list.length) {
						left = image_list.length;
					}
				}

				// 自動填補。
				if (!chapter_data.title
						&& Array.isArray(work_data.chapter_list)
						//
						&& library_namespace
								.is_Object(work_data.chapter_list[chapter - 1])) {
					chapter_data.title = work_data.chapter_list[chapter - 1].title;
				}

				if (typeof _this.pre_get_images === 'function') {
					_this.pre_get_images(XMLHttp, work_data, chapter_data,
					// pre_get_images:function(XMLHttp,work_data,chapter_data,callback){;callback();},
					function() {
						process_images(chapter_data, XMLHttp);
					});
				} else {
					process_images(chapter_data, XMLHttp);
				}
			}

			function pre_parse_chapter_data(XMLHttp) {
				if (typeof _this.pre_parse_chapter_data === 'function') {
					_this.pre_parse_chapter_data(XMLHttp, work_data, chapter,
					// pre_parse_chapter_data:function(XMLHttp,work_data,chapter,callback){;callback();},
					function() {
						process_chapter_data(XMLHttp);
					});
				} else {
					process_chapter_data(XMLHttp);
				}
			}

			if (work_data.reget_chapter) {
				get_URL(chapter_URL, pre_parse_chapter_data, _this.charset,
						null, Object.assign({
							error_retry : _this.MAX_ERROR
						}, _this.get_URL_options));

			} else {
				// 警告: reget_chapter=false僅適用於小說之類不取得圖片的情形，
				// 因為若有圖片（parse_chapter_data()會回傳chapter_data.image_list），將把chapter_page寫入僅能從chapter_URL取得名稱的於目錄中。
				library_namespace.get_URL_cache(chapter_URL, function(data) {
					pre_parse_chapter_data({
						buffer : data,
						responseText : data && data.toString(_this.charset)
					});
				}, {
					file_name : chapter_file_name,
					encoding : undefined,
					charset : _this.charset,
					get_URL_options : _this.get_URL_options
				});
			}
		}
		get_data();

		function check_if_done() {
			--left;
			// console.log('check_if_done: left: ' + left);
			if (Array.isArray(image_list) && image_list.length > 1) {
				process.stdout.write(left + ' left...\r');
				library_namespace.debug(chapter_label + ': ' + left + ' left',
						3, 'check_if_done');
			}
			// 須注意若是最後一張圖get_images()直接 return 了，
			// 此時尚未設定 waiting，因此此處不可以 waiting 判斷！
			if (left > 0) {
				// 還有尚未取得的檔案。
				if (waiting && left < 2) {
					library_namespace.debug('Waiting for:\n'
					//
					+ image_list.filter(function(image_data) {
						return !image_data.done;
					}).map(function(image_data) {
						return image_data.url + '\n→ ' + image_data.file;
					}));
				}
				return;
			}
			// assert: left===0

			// 已下載完本chapter

			// 記錄下載錯誤的檔案。
			// TODO: add timestamp, work/chapter/NO, {Array}error code
			// TODO: 若錯誤次數少於限度，則從頭擷取work。
			if (_this.error_log_file && Array.isArray(image_list)) {
				var error_file_logs = [],
				// timestamp_prefix
				log_prefix = (new Date).format('%4Y%2m%2d') + '	';
				image_list.forEach(function(image_data, index) {
					if (image_data.has_error) {
						error_file_logs.push(log_prefix + image_data.file + '	'
								+ image_data.parsed_url);
					}
				});

				if (error_file_logs.length > 0) {
					error_file_logs.push('');
					node_fs.appendFileSync(_this.main_directory
							+ _this.error_log_file,
					// 產生錯誤紀錄檔。
					error_file_logs.join(library_namespace.env.line_separator));
					set_work_status(work_data, chapter_label + ': '
							+ error_file_logs.length + ' images download error');
				}
			}

			work_data.last_download.chapter = chapter;
			// 最後成功下載章節或者圖片日期。
			work_data.last_saved = (new Date).toISOString();
			// 紀錄已下載完之 chapter。
			save_work_data_file(work_data);
			if (++chapter > work_data.chapter_count) {
				library_namespace.log(work_data.directory_name + ': '
						+ work_data.chapter_count + ' chapters done.');
				if (typeof callback === 'function') {
					callback(work_data);
				}
				return;
			}
			_this.pre_get_chapter_data(work_data, chapter, callback);
		}
	}

	function image_path_to_url(path, server) {
		if (path.includes('://')) {
			return path;
		}

		if (!server.includes('://')) {
			// this.get_URL_options.headers.Host = server;
			server = 'http://' + server;
		}
		return server + path;
	}

	function EOI_error_path(path, XMLHttp) {
		return path.replace(/(\.[^.]*)$/, this.EOI_error_postfix
		// + (XMLHttp && XMLHttp.status ? ' ' + XMLHttp.status : '')
		+ '$1');
	}

	function get_images(image_data, callback) {
		// console.log(image_data);
		if (node_fs.existsSync(image_data.file) || this.skip_existed_bad_file
		// 檢查是否已具有server上本身就已經出錯的檔案。
		&& node_fs.existsSync(this.EOI_error_path(image_data.file))) {
			image_data.done = true;
			typeof callback === 'function' && callback();
			return;
		}

		var _this = this, url = image_data.url, server = this.server_list;
		if (server) {
			server = server[server.length * Math.random() | 0];
			url = this.image_path_to_url(url, server, image_data);
		} else {
			url = this.full_URL(url);
		}
		image_data.parsed_url = url;
		if (!PATTERN_non_CJK.test(url)) {
			library_namespace.warn('Need encodeURI: ' + url);
			// url = encodeURI(url);
		}

		if (!image_data.file_length) {
			image_data.file_length = [];
		}

		get_URL(url, function(XMLHttp) {
			// console.log(XMLHttp);
			var contents = XMLHttp.responseText,
			// 因為當前尚未能 parse 圖像，而 jpeg 檔案可能在檔案中間出現 End Of Image mark；
			// 因此當圖像檔案過小，即使偵測到以 End Of Image mark 作結，依然有壞檔疑慮。
			has_error = !contents || !(contents.length >= _this.MIN_LENGTH)
					|| (XMLHttp.status / 100 | 0) !== 2, verified_image;
			if (!has_error) {
				image_data.file_length.push(contents.length);
				var file_type = library_namespace.file_type(contents);
				verified_image = file_type && !file_type.damaged;
				if (verified_image) {
					if (!(file_type.type in _this.image_types)) {
						library_namespace.warn('The file type ['
								+ file_type.type + '] is not image!\n'
								+ image_data.file);
					}
					if (!image_data.file.endsWith('.' + file_type.extension)) {
						// 依照所驗證的檔案格式改變副檔名。
						// e.g. .png
						image_data.file = image_data.file.replace(/[^.]+$/,
								file_type.extension);
					}
				}
			}
			// verified_image===true 則必然(!!has_error===false)
			// has_error表示下載過程發生錯誤，光是檔案損毀，不會被當作has_error!
			// has_error則必然(!!verified_image===false)

			if (false) {
				console.log(_this.skip_error + ',' + _this.MAX_ERROR + ','
						+ has_error);
				console.log('error count: ' + image_data.error_count);
			}
			if (verified_image || _this.skip_error
			// 有出問題的話，最起碼都需retry足夠次數。
			&& image_data.error_count === _this.MAX_ERROR
			//
			|| _this.allow_EOI_error
			//
			&& image_data.file_length.length > _this.MAX_EOI_ERROR) {
				// console.log(image_data.file_length);
				if (verified_image || _this.skip_error
				// skip error 的話，就算沒有取得過檔案(如404圖像不存在)，依然 pass。
				&& image_data.file_length.length === 0
				//
				|| image_data.file_length.cardinal_1()
				// ↑ 若是每次都得到相同的檔案長度，那就當作來源檔案本來就有問題。
				&& (_this.skip_error || _this.allow_EOI_error
				//
				&& image_data.file_length.length > _this.MAX_EOI_ERROR)) {
					// pass, 過關了。
					var bad_file_path = _this.EOI_error_path(image_data.file,
							XMLHttp);
					if (has_error || verified_image === false) {
						image_data.file = bad_file_path;
						image_data.has_error = true;
						library_namespace.warn('Force saving '
								+ (has_error ? (contents ? 'bad' : 'empty')
										+ ' file (as image)'
								// assert: (!!verified_image===false)
								// 圖檔損壞: e.g., Do not has EOI
								: 'bad image')
								+ (XMLHttp.status ? ' (status '
										+ XMLHttp.status + ')' : '')
								+ (contents ? ' ' + contents.length + ' bytes'
										: '') + ': ' + image_data.file + '\n← '
								+ url);
						if (!contents
						// 404之類，就算有內容，也不過是錯誤訊息頁面。
						|| (XMLHttp.status / 100 | 0) === 4) {
							contents = '';
						}
					} else if (node_fs.existsSync(bad_file_path)) {
						library_namespace.info('刪除損壞的舊檔：' + bad_file_path);
						library_namespace.fs_remove(bad_file_path);
					}

					var old_file_status;
					try {
						old_file_status = node_fs.statSync(image_data.file);
					} catch (e) {
						// old/bad file not exist
					}
					if (!old_file_status
					// 得到更大的檔案，寫入更大的檔案。
					|| old_file_status.size < contents.length) {
						node_fs.writeFileSync(image_data.file, contents);
					} else if (old_file_status
							&& old_file_status.size > contents.length) {
						library_namespace.log('存在較大的舊檔 ('
								+ old_file_status.size + '>' + contents.length
								+ ')，將不覆蓋：' + image_data.file);
					}
					image_data.done = true;
					typeof callback === 'function' && callback();
					return;
				}
			}

			// 有錯誤。下載錯誤時報錯。
			library_namespace.error(
			//
			(verified_image === false ? 'Do not has EOI: '
			//
			: (XMLHttp.status ? XMLHttp.status + ' ' : '')
			//
			+ '(' + (!contents ? 'No contents' : contents.length + ' B'
			//
			+ (contents.length >= _this.MIN_LENGTH ? '' : ', too small'))
			//
			+ '): Failed to get ') + url + '\n→ ' + image_data.file);
			if (image_data.error_count === _this.MAX_ERROR) {
				image_data.has_error = true;
				// throw new Error(_this.MESSAGE_RE_DOWNLOAD);
				library_namespace.log(_this.MESSAGE_RE_DOWNLOAD);
				// console.log('error count: ' + image_data.error_count);
				if (!_this.skip_error) {
					library_namespace
							.info('若錯誤持續發生，您可以設定 .skip_error=true 來忽略圖像錯誤。');
				}
				if (contents && contents.length < _this.MIN_LENGTH
				// 檔案有驗證過，只是太小時，應該不是 false。
				&& verified_image !== false) {
					library_namespace.warn('或許圖像是完整的，只是過小而未達標，例如幾乎為空白之圖像。'
							+ '您可先設定 .skip_error=true 來忽略圖像錯誤，'
							+ '待取得檔案後，自行更改檔名，去掉錯誤檔名後綴'
							+ JSON.stringify(_this.EOI_error_postfix)
							+ '以跳過此錯誤。');
				}
				process.exit(1);
			}

			image_data.error_count = (image_data.error_count | 0) + 1;
			library_namespace.log('get_images: Retry ' + image_data.error_count
					+ '/' + _this.MAX_ERROR + '...');
			_this.get_images(image_data, callback);

		}, 'binary', null, this.get_URL_options);
	}

	// --------------------------------------------------------------------------------------------
	// 本段功能須配合 CeL.application.storage.EPUB 並且做好事前設定。
	// 可參照 https://github.com/kanasimi/work_crawler

	function create_ebook(work_data) {
		if (!this.site_id) {
			this.site_id = this.id;
		}

		if (!library_namespace.is_Date(work_data.last_update_Date)
				&& work_data.last_update) {
			var last_update_Date = work_data.last_update;
			// assert: typeof last_update_Date === 'string'
			last_update_Date = last_update_Date.to_Date({
				zone : work_data.time_zone
			});
			// 注意：不使用 cache。
			work_data.last_update_Date = last_update_Date;
		}

		// CeL.application.storage.EPUB
		var ebook = new library_namespace.EPUB(work_data.directory
				+ work_data.directory_name, {
			rebuild : this.hasOwnProperty('rebuild_ebook')
			// rebuild: 重新創建, 不使用舊的.opf資料. start over, re-create
			? work_data.rebuild_ebook : work_data.reget_chapter
					|| work_data.regenerate,
			id_type : this.site_id,
			// 以下為 epub <metadata> 必備之元素。
			// 小説ID
			identifier : work_data.id,
			title : work_data.title,
			language : work_data.language || this.language,
			// 作品內容最後編輯時間。
			modified : work_data.last_update_Date
		});

		ebook.time_zone = work_data.time_zone || this.time_zone;

		// http://www.idpf.org/epub/31/spec/epub-packages.html#sec-opf-dcmes-optional
		ebook.set({
			// 作者名
			creator : work_data.author,
			// 🏷標籤, ジャンル, タグ, キーワード
			subject : work_data.genre || work_data.status,
			// あらすじ
			description : get_label(work_data.description
			// .description 中不可存在 tag。
			.replace(/\n*<br[^<>]+>\n*/ig, '\n')),
			publisher : work_data.site_name + ' (' + this.base_URL + ')',
			// source URL
			source : work_data.url
		});

		if (work_data.image) {
			ebook.set_cover(work_data.image);
		}

		return work_data[this.KEY_EBOOK] = ebook;
	}

	function add_ebook_chapter(work_data, chapter, data) {
		var ebook = work_data && work_data[this.KEY_EBOOK];
		if (!ebook) {
			return;
		}

		if (('title' in data) && !('sub_title' in data)) {
			// throw '請將 parse_chapter_data() 中章節名稱設定在 sub_title 而非 title!';
			// 當僅設定title時，將之當做章節名稱而非part名稱。
			data.sub_title = data.title;
			delete data.title;
		}

		if (Array.isArray(data.title)) {
			data.title = data.title.join(' - ');
		}
		// assert: !data.title || typeof data.title === 'string'

		var file_title = chapter.pad(3) + ' '
				+ (data.title ? data.title + ' - ' : '')
				+ (data.sub_title || ''),
		//
		item = ebook.add({
			title : file_title,
			// include images / 自動載入內含資源, 將外部media內部化
			internalize_media : true,
			file : library_namespace.to_file_name(file_title + '.xhtml'),
			// 警告：必須設定 work_data.chapter_list。
			date : work_data.chapter_list[chapter - 1].date
		}, {
			// part_title
			title : get_label(data.title || ''),
			// chapter_title
			sub_title : get_label(data.sub_title || ''),
			text : data.text,
			post_processor : this.contents_post_processor
		});

		return item;
	}

	var PATTERN_epub_file = /^\(一般小説\) \[([^\[\]]+)\] ([^\[\]]+) \[(.*?) (\d{8})(?: (\d{1,4})話)?\]\.(.+)\.epub$/i;
	function parse_epub_name(file_name) {
		var matched = file_name.match(PATTERN_epub_file);
		if (matched) {
			return {
				file_name : file_name,
				author : matched[1],
				title : matched[2],
				// titles : matched[2].trim().split(' - '),
				site_name : matched[3],
				// e.g., "20170101"
				date : matched[4],
				chapter_count : matched[5],
				// book id in this site
				id : matched[6]
			};
		}
	}

	function get_file_status(file_name, directory) {
		var status = node_fs.lstatSync((directory || '') + file_name);
		status.name = file_name;
		return status;
	}

	// remove duplicate title ebooks.
	// 封存舊的ebooks，移除較小的舊檔案。
	function remove_old_ebooks(only_id) {
		var _only_id;
		if (only_id && (_only_id = parse_epub_name(only_id))) {
			only_id = _only_id.id;
		}

		var _this = this;

		if (!this.ebook_archive_directory) {
			this.ebook_archive_directory = this.main_directory
					+ this.archive_directory_name;
			if (!library_namespace
					.directory_exists(this.ebook_archive_directory)) {
				library_namespace.create_directory(
				// 先創建封存用目錄。
				this.ebook_archive_directory);
			}
		}

		function for_each_old_ebook(directory, for_old_smaller, for_else_old) {
			var last_id, last_file,
			//
			ebooks = library_namespace.read_directory(directory);

			if (!ebooks) {
				// 照理來說應該在之前已經創建出來了。
				library_namespace.warn('不存在封存檔案用的目錄: '
						+ _this.ebook_archive_directory);
				return;
			}

			ebooks
			// assert: 依id舊至新排列
			.sort().map(parse_epub_name)
			//
			.forEach(function(data) {
				if (!data
				// 僅針對 only_id。
				|| only_id && data.id !== only_id) {
					return;
				}
				if (!last_id || last_id !== data.id) {
					last_id = data.id;
					last_file = data.file_name;
					return;
				}

				var this_file = get_file_status(
				//
				data.file_name, directory);
				if (typeof last_file === 'string') {
					last_file = get_file_status(
					//
					last_file, directory);
				}
				// assert: this_file, last_file are all {Object}(file status)

				if (this_file.size >= last_file.size) {
					for_old_smaller(last_file, this_file);
				} else if (for_else_old) {
					for_else_old(last_file, this_file);
				}

				last_file = this_file;
			});
		}

		// 封存較小的ebooks舊檔案。
		for_each_old_ebook(this.main_directory, function(last_file) {
			last_file = last_file.name;
			library_namespace.log(_this.main_directory + last_file
			// 新檔比較大。刪舊檔或將之移至archive。
			+ '\n→ ' + _this.ebook_archive_directory + last_file);
			library_namespace.move_file(
			//
			_this.main_directory + last_file,
			//
			_this.ebook_archive_directory + last_file);

		}, this.milestone_extension && function(last_file) {
			last_file = _this.main_directory + last_file.name;
			var extension = (typeof _this.milestone_extension === 'string'
			// allow .milestone_extension = true
			? _this.milestone_extension : '.milestone') + '$1';
			library_namespace.log(last_file
			// 舊檔比較大!!將之標註成里程碑紀念/紀錄。
			+ '\n→ ' + last_file.replace(/(.[a-z\d\-]+)$/i, extension));
			library_namespace.move_file(last_file,
			//
			+last_file.replace(/(.[a-z\d\-]+)$/i, extension));
		});

		// ✘ 移除.ebook_archive_directory中，較小的ebooks舊檔案。
		// 僅留存最新的一個ebooks舊檔案。
		for_each_old_ebook(this.ebook_archive_directory, function(last_file,
				this_file) {
			library_namespace.info('remove_old_ebooks: '
			// 新檔比較大。刪舊檔。
			+ _this.ebook_archive_directory + last_file.name + ' ('
			// https://en.wikipedia.org/wiki/Religious_and_political_symbols_in_Unicode
			+ this_file.size + ' = ' + last_file.size + '+'
			// ✞ Memorial cross, Celtic cross
			+ (this_file.size - last_file.size) + ')');
			library_namespace.remove_file(
			//
			_this.ebook_archive_directory + last_file.name);
		});
	}

	function pack_ebook(work_data, file_name) {
		// remove_old_ebooks.call(this);

		var ebook = work_data && work_data[this.KEY_EBOOK];
		if (!ebook) {
			return;
		}

		process.title = '打包 epub: ' + work_data.title + ' @ ' + this.id;
		if (!file_name) {
			file_name =
			// e.g., "(一般小説) [author] title [site 20170101 1話].id.epub"
			[ '(一般小説) [', work_data.author, '] ', work_data.title, ' [',
					work_data.site_name, ' ',
					work_data.last_update_Date.format('%Y%2m%2d'),
					work_data.chapter_count >= 1
					//
					? ' ' + work_data.chapter_count + '話' : '', '].',
					work_data.id, '.epub' ].join('');
			// assert: PATTERN_epub_file.test(file_name) === true
		}
		file_name = library_namespace.to_file_name(file_name);
		// https://github.com/ObjSal/p7zip/blob/master/GUI/Lang/ja.txt
		library_namespace.debug('打包 epub: ' + file_name);

		// this: this_site
		ebook.pack([ this.main_directory, file_name ],
				this.remove_ebook_directory);

		remove_old_ebooks.call(this, file_name);
	}

	// --------------------------------------------------------------------------------------------

	// export 導出.

	return Work_crawler;
}
