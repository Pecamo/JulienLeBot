'use strict';

var local = require('./localization');

var QuestionsQueue = require('./QuestionsQueue');
var Timer = require('./Timer');
var Scoreboard = require('./Scoreboard');

class Quiz {
	constructor(channel, quizManager) {
		this.channel = channel;
		this.manager = quizManager;
		this.scoreboard = new Scoreboard();
		this.timer = new Timer();
		this.paused = false;
		this.channel.send(local.get(local.data.quiz.start));
		this.questionsQueue = new QuestionsQueue((err = '') => {
			if (err) {
				this.failedInit(err);
			} else {
				setTimeout(() => { this.begin(); }, 500);
			}
		});
	}

	failedInit(err) {
		this.channel.send(local.error(local.data.quiz.error.chargement, err));
		setTimeout(() => { this.manager.stopQuiz(this.channel, false); }, 1000);
	}

	begin() {
		this.channel.send(local.get(local.data.quiz.begin, 10));
		this.timer.reset(() => {
			this.nextQuestion();
		}, 10000);		
	}

	nextQuestion() {
		this.channel.send(local.get(local.data.quiz.question, this.questionsQueue.getCurrentQuestion()));
		this.timer.reset(() => {
			this.giveHint();
		}, 20000);
	}

	giveHint() {
		this.channel.send(this.questionsQueue.getHint());
		this.timer.reset(() => {
			this.endQuestion();
		}, 20000);
	}

	endQuestion(found = false) {
		if (!found) {
			this.channel.send(local.get(local.data.quiz.noAnswer, this.questionsQueue.getFinalAnswer()));
		}
		if (this.questionsQueue.nextQuestion()) {
			this.channel.send(local.get(local.data.quiz.nextQuestion, 10));
			this.timer.reset(() => {
				this.nextQuestion();
			}, 10000);
		} else {
			this.manager.stopQuiz(this.channel);
		}
	}

	checkAnswer(message) {
		if (!this.paused && this.questionsQueue.checkAnswer(message.content)) {
			let score = this.scoreboard.addPoints(message.author, 1);
			this.timer.pause();
			this.channel.send(local.get(local.data.quiz.goodAnswer, message.content, message.author.username) + "\n" + local.get(local.data.quiz.userScore, message.author.username, score));
			this.endQuestion(true);
		}
	}

	pause() {
		if (this.paused) {
			this.channel.send(local.error(local.data.quiz.error.alreadyPaused));
		} else {
			this.paused = true;
			this.timer.pause();
			this.channel.send(local.get(local.data.quiz.pause));
		}
	}

	resume() {
		if (!this.paused) {
			this.channel.send(local.error(local.data.quiz.error.notPaused));
		} else {
			this.paused = false;
			this.timer.resume();
			this.channel.send(local.get(local.data.quiz.resume));
		}
	}

	showScore() {
		this.scoreboard.showScore(this.channel);
	}

	stop(showScore = true) {
		this.timer.pause();
		if (showScore) {
			this.channel.send(local.get(local.data.quiz.end));
		}
		this.channel.send(local.get(local.data.quiz.stop));
		if (showScore) {
			this.showScore();
		}
	}
}

module.exports = Quiz;