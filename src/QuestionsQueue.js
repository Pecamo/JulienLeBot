'use strict';

var QuizParser = require('./QuizParser');

/** Returns a random integer between min (inclusive) and max (inclusive) */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class QuestionsQueue {
	constructor(callback) {
		let parser = new QuizParser();
		this.questions = [];
		this.qid = 0;
		let ret = parser.parse((err, questions) => {
			if (err) {
				callback(err);
				return;
			}
			this.questions = questions;
			this.qid = getRandomInt(0, this.questions.length - 1);
			callback();
		});
	}

	getCurrentQuestion() {
		return (this.questions[this.qid].question);
	}

	getHint() {
		return (this.questions[this.qid].hint);
	}

	getFinalAnswer() {
		return (this.questions[this.qid].finalAnswer);
	}

	checkAnswer(answer) {
		return (this.questions[this.qid].answer.test(answer));
	}

	nextQuestion() {
		if (this.questions.length == 1) {
			return false;
		}
		this.questions.splice(this.qid, 1);
		this.qid = getRandomInt(0, this.questions.length - 1);
		return true;
	}
}

module.exports = QuestionsQueue;