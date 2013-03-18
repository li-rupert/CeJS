/**
 * @name CeL function for era calendar.
 * @fileoverview 本檔案包含了東亞傳統曆法/中國傳統曆法/曆書/歷譜，農曆、夏曆、陰曆，中西曆轉換的功能。<br />
 *               用意不在推導曆法，而在對過去時間作正確轉換。因此不作繁複計算。
 * 
 * @since 2013/2/13 12:45:44
 * 
 * TODO:<br />
 * 天象計算功能<br />
 * http://www.chris.obyrne.com/Eclipses/calculator.html<br />
 * http://www.chinesefortunecalendar.com/CLC/clcBig5.htm<br />
 * http://www.nongli.com/item2/index.html<br />
 * http://bbs.nongli.net/dispbbs_2_14995.html<br />
 * http://zh.wikipedia.org/wiki/%E6%9C%88#.E6.9C.88.E7.9A.84.E9.95.B7.E5.BA.A6<br />
 * <br />
 * http://www.cfarmcale2100.com.tw/<br />
 * 
 * 未來發展：<br />
 * 加入世界各國的對應機能。<br />
 * 與歷史事件結合，能夠直觀的藉點取時間軸，即獲得當時世界上所有已知發生之事件以及出處依據（參考文獻來源、出典考據）、註解。
 * 
 * 歷代帝王/年號紀年 → 公元紀年:<br />
 * http://sinocal.sinica.edu.tw/<br />
 * http://authority.ddbc.edu.tw/time/index.php<br />
 * http://140.112.30.230/datemap/index.php<br />
 * http://www.chinese-artists.net/year/<br />
 * http://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E5%B9%B4%E5%8F%B7%E7%B4%A2%E5%BC%95<br />
 * http://chowkafat.net/Hisnote.html#Reigntitle<br />
 * http://homepage1.nifty.com/history/history/list.htm<br />
 * http://www.fanren8.com/read-htm-tid-1798.html<br />
 * 
 * @example <code>

CeL.run('data.date.era');

CeL.assert(['孺子嬰',CeL.era('初始').君主]);
CeL.assert(['孺子嬰','初始元年11月1日'.to_Date('era').君主]);
CeL.assert(['庚辰年庚辰月庚辰日庚辰時','一八八〇年四月二十一日七時'.to_Date('era').format({format:'%歲次年%月干支月%日干支日%時干支時',locale:'cmn-Hant-TW'})]);
CeL.assert(['清德宗光緒六年三月十三日',CeL.to_Chinese_numeral('一八八〇年四月二十一日七時'.to_Date('era').format({format:'%朝代%君主%紀年%年年%月月%日日',locale:'cmn-Hant-TW'}))]);
CeL.assert(['1628年3月1日','明思宗崇禎1年1月26日'.to_Date('era').format('%Y年%m月%d日')]);
CeL.assert(['1628年3月1日','天聰二年甲寅月戊子日'.to_Date('era').format('%Y年%m月%d日')]);
CeL.assert(['1628年3月1日','天聰2年寅月戊子日'.to_Date('era').format('%Y年%m月%d日')]);
CeL.assert(['1880年4月21日','清德宗光緒六年三月十三日'.to_Date('era').format('%Y年%m月%d日')]);
CeL.assert(['1880年4月21日','清德宗光緒庚辰年三月十三日'.to_Date('era').format('%Y年%m月%d日')]);
CeL.assert(['1880年4月21日','清德宗光緒庚辰年庚辰月庚辰日'.to_Date('era').format('%Y年%m月%d日')]);
CeL.assert(['庚辰年庚辰月庚辰日','清德宗光緒六年三月十三日'.to_Date('era').format({format:'%歲次年%月干支月%日干支日',locale:'cmn-Hant-TW'})]);
CeL.assert(['庚辰年庚辰月庚辰日庚辰時','一八八〇年庚辰月庚辰日7時'.to_Date('era').format({format:'%歲次年%月干支月%日干支日%時干支時',locale:'cmn-Hant-TW'})]);
CeL.assert(['庚辰年庚辰月庚辰日庚辰時','一八八〇年庚辰月庚辰日庚辰時'.to_Date('era').format({format:'%歲次年%月干支月%日干支日%時干支時',locale:'cmn-Hant-TW'})]);
CeL.assert(['清德宗光緒六年三月十三日',CeL.to_Chinese_numeral('一八八〇年庚辰月庚辰日庚辰時'.to_Date('era').format({format:'%朝代%君主%紀年%年年%月月%日日',locale:'cmn-Hant-TW'}))]);
CeL.assert(['庚辰年庚辰月庚辰日庚辰時','西元一八八〇年四月二十一日七時'.to_Date('era').format({format:'%歲次年%月干支月%日干支日%時干支時',locale:'cmn-Hant-TW'})]);
CeL.assert(['庚辰年庚辰月庚辰日庚辰時','清德宗光緒六年三月十三日辰正一刻'.to_Date('era').format({format:'%歲次年%月干支月%日干支日%時干支時',locale:'cmn-Hant-TW'})]);
CeL.assert(['252年5月26日','魏少帝嘉平4年5月1日'.to_Date('era').format('%Y年%m月%d日')]);
CeL.assert(['252年6月24日','魏少帝嘉平4年閏5月1日'.to_Date('era').format('%Y年%m月%d日')]);
CeL.assert(['252年6月24日','魏少帝嘉平4年閏月1日'.to_Date('era').format('%Y年%m月%d日')]);



CeL.era('1628年3月1日').共存紀年;
//["中國清太宗天聰2年1月26日", "中國明思宗崇禎1年1月26日"]


// should be error: 清任一紀年無一八八〇年。
'清一八八〇年四月二十一日七時'.to_Date('era').format({format:'%歲次年%月干支月%日干支日%時干支時',locale:'cmn-Hant-TW'})
// should be error
'元一八八〇年四月二十一日七時'.to_Date('era').format({format:'%歲次年%月干支月%日干支日%時干支時',locale:'cmn-Hant-TW'})


TODO:
重構。


CeL.era('庚辰年庚辰月庚辰日庚辰時',{base:'1850年'}) → 1880年4月21日7時
CeL.era('1329年9月1日') → [ {'元文宗天曆2年8月8日'} ]
CeL.era('元文宗天曆2年8月8日') → '1329年9月1日'





75/748: 75 魏-明帝-景初
中曆239年 (魏明帝景初3年　歲次：戊午　生肖：馬　西元239年1月22日(星期二)起
蜀後主延熙元年11月30日起　吳大帝赤烏元年12月1日起) 12月 (index 11): 不同的日數!
	青龍五年三月改元並改用景初歷，以建丑之月為正月。因此青龍五年三月則成為景初元年四月。
	復用夏正詔（《魏志‧齊王芳紀》，又見《冊府元龜》四）
	魏少帝十二月，詔曰：「烈祖明皇帝以正月棄背天下，臣子永惟忌日之哀，其復用夏正；雖違先帝通三統之義，斯亦禮制所由變改也。又夏正於數為得天正，其以建寅之月為正始元年正月，以建丑月為後十二月。」


293/738: 293 北魏-孝武帝-永興
[☠][9.517s] 無法判別 [北魏孝武帝永興年間|北魏孝武帝永興年間] 之結束日期!
	永興（532年十二月）是北魏孝武帝元修的第二個年號，歷時未及一個月。
	魏書/卷11 十有二月..丁亥，殺大司馬、汝南王悅。大赦天下，改太昌為永興，以太宗號，尋改為永熙元年。 二年春正月庚寅朔，朝饗群臣於太極前殿。

385/748: 385 唐-武后-久視
中曆700年 (唐武后久視元年　歲次：庚子　生肖：鼠　西元700年5月23日(星期日)起) 11月 (index 11): 不同的日數!
	資治通鑑/卷207
	甲寅，制復以正月為十一月，一月為正月，赦天下。
	西元705年2月9日映對到中曆，結果是「唐武后長安5年(武后神龍元年 中宗神龍元年)(歲次乙巳)1月11日」。


402/748: 402 唐-肅宗
[☠][1.34s] 已設定過 [唐肅宗*年間|唐肅宗*年間]，但並非上一筆: 224/270!
[☠][0] 上一筆已設定過紀年 [天寶]!


406/748: 406 唐-肅宗-*
[☠][304] 已設定過 [唐肅宗*年間|唐肅宗*年間]，但並非上一筆: 224/273!
[☠][0] 上一筆已設定過紀年 [上元]!


566/748: 566 遼-太祖
[☠][6.264s] 上一筆未設定過君主!

[☺]567/748: 567 遼-太祖-*
[☠][71] 上一筆未設定過君主!


658/738: 658 元-文宗-天曆
[☠][190] 已設定過 [元文宗天曆年間|元文宗天曆年間]，但並非上一筆，而是在第443筆! (當前為第445筆)
[☠][1] 上一筆已設定過紀年 [天曆]!


明光宗泰昌
	泰昌（1620年八月-十二月）為中國明朝第十四個皇帝明光宗朱常洛的年號，由於明光宗在位僅一個月，故泰昌這個年號僅用了不足一年。實際上，直到九月二十日熹宗下《泰昌元年、<大統歷>敕諭》時，方開始使用[1]。
	《大明泰昌元年大統歷》考
	泰昌元年十一月月建為辛丑


清穆宗祺祥（1861年七月－十二月）
	1861年8月22日，咸豐帝（清文宗）在熱河承德去世，兒子載淳在以肅順為首的8位顧命大臣的輔佐下登基，9月3日改元祺祥。11月2日辛酉政變發生，八大臣被慈禧一派奪權。朝廷在11月7日下詔翌年改年號為同治，棄祺祥。
	清史稿穆宗本紀一.乙卯，定年號祺祥。..庚申，詔改祺祥為同治。..甲子，上御太和殿即皇帝位，受朝。頒詔天下，以明年為同治元年




天曆（元年：1328年九月 - 末年：1330年五月）是元朝時元文宗圖帖睦爾的年號，該年號在元明宗(1329年)時被重複使用[1,2]，共計3年。



pack_era: 紀年 [/寧宗/至順] 年分並未按照順序：2 → 4
[⚠][0] pack_era: 無法壓縮紀年 [/寧宗/至順] 2年資料 [29;30;29;閏3=29;30;29;30;30;30;29]





// 廢棄:

// 查找：某 era name → era data:
// 1st: [朝代 or 朝代兼紀年] from dynasty{*}
// 2ed: [朝代:君主(帝王) list] from dynasty{朝代:{*}}
// 3ed: [朝代君主(帝王):紀年 list] from dynasty{朝代:{君主(帝王):[]}}

// 查找：某日期 → era data:
// 1. get start date: 定 era_start_UTC 所有 day 或之前的 index。
// 2. get end date, refrence:
// 遍歷 era_end_UTC，處理所有（結束）日期於 day 之後的，即所有包含此日期的 data。


 </code>
 */

'use strict';

