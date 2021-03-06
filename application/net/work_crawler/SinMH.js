﻿/**
 * @name CeL function for downloading SinMH comics.
 * 
 * @fileoverview 本檔案包含了解析並處理、批量下載中國大陸常見漫畫管理系統: 圣樱漫画管理系统 (圣樱CMS) MHD模板 的工具。
 * 
 * <code>

 CeL.SinMH(configuration).start(work_id);

 </code>
 * 
 * @see https://cms.shenl.com/sinmh/
 * 
 * @since 2018/7/26 11:9:53 模組化。
 */

// More examples:
// @see
// https://github.com/kanasimi/work_crawler/blob/master/comic.cmn-Hans-CN/gufengmh.js
// https://github.com/kanasimi/work_crawler/blob/master/comic.cmn-Hans-CN/36mh.js
'use strict';

// --------------------------------------------------------------------------------------------

// 不採用 if 陳述式，可以避免 Eclipse JSDoc 與 format 多縮排一層。
typeof CeL === 'function' && CeL.run({
	// module name
	name : 'application.net.work_crawler.SinMH',

	require : 'application.net.work_crawler.'
	// for CeL.to_file_name()
	+ '|application.net.'
	// for .detect_HTML_language(), .time_zone_of_language()
	+ '|application.locale.',

	// 設定不匯出的子函式。
	no_extend : '*',

	// 為了方便格式化程式碼，因此將 module 函式主體另外抽出。
	code : module_code
});

