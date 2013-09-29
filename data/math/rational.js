
/**
 * @name	CeL rational number function
 * @fileoverview
 * 本檔案包含了分數/有理數 (rational number) 的 functions，相當/類似於 BigRational, BigQuotient (numerator and denominator), BigDecimal。<br />
 * 在純 javascript 的環境下，藉由原生計算功能，盡可能提供高效的大數計算。<br />
 *
 * @example
 * <code>
 * CeL.run('data.math.rational');
 * </code>
 *
 * @since	
 */


/*
TODO:

規格書:

rational = new Rational(numerator, denominator, base);

rational = new Rational(10783, 2775);
rational = new Rational('10783/2775');
rational = new Rational('3+2458/2775');
rational = new Rational('3 2458/2775');
//https://en.wikipedia.org/wiki/Vinculum_(symbol)
rational = new Rational('3.88¯576');
//Brackets
rational = new Rational('3.88(576)');

numerator 10783
denominator 2775

integer part 整數部分 == quotient == continued fraction[0]
fractional part 分數/小數部分 == remainder / denominator

mixed fraction 帶分數 == integer part + fractional part
vulgar fraction 真分數/假分數 == 

decimal approximation (numerical value) 無限小數 3.88576576576576576576576576
//https://en.wikipedia.org/wiki/Overline#Math_and_science
repeating decimal 循環小數 3.88¯576

continued fraction 連分數 == [3; 1, 7, 1, 3, 15, 1, 1, 2]

Egyptian fraction expansion 古埃及分數

最簡分數(irreducible fraction)約分 reduce

*/



