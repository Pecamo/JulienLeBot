'use strict';

var fs = require('fs');
var local = require('./localization');

function replaceChar(str, idx, char) {
	let tab = str.split('');
	tab[idx] = char;
	return tab.join('');
}

class QuizParser {
	constructor() {
		this.testQuestions = [];
	}

	parse(callback) {
		fs.readdir('./quizzes', (err, items) => {
			if (err) {
				console.log(local.get(local.data.parser.log.readdir, {directory: './quizzes', error: err}));
				callback(local.get(local.data.parser.user.readdir), []);
				return;
			}
			for (let i = 0; i < items.length;) {
				let sp = items[i].split('.');
				if (sp.length > 1 && sp[sp.length - 1] === 'txt') {
					++i;
				} else {
					items.splice(i, 1);
				}
			}
			if (!items.length) {
				callback(local.get(local.data.parser.user.noQuiz), []);
				return;				
			}
			let parsed = 0;
			let error = false;
			for (let i = 0; i < items.length; ++i) {
				fs.readFile('./quizzes/' + items[i], "utf8", (err, data) => {
					if (err) {
						console.log(local.get(local.data.parser.log.readfile, {file: items[i], error: err}));
						error = true;
					} else if (!error) {
						this.parseFileContent(data, items[i].split('.')[0]);
					}
					parsed++;
					if (parsed >= items.length) {
						if (error) {
							callback(local.get(local.data.parser.user.readfile), []);
						} else if (!this.testQuestions.length) {
							callback(local.get(local.data.parser.user.noQuestion), []);
						} else {
							callback(null, this.testQuestions);							
						}
					}
				});
			}
		});
	}

	parseFileContent(content, category) {
		// Remove comments
		content = content.replace(/(\/{3,}.*(?:\r?\n|\r)?)/g, "");
		let questions = content.match(/((?:.+(?:\r?\n|\r)?)+)/g);
		if (!questions) return;
		for (let i = 0; i < questions.length; ++i) {
			this.parseQuestion(questions[i], category);
		}
	}

	parseQuestion(question, category) {
		let sp = question.split(/\r?\n|\r/g);
		// Remove last element if it does not contain characters
		if (!/\S/.test(sp[sp.length - 1])) {
			sp.pop();
		}
		if (sp.length < 2) {
			console.log(local.get(local.data.parser.log.missingQA, {question: question}));
			return;
		}
		let originals = sp.slice();
		sp = this.cleanUp(sp);
		let holes = (sp[0].match(/___/g) || []).length;
		if (this.checkAnswersFormat(question, sp, holes, originals)) {
			if (holes) {
				this.parseMultipleFormat(question, sp, category);
			} else {
				this.parseSingleFormat(question, sp, category);
			}
		}
	}

	cleanEmptySlots(array) {
		for (let i = 0; i < array.length;) {
			if (/\S/.test(array[i])) {
				++i;
			} else {
				array.splice(i, 1);
			}
		}
		return array;
	}

	cleanUp(sp) {
		sp[0] = sp[0].trim().replace(/  +/g, ' ');
		for (let i = 1; i < sp.length; ++i) {
			sp[i] = this.cleanEmptySlots(sp[i].trim().replace(/  +/g, ' ').split(/ ?-> ?/g));
			if (sp[i].length > 1) {
				sp[i][0] = this.cleanEmptySlots(sp[i][0].split(/ ?, ?/g));
			}
		}
		return sp;
	}

	checkArrows(question, answer, holes, original) {
		if (answer.length > 2) {
			console.log(local.get(local.data.parser.log.multipleArrows, {answer: original, question: question}));
			return false;
		}
		return true;
	}

	checkHoles(question, answer, holes, original) {
		if (!holes && answer.length > 1) {
			console.log(local.get(local.data.parser.log.noHole, {answer: original, question: question}));
			return false;
		}
		if (holes > 0 && answer[0].length != holes) {
			console.log(local.get(local.data.parser.log.mismatchHoles, {answer: original, question_holes: holes, answer_opt: answer[0].length, question: question}));
			return false;
		}
		return true;
	}