function module_code(library_namespace) {

	// requiring

	// --------------------------------------------------------------------------------------------

	var default_configuration = {

		// 嘗試取得被屏蔽的作品。
		// 對於被屏蔽的作品，將會每次都從頭檢查。
		try_to_get_blocked_work : true,

		// allow .jpg without EOI mark.
		// allow_EOI_error : true,
		// 當圖像檔案過小，或是被偵測出非圖像(如不具有EOI)時，依舊強制儲存檔案。
		// skip_error : true,

		// 提取出引數（如 URL）中的作品ID 以回傳。
		extract_work_id : function(work_information) {
			// e.g,
			// https://www.36mh.com/manhua/IDOLiSH7ouxiangxingyuanxiangliuxingxuyuan/
			return /^[a-z\d]+$/i.test(work_information) && work_information;
		},

		// 取得伺服器列表。
		// use_server_cache : true,
		server_URL : 'js/config.js',
		parse_server_list : function(html) {
			var server_list = [], SinConf;
			html = html.replace('var ', '').replace(/(}\(\))[\s\S]*/, '$1');
			eval(html);
			SinConf.resHost.map(function(data) {
				server_list.append(data.domain.map(function(host) {
					return host.endsWith('/') ? host : host + '/';
				}));
			});
			server_list = server_list.unique();
			server_list.conf = SinConf;
			// console.log(SinConf);
			return server_list;
		},

		// 解析 作品名稱 → 作品id get_work()
		// 1. 使用網頁取得搜尋所得的作品資料。 (default)
		search_URL : 'search/?keywords=',
		// 2. 使用API取得搜尋所得的作品資料。 (set search_URL:'API')
		search_URL_API : function(work_title) {
			// SinConf.apiHost
			var apiHost = this.base_URL.replace(/\/\/[a-z]+/, '//api');
			return [ apiHost + 'comic/search', {
				keywords : work_title
			} ];
		},
		parse_search_result : function(html, get_label) {
			if (html.startsWith('{')) {
				// 2. 使用API取得搜尋所得的作品資料。
				// this.id_of_search_result='slug';
				this.title_of_search_result = 'title';
				/**
				 * e.g.,<code>
				{"items":[{"id":3542,"status":1,"commend":0,"is_original":0,"is_vip":0,"name":"军阀霸宠：纯情妖女火辣辣","title":"民国妖闻录","alias":"","original_name":"","letter":"j","slug":"junfabachongchunqingyaonuhuolala","coverUrl":"http://res.gufengmh.com/images/cover/201711/1509877682Xreq-5mrrSsDm82P.jpg","uri":"/manhua/junfabachongchunqingyaonuhuolala/","last_chapter_name":"040：纯良少年的堕落","last_chapter_id":235075,"author":"逐浪动漫","author_id":3901,"serialise":1}],"_links":{"self":{"href":"http://api.gufengmh.com/comic/search?page=1"}},"_meta":{"totalCount":1,"pageCount":1,"currentPage":1,"perPage":20},"status":0}
				 </code>
				 */
				var id_data = html ? JSON.parse(html) : [];
				return [ id_data.items.map(function(data) {
					return data.slug;
				}), id_data.items ];
			}

			// 1. 使用網頁取得搜尋所得的作品資料。
			html = html.between('<h4 class="fl">');
			var id_list = [], id_data = [], matched,
			//
			PATTERN_search = /<p class="ell"><a href="([^<>"]+)">([^<>]+)/g;

			while (matched = PATTERN_search.exec(html)) {
				matched[1] = matched[1].match(/([^\/]+)\/$/);
				id_list.push(matched[1][1]);
				id_data.push(get_label(matched[2]));
			}

			return [ id_list, id_data ];
		},

		// 取得作品的章節資料。 get_work_data()
		work_URL : function(work_id) {
			return 'manhua/' + work_id + '/';
		},
		parse_work_data : function(html, get_label, extract_work_data) {
			var work_data = {
				// 必要屬性：須配合網站平台更改。
				title : get_label(html.between('<h1>', '</h1>')),

				// 選擇性屬性：須配合網站平台更改。
				description : get_label(html.between('intro-all', '</div>')
						.between('>'))
			}, data = html.between('detail-list', '</ul>');
			extract_work_data(work_data, data,
			// e.g., "<strong>漫画别名：</strong>暂无</span>"
			/<strong[^<>]*>([^<>]+)<\/strong>([\s\S]+?)<\/li>/g);

			Object.assign(work_data, {
				author : work_data.漫画作者,
				status : work_data.漫画状态,
				last_update : work_data.更新时间
			});
			// console.log(work_data);
			return work_data;
		},
		get_chapter_list : function(work_data, html, get_label) {
			var chapter_block, chapter_list = [], PATTERN_chapter_block =
			//
			/class="chapter-body[^<>]+>([\s\S]+?)<\/div>/g;
			while (chapter_block = PATTERN_chapter_block.exec(html)) {
				chapter_block = chapter_block[1];
				var link, PATTERN_chapter_link =
				//
				/<a href="([^<>"]+)"[^<>]*>([\s\S]+?)<\/a>/g;
				while (link = PATTERN_chapter_link.exec(chapter_block)) {
					if (link[1].startsWith('javascript:')) {
						// 本站应《 》版权方要求现已屏蔽删除本漫画所有章节链接，只保留作品文字信息简介以及章节目录
						continue;
					}
					var chapter_data = {
						url : link[1],
						title : get_label(link[2])
					};
					chapter_list.push(chapter_data);
				}
			}
			// console.log(chapter_list);
			var text;
			if (chapter_list.length === 0
			// 已屏蔽删除本漫画所有章节链接
			&& (text = html.between('class="ip-body">', '</div>'))) {
				work_data.filtered = true;
				var chapter_id = html.between('href="/comic/read/?id=', '"')
						|| html.between('SinMH.initComic(', ')')
						|| html.between('SinTheme.initComic(', ')')
						|| html.between('var pageId = "comic.', '"');
				if (this.try_to_get_blocked_work && chapter_id) {
					// 嘗試取得被屏蔽的作品。
					// e.g., 全职法师
					chapter_list.push({
						url : '/comic/read/?id=' + chapter_id
					});
				} else {
					library_namespace.warn(get_label(text));
				}
			}
			work_data.chapter_list = chapter_list;
		},

		pre_parse_chapter_data
		// 執行在解析章節資料 process_chapter_data() 之前的作業 (async)。
		// 必須自行保證執行 callback()，不丟出異常、中斷。
		: function(XMLHttp, work_data, callback, chapter_NO) {
			if (work_data.filtered && chapter_NO === 1) {
				var html = XMLHttp.responseText, first_chapter_id = html
						.between('SinMH.initChapter(', ',')
						|| html.between('SinTheme.initChapter(', ',');
				if (first_chapter_id) {
					library_namespace.debug('add first chapter: '
							+ first_chapter_id);
					var url = this.work_URL(work_data.id) + first_chapter_id
							+ '.html';
					work_data.chapter_list[chapter_NO - 1].url = url;
					library_namespace.get_URL(this.full_URL(url), callback,
							this.charset, null,
							//
							Object.assign({
								error_retry : this.MAX_ERROR_RETRY,
								no_warning : true
							}, this.get_URL_options));
					return;
				}
			}
			callback();
		},

		// 取得每一個章節的各個影像內容資料。 get_chapter_data()
		parse_chapter_data : function(html, work_data, get_label, chapter_NO) {
			if (work_data.filtered && !work_data.chapter_filtered) {
				var next_chapter_data = html.between('nextChapterData =', ';');
				// console.log(next_chapter_data || html);
				if ((next_chapter_data = JSON.parse(next_chapter_data))
						&& next_chapter_data.id > 0) {
					library_namespace.debug('add chapter: '
							+ next_chapter_data.id);
					next_chapter_data.url = this.work_URL(work_data.id)
							+ next_chapter_data.id + '.html';
					// 動態增加章節。
					work_data.chapter_count++;
					work_data.chapter_list.push(next_chapter_data);
				} else {
					// console.log(html);
				}
			}

			var chapter_data = library_namespace.null_Object();
			// 2018/3 古风漫画网改版。
			html = html.between('<script>;phone.') || html;
			eval(html.between('<script>', '</script>').replace(/;var /g,
					';chapter_data.'));
			if (!chapter_data) {
				library_namespace.warn(work_data.title + ' #' + chapter_NO
						+ ': No valid chapter data got!');
				return;
			}

			// 設定必要的屬性。
			chapter_data.title = get_label(html.between('<h2>', '</h2>'));
			// e.g., 'images/comic/4/7592/'
			var path = encodeURI(chapter_data.chapterPath);
			chapter_data.image_list = chapter_data.chapterImages.map(function(
					url) {
				return {
					// e.g., 外挂仙尊 184 第76话
					// 但是這還是沒辦法取得圖片...
					url : /^https?:\/\//.test(url) ? url : path + url
				}
			});

			if (chapter_data.image_list.length === 0
					&& (html = html.between('class="ip-notice">', '<'))) {
				// 避免若連內容被屏蔽，會從頭檢查到尾都沒有成果。
				work_data.chapter_filtered = true;
				if (work_data.filtered) {
					library_namespace.info('因為本章節內容也被屏蔽，因此不再嘗試解析其他章節。');
				} else {
					library_namespace.warn(get_label(html));
				}
			}

			return chapter_data;
		}

	};

	// --------------------------------------------------------------------------------------------

	function new_SinMH_comics_crawler(configuration) {
		configuration = configuration ? Object.assign(library_namespace
				.null_Object(), default_configuration, configuration)
				: default_configuration;

		if (configuration.search_URL === 'API') {
			configuration.search_URL = default_configuration.search_URL_API;
		}

		// 每次呼叫皆創建一個新的實體。
		return new library_namespace.work_crawler(configuration);
	}

	return new_SinMH_comics_crawler;
}