'use strict';
if (typeof CeL === 'function')
	CeL.run(
	{
		name: 'data.math.rational',
		require: 'data.math.integer.',
		no_extend: 'random,compare',
		code: function (library_namespace) {

			//	requiring
			var Integer = library_namespace.data.math.integer;
			//eval(this.use());

			// ---------------------------------------------------------------------//
			// 定義基本常數。
			var
			// copy from data.math.integer.

			// 乘法單位元素
			// https://en.wikipedia.org/wiki/Identity_element
			// number * MULTIPLICATIVE_IDENTITY === number
			// 2/2, 3/3, ..
			MULTIPLICATIVE_IDENTITY = 1 / 1,


			//{Integer}
			KEY_NUMERATOR = 'numerator',
			//{Integer|Undefined}
			KEY_DENOMINATOR = 'denominator',
			//{Boolean|Undefined}
			KEY_IRREDUCIBLE = 'irreducible',

			// 應與 parseInt() 一致。
			DEFAULT_RADIX = parseInt('10'),

			//可辨認之數字字串。
			//	[ full , sign, integer part 整數部分, sign of fractional part 小數部分, numerator, denominator ]
			PATTERN_FRACTION = /([+\-]?)(?:(\d+)([ +\-]))?(\d+)\/(\d+)/,
			//	[ full , sign, integer part 整數部分, fractional part 小數部分, repeating decimal 循環小數1, repeating decimal 循環小數2 ]
			PATTERN_DECIMAL = /([+\-]?)(\d*)\.(\d*)(?:¯(\d+)|\((\d+)\))?/
			;

			// ---------------------------------------------------------------------//
			// 初始調整並規範基本常數。


			// ---------------------------------------------------------------------//
			// 工具函數

			function do_modified(rational, not_amount) {
				if (!not_amount)
					delete rational[KEY_IRREDUCIBLE];
			}


			// ---------------------------------------------------------------------//
			//	definition of module integer

			/**
			 * 任意大小、帶正負號的有理數。rational number instance.
			 *
			 * @example
			 * <code>
			 * </code>
			 *
			 * @class	Integer 的 constructor
			 * @constructor
			 */
			function Rational() {
				if (arguments.length > 0)
					assignment.apply(this, arguments);
			}

			//	instance public interface	-------------------

			// https://en.wikipedia.org/wiki/Operation_(mathematics)
			var OP_REFERENCE = {
				'+': add,
				'-': subtract,
				'*': multiply,
				'/': divide,
				'^': power,
				'=': assignment,
				'==': compare
			};

			library_namespace.extend(OP_REFERENCE, Integer.prototype);

			library_namespace.extend({
				// 下面全部皆為 assignment，例如 '+' 實為 '+='。
				assignment: assignment,

				// add_assignment
				add: add,
				// subtract_assignment
				subtract: subtract,
				// multiply_assignment
				multiply: multiply,
				// divide_assignment
				divide: divide,
				div: divide,

				power: power,
				pow: power,
				square_root: square_root,
				sqrt: square_root,
				square: square,
				// 至此為 assignment。

				clone: clone,

				//https://en.wikipedia.org/wiki/Absolute_value
				abs: function (negative) {
					this[KEY_NUMERATOR].abs(negative);
					return this;
				},
				//變換正負號。
				negate: function () {
					do_modified(this, true);
					this[KEY_NUMERATOR].negate();
					return this;
				},
				is_positive: function () {
					return this.compare(0) > 0;
				},
				is_negative: function () {
					return this[KEY_NUMERATOR].is_negative();
				},
				// https://en.wikipedia.org/wiki/Sign_(mathematics)
				// https://en.wikipedia.org/wiki/Sign_function
				sign: function (negative) {
					return this[KEY_NUMERATOR].sign(negative);
				},

				round: round,
				floor: function (digit) {
					return this.round(digit, -Infinity);
				},
				ceil: function (digit) {
					return this.round(digit, Infinity);
				},

				log: log,

				is_0: function () {
					return this[KEY_NUMERATOR].is_0();
				},
				//compare_amount: compare_amount,
				compare: compare,
				equals: function (number) {
					return this.compare(number) === 0;
				},

				op: operate,
				valueOf: valueOf,
				toString: toString
			}, Rational.prototype);

			//	class public interface	---------------------------
			function is_Rational(value) {
				return value instanceof Rational;
			}

			function Rational_compare(number1, number2) {
				TODO;
			}

			//get the extreme value (極端值: max/min) of input values
			function extreme(values, get_minima) {
				TODO;
			}

			function random(range, base) {
				TODO;
			}

			library_namespace.extend({
				random: random,
				max: function () {
					// get max()
					return extreme(arguments);
				},
				min: function () {
					// get min()
					return extreme(arguments, true);
				},
				compare: Rational_compare,
				// little_natural: little natural number, e.g., 1
				is_0: function (value, little_natural) {
					if (typeof value === 'string')
						value = new Rational(value);
					return value === (little_natural || 0) || (is_Rational(value) ? value[KEY_NUMERATOR] : Integer(value)).is_0(little_natural);
				},

				is_Rational: is_Rational
			}, Rational);


			// ---------------------------------------------------------------------//

			//因 clone 頗為常用，作特殊處置以增加效率。
			function clone() {
				var rational = new Rational;
				rational[KEY_NUMERATOR] = this[KEY_NUMERATOR].clone();
				if (KEY_DENOMINATOR in this)
					rational[KEY_DENOMINATOR] = this[KEY_DENOMINATOR].clone();
				if (KEY_IRREDUCIBLE in this)
					rational[KEY_IRREDUCIBLE] = this[KEY_IRREDUCIBLE];
				return rational;
			}

			//正規化(normalize)
			function normalize(rational) {
				if (KEY_DENOMINATOR in rational) {
					//確保不使用 exponent，使 exponent 為 0。
					var e_n = rational[KEY_NUMERATOR].get_exponent() - rational[KEY_DENOMINATOR].get_exponent(), e_d = 0;
					if (e_n < 0)
						e_d = -e_n, e_n = 0;
					rational[KEY_NUMERATOR].get_exponent(e_n);
					rational[KEY_DENOMINATOR].get_exponent(e_d);
					rational[KEY_DENOMINATOR].expand_exponent();

					//將正負符號擺在 [KEY_NUMERATOR]，確保 [KEY_DENOMINATOR] 不為負。
					if (rational[KEY_DENOMINATOR].is_negative())
						rational[KEY_NUMERATOR].negate(), rational[KEY_DENOMINATOR].negate();

					// [KEY_DENOMINATOR] 預設即為 MULTIPLICATIVE_IDENTITY。
					if (rational[KEY_DENOMINATOR].equals(MULTIPLICATIVE_IDENTITY))
						delete rational[KEY_DENOMINATOR];
				}
				if (rational[KEY_NUMERATOR].expand_exponent().is_0()
					//TODO: or Infinity
					|| rational[KEY_NUMERATOR].isNaN()
					)
					delete rational[KEY_DENOMINATOR];
			}

			function assignment(numerator, denominator, base) {
				var matched;
				if (is_Rational(numerator)) {
					//shift arguments
					base = denominator;
					denominator = numerator[KEY_DENOMINATOR];
					numerator = numerator[KEY_NUMERATOR];
				}

				if (denominator) {
					// rational = new Rational(10783, 2775);
					this[KEY_NUMERATOR] = new Integer(numerator, base);
					this[KEY_DENOMINATOR] = new Integer(denominator, base);
					normalize(this);

				} else if (typeof numerator === 'string' && (matched = numerator.match(PATTERN_FRACTION))) {
					//rational = new Rational('10783/2775');
					//rational = new Rational('3+2458/2775');
					//rational = new Rational('3 2458/2775');

					//	[ full , sign, integer part 整數部分, sign of fractional part 小數部分, numerator, denominator ]
					if (matched[3] === '-' && matched[1] !== '-')
						library_namespace.err('assignment: Invalid number sign!');

					this[KEY_DENOMINATOR] = denominator = new Integer(matched[5], base);
					numerator = new Integer(matched[4], base);
					if (matched[2])
						numerator = new Integer(matched[2], base).multiply(denominator).add(numerator);
					if (matched[1] === '-')
						numerator.negate();
					this[KEY_NUMERATOR] = numerator;

				} else if (typeof numerator === 'string' && (matched = numerator.match(PATTERN_DECIMAL))) {
					//https://en.wikipedia.org/wiki/Vinculum_(symbol)
					//rational = new Rational('3.88¯576');
					//Brackets
					//rational = new Rational('3.88(576)');

					//	[ full , sign, integer part 整數部分, fractional part 小數部分, repeating decimal 循環小數1, repeating decimal 循環小數2 ]
					// e.g., 1111.222¯33333 → 1111 + (22233333 - 222) / 99999000
					numerator = matched[1] + matched[2] + matched[3];
					if (matched[4] || (matched[4] = matched[5])) {
						//有循環節。
						this[KEY_NUMERATOR] = new Integer(numerator + matched[4], base)
							.add(new Integer(matched[3], base), true);
						denominator = ((base || DEFAULT_RADIX) - 1).toString(base || DEFAULT_RADIX).repeat(matched[4].length);
					} else {
						//無循環節。
						this[KEY_NUMERATOR] = new Integer(numerator, base);
						denominator = MULTIPLICATIVE_IDENTITY;
					}
					if (denominator !== MULTIPLICATIVE_IDENTITY || matched[3].length)
						this[KEY_DENOMINATOR] = new Integer(denominator + '0'.repeat(matched[3].length), base);
					else
						delete this[KEY_DENOMINATOR];

				} else {
					delete this[KEY_DENOMINATOR];
					this[KEY_NUMERATOR] = denominator = new Integer(numerator, base);
					if (denominator.isNaN())
						library_namespace.err('assignment: Invalid number: [' + numerator + '].');
					else
						normalize(denominator);
				}

				return this;
			}

			function reduce() {
				if ((KEY_DENOMINATOR in this) && !this[KEY_IRREDUCIBLE]) {
					var gcd = this[KEY_NUMERATOR].clone().Euclidean_algorithm(this[KEY_DENOMINATOR].clone())[1];
					this[KEY_NUMERATOR].divide(gcd);
					if (this[KEY_DENOMINATOR].equals(gcd))
						delete this[KEY_DENOMINATOR];
					else
						this[KEY_DENOMINATOR].divide(gcd);
					this[KEY_IRREDUCIBLE] = true;
				}

				return this;
			}

			/**
			 * 測試大小/比大小
			 * @param number	the number to compare
			 * @return	{Number}	0:==, <0:<, >0:>
			 * @_name	_module_.prototype.compare_to
			 */
			function compare(number) {
				if (is_Rational(number) && (KEY_DENOMINATOR in number.reduce()))
					return this.reduce()[KEY_NUMERATOR].clone().multiply(number[KEY_DENOMINATOR])
					//
					.compare(KEY_DENOMINATOR in this ? this[KEY_DENOMINATOR].clone().multiply(number[KEY_NUMERATOR]) : number[KEY_NUMERATOR]);

				else {
					if (is_Rational(number))
						number = number[KEY_NUMERATOR];
					return this.reduce()[KEY_NUMERATOR]
					//
					.compare(KEY_DENOMINATOR in this ? this[KEY_DENOMINATOR].clone().multiply(number) : number);
				}
			}


			// ---------------------------------------------------------------------//
			//四則運算，即加減乘除， + - * / (+-×÷)**[=]
			//https://en.wikipedia.org/wiki/Elementary_arithmetic

			//和
			function add(addend, is_subtract) {
				if (typeof addend === 'string')
					addend = new Rational(addend);

				if (!is_0(addend)) {
					//	assert: addend != 0.

					do_modified(this.reduce());

					if (is_Rational(addend) && !(KEY_DENOMINATOR in addend.reduce()))
						addend = addend[KEY_NUMERATOR];
					//assert: addend is non-Rational or reduced Rational with denominator.

					if (is_Rational(addend)
						//分母相同時，直接相加減分子。
					 ? (KEY_DENOMINATOR in this) && addend[KEY_DENOMINATOR].equals(this[KEY_DENOMINATOR])
						//分母相同(=1)時，直接相加減分子。
					 : !(KEY_DENOMINATOR in this))
						this[KEY_NUMERATOR].add(is_Rational(addend) ? addend[KEY_DENOMINATOR] : addend, is_subtract);
						//分母相同，毋須更動。

					else {
						// n1/d1 ± n2/d2 = (n1d2 ± n2d1)/d1d2
						//assert: d1 != d2
						var denominator_need_multiply;
						if (is_Rational(addend)) {
							//僅在 (KEY_DENOMINATOR in addend) 時，才須處理分母。
							if (KEY_DENOMINATOR in this)
								//為不干擾 this[KEY_NUMERATOR].add() 之操作，另作 cache。
								denominator_need_multiply = addend[KEY_DENOMINATOR];
							else
								//為不干擾 addend，另外創建。
								this[KEY_DENOMINATOR] = addend[KEY_DENOMINATOR].clone();
							this[KEY_NUMERATOR].multiply(addend[KEY_DENOMINATOR]);
							addend = addend[KEY_NUMERATOR];
						}
						this[KEY_NUMERATOR].add(KEY_DENOMINATOR in this ? this[KEY_DENOMINATOR].clone().multiply(addend) : addend, is_subtract);
						if (denominator_need_multiply)
							this[KEY_DENOMINATOR].multiply(denominator_need_multiply);
					}
				}

				return this;
			}

			//差
			function subtract(number) {
				return this.add(number, true);
			}

			function multiply(number) {
				if (typeof number === 'string')
					number = new Rational(number);

				if (!is_0(number, 1)) {
					do_modified(this.reduce());

					if (is_0(number)) {
						this[KEY_NUMERATOR].assignment(0);
						delete this[KEY_DENOMINATOR];

					} else {
						if (is_Rational(number) && !(KEY_DENOMINATOR in number.reduce()))
							number = number[KEY_NUMERATOR];
						//assert: number is non-Rational or reduced Rational with denominator.

						if (is_Rational(number)) {
							this[KEY_NUMERATOR].multiply(number[KEY_NUMERATOR]);
							if (KEY_DENOMINATOR in this)
								this[KEY_DENOMINATOR].multiply(number[KEY_DENOMINATOR]);
							else
								this[KEY_DENOMINATOR] = number[KEY_DENOMINATOR].clone();
						} else
							this[KEY_NUMERATOR].multiply(number);
					}
				}

				return this;
			}

			function divide(number) {
				if (typeof number === 'string')
					number = new Rational(number);

				if (!is_0(number, 1)) {
					do_modified(this.reduce());

					if (is_0(number)) {
						this[KEY_NUMERATOR].assignment(NaN);
						delete this[KEY_DENOMINATOR];

					} else {
						if (is_Rational(number)) {
							if (KEY_DENOMINATOR in number.reduce())
								this[KEY_NUMERATOR].multiply(number[KEY_DENOMINATOR]);
							number = number[KEY_NUMERATOR];
						}

						if (KEY_DENOMINATOR in this)
							this[KEY_DENOMINATOR].multiply(number);
						else
							this[KEY_DENOMINATOR] = number.clone();
					}
				}

				return this;
			}


			// ---------------------------------------------------------------------//


			//https://en.wikipedia.org/wiki/Rounding
			//precision: 小數點後第 precision 位，可為負數
			//direct: directed rounding: undefined, 0, Infinity, -Infinity
			function round(precision, direct) {
				TODO;
			}

			// ---------------------------------------------------------------------//
			//advanced functions

			function square() {
				do_modified(this.reduce());

				this[KEY_NUMERATOR].square();

				if (KEY_DENOMINATOR in this)
					this[KEY_DENOMINATOR].square();

				return this;
			}

			function power(exponent) {
				do_modified(this.reduce());

				this[KEY_NUMERATOR].power(exponent);

				if (KEY_DENOMINATOR in this)
					this[KEY_DENOMINATOR].power(exponent);

				return this;
			}

			//WARNING 注意: this will get floor(sqrt(this))，結果僅會回傳整數！
			function square_root(precision) {
				do_modified(this.reduce());

				if (KEY_DENOMINATOR in this) {
					this[KEY_NUMERATOR].divide(this[KEY_DENOMINATOR], precision);
					delete this[KEY_DENOMINATOR];
				}

				this[KEY_NUMERATOR].square_root(precision);

				return this;
			}

			function log(base) {
				var value = this[KEY_NUMERATOR].log(base);

				if (KEY_DENOMINATOR in this)
					value -= this[KEY_DENOMINATOR].log(base);

				return value;
			}


			// ---------------------------------------------------------------------//

			/**
			 * front end of operation(運算)
			 * @param {String}operator	operator
			 * @param number	the second integer
			 * @return	計算後的結果
			 * @see
			 * https://en.wikipedia.org/wiki/Operation_(mathematics)
			 * <a href="http://www.javaworld.com.tw/jute/post/view?bid=35&amp;id=30169&amp;tpg=1&amp;ppg=1&amp;sty=1&amp;age=0#30169" accessdate="2010/4/16 20:47">JavaWorld@TW Java論壇 - post.view</a>
			 * @_name	_module_.prototype.op
			 */
			function operate(operator, number, flag) {
				var target;
				if (operator.slice(-1) === '=') {
					if (operator === '===')
						return this === number;
					if (operator !== '=' && operator !== '==')
						operator = operator.slice(0, -1);
					target = this;
				} else
					target = this.clone();

				if (operator in OP_REFERENCE)
					OP_REFERENCE[operator].call(target, number, flag);
				else
					library_namespace.err('operate: Invalid operator [' + operator + ']!');

				return target;
			}

			// ---------------------------------------------------------------------//

			//當數字過大，轉回傳 {String}
			var TYPE_String_for_large = 1,
			//return [value, exponent]: this = value * base ^ exponent
			TYPE_info_for_large = 2,
			//與 NaN 等極端數字作運算用。
			TYPE_TEST = 3;
			//WARNING 注意: 若回傳非 Number.isSafeInteger()，則會有誤差，不能等於最佳近似值。
			function valueOf(type) {
				var value;
				if (KEY_TYPE in this)
					value = this[KEY_TYPE];

				else if (type === TYPE_TEST && this.length < 2) {
					if ((value = this[0] || 0) && this[KEY_EXPONENT])
						value *= Math.pow(base, this[KEY_EXPONENT]);

				} else {
					var index = this.length, base = this[KEY_BASE], next_value;
					for (value = 0; 0 < index--; value = next_value)
						if (!isFinite(next_value = value * base + this[index])) {
							if (!type)
								// normal: 強迫回傳 {Number}
								value = Infinity;
							else if (type === TYPE_info_for_large)
								return [value, index + 1 + this[KEY_EXPONENT]];
							else if (type === TYPE_String_for_large) {
								value = Math.log10(value) + Math.log10(base) * (index + 1 + this[KEY_EXPONENT]);
								value = Math.pow(10, value % 1) + 'e+' + (value | 0);
							} else
								//TYPE_TEST
								//與 NaN 等極端數字相較，再大的 Integer 都只是小兒科。因為不在乎精度，無須再處理。
								//但須注意 assignment() 之使用。
								;
							break;
						}

					if (this[KEY_EXPONENT]
						//確定 type !== TYPE_String_for_large，因為已處理過。
						&& typeof value === 'number' && value) {
						next_value = value * Math.pow(base, this[KEY_EXPONENT]);
						if (type === TYPE_info_for_large && (!isFinite(next_value)
							//維持同樣精度。
							|| Number.isSafeInteger(value) && !Number.isSafeInteger(next_value)))
							return [value, this[KEY_EXPONENT]];
						value = next_value;
					}
				}
				return this[KEY_NEGATIVE] ? typeof value === 'number' ? -value : '-' + value : value;
			}

			function toString(radix) {
				var base, zero = 0;
				if (radix && isNaN(radix))
					radix = (base = Array.isArray(radix) ? radix : String(radix).split('')).length;
				else if (!(MIN_RADIX <= radix && radix <= MAX_RADIX))
					radix = DEFAULT_RADIX;
				if (!base && this[KEY_CACHE] && this[KEY_CACHE][radix])
					return this[KEY_CACHE][radix];

				var digits, value;
				if (KEY_TYPE in this)
					digits = [this[KEY_TYPE]];
				else {
					if (!base)
						//assert: 'ab'[1]==='b'
						base = DEFAULT_DIGITS;
					zero = base[0];
					digits = [];
					value = new Integer(this, radix, true);
					value.forEach(function (digit) {
						digits.push(base[digit]);
					});
					if (value = value[KEY_EXPONENT])
						if (0 < value)
							digits.unshift(zero.repeat(value));
						else {
							if (digits.length < (value = -value))
								//補足長度。
								if (digits.fill)
									digits.fill(zero, digits.length, value);
								else
									for (var i = digits.length; i < value;)
										digits[i++] = zero;
							digits.splice(value, 0, '.');
							while (digits[0] == zero)
								//去除末端的 '0'
								digits.shift();
							if (digits[0] === '.')
								digits.shift();
						}
				}

				//去除前導的 '0'
				if (value = digits.length)
					while (0 < --value && digits[value] == zero)
						digits.pop();
				else
					digits = [zero];

				if (this[KEY_NEGATIVE])
					digits.push('-');

				digits.reverse();

				if (!this[KEY_CACHE])
					this[KEY_CACHE] = [];
				return this[KEY_CACHE][radix] = digits.join('');
			}


			// ---------------------------------------------------------------------//

			return Rational;
		}

	});