	checkParentheses(question, answer, original) {
		for (let i = 0; i < answer.length; ++i) {
			if (answer[i].constructor === String) {
				let par = 0;
				for (let char of answer[i]) {
					if (char == '(') {
						par++;
					} else if (char == ')') {
						par--;
					}
					if (par < 0) {
						console.log(local.get(local.data.parser.log.mismatchRightParenthesis, {answer: original, question: question}));
						return false;
					}
				}
				if (par > 0) {
					console.log(local.get(local.data.parser.log.mismatchLeftParenthesis, {answer: original, question: question}));
					return false;
				}
			}
		}
		return true;
	}

	checkAnswersFormat(question, sp, holes, originals) {
		if (!holes && sp.length > 2) {
			console.log(local.get(local.data.parser.log.tooManyAnswer, {question: question}));
		}
		for (let i = 1; i < sp.length; ++i) {
			if (!this.checkArrows(question, sp[i], holes, originals[i]) ||
				!this.checkHoles(question, sp[i], holes, originals[i]) ||
				!this.checkParentheses(question, sp[i], originals[i])) {
				sp.splice(i, 1);
				i--;
			}
		}
		return (sp.length > 1);
	}

	escapeRegExp(text) {
		return text.replace(/[-[\]{}*+?.,\\^$|#\s]/g, '\\$&');
	}

	swapIfFirstOption(answer) {
		if (answer[0] == '(') {
			let par = 0;
			for (let i = 0; i < answer.length; ++i) {
				if (answer[i] == '(') {
					par++;
				}
				if (answer[i] == ')') {
					par--;
					if (par == 0) {
						if (i < answer.length - 1 && answer[i + 1] == ' ') {
							answer = replaceChar(answer, i + 1, ')');
							while (answer[i--] == ')');
							answer = replaceChar(answer, i + 2, ' ');
							return answer;
						}
					}
				}
			}
		}
		return answer;
	}

	createRegExpAnswer(answers) {
		let sp = answers.split(/\s*,\s*/g);
		for (let i = 0; i < sp.length; ++i) {
			sp[i] = this.escapeRegExp(this.swapIfFirstOption(sp[i]).replace(/\s(\(+)/g, '$1 '));
			sp[i] = sp[i].replace(/\)/g, ')?');
		}
		return new RegExp('^' + sp.join('|') + '$', 'gi');
	}

	createFinalAnswer(answer) {
		return (answer.replace(/[()]/g, ''));
	}

	createHint(answer) {
		let start = -1;
		let par = 0;
		for (let i = 0; i < answer.length; ++i) {
			if (answer[i] == '(') {
				par++;
				if (start < 0) {
					start = i;
				}
			}
			if (answer[i] == ')') {
				par--;
				if (par == 0) {
					if (start > -1) {
						answer = answer.replace(answer.substring(start, i + 1), '');
						i = start - 1;
					}
					start = -1;
				}
			}
		}
		return answer.trim()[0] + '...';
	}

	parseSingleFormat(question, sp, category) {
		let fAnswer = sp[1][0].split(',')[0];
		this.testQuestions.push({
			'category': category,
			'question': sp[0],
			'answer': this.createRegExpAnswer(sp[1][0]),
			'hint': this.createHint(fAnswer),
			'finalAnswer': this.createFinalAnswer(fAnswer)
		});
	}

	parseMultipleFormat(question, sp, category) {
		for (let i = 1; i < sp.length; ++i) {
			let q = sp[0];
			for (let h = 0; h < sp[i][0].length; ++h) {
				q = q.replace(/___/, sp[i][0][h]);
			}
			let fAnswer = sp[i][1].split(',')[0];
			this.testQuestions.push({
				'category': category,
				'question': q,
				'answer': this.createRegExpAnswer(sp[i][1]),
				'hint': this.createHint(fAnswer),
				'finalAnswer': this.createFinalAnswer(fAnswer)
			});
		}
	}
}

module.exports = QuizParser;