if (typeof CeL === 'function')
	CeL.run({
		name : 'data.date.era',
		// data.code.compatibility. : for String.prototype.repeat(),
		// String.prototype.trim()
		// data.native. : for Array.prototype.search_sorted()
		// data.date. : 干支
		// application.locale. : 中文數字
		require : 'data.date.String_to_Date|data.native.|application.locale.',

		code : function(library_namespace) {

			// requiring
			var String_to_Date;
			eval(this.use());

			// ---------------------------------------------------------------------//
			// example.

			if (false) {
				parse_era([
						// ------------------------
						// 精確指定。
						'朝代/君主(帝王)/紀年名稱|[parser:]標準時間(如UTC+8) 起訖時間'
								+ '|曆數(月分資料)[|其他附加屬性名稱=值|..]',
						// e.g.,
						'西漢/平帝/元始|1/2/11~6/2/16',

						// inherited 繼承
						'/君主(帝王)/紀年|起訖時間',
						// e.g.,
						'/孺子嬰/居攝|~8/12/16',

						// inherited 繼承
						'/紀年|起訖時間',
						// e.g.,
						'/初始|~9/1/14',

						// ------------------------
						// 精確指定。
						'朝代/君主(帝王)|起訖時間',
						// inherited 繼承
						'/君主(帝王)|起訖時間',

						// ------------------------
						// 精確指定。
						'朝代兼紀年|起訖時間' ]);

				// ------------------------

				// parser:
				// (省略) : 預設為 CE。

				// ------------------------

				// 起訖時間: [起時間][訖時間]

				// 起時間:
				// "y/m/d" : start date
				// "y/m/干支" : start date
				// (省略) : 接續上一筆紀年，從上一筆紀年的下一日/下一秒起

				// 訖時間:
				// "~y/m/d" : 指定 end date
				// "~m/d" : 指定 end date
				// "~" : 省略後續 end date，持續至下一筆紀年或持續至今
				// "+d" : 持續日數

				// ------------------------

				// 曆數(月分資料): 藉此可農曆 → 公元紀年。
				// 年與年以 pack_era.year_separator 分隔。
				// 月與月以 pack_era.month_separator 分隔。
				// 當曆法接著將起始的年名/月名/起始日碼=當月之日數 data;
				'2/1/2=29;30;29';
				// 月名=日數 data; : 月名/1日起始
				'2=29;30;29;30';
				// =日數 data; : 1年/1月/1日起始
				'=29;30;29'
				// 年名/月名=日數 data; : 年名/月名/1日起始
				'2/1=30;2=29;閏2=30;3=29;'
						+ ';11=30;12=29;11=30;12=29;後12=29	1=29;';
				// /月名/起始日碼=日數 data; : 接續年名/月名/起始日碼
				'/1/2=28;30;29'
				// 日數 data; : 省略起始的年月日名，當作接續上一個紀年的月分日期。若沒有可接續者，則預設為當曆法之
				// 1/1。
				'29;30;29';

				// 編碼壓縮法:
				'1=30;2=29;閏2=30;3=29'
				//
				== '30;29;閏2=30;29'
				// 按月排，最前面加上 1 以避免 0 起頭、得處理長度不足問題。
				// 最後添上 4 閏月 index（並非月號！），1011 → [11] 為閏月。
				// 因此，長度為 13 或 14 + 4*閏月數。

				// 1 個閏月。0/1 定義見 MONTH_DAYS。
				// 30 29 30 29 → 0101
				// 閏2 @ index [2] → 0010(base 2)
				== '1 0101 0010'
				// parseInt('101010010', 2).toString(PACK_RADIX);
				== '9e';

				// 無閏月之12個月。0/1 定義見 MONTH_DAYS。
				'1101100101010'
				// parseInt('1101100101010',
				// 2).toString(PACK_RADIX);
				// 填滿至長度 4。見 YEAR_CHUNK_SIZE。
				== '5d6 ';

				// TODO: 由於農曆通常是大小月相間，應該以此壓縮。

				// ------------------------

				// 其他附加屬性名稱=值|attribute name=value
				// source=_URL_ : 依據（參考文獻來源、出典考據）。
				// note=.. : 註解。
				// URL=_URL_ : 當紀年之資料。

				// ---------------------------------------

				// 共和元年（前841年）是中國歷史上有確切紀年的開始。
				'元康元年春正月';
				'西漢平帝元始己未年九月'.to_Date({
					parser : 'Chinese'
				});
				Date_to_era({
					朝代 : '國號',
					君主 : '君主(帝王)號',
					// 共和
					紀年 : '君主(帝王)/年號/民國'
				});

				// Date.to_Chinese():
				Date.to_Chinese = {
					// 陽曆「二十四節氣」中，每月有一個節氣，一個中氣，分別發生在每月的7日和22日前後。
					節氣 : '',
					// 立春到立夏前為春季，立夏到立秋前為夏季，立秋到立冬前為秋季，立冬到立春前為冬季。
					季 : '春夏秋冬',

					// 講述東周歷史的兩部典籍《春秋》和《戰國策》都是使用帝王紀年。
					// 共伯和/周定公、召穆公
					朝代 : '國號',
					君主 : '君主(帝王)號',
					// 共和
					紀年 : '君主(帝王)/年號/民國',
					// 東漢四分曆以前，用歲星紀年和太歲紀年（歲星:木星）。到現在來用干支紀年。
					// 干支紀年萌芽於西漢，始行於王莽，通行於東漢後期。
					歲次 : '甲子',
					年 : 1,
					月 : 1,
					日 : 1,
					// 甲乙丙丁戊己庚辛壬癸
					// 子丑寅卯辰巳午未申酉戌亥
					生肖 : '',
					// http://zh.wikipedia.org/wiki/五行#五行與干支表
					陰陽五行 : '',
					閏月 : true,
					// 每年正月初一即改變干支，例如錢益謙在崇禎十五年除夕作「壬午除夕」、隔日作「癸未元日」
					// 日干支:'干支紀日',
					// 月干支:'干支紀月',
					月柱 : '歲次',
					// 把一年十二個月和天上的十二辰聯繫起來。
					月建 : '歲次',

					晝夜 : '',
					// 第一個時辰是子時，半夜十一點到一點。
					時辰 : '子丑寅卯辰巳午未申酉戌亥',
					// 一個月的第一個十天為上旬，第二個十天為中旬，餘下的天數為下旬。
					旬 : '上中下旬',
					// 晚上七點到第二天早上五點平均分為五更（合十個小時），每更合二個小時。
					更 : '',

					// 用四柱神算推算之時辰八字
					八字 : '丙戌年戊戌月壬申日乙巳時',
					夏曆 : '丙戌年八月十九日巳時',
					星座 : '',

					曆法 : '授時歷即統天歷',
					// 農民曆 : ''
					注解 : ''
				};
			}

			// ---------------------------------------------------------------------//
			// 一整天的 time 值。should be 86400000.
			var ONE_DAY_LENGTH_VALUE = new Date(0, 0, 2) - new Date(0, 0, 1),

			// 設計要求：
			// 可提供統一時間標準與各特殊紀年間的轉換。

			// 統一時間標準→各特殊紀年（西→中）：
			// 查詢某時間點（時刻）存在的所有紀年與資訊。
			// 查詢某時間點（時刻）的日期資訊，如月干支等。

			// 各特殊紀年→統一時間標準（中→西）：
			// 查詢某農曆+紀年/君主(帝王)對應的標準時間(如UTC+8)。
			// 查詢某朝代/君主(帝王)所有的紀年與資訊。

			// era data refrence 對應/sorted by start Date 標準時間(如UTC+8).
			era_list = [],

			// 搜尋時，紀年顯示方法："紀年 (朝代君主(帝王), 國家)"
			// e.g., "元始 (西漢平帝劉衍, 中國)"

			// 專門供搜尋各特殊紀年使用。
			era_search_pattern,

			search_index = {
			// 朝代、君主(帝王)、帝王紀年、年號紀年、國家 : [
			// type (-1 混合, 0 紀年, 1 君主(帝王), 2 朝代, 3 國家, 4 others),
			// 朝代, 君主(帝王), 帝王紀年, 年號紀年, 國家, 對應之 era_list index list
			// ]
			},

			// constant 常數。

			// http://zh.wikipedia.org/wiki/Talk:%E8%BE%B2%E6%9B%86
			// 將西元日時換算為夏曆日時，1929年1月1日以前，應將時間換為北京紫禁城（東經116.4度）實際時間，1929年1月1日開始，則使用東八區（東經120度）的標準時間。
			DEFAULT_TIMEZONE = String_to_Date.zone.CST,

			中氣日_days = 3,
			// 中氣發生於每月此日起 (中氣日_days - 1) 日間。
			// assert: 在整個作業年代中，此中氣日皆有效。起碼須包含 BCE 800 至今。
			中氣日 = [ 19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 20 ],

			NOT_FOUND = -1,

			// 起始年月日
			START_YEAR = 1, START_MONTH = 1, START_DATE = 1,

			// (年/月分資料=[年分各月資料/月分日數])[NAME_KEY]=[年/月分名稱]
			NAME_KEY = 'name', LEAP_MONTH_KEY = 'leap',
			// 月次，歲次
			START_KEY = 'start',
			//
			START_DATE_KEY = 'start date',

			// set normal month count of a year.
			MONTH_COUNT = 12,

			// 二進位。
			RADIX_2 = 2,

			// parseInt( , radix)
			// 與 Number.prototype.toString ( [ radix ] )
			// 可用之最大基數 (radix, base)。
			PACK_RADIX = 10 + 26,

			LEAP_MONTH_PADDING = new Array(
			// 閏月會有 MONTH_COUNT 個月 + 1個閏月 筆資料。
			(MONTH_COUNT + 1).toString(RADIX_2).length + 1).join(0),

			// 每年月數資料的固定長度。
			// 依當前實作法，最長可能為長度 4。
			YEAR_CHUNK_SIZE = parseInt(
			// 為了保持應有的長度，最前面加上 1。
			'1' + new Array(MONTH_COUNT).join(
			// 農曆通常是大小月相間。
			'110').slice(0, MONTH_COUNT + 1)
			// 13 個月可以二進位 1101 表現。
			+ (MONTH_COUNT + 1).toString(RADIX_2), RADIX_2)
			//
			.toString(PACK_RADIX).length,

			PACKED_YEAR_CHUNK_PADDING = new Array(
			// using String.prototype.repeat
			YEAR_CHUNK_SIZE + 1).join(' '),

			// 篩選出每年月數資料的 pattern。
			CALENDAR_DATA_SPLIT_PATTERN = new RegExp('[\\s\\S]{1,'
			// 或可使用: /[\s\S]{4}/g
			+ YEAR_CHUNK_SIZE + '}', 'g'),

			// date_data 0/1 設定。
			// 農曆一個月是29日或30日。
			// 0:30, 1:29
			// 注意:會影響到 parse_era()!
			MONTH_DAYS = [ 30, 29 ],

			MONTH_DAY_INDEX = library_namespace.null_Object(),

			// matched: [ , 閏, 月分號碼 ]
			MONTH_NAME_PATTERN = /^(閏)?([正元]|\d{1,2})月?$/,

			// matched: [ , 年, 月, 日 ]
			起始日碼_PATTERN =
			//
			/^(-?\d+|元)?[\/.\-年](閏?(?:[正元]|\d{1,2}))[\/.\-月]?(?:(初?\d{1,2}?|[正元])日?)?$/
			//
			,

			時刻_PATTERN = new RegExp(
			// '(?:[早晚夜])'+
			'([' + library_namespace.BRANCH_LIST
					+ '])時?\s*(?:([初正])([初一二三123])刻)?'),

			// 注意:依照當前的 pattern，必須指定年/月/日，
			// 否則遇到'吳大帝太元元年1月1日'之類的無法處理。
			// [ , prefix, year, month, date, suffix ]
			ERA_PATTERN =
			// 若有非數字，干支之年分名稱，需要重新設計！
			/(-?\d{1,4}|干支|[數字]+|元)[\/.\-年]\s*([^\s月]{1,3})[\/.\-月]\s*?([^\s日]{1,3})日/
			//
			,

			POSITIONAL_DATE_NAME_PATTERN = new RegExp('^['
					+ library_namespace.Chinese_numerals_Normal_digits
					+ ']{2,4}$'),

			STEM_LIST_PATTERN = new RegExp('[' + library_namespace.STEM_LIST
					+ ']'),

			持續日數_PATTERN = /^\s*\+\d+\s*$/,

			// default date parser.
			// 採用 'Chinese' 可 parse 日干支。
			DEFAULT_DATE_PARSER = 'Chinese',
			// 不使用 parser。
			PASS_PARSER = [ 'PASS_PARSER' ],
			// default date format
			DATE_NAME_FORMAT = '%Y/%m/%d',

			// 十二生肖，或屬相
			// Chinese Zodiac
			十二生肖_LIST = '鼠牛虎兔龍蛇馬羊猴雞狗豬',
			// 陰陽五行
			// The Wu Xing, (五行 wŭ xíng) also known as the Five Elements, Five
			// Phases, the Five Agents, the Five Movements, Five Processes, and
			// the Five Steps/Stages
			陰陽五行_LIST = '木火土金水';

			// 初始化常數。
			library_namespace.十二生肖_LIST = 十二生肖_LIST;
			library_namespace.陰陽五行_LIST = 陰陽五行_LIST;

			ERA_PATTERN = new RegExp(('^(.*?)' + ERA_PATTERN.source + '(.*?)$')
					.replace(
							/數字/g,
							library_namespace.Chinese_numerals_Normal_digits
									+ '十百千').replace(/干/g,
							'[' + library_namespace.STEM_LIST + ']').replace(
							/支/g, '[' + library_namespace.BRANCH_LIST + ']'));

			// 預設國家。
			// parse_era.default_country = '中國';

			// clone MONTH_DAYS
			parse_era.days = [];

			parse_era.chunk_size = YEAR_CHUNK_SIZE;

			MONTH_DAYS.forEach(function(days, index) {
				MONTH_DAY_INDEX[days] = index;
				parse_era.days.push(days);
			});

			/**
			 * 正規化日期名稱，盡量將中文數字轉為阿拉伯數字。
			 * 
			 * @param {String}number_String
			 *            中文數字年月日
			 * @returns
			 */
			function numeralize_date_name(number_String) {
				if (!number_String)
					return number_String === 0 ? 0 : '';
				// 處理元年, 閏?[正元]月, 初日
				number_String = String(number_String).trim().replace(/^初/, '')
						.replace(/[正元]$/, 1);
				return POSITIONAL_DATE_NAME_PATTERN.test(number_String)
				//
				? library_namespace
						.from_positional_Chinese_numeral(number_String)
				//
				: library_namespace.from_Chinese_numeral(number_String);
			}

			// 至順治二年（公元1645年）頒行時憲曆後，改為日96刻，每時辰八刻（初初刻、初一刻、初二刻、初三刻、正初刻、正一刻、正二刻、正三刻）。自此每刻15分，無「四刻」之名。
			function 時刻_to_hour(時刻_String) {
				return 時刻_String.replace(時刻_PATTERN,
						function($0, 時, 初正, 刻) {
							return (2 * library_namespace.BRANCH_LIST
									.indexOf(時) - (初正 === '初' ? 1 : 0))
									+ '時'
									//
									+ (刻
											&& (刻 = isNaN(刻) ? '初一二三'
													.indexOf(刻) : +刻) ? 15 * 刻
											+ '分' : '');
						});
			}

			// ---------------------------------------------------------------------//

			function Era(properties, previous) {
				for ( var property in properties)
					this[property] = properties[property];
			}

			// ---------------------------------------
			// 月次，歲次或名稱與序號 (index) 之互換。

			// 歲序→歲次(serial: start with START_YEAR)→歲名
			function year_index_to_name(歲序) {
				var 歲名 = this.calendar[NAME_KEY];
				if (!歲名 || !(歲名 = 歲名[歲序]))
					歲名 = 歲序 + (START_KEY in this.calendar
					//
					? this.calendar[START_KEY] : START_YEAR);
				return 歲名;
			}
			// (歲名→)歲次(serial: start with START_YEAR)
			// →歲序(index of year[])
			function year_name_to_index(歲名) {
				if (!歲名)
					return;

				var 歲序 = this.calendar[NAME_KEY];
				if (!歲序 || (歲序 = 歲序.indexOf(歲名)) === NOT_FOUND) {
					歲名 = numeralize_date_name(歲名);

					if (isNaN(歲名)) {
						library_namespace.err('year_name_to_index: '
						//
						+ (歲序 ? '紀年沒有[' + 歲名 + ']年！' : '紀年不具有特殊名稱設定！'));
						return;
					}

					歲序 = 歲名 - (START_KEY in this.calendar
					//
					? this.calendar[START_KEY] : START_YEAR);
				}
				return 歲序;
			}
			// 月序→月次(serial: start with START_MONTH)→月名
			function month_index_to_name(月序, 歲序) {
				歲序 = this.calendar[歲序];
				var 月名 = 歲序[NAME_KEY];
				if (!月名 || !(月名 = 月名[月序])) {
					月名 = 月序 +
					//
					(START_KEY in 歲序 ? 歲序[START_KEY] : START_MONTH);
					if (月序 >= 歲序[LEAP_MONTH_KEY])
						if (月序 == 歲序[LEAP_MONTH_KEY])
							月名 = '閏' + 月名;
						else
							月名--;
				}
				return 月名;
			}
			// (月名→)月次(serial: start with START_MONTH)
			// →月序(index of month[])
			function month_name_to_index(月名, 歲序) {
				if (!月名 || isNaN(歲序) || 歲序 >= this.calendar.length)
					return;

				var 歲_data = this.calendar[歲序], 月序 = 歲_data[NAME_KEY],
				//
				閏月序 = 歲_data[LEAP_MONTH_KEY], is_閏月;

				if (!月序 || (月序
				//
				= 月序.indexOf(月名 = numeralize_date_name(月名))) === NOT_FOUND)
					if (月名 === '閏') {
						if (isNaN(月序 = 閏月序)) {
							if (library_namespace.is_debug())
								library_namespace.warn(
								//
								'month_name_to_index: 紀年 [' + this.name
										+ '] 之 [' + this.歲名(歲序) + ']年沒有閏月！');
							return;
						}

					} else if (月序 = String(numeralize_date_name(月名)).match(
							MONTH_NAME_PATTERN)) {
						月序 = +月序[2]
								+ (is_閏月 = 月序[1] ? 1 : 0)
								- (START_KEY in 歲_data ? 歲_data[START_KEY]
										: START_MONTH);
						if (is_閏月 && 月序 !== 閏月序) {
							if (library_namespace.is_debug())
								library_namespace.warn(
								//
								'month_name_to_index: 紀年 ['
										+ this.name
										+ '] 之 ['
										+ this.歲名(歲序)
										+ ']年沒有 ['
										+ 月名
										+ ']月'
										+ (閏月序 ? '，只有' + this.月名(閏月序) + '月'
												: '') + '！');
							return;
						}

					} else {
						if (library_namespace.is_debug())
							library_namespace.warn('month_name_to_index: 紀年 ['
									+ this.name
									+ '] 之 ['
									+ this.歲名(歲序)
									+ ']年'
									+ (歲_data[NAME_KEY] ? '不具有特殊月分名稱設定！'
											: '沒有月分名稱[' + 月名 + ']！'));
						return;
					}
				return 月序;
			}

			// 日序轉成日名。
			function date_index_to_name(日序, 月序, 歲序) {
				return [ 日序
				//
				+ (月序 === 0 && 歲序 === 0 && START_DATE_KEY in this.calendar
				//
				? this.calendar[START_DATE_KEY] : START_DATE),
				//
				this.月名(月序, 歲序), this.歲名(歲序) ];
			}
			// 日名轉成日序。
			function date_name_to_index(日名, is首月) {
				if (!isNaN(日名
				//
				= numeralize_date_name(日名)))
					日名 -= (is首月 && START_DATE_KEY in this.calendar
					//
					? this.calendar[START_DATE_KEY] : START_DATE);
				return 日名;
			}

			// 取得 (歲序)年後，(月數) 個月之後的月序與歲序。
			function shift_month(月數, 歲數, 基準月) {
				if (Array.isArray(月數))
					基準月 = 月數, 月數 = 歲數 = 0;
				else {
					if (isNaN(月數 |= 0))
						月數 = 0;
					if (Array.isArray(歲數))
						基準月 = 歲數, 歲數 = 0;
					else {
						if (isNaN(歲數 |= 0))
							歲數 = 0;
						if (!Array.isArray(基準月))
							基準月 = [ 0, 0 ];
					}
				}

				// 基準月: [ 月序, 歲序, 差距月數 ]
				var 月序 = (基準月[0] | 0) + 月數,
				//
				歲序 = 基準月[1] | 0,
				//
				差距月數 = (基準月[2] | 0) + 月數;

				while (歲數 > 0 && 歲序 < this.calendar.length)
					歲數--, 差距月數 += this.calendar[歲序++].length;
				while (歲數 < 0 && 歲序 > 0)
					歲數++, 差距月數 -= this.calendar[歲序--].length;

				if (月序 > 0)
					while (月序 >= (月數 = this.calendar[歲序].length)) {
						if (++歲序 >= this.calendar.length) {
							library_namespace.err(
							//
							'shift_month: 已至曆數結尾，無可資利用之月分資料！');
							差距月數 = NaN;
							歲序--;
							break;
						}
						月序 -= 月數;
					}
				else
					while (月序 < 0) {
						if (--歲序 < 0) {
							library_namespace.err(
							//
							'shift_month: 已至曆數起頭，無可資利用之月分資料！');
							差距月數 = NaN;
							歲序 = 0;
							break;
						}
						月序 += this.calendar[歲序].length;
					}

				基準月[0] = 月序;
				基準月[1] = 歲序;
				if (差距月數)
					基準月[2] = 差距月數;
				return isNaN(差距月數) || 基準月;
			}

			function date_index_to_Date(歲序, 月序, 日序) {
				if (!this.shift_month(歲序 = [ 月序, 歲序 ]))
					return;
				// 差距日數
				月序 = 歲序[0];
				歲序 = 歲序[1];
				日序 |= 0;

				var date = this.year_start[歲序],
				//
				i = 0, calendar = this.calendar[歲序];
				for (; i < 月序; i++)
					日序 += calendar[i];

				return new Date(date + 日序 * ONE_DAY_LENGTH_VALUE);
			}

			// 初始化/parse 紀年之月分日數 data。
			// initialize era date.
			function initialize_era_date() {
				if (!this.calendar || typeof this.calendar !== 'string') {
					library_namespace.err('initialize_era_date: 無法辨識曆數資料！');
					return;
				}

				function extract_calendar($0, date_name, calendar_data) {
					calendar_data = extract_calendar_data(calendar_data,
							date_name);
					return calendar_data[0] ? calendar_data.join('=')
							: calendar_data[1];
				}

				var days = 0, start_time = new Date(this.start),
				//
				year_start_time = [ start_time.getTime() ],
				//
				this_year_data,
				// (年/月分資料=[年分各月資料/月分日數])[NAME_KEY]=[年/月分名稱],
				// [START_KEY] = start serial,
				// [LEAP_MONTH_KEY] = leap month serial.
				calendar_data = [],
				//
				month_serial, year_serial = START_YEAR,
				//
				紀年曆數 = this.calendar
				// 解壓縮日數 data。
				.replace(/(?:[;\t]|^)(.*?)=?([^;\t=]+)(?:[;\t]|$)/g,
						extract_calendar).split(pack_era.year_separator);

				紀年曆數.forEach(function(year_data) {
					var month_data = year_data.split(pack_era.month_separator);

					// 初始設定。
					month_serial = START_MONTH;
					calendar_data.push(this_year_data = []);

					month_data.forEach(function(date_data) {
						// 當月之日數|日數 data
						// =當月之日數|日數 data
						// 年名/月名/起始日碼=當月之日數|日數 data
						// /月名/起始日碼=當月之日數|日數 data
						// 年名/月名=當月之日數|日數 data
						// 月名=當月之日數|日數 data

						var date_name = date_data.match(/^(.*?)=?([^;\t=]+)$/);

						if (!library_namespace
								.is_digits(date_data = date_name[2].trim())
								//
								|| (date_data |= 0) <= 0) {
							library_namespace
									.err('initialize_era_date: 無法辨識日數資料 ['
											+ calendar_data + '] 中的 ['
											+ date_data + ']！');
							return;
						}

						// 處理日期名稱。
						if (date_name = date_name[1]) {
							date_name = date_name.split('/');
							if (date_name.length === 1)
								// 月名
								date_name.unshift('');

							// [年名]/月名[/起始日碼]
							var tmp, 年名 = numeralize_date_name(date_name[0]),
							//
							月名 = numeralize_date_name(date_name[1]),
							//
							起始日碼 = numeralize_date_name(date_name[2]);

							// 設定年分名稱
							if (年名 && 年名 != year_serial) {
								if (library_namespace.is_digits(年名))
									// 還預防有負數。
									年名 = Math.floor(年名);
								if (typeof 年名 === 'number'
										&& !(NAME_KEY in calendar_data)
										&& !(START_KEY in calendar_data))
									calendar_data[START_KEY]
									//
									= year_serial = 年名;

								else {
									if (!(NAME_KEY in calendar_data)) {
										calendar_data[NAME_KEY] = [];
										// TODO:
										// 填補原先應有的名稱。
									} else {
										if (calendar_data[NAME_KEY]
										//
										[calendar_data.length])
											library_namespace.warn(
											//
											'initialize_era_date: '
													+ '重複設定年分名稱！');
										if (this_year_data.length > 0)
											library_namespace.warn(
											//
											'initialize_era_date: '
													+ '在年中，而非年初設定年分名稱！');
									}

									calendar_data[NAME_KEY]
									//
									[calendar_data.length] = 年名;
								}

							}

							// 設定起始之月中日數
							if (起始日碼
							//
							&& 起始日碼 != START_DATE)
								if (!(START_DATE_KEY in calendar_data)
										&& library_namespace.is_digits(起始日碼))
									calendar_data[START_DATE_KEY]
									//
									= +起始日碼;
								else
									library_namespace.warn(
									//
									'initialize_era_date: 設定非數字的月中起始日 [' + 起始日碼
											+ ']；或是在中途設定日期，'
											+ '而非在曆數資料一開始即設定月中日期！將忽略之。');

							// 設定月分名稱。
							if (月名 && 月名 != month_serial) {
								if (library_namespace.is_digits(月名))
									月名 |= 0;
								if (typeof 月名 === 'number'
										&& !(NAME_KEY in this_year_data)
										&& !(START_KEY in this_year_data))
									// 若 month_serial ==
									// 月名則不會到這。
									this_year_data[START_KEY]
									//
									= month_serial = 月名;
								else if (月名 === '閏'
										|| (tmp = 月名.match(MONTH_NAME_PATTERN))
										&& tmp[1]
										&& (!tmp[2] || tmp[2] == month_serial))
									if (LEAP_MONTH_KEY in this_year_data)
										library_namespace.warn(
										//
										'initialize_era_date: '
												+ '本年有超過1個閏月！將忽略之。');
									else
										this_year_data[LEAP_MONTH_KEY]
										// 閏月
										// index:
										// 閏月將排在
										// [this_year_data.length]。
										= this_year_data.length,
										// 因為閏月，減1個月。
										month_serial--;
								else {
									if (!(NAME_KEY in this_year_data)) {
										this_year_data[NAME_KEY] = [];
										// TODO:
										// 填補原先應有的名稱。

									} else {
										if (this_year_data[NAME_KEY]
										//
										[this_year_data.length])
											library_namespace.warn(
											//
											'initialize_era_date: '
													+ '重複設定月分名稱！');
									}

									this_year_data[NAME_KEY]
									//
									[this_year_data.length] = 月名;
								}
							}

						}
						// 日期名稱處理完畢。

						// 當月之日數
						this_year_data.push(date_data);
						days += date_data;

						month_serial++;
						// build year_start_time.

						// 注意:需要依照 MONTH_DAYS 更改公式!
					});

					// 後設定。
					start_time.setDate(start_time.getDate() + days);
					year_start_time.push(start_time.getTime());
					days = 0;
					year_serial++;
				});

				this.year_start = year_start_time;
				this.calendar = calendar_data;
			}

			// get （起始）年干支序。
			// 設定"所求干支序"，將回傳所求干支序之 year serial。
			// 未設定"所求干支序"，將回傳紀年首年之年干支index。
			function get_year_stem_branch_index(所求干支序) {
				var 曆數 = this.calendar, 年干支 = this.起始年干支序, 起始月分, offset;

				if (isNaN(年干支)) {
					// 盡量取得正月，不需要調整的月分。
					if ((起始月分 = 曆數[0][START_KEY])
					// assert: 即使是只有一個月的短命政權，也得要把日數資料填到年底！
					&& (offset = this.year_start[1]))
						年干支 = new Date(offset);
					else {
						年干支 = new Date(this.start);
						if (起始月分)
							年干支.setMonth(年干支.getMonth() + START_MONTH - 起始月分);
					}
					年干支 = (年干支.getFullYear()
							- library_namespace.YEAR_STEM_BRANCH_OFFSET
							// 中曆年起始於CE年末，則應算作下一年之
							// YEAR_STEM_BRANCH_OFFSET。
							+ (年干支.getMonth() > 9 ? 1 : 0) - (offset ? 1 : 0))
							% library_namespace.SEXAGENARY_CYCLE_LENGTH;
					if (年干支 < 0)
						年干支 += library_namespace.SEXAGENARY_CYCLE_LENGTH;
					this.起始年干支序 = 年干支;
				}

				if (!isNaN(所求干支序) && (年干支 = 所求干支序 - 年干支) < 0)
					年干支 += library_namespace.SEXAGENARY_CYCLE_LENGTH;

				return 年干支;
			}

			// get （起始）月干支序。
			// 設定"月干支"，將回傳所求月干支之 [ 月序, 歲序 ]。
			// 未設定"月干支"，將回傳紀年首年首月之月干支index。
			function get_month_branch_index(月干支, 歲序) {
				var 曆數 = this.calendar, 起始月干支 = this.起始月干支序, 月序;

				// 確定以建(何支)之月為歲首(分年之月)。除顓頊曆，通常即正朔。
				// 以冬至建子之月為曆初。
				// 「三正」一說是夏正（建寅的農曆月份，就是現行農曆的正月）殷正（建丑，即現行農曆的十二月）、周正（建子，即現行農曆的十一月）；
				// 秦始皇統一中國後，改以建亥之月（即夏曆的十月）為歲首，但夏正比較適合農事季節，所以並不稱十月為正月（秦朝管正月叫「端月」），不改正月為四月，

				if (isNaN(起始月干支)) {
					月序 = [ START_DATE_KEY in 曆數 ? 1 : 0, 0 ];

					// 找到第一個非閏月。
					// 一般說來，閏月不應該符合中氣，因此照理不需要這段篩選。
					if (false)
						while (isNaN(this.月名(月序[0], 月序[1])))
							if (!this.shift_month(1, 月序)) {
								library_namespace.err(
								//
								'get_month_branch_index: 無法取得月次（數字化月分名稱）！');
								return;
							}

					// 判別此月份所包含之中氣日。
					// 包冬至 12/21-23 的為建子之月。
					// 冬至所在月份為冬月、大寒所在月份為臘月、雨水所在月份為正月、春分所在月份為二月、…、小雪所在月份為十月，無中氣的月份為前一個月的閏月。
					var ST本月起始日, ST本月中氣起始日, 下個月起始日差距, ST月序, 中氣差距日數;
					for (;;)
						if (this.shift_month(月序)) {
							// 標準時間(如UTC+8) 本月月初起始日
							ST本月起始日 = this.date_index_to_Date(月序[1], 月序[0]);
							// 標準時間(如UTC+8) 本月中氣起始日
							ST本月中氣起始日 = 中氣日[ST月序 = ST本月起始日.getMonth()];
							// 中氣起始日與本月月初起始日之差距日數日數
							中氣差距日數 = ST本月中氣起始日 - ST本月起始日.getDate();
							// 下個月月初起始日，與本月月初起始日之差距日數。
							// 即本月日數。
							下個月起始日差距 = 曆數[月序[1]][月序[0]];
							if (中氣差距日數 < 0) {
								// 日期(of 標準時間月)於中氣前，改成下個月的中氣日。
								if (++ST月序 >= 中氣日.length)
									ST月序 = 0;
								ST本月中氣起始日 = 中氣日[ST月序];
								中氣差距日數 = ST本月中氣起始日 - ST本月起始日.getDate();

								// 加上本標準時間月日數，
								// e.g., 3月為31日。
								// 使(中氣差距日數)成為下個月的中氣日差距。
								// .setDate(0) 可獲得上個月的月底日。
								ST本月起始日.setMonth(ST月序, 0);
								中氣差距日數 += ST本月起始日.getDate();
							}
							// 只要本月包含所有中氣可能發生的時段，就當作為此月。
							if (中氣差距日數 + 中氣日_days < 下個月起始日差距) {
								// 標準時間月序(ST月序) No 0:
								// 包含公元當年1月之中氣(大寒)，為臘月，
								// 月建丑，月建序 1(子月:0)。餘以此類推。

								// 歲序(月序[1])月序(月序[0])，
								// 距離紀年初(月序[2]||0)個月，
								// 包含公元當年(ST月序 + 1)月之中氣，
								// 其月建序為(ST月序 + 1)。

								this.歲首月建序 = ST月序 + 1 - 月序[0];
								// 將(ST月序)轉為紀年首月之月干支序差距。
								ST月序 += 1 - (月序[2] || 0);
								break;
							}
							// 跳過無法判斷之月分。
							月序[0]++;

						} else {
							// 無法判別的，預設甲子年正月(月序0):
							// 丙寅月，干支序(index)=2+月序。
							ST月序 = (this.歲首月建序 = 2)
									//
									+ (START_KEY in 曆數[歲序] ? 曆數[歲序][START_KEY]
											- START_MONTH : 0);
							break;
						}

					// 取得月干支。
					// 月干支每5年一循環。
					起始月干支 = ((this.get_year_stem_branch_index() + 月序[1])
							* MONTH_COUNT + ST月序)
							% library_namespace.SEXAGENARY_CYCLE_LENGTH;
					this.起始月干支序 = 起始月干支;
				}

				if (月干支 && isNaN(月干支))
					月干支 = library_namespace.stem_branch_index(月干支);
				if (isNaN(月干支))
					// 回傳紀年首年首月之月干支index。
					return 起始月干支;

				// 找出最接近的月干支所在。
				// 回傳所求干支序之 [ 月序, 歲序 ]。
				// 就算有閏月，每年也不過移動 MONTH_COUNT。
				if (歲序 |= 0) {
					// 算出本歲序首月之月干支。
					// 有閏月的話，月干支會少位移一個月。
					起始月干支 = (起始月干支 + 曆數[0].length
							- (曆數[0][LEAP_MONTH_KEY] ? 1 : 0) + MONTH_COUNT
							* (歲序 - 1))
							% library_namespace.SEXAGENARY_CYCLE_LENGTH;
				}
				// now: 起始月干支 = 歲序(歲序)月序(0)之月干支

				// 取得差距月數，須取得歲序(歲序)月序(0)往後(月干支)個月。
				if ((月序 = 月干支 - 起始月干支) < 0)
					// 確保所求差距月數於起始月干支後。
					月序 += library_namespace.SEXAGENARY_CYCLE_LENGTH;
				if (月序 >= MONTH_COUNT) {

					library_namespace.err('get_month_branch_index: '
					//
					+ this.歲名(歲序) + '年並無此月干支 [' + 月干支 + ']！');

					// 判斷前後差距何者較大。
					if (月序 - 曆數[歲序].length
					// 若是向後月數過大，才採用向前的月分。否則普通情況採用向後的月分。
					> library_namespace.SEXAGENARY_CYCLE_LENGTH - 月序) {
						// 採用向前的月分。
						月序 = library_namespace.SEXAGENARY_CYCLE_LENGTH - 月序;
						// 警告，須檢查(歲序<0)的情況。
						歲序 -= (月序 / MONTH_COUNT) | 0;
						月序 %= MONTH_COUNT;
						月序 = 曆數[歲序].length - 月序;
						if (月序 >= 曆數[歲序][LEAP_MONTH_KEY])
							月序--;
					} else {
						// 普通情況採用向後的月分。
						// 警告，須檢查(歲序>=曆數.length)的情況。
						歲序 += (月序 / MONTH_COUNT) | 0;
						月序 %= MONTH_COUNT;
					}

				}
				// 採用 '>=' 會取非閏月。
				if (月序 >= 曆數[歲序][LEAP_MONTH_KEY])
					月序--;
				return [ 月序, 歲序 ];
			}

			// 年, 月, 日 次(serial)
			// (start from START_YEAR, START_MONTH, START_DATE)
			// or 年, 月, 日 名(name)
			// or 年, 月, 日 干支
			function date_name_to_Date(年, 月, 日) {
				if (!this.year_start)
					this.initialize();

				var 干支, year_index = this.歲序(年), month_index;

				if (isNaN(year_index)
				//
				&& !isNaN(干支 = library_namespace.stem_branch_index(年)))
					// 處理年干支。
					year_index = this.get_year_stem_branch_index(干支);

				// 是否為月建。
				if (月)
					if (月.length === 1 && NOT_FOUND !== (干支
					//
					= library_namespace.BRANCH_LIST.indexOf(月))) {
						if (isNaN(this.歲首月建序))
							this.get_month_branch_index();
						month_index = 干支 - this.歲首月建序;
						if (month_index < 0)
							month_index
							//
							+= library_namespace.BRANCH_LIST.length;

					} else if (isNaN(month_index = this.月序(月, year_index || 0))
					//
					&& !isNaN(干支 = library_namespace.stem_branch_index(月))) {
						// 處理月干支。
						// 回傳所求月干支之 [ 月序, 歲序 ]。
						month_index = this.get_month_branch_index(干支,
								year_index || 0);
						// 檢查此年之此月是否為此干支。
						if (year_index !== month_index[1]) {
							if (!isNaN(year_index))
								library_namespace.err('date_name_to_Date: '
										+ this.歲名(year_index) + '年並無此月干支 [' + 月
										+ ']！');
							// 直接設定歲序。
							year_index = month_index[1];
						}
						month_index = month_index[0];
					}

				if (isNaN(year_index)) {
					// assert: !年 === true
					library_namespace.warn('date_name_to_Date: 無法辨識年分！');
					return this.start;
				}

				if (isNaN(month_index)) {
					library_namespace.warn('date_name_to_Date: 無法辨識月分！');
					return new Date(this.year_start[year_index]);
				}

				日 = this.日序(日, year_index === 0 && month_index === 0);
				// 取得基準 Date。
				year_index = this
						.date_index_to_Date(year_index, month_index, 日);
				if (isNaN(日)
						&& !isNaN(干支 = library_namespace.stem_branch_index(日)))
					// 處理日干支。
					year_index = library_namespace.convert_stem_branch_date(干支,
							year_index);

				return year_index;
			}

			function Date_to_date_index(date) {
				if (!this.year_start)
					this.initialize();

				var 歲序 = this.year_start.search_sorted(date, {
					found : true
				}),
				//
				month_data = this.calendar[歲序], 月序 = 0,
				//
				日序 = (date - this.year_start[歲序]) / ONE_DAY_LENGTH_VALUE;

				while (month_data[月序] <= 日序)
					日序 -= month_data[月序++];

				return [ 歲序, 月序, 日序 | 0 ];
			}

			Era.prototype = {
				// 月次，歲次與 index 之互換。
				// 注意：此處"序"指的是 Array index，從 0 開始。
				// "次"則從 1 開始，閏月次與本月次相同。
				// 若無特殊設定，則"次"="名"。
				月序 : month_name_to_index,
				歲序 : year_name_to_index,

				月名 : month_index_to_name,
				歲名 : year_index_to_name,

				日序 : date_name_to_index,
				日名 : date_index_to_name,

				shift_month : shift_month,

				initialize : initialize_era_date,
				get_month_branch_index : get_month_branch_index,
				get_year_stem_branch_index : get_year_stem_branch_index,
				date_name_to_Date : date_name_to_Date,
				date_index_to_Date : date_index_to_Date,
				Date_to_date_index : Date_to_date_index
			};

			// ---------------------------------------------------------------------//

			function create_era_search_pattern() {
				var key, key_list = [];
				for (key in search_index)
					key_list.push(key);
				key_list.sort(function(key_1, key_2) {
					return key_2.length - key_1.length
							|| search_index[key_2].size
							- search_index[key_1].size;
				});
				// 從最後搜尋起。
				// 從後端開始搜尋較容易一開始就取得最少的候選者，能少做點處理，較有效率。
				era_search_pattern = new RegExp('(?:' + key_list.join('|')
						+ ')$', 'g');
			}

			// private
			function compare_start_date(era_1, era_2) {
				return era_1.start - era_2.start;
			}

			// ---------------------------------------------------------------------//
			// 處理朝代紀年之 main functions。

			// build data (using insertion):
			// parse era data
			function parse_era(era_data_array, options) {
				if (library_namespace.is_Object(era_data_array)) {
					for ( var 國家 in era_data_array)
						parse_era(era_data_array[國家], {
							國家 : 國家
						});
					return;
				}

				if (!library_namespace.is_Object(options))
					options = library_namespace.null_Object();

				var last_紀年 = [],
				//
				國家 = options.國家 || parse_era.default_country,
				// 上一紀年資料 @ era_list。
				last_era_data;

				era_data_array.forEach(function(era_data, index) {

					if (!Array.isArray(era_data))
						era_data = era_data.split('|');
					// 至此 era_data = [ 紀年, 起訖, 曆數, 其他附加屬性 ]

					var 紀年 = era_data[0], 起訖 = era_data[1], tmp, i, j, k;
					if (!紀年 || (紀年 = 紀年.split('/')).length === 0) {
						library_namespace.err('parse_era: 無法判別紀年 [' + index
								+ '] 之名稱資訊！');
						return;
					}

					library_namespace.debug('前期準備：正規化紀年[' + 紀年 + ']起訖日期、其他屬性。',
							2);

					if (紀年.length === 1 && 紀年[0]) {
						// 朝代兼紀年：紀年=朝代
						last_紀年 = [ 紀年[2] = 紀年[0] ];
					} else {
						if (!紀年[0] && (tmp = last_紀年.length) > 0) {
							// 填補 inherited 繼承值/預設值。
							while (!last_紀年[--tmp])
								last_紀年.length--;
							紀年.shift();
							紀年 = last_紀年.slice(0, -紀年.length).concat(紀年);
						}

						// clone
						last_紀年 = 紀年.slice();
						if (紀年.length === 2) {
							// 朝代/君主(帝王)：紀年=君主(帝王)
							紀年[2] = 紀年[1];
						}
					}

					紀年 = 紀年.reverse();
					if (國家 && !紀年[3])
						紀年[3] = 國家;

					// assert: 至此
					// last_紀年 = [ 朝代, 君主(帝王), 紀年 ]
					// 紀年 = [ 紀年, 君主(帝王), 朝代, 國家 ]

					if (/[~～至]\s*$/.test(起訖)
							&& (tmp = era_data_array[index + 1])) {
						// 下一個紀年的起始日期接續本紀年，因此先分解下一個紀年。
						if (!Array.isArray(tmp))
							era_data_array[index + 1] = tmp = tmp.split('|');
						起訖 = [ 起訖, tmp[1].replace(/[~～至](.*?)$/, '') ];
						// 既然直接採下一個紀年的起始日期，就不需要取終點了。
						tmp = false;
					} else
						tmp = true;
					if (!(起訖 = split_date(起訖, era_data[0]))) {
						library_namespace.err('parse_era: 跳過起訖日期錯誤的紀年資料！');
						return;
					}

					起訖[0] = normalize_date(起訖[0], 起訖[2], false, true);

					if (持續日數_PATTERN.test(起訖[1])) {
						// 訖時間 "+d" : 持續日數
						tmp = +起訖[1];
						(起訖[1] = normalize_date(起訖[0], 起訖[2], true, true))
								.setDate(tmp);

					} else
						// 訖時間 "~y/m/d"
						起訖[1] = normalize_date(起訖[1], 起訖[2], tmp, true);

					// assert: 至此
					// 起訖 = [ 起 Date, 訖 Date, parser ]

					last_era_data = new Era({
						// 紀年名稱資訊（範疇小→大）
						// [ 紀年, 君主(帝王), 朝代, 國家, 其他搜尋 keys ]
						name : 紀年,

						// {Date}起 標準時間(如UTC+8),開始時間.
						start : 起訖[0],
						// {Date}訖 標準時間(如UTC+8), 結束時間.
						end : 起訖[1],

						// 共存紀年/同時存在紀年 []:
						// 在本紀年開始時尚未結束的紀年 list,
						contemporary : [],

						// 年分起始 Date value (搜尋用) [ 1年, 2年, .. ],
						// year_tart:[],

						// 曆數/歷譜資料:
						// 各月分資料 [ [1年之月分資料], [2年之月分資料], .. ],
						// 這邊還不先作處理。
						calendar : era_data[2]

					// { 其他附加屬性 : .. }
					});

					// 設定搜尋用 index。
					紀年.forEach(function(era_token) {
						if (era_token)
							if (era_token in search_index)
								search_index[era_token].add(last_era_data);
							else
								search_index[era_token] = new Set(
										[ last_era_data ]);
					});

					i = era_list.length;
					if (i === 0) {
						era_list.push(last_era_data);
						return;
					}

					// 紀年E 插入演算：
					// 依紀年開始時間，以 binary search 找到插入點 index。
					i -= 8;
					i = era_list.search_sorted(last_era_data, {
						comparator : compare_start_date,
						found : true,
						// 因為輸入資料通常按照時間順序，
						// 因此可以先檢查最後幾筆資料，以加快速度。
						start : 9 < i && era_list[i].start <= 起訖[0] ? i : 0
					})
					// 因為 .search_sorted() 會回傳 <= 的值，
					// 因此應插入在下一 index。
					+ 1;

					// 以 Array.prototype.splice(插入點 index, 0,
					// 紀年) 插入紀年E，
					// 使本紀年E 之 index 為 (插入點 index)。
					era_list.splice(i, 0, last_era_data);

					// 依紀年開始時間，
					// 將所有紀年E 之後(其開始時間 >= 紀年E 開始時間)，
					// 所有開始時間在其結束時間前的紀年，
					// 插入紀年E 於"共存紀年" list。
					for (k = 起訖[1],
					// 從本紀年E 之下個紀年起。
					j = i + 1; j < era_list.length; j++)
						if ((tmp = era_list[j]).start < k)
							tmp.contemporary.push(last_era_data);
						else
							break;

					// 向前處理"共存紀年" list：
					j = last_era_data.contemporary;
					k = 起訖[0];
					while (i > 0 && (tmp = era_list[--i]).start === 起訖) {
						// 同時開始。
						j.push(tmp);
						tmp.contemporary.push(last_era_data);
					}

					// 檢查前一紀年，
					// 與其"在本紀年開始時尚未結束的紀年 list"，
					// 找出所有(其結束時間 period_end > 紀年E 開始時間)之紀年，
					// 將之插入紀年E 之"共存紀年" list。
					i = era_list[i];
					i.contemporary.concat(i).forEach(function(era) {
						if (era.end > k)
							j.push();
					});
				});

				if (last_era_data)
					// 當有新加入者時，原先的 pattern 已無法使用。
					era_search_pattern = null;
			}

			// 工具函數：分割日期。
			function split_date(date, era) {
				if (typeof date === 'string' && (date =
				//
				date.match(/^([^:]+:)?([^~～至]+)(?:[~～至](.+)|(\+\d+))/))) {
					date = [ date[2], date[3] || date[4], date[1] ];
				}

				if (Array.isArray(date) && date.length > 0) {
					var 起 = date[0];
					if (typeof 起 === 'string' && (起 =
					// 針對從下一筆紀年調來的資料。
					起.match(/^([^:]+:)?([^~～至]+)/)))
						date = [ 起[2], date[1] || date[4], 起[1] ];

					if (/^\d+\/\d+$/.test(date[1])
							&& (起 = date[0].match(/^(\d+\/)\d+\/\d+$/)))
						// 補上相同年分。
						date[1] = 起[1] + date[1];

					return date;
				}

				library_namespace.err('split_date: 無法判別 [' + era + '] 之起訖時間！');
			}

			// 工具函數：正規化日期。
			function normalize_date(date, parser, period_end, get_date) {
				library_namespace.debug('以 parser [' + parser + '] 解析 [' + date
						+ ']。', 3, 'normalize_date');
				if (!date)
					return '';

				if (typeof date.to_Date === 'function')
					date = date.to_Date({
						parser : parser === PASS_PARSER ? undefined : parser
								|| DEFAULT_DATE_PARSER,
						period_end : period_end
					});
				if (date)
					if (get_date)
						return date;
					else if (typeof date.format === 'function')
						return date.format(DATE_NAME_FORMAT);

				library_namespace.err('normalize_date: 無法解析 [' + date + ']！');
			}

			// 在可適度修改或檢閱紀年資料的範疇內，極小化壓縮紀年資料的紀錄。
			// 會更改到 plain_era_data！
			function pack_era(plain_era_data) {

				// 單筆/多筆共用函數。

				// -----------------------------
				// 處理多筆紀年。

				if (Array.isArray(plain_era_data)) {
					var last_era = [],
					// 上一紀年結束日期。
					last_end_date, era_list = [];

					plain_era_data.forEach(function(era) {
						if (!library_namespace.is_Object(era)) {
							library_namespace.err('pack_era: 跳過資料結構錯誤的紀年資料！');
							return;
						}

						// 簡併紀年名稱。
						var i = 0, this_era = era.紀年, no_inherit;
						if (!Array.isArray(this_era))
							this_era = [ this_era ];
						for (; i < this_era.length; i++)
							if (!no_inherit && this_era[i] === last_era[i])
								this_era[i] = '';
							else {
								no_inherit = true;
								if (this_era[i] !== pack_era.inherit)
									last_era[i] = this_era[i] || '';
							}
						era.紀年 = this_era;

						// 簡併起訖日期。
						// 起訖 : [ 起, 訖, parser ]
						if (!(this_era = split_date(era.起訖, this_era))) {
							library_namespace.err('pack_era: 跳過起訖日期錯誤的紀年資料！');
							return;
						}
						// 回存。
						era.起訖 = this_era;

						// 正規化日期。
						// assert: 整個 era Array 都使用相同 parser。

						// 若上一紀年結束日期 == 本紀年開始日期，
						// 則除去上一紀年結束日期。
						if (
						// cache 計算過的值。
						(this_era[0] = normalize_date(this_era[0], this_era[2]
								|| PASS_PARSER))
								&& this_era[0] === last_end_date) {
							library_namespace.debug('接續上一個紀年的日期 ['
									+ last_end_date + ']。除去上一紀年結束日期。', 2);
							last_era.date[1] = '';

							// 這是採除去本紀年開始日期時的方法。
							// this_era[0] = '';

							// 之所以不採除去本紀年的方法，是因為：
							// 史書通常紀載的是紀年開始的日期，而非何時結束。
						} else
							library_namespace.debug('未接續上一個紀年的日期: ['
									+ last_end_date + ']→[' + this_era[0]
									+ ']。', 2);

						if (持續日數_PATTERN.test((last_era.date = this_era)[1])) {
							(last_end_date = normalize_date(this_era[0],
									this_era[2] || PASS_PARSER, true, true))
									.setDate(+this_era[1]);
							last_end_date = normalize_date(last_end_date);
							library_namespace.debug('訖時間 "+d" [' + this_era[1]
									+ '] : 持續日數 [' + last_end_date + ']。', 2);
						} else {
							last_end_date = normalize_date(this_era[1].trim(),
									this_era[2] || PASS_PARSER, true);
							library_namespace.debug('訖時間 "~y/m/d" ['
									+ this_era[1] + '] : 指定 end date ['
									+ last_end_date + ']。', 2);
						}

						era_list.push(era);
					});

					// 因為可能動到前一筆資料，只好在最後才從頭再跑一次。
					library_namespace.debug('開始 pack data。', 2);
					last_era = [];
					era_list.forEach(function(era) {
						last_era.push(pack_era(era));
					});

					library_namespace.debug('共轉換 ' + last_era.length + '/'
							+ era_list.length + '/' + plain_era_data.length
							+ ' 筆紀錄。');

					return last_era;
				}

				// -----------------------------
				// 處理單筆紀年。

				if (!library_namespace.is_Object(plain_era_data)) {
					library_namespace.err('pack_era: 無法判別紀年資料！');
					return plain_era_data;
				}

				// 至此 plain_era_data = {
				// 紀年 : [ 朝代, 君主(帝王), 紀年名稱 ],
				// 起訖 : [ 起, 訖, parser ],
				// 曆數 : [ [1年之月分資料], [2年之月分資料], .. ],
				// 其他附加屬性 : ..
				// }

				var i = 0, j,
				//
				year_data,
				// 當前年度
				year_now = START_YEAR,
				// 當前月分
				month_now,
				// 壓縮用月分資料
				month_data,
				//
				month_name,
				//
				前項已壓縮,
				// {String} 二進位閏月 index
				leap_month_index_base_2, 日數, 起始日碼,
				//
				to_skip = {
					紀年 : 1,
					起訖 : 1,
					曆數 : 1
				}, packed_era_data,
				//
				紀年名稱 = plain_era_data.紀年,
				//
				起訖時間 = split_date(plain_era_data.起訖, 紀年名稱),
				// calendar_data
				年度月分資料 = plain_era_data.曆數;

				if (!起訖時間)
					return;

				if (!Array.isArray(年度月分資料) || !年度月分資料[0]) {
					library_namespace.err('pack_era: 未設定年度月分資料！');
					return;
				}

				if (Array.isArray(紀年名稱))
					紀年名稱 = 紀年名稱.join('/').replace(/^\/{2,}/, '/').replace(
							/\/+$/, '');
				if (!紀年名稱 || typeof 紀年名稱 !== 'string') {
					library_namespace.err(
					//
					'pack_era: 無法判別紀年名稱: [' + 紀年名稱 + ']');
					return;
				}

				// 簡併月分資料。
				for (; i < 年度月分資料.length; i++, year_now++) {
					year_data = 年度月分資料[i];
					// 每年自一月開始。
					month_now = START_MONTH;
					month_data = [];
					leap_month_index_base_2 = '';
					for (j = 0; j < year_data.length; j++, month_now++) {
						// 允許之日數格式：
						// 日數
						// '起始日碼=日數'
						// [ 起始日碼, 日數 ]
						if (isNaN(日數 = year_data[j])) {
							if (typeof 日數 === 'string')
								日數 = 日數.split('=');

							if (!Array.isArray(日數) || 日數.length !== 2) {
								library_namespace.err(
								//
								'pack_era: 無法辨識日數資料 [' + year_data[j] + ']！');
								month_data = null;

							} else {
								if (起始日碼 = String(日數[0]).match(
										MONTH_NAME_PATTERN))
									起始日碼 = [ , , (起始日碼[1] || '') + 起始日碼[2] ];

								else if (!(起始日碼 = 日數[0].match(
								//
								起始日碼_PATTERN))) {
									library_namespace.warn(
									//
									'pack_era: 無法辨識紀年 [' + 紀年名稱 + '] '
											+ year_now + '年之年度月分資料 ' + j + '/'
											+ year_data.length + '：起始日碼 ['
											+ 日數[0] + ']，將之逕作為月分名！');
									起始日碼 = [ , , 日數[0] ];
								}

								日數 = 日數[1];

								// 至此 起始日碼 = [ , 年, 月, 日 ]

								// 處理元年
								起始日碼[1] = numeralize_date_name(起始日碼[1]);
								// 處理[正元]月
								if (MONTH_NAME_PATTERN.test(起始日碼[2]))
									起始日碼[2] = numeralize_date_name(起始日碼[2]);

								if (year_now == 起始日碼[1])
									起始日碼[1] = '';
								if (month_now == 起始日碼[2])
									起始日碼[2] = '';
								起始日碼[3] = START_DATE == 起始日碼[3] ? ''
										: numeralize_date_name(起始日碼[3]);

								if ((month_name = 起始日碼[2]) || 起始日碼[1]
										|| 起始日碼[3]) {
									// 可能為: 閏?\d+, illegal.

									if (i === 0 && j === 0 && !起始日碼[3]
											&& (month_name = month_name.match(
											//
											MONTH_NAME_PATTERN))) {
										library_namespace.info(
										//
										'pack_era: 紀年 [' + 紀年名稱 + '] '
										//
										+ (起始日碼[1] || year_now) + '年：起始的年月分並非 '
												+ year_now + '/' + month_now
												+ '，而為 ' + 起始日碼[1] + '/'
												+ 起始日碼[2]);

										// 將元年前面不足的填滿。
										// 為了增高壓縮率，對元年即使給了整年的資料，也僅取從指定之日期開始之資料。
										month_data = new Array(
										// reset
										month_now = +month_name[2]
												+ (month_name[1] ? 1 : 0))
												.join('0').split('');
									}

									// 可壓縮: 必須為閏(month_now - 1)
									if ((month_name = 起始日碼[2]) !== '閏'
											+ (month_now - 1)
											|| 起始日碼[1] || 起始日碼[3]) {
										if ((month_name = 起始日碼[2]) !== '閏'
												+ (month_now - 1)
												&& (i > 0 || j > 0)) {
											library_namespace.warn(
											//
											'pack_era: 紀年 [' + 紀年名稱 + '] '
											//
											+ year_now + '年：日期非序號或未按照順序。月分資料 '
													+ j + '/'
													+ year_data.length + ' ['
													+ year_now + '/'
													+ month_now + '/'
													+ START_DATE + '] → ['
													+ (起始日碼[1] || '') + '/'
													+ (起始日碼[2] || '') + '/'
													+ (起始日碼[3] || '') + ']');
											month_data = null;
										}

									} else if (leap_month_index_base_2) {
										library_namespace.err(
										//
										'pack_era: 本年有超過1個閏月！');
										month_data = null;

									} else {
										// 處理正常閏月。
										if (month_data) {
											leap_month_index_base_2 =
											// 二進位
											month_data.length
											//
											.toString(RADIX_2);
											// 預防
											// leap_month_index_base_2
											// 過短。
											leap_month_index_base_2
											//
											= LEAP_MONTH_PADDING
											//
											.slice(0, LEAP_MONTH_PADDING.length
											//
											- leap_month_index_base_2.length)
													+ leap_month_index_base_2;
										} else
											leap_month_index_base_2
											//
											= month_now;

										month_now--;
									}

									if (month_name = (起始日碼[1] ? 起始日碼[1] + '/'
											: '')
											+ (起始日碼[2] ? 起始日碼[2] : '')
											+ (起始日碼[3] ? '/' + 起始日碼[3] : ''))
										month_name += '=';

									if (year_data[j] != (month_name += 日數))
										year_data[j] = month_name;

									if (起始日碼[1] !== '' && !isNaN(起始日碼[1])) {
										library_namespace
												.debug('year: ' + year_now
														+ ' → ' + 起始日碼[1], 2);
										year_now = 起始日碼[1];
									}

									if (起始日碼[2] !== ''
											&& !isNaN(起始日碼[2] = 起始日碼[2]
													.replace(
															MONTH_NAME_PATTERN,
															'$2'))
											&& month_now != 起始日碼[2]) {
										library_namespace.debug('month: '
												+ month_now + ' → ' + 起始日碼[2],
												2);
										month_now = 起始日碼[2];
									}

								} else if (year_data[j] != 日數)
									// 可省略起始日碼的情況。
									year_data[j] = 日數;

							}
						}

						if (month_data)
							if (日數 in MONTH_DAY_INDEX) {
								month_data.push(MONTH_DAY_INDEX[日數]);
							} else {
								library_namespace.warn(
								//
								'pack_era: 錯誤的日數？' + 日數 + '日');
								month_data = null;
							}
					}

					if (month_data) {
						j = MONTH_COUNT + (leap_month_index_base_2 ? 1 : 0);
						if (month_data.length < j) {
							// padding
							month_data = month_data.concat(new Array(j + 1
									- month_data.length).join(0).split(''));
						} else if (month_data.length > j) {
							library_namespace.warn('pack_era: 紀年 [' + 紀年名稱
									+ '] ' + year_now + '年：月分資料過長！');
						}

						if (library_namespace.is_debug(2))
							j = '] ← ['
									+ month_data.join('')
									+ (leap_month_index_base_2 ? ' '
											+ leap_month_index_base_2 : '')
									+ '] ← ['
									+ year_data.join(pack_era.month_separator)
									+ ']';
						month_data = parseInt(
						// 為了保持應有的長度，最前面加上 1。
						'1' + month_data.join('') + leap_month_index_base_2,
								RADIX_2)
						//
						.toString(PACK_RADIX);

						if (month_data.length > YEAR_CHUNK_SIZE)
							library_namespace.warn('pack_era: 紀年 [' + 紀年名稱
									+ '] ' + year_now + '年：月分資料過長！');
						else if (month_data.length < YEAR_CHUNK_SIZE
						// 非尾
						&& i < 年度月分資料.length - 1) {
							if (month_data.length < YEAR_CHUNK_SIZE - 1
							// 非首
							&& i > 0)
								// 非首非尾
								library_namespace.warn('pack_era:紀年 [' + 紀年名稱
										+ '] ' + year_now + '年：月分資料過短！');
							// 注意：閏月之 index 是 padding 前之資料。
							month_data += PACKED_YEAR_CHUNK_PADDING.slice(0,
									YEAR_CHUNK_SIZE - month_data.length);
						}
						library_namespace.debug('[' + month_data + j, 2);

						if (i === 0 && /=./.test(year_data[0]))
							month_data = year_data[0].replace(/[^=]+$/, '')
									+ month_data;
						年度月分資料[i] = month_data;

					} else {
						if (library_namespace.is_debug())
							library_namespace.warn(
							//
							'pack_era: 無法壓縮紀年 [' + 紀年名稱 + '] ' + year_now
									+ '年資料 ['
									+ year_data.join(pack_era.month_separator)
									+ ']');
						// 年與年以 pack_era.year_separator 分隔。
						// 月與月以 pack_era.month_separator 分隔。
						年度月分資料[i] = (前項已壓縮 ? pack_era.year_separator : '')
								+ year_data.join(pack_era.month_separator)
								+ pack_era.year_separator;
					}

					前項已壓縮 = !!month_data;
				}

				年度月分資料[i - 1] = 前項已壓縮 ? 年度月分資料[i - 1].replace(/\s+$/, '')
						: 年度月分資料[i - 1].slice(0, -1);

				起訖時間[0] = normalize_date(起訖時間[0], 起訖時間[2] || PASS_PARSER);
				if (!持續日數_PATTERN.test(起訖時間[1]))
					// assert: isNaN(起訖時間[1])
					起訖時間[1] = normalize_date(起訖時間[1], 起訖時間[2] || PASS_PARSER);
				// 去掉相同年分。
				// 800/1/1~800/2/1 → 800/1/1~2/1
				if ((i = 起訖時間[0].match(/^[^\/]+\//))
						&& 起訖時間[1].indexOf(i = i[0]) === 0)
					起訖時間[1] = 起訖時間[1].slice(i.length);
				packed_era_data = [ 紀年名稱, (起訖時間[2] ? 起訖時間[2] + ':' : '')
				//
				+ 起訖時間[0] + '~' + 起訖時間[1], 年度月分資料.join('') ];

				// 添加其他附加屬性名稱。
				for (i in plain_era_data)
					if (!(i in to_skip))
						// TODO: 檢查屬性是否有特殊字元。
						packed_era_data.push(i + '=' + plain_era_data[i]);

				return packed_era_data.join('|');
			}

			pack_era.inherit = '=';
			// assert: .length === 1
			pack_era.year_separator = '\t';
			// assert: .length === 1
			pack_era.month_separator = ';';

			// ---------------------------------------------------------------------//
			// 處理農曆之 main functions。

			// 解壓縮日數 data。
			function extract_calendar_data(calendar_data_String, date_name) {
				if (calendar_data_String in MONTH_DAY_INDEX)
					return [ date_name, calendar_data_String ];

				var calendar_data = calendar_data_String
				// TODO: 除此 .split() 之外，盡量不動到這些過於龐大的資料…戯言。
				// http://jsperf.com/chunk-vs-slice
				// JavaScript 中 split 固定長度比 .slice() 慢。
				.match(CALENDAR_DATA_SPLIT_PATTERN),
				//
				calendar_data_Array = [], initial_month = date_name || '';

				if (initial_month.indexOf('/') !== NOT_FOUND)
					initial_month = initial_month.split('/')[1];

				if (calendar_data.length === 0) {
					library_namespace.err('extract_calendar_data: 無法辨識日數資料 ['
							+ calendar_data_String + ']！');
					return [ date_name, calendar_data_String ];
				}

				calendar_data.forEach(function(year_data) {
					year_data = parseInt(year_data, PACK_RADIX).toString(
							RADIX_2).slice(1);

					var year_data_Array = [],
					//
					leap_month_index, leap_month_index_list;

					// MONTH_COUNT 個月 + 1個閏月。
					while (year_data.length > MONTH_COUNT + 1) {
						// 閏月的部分以 4
						// (LEAP_MONTH_PADDING.length)
						// 個二進位數字指示。
						leap_month_index = parseInt(
						//
						year_data.slice(-LEAP_MONTH_PADDING.length), RADIX_2);
						year_data = year_data.slice(0,
								-LEAP_MONTH_PADDING.length);

						if (leap_month_index_list) {
							library_namespace
									.err('extract_calendar_data: 本年有超過1個閏月！');
							leap_month_index_list.unshift(leap_month_index);
						} else
							leap_month_index_list = [ leap_month_index ];
					}

					// assert: 由小至大。
					if (leap_month_index_list)
						leap_month_index_list
						//
						= leap_month_index_list.sort()[0];

					if (initial_month > 0) {
						// 注意：閏月之 index 是 padding 前之資料。
						year_data = year_data
								.slice(initial_month - START_MONTH);
						// 僅能使用一次。
						initial_month = null;
					}
					year_data = year_data.split('');

					year_data.forEach(function(month_days) {
						year_data_Array.push(
						//
						(leap_month_index_list === year_data_Array.length
						//
						? '閏=' : '') + MONTH_DAYS[month_days]);
					});

					calendar_data_Array.push(year_data_Array
							.join(pack_era.month_separator));
				});

				return [ date_name,
						calendar_data_Array.join(pack_era.year_separator) ];
			}

			// ---------------------------------------------------------------------//

			// date: duration [start_date, end_date]
			// date: era string
			// date: {國家:,朝代:,君主:,紀年:,日期:}
			// options: {base:,..}
			// 轉成具有紀年附加屬性的 Date。
			function to_era_Date(date, options) {
				library_namespace.debug('parse (' + typeof date + ') [' + date
						+ ']', 3, 'to_era_Date');

				if (!library_namespace.is_Object(options))
					options = library_namespace.null_Object();

				if (!date)
					date = new Date();

				var 紀年_list, 紀年, origin = true, 未特定紀年, tmp, tmp2;
				// 欲改變 紀年_list。
				function check_to_modify() {
					if (origin) {
						origin = false;
						// 防止改變原先的 data。
						紀年_list = new Set(紀年_list);
					}
				}
				// 取交集。
				function get_intersection(key) {
					library_namespace
							.debug('to_era_Date: 取交集 [' + key + ']', 2);
					var list = search_index[key];
					// assert: (Set)list
					if (list.size === 0)
						return;
					// 初次設定。
					if (!紀年_list)
						return 紀年_list = list;

					check_to_modify();
					紀年_list.forEach(function(era) {
						if (!list.has(era))
							紀年_list['delete'](era);
					});
					return 紀年_list;
				}

				// 取得任何一個紀年作為主紀年。
				function get_next_era() {
					if (!紀年_list || 紀年_list.size === 0)
						return 紀年 = null;

					try {
						紀年_list.forEach(function(era) {
							library_namespace.debug('to_era_Date: 採用紀年 ['
									+ era.name + ']', 2);
							紀年 = era;
							// TODO: 以更好的方法處理，不用 throw。
							throw 0;
						});
					} catch (e) {
					}

					return 紀年;
				}

				if (library_namespace.is_Object(date)) {
					library_namespace.debug('era information Object → Date', 3,
							'to_era_Date');

					// {國家:,朝代:,君主:,紀年:,日期:}
					// 從範圍小的開始搜尋。
					for ( var i in {
						紀年 : 1,
						君主 : 1,
						朝代 : 1,
						國家 : 1
					})
						if (i = date[i])
							get_intersection(i);

					date = date.日期;
				}

				if (typeof date === 'string') {
					library_namespace.debug('parse 紀年日期 string [' + date + ']',
							3, 'to_era_Date');

					// era information String
					// → era information Object
					var matched, 前置, 年, 月, 日, 後置,
					// 數字正規化。
					numeralized = library_namespace
							.Chinese_numerals_Formal_to_Normal(
							//
							library_namespace.normalize_Chinese_numeral(date)),
					//
					search_era = function search_era() {
						// 通常後方的條件會比較精細。
						while (前置) {
							if (matched = 前置.match(era_search_pattern)) {
								前置 = 前置.slice(0, -matched[0].length);
								return matched;
							}
							前置 = 前置.slice(0, -1);
						}
						while (後置) {
							if (matched = 後置.match(era_search_pattern)) {
								後置 = 後置.slice(0, -matched[0].length);
								return matched;
							}
							後置 = 後置.slice(0, -1);
						}
					};

					// TODO: CE, BCE
					var ignore_pattern = /(?:^|\s)[公西][元曆](?:$|\s)/;

					// (前置),(後置)改成 Array (紀年指示詞)，統一處理。
					if (tmp = numeralized.match(ERA_PATTERN)) {
						library_namespace.debug('to_era_Date: 辨識出紀年+日期之樣式 ['
								+ tmp + ']', 2);
						// 依照習慣，前置多為(通常應為)紀年。
						前置 = (tmp[1] = 時刻_to_hour(tmp[1].trim())).replace(
								ignore_pattern, ''),
						// 中間多為日期
						年 = tmp[2], 月 = tmp[3], 日 = tmp[4],
						// 依照習慣，後置多為(通常應為)時間。
						後置 = (tmp[5] = 時刻_to_hour(tmp[5].trim())).replace(
								ignore_pattern, '');

					} else {
						前置 = date.trim().replace(ignore_pattern, '');
						library_namespace.debug(
								'to_era_Date: 無法辨識出紀年樣式，直接當紀年名稱處理。 [' + 前置
										+ ']', 2);
					}

					// 首先確定紀年。
					if (前置 || 後置) {
						if (!era_search_pattern)
							// 初始化 search pattern。
							create_era_search_pattern();

						if (search_era()
								&& get_intersection(matched[0]).size > 1)
							while (紀年_list.size > 1 && search_era())
								get_intersection(matched[0]);
					}

					// 從紀年、日期取得 Date。
					date = null;
					while (get_next_era()
							&& (!(date = 紀年.date_name_to_Date(年, 月, 日))
							//
							|| isNaN(date.getTime()))) {
						check_to_modify();
						// 刪掉不合適的紀年。
						紀年_list['delete'](紀年);
						date = 紀年 = null;
					}

					if (!紀年_list || 紀年_list.size === 0) {
						library_namespace.info('to_era_Date: 無法判別地域紀年名稱: ['
								+ date + ']，將視為公元紀年。');
						未特定紀年 = true;
					} else if (紀年_list.size > 1)
						library_namespace.warn('to_era_Date: 可能的紀年名稱有 '
								+ 紀年_list.size + ' 個!');

					if (!date && !isNaN(年 = numeralize_date_name(年))) {
						date = new Date(年 = +年, numeralize_date_name(月) - 1,
								numeralize_date_name(日));

						if (isNaN(date.getTime())) {
							// 可能到這邊的:如 '1880年庚辰月庚辰日庚辰時'。
							// 從 era_list.search_sorted() 擇出所有可能候選。
							var 候選,
							//
							紀年起序 = era_list.search_sorted({
								// 年初
								start : new Date(年, 0, 1)
							}, {
								comparator : compare_start_date,
								found : true
							}), 紀年迄序 = era_list.search_sorted({
								// 年尾
								start : new Date(年 + 1, 0, 1)
							}, {
								comparator : compare_start_date,
								found : true
							});
							紀年_list = era_list[紀年起序].contemporary
									.concat(era_list.slice(紀年起序, 紀年迄序 + 1));

							for (date = new Date(年, 6, 1), 紀年起序 = 0;
							//
							紀年起序 < 紀年_list.length; 紀年起序++) {
								紀年 = 紀年_list[紀年起序];
								if ((候選 = 紀年.Date_to_date_index(date))
										//
										&& (候選 = 紀年.date_name_to_Date(紀年
												.歲名(候選[0]), 月, 日)))
									break;
							}
							date = 候選;
						}
					}

					if (!date)
						// 死馬當活馬醫。
						// 不可用 DEFAULT_DATE_PARSER，恐造成循環參照。
						date = library_namespace.from_Chinese_numeral(
								numeralized).to_Date('CE');

					if (date
							&& tmp
							&& (tmp2 = tmp[5]
									&& library_namespace.from_Chinese_numeral(
											tmp[5]).to_Date('CE')
									|| tmp[1]
									&& library_namespace.from_Chinese_numeral(
											tmp[1]).to_Date('CE'))
							&& (tmp2 -= new Date(tmp2).setHours(0, 0, 0, 0))) {
						library_namespace.debug('to_era_Date: 處理時間。 [' + tmp2
								+ ']', 3);
						date.setTime(date.getTime() + tmp2);
					}
				}

				if (!date && get_next_era())
					date = 紀年.start;

				if (!library_namespace.is_type(date, 'Date')
						|| isNaN(date.getTime())) {
					library_namespace.err('to_era_Date: 無法判別紀年 ['
							+ arguments[0] + '] 之時間或名稱資訊！');
					return;
				}

				// 到這裡，date 最起碼是紀年初始時間。

				if (!isNaN(tmp = options.minute_offset))
					date.setMinutes(date.getMinutes() - tmp);

				// 至此 date 應為 Date，並已篩出可能的主要紀年。
				// Date → era information Date (Date += era information)

				// 某時間點（時刻）搜尋演算：
				// 查詢某時間點（時刻）存在的所有紀年與資訊：
				// 依紀年開始時間，以 binary search 找到插入點 index。
				紀年 = era_list.search_sorted({
					start : date
				}, {
					comparator : compare_start_date,
					found : era_list
				});

				var date_index,
				// 沒意外的話，應該是照紀年初始時間排序。
				共存紀年 = [];
				紀年.contemporary.forEach(function(era) {
					// 檢查其"共存紀年" list，
					// 找出所有(其結束時間 period_end >= 所求時間)之紀年，即為所求紀年。
					if (era.end >= date)
						共存紀年.push(era);
				});

				if (options.era_only) {
					// 加上本紀年本身。
					共存紀年.push(紀年);
					return 共存紀年;
				}

				if (未特定紀年)
					共存紀年.push(紀年);
				if (共存紀年.length > 0) {
					date.共存紀年 = tmp = [];
					共存紀年.forEach(function(era) {
						date_index = era.Date_to_date_index(date);
						date_index = era.日名(date_index[2], date_index[1],
								date_index[0]);
						tmp.push(era.name.slice().reverse().join('')
								+ date_index[2] + '年' + date_index[1] + '月'
								+ date_index[0] + '日');
					});
				}

				// 查詢某時間點（時刻）的日期資訊，如月干支等：
				// 對所有紀年，找出此時間點相應之曆數：
				// 若年分起始未初始化，則初始化、解壓縮之。
				// 依年分起始 Date value，以 binary search 找到年分。
				// 依該年之月分資料，找出此時間點相應之月分、日碼(date of month)。
				date.name = 紀年.name;
				if (tmp = 紀年.name[0])
					date.紀年 = tmp;
				if (tmp = 紀年.name[1])
					date.君主 = date.帝王 = tmp;
				if (tmp = 紀年.name[2])
					date.朝代 = tmp;
				if (tmp = 紀年.name[3])
					date.國家 = tmp;

				date_index = 紀年.Date_to_date_index(date);
				tmp = 紀年.日名(date_index[2], date_index[1], date_index[0]);
				date.年 = tmp[2];
				date.月 = tmp[1];
				date.日 = tmp[0];
				// 一個月的第一個十天為上旬，第二個十天為中旬，餘下的天數為下旬。
				date.旬 = date_index[2] < 10 ? '上' : date_index[2] < 20 ? '中'
						: '下';

				tmp = 紀年.get_year_stem_branch_index() + date_index[0];
				date.生肖 = 十二生肖_LIST.charAt(tmp % 十二生肖_LIST.length);
				date.五行 = (tmp % 2 ? '陰' : '陽')
						+ 陰陽五行_LIST.charAt((tmp >> 1) % 陰陽五行_LIST.length);
				date.歲次 = library_namespace.to_stem_branch(tmp);
				// 取得當年閏月 index。
				tmp = 紀年.calendar[date_index[0]][LEAP_MONTH_KEY];
				date.月干支 = library_namespace.to_stem_branch(
				// 基準點。
				紀年.get_month_branch_index()
				// 就算有閏月，每年也不過移動 MONTH_COUNT。
				+ MONTH_COUNT * date_index[0] + date_index[1]
				// 閏月或在閏月之後的 index，都得減一。
				- (!tmp || date_index[1] < tmp ? 0 : 1));
				if (false)
					date.日干支 = date.format({
						format : '%日干支',
						locale : 'cmn-Hant-TW'
					});

				return date;
			}

			// ---------------------------------------------------------------------//

			library_namespace.Date_to_String.parser.strftime.set_conversion({
				朝代 : '國號',
				君主 : '君主(帝王)號',
				// 共和
				紀年 : '君主(帝王)/年號/民國',

				歲次 : '歲次',
				生肖 : '十二生肖/屬相',
				// http://zh.wikipedia.org/wiki/五行#五行與干支表
				五行 : '陰陽五行',

				年 : '中曆年',
				月 : '中曆月',
				日 : '中曆日',

				旬 : '上中下旬',

				// alias
				年干支 : '歲次',
				年柱 : '歲次',

				// 佔位:會引用 Date object 本身的屬性。
				// see strftime()
				月干支 : '月干支',
				月柱 : '月干支',
				// 閏月月建同本月。
				// 子月：大雪(12月7/8日)至小寒前一日，中氣冬至。
				// 因此可以與12月7日最接近的月首，作為子月初一。
				月建 : '月干支'

			}, 'cmn-Hant-TW');

			to_era_Date.pack = pack_era;
			to_era_Date.set = parse_era;

			String_to_Date.parser.era = function(date_string, minute_offset,
					options) {
				if (minute_offset) {
					if (!library_namespace.is_Object(options))
						options = library_namespace.null_Object();
					options.minute_offset = minute_offset;
				}

				library_namespace.debug('parse (' + typeof date_string + ') ['
						+ date_string + ']', 3, 'String_to_Date.parser.era');
				return to_era_Date(date_string, options);
			};

			// ---------------------------------------

			library_namespace.run(
			//
			library_namespace.get_module_path(this.id + '_data'));
			// this.finish = function() {};

			return to_era_Date;
		},

		// this is a sub module.
		no_extend : '*'
	});
