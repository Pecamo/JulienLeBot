'use strict';

var fs = require('fs');

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
				console.log("Readdir error: " + err);
				callback("Unable to read quizzes directory.", []);
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
				callback("No quiz available.", []);
				return;				
			}
			let parsed = 0;
			let error = '';
			for (let i = 0; i < items.length; ++i) {
				fs.readFile('./quizzes/' + items[i], "latin1", (err, data) => {
					if (err) {
						console.log('Readfile error: ' + items[i] + ': ' + err);
						error += 'Unable to read ' + items[i] + '.';
					} else if (!error) {
						this.parseFileContent(data);
					}
					parsed++;
					if (parsed >= items.length) {
						if (error) {
							callback(error, []);
						} else {
							console.log(this.testQuestions);
							callback(null, this.testQuestions);							
						}
					}
				});
			}
		});
	}

	parseFileContent(content) {
		// Remove comments
		content = content.replace(/(\/{3,}.*(?:\r?\n|\r)?)/g, "");
		let questions = content.match(/((?:.+(?:\r?\n|\r)?)+)/g);
		for (let i = 0; i < questions.length; ++i) {
			this.parseQuestion(questions[i]);
		}
	}

	parseQuestion(question) {
		let sp = question.split(/\r?\n|\r/g);
		// Remove last element if it does not contain characters
		if (!/\S/.test(sp[sp.length - 1])) {
			sp.pop();
		}
		if (sp.length < 2) {
			console.log("Warning: Missing question or answer for the block:\n" + question + "\nQuestion ignored.");
			return;
		}
		sp = this.cleanUp(sp);
		let holes = (sp[0].match(/___/g) || []).length;
		if (this.checkAnswersFormat(question, sp, holes)) {
			if (holes) {
				this.parseMultipleFormat(question, sp);
			} else {
				this.parseSingleFormat(question, sp);
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

	checkAnswersFormat(question, sp, holes) {
		return true;
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

	parseSingleFormat(question, sp) {
		let fAnswer = sp[1][0].split(',')[0];
		this.testQuestions.push({
			'question': sp[0],
			'answer': this.createRegExpAnswer(sp[1][0]),
			'hint': this.createHint(fAnswer),
			'finalAnswer': this.createFinalAnswer(fAnswer)
		});
	}

	parseMultipleFormat(question, sp) {
		for (let i = 1; i < sp.length; ++i) {
			let q = sp[0];
			for (let h = 0; h < sp[i][0].length; ++h) {
				q = q.replace(/___/, sp[i][0][h]);
			}
			let fAnswer = sp[i][1].split(',')[0];
			this.testQuestions.push({
				'question': q,
				'answer': this.createRegExpAnswer(sp[i][1]),
				'hint': this.createHint(fAnswer),
				'finalAnswer': this.createFinalAnswer(fAnswer)
			});
		}
	}
}

module.exports = QuizParser;