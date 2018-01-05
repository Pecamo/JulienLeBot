'use strict';

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
		this.channel.send("Quiz started!");
		this.questionsQueue = new QuestionsQueue((err = '') => {
			if (err) {
				this.failedInit(err);
			} else {
				this.nextQuestion();
			}
		});
	}

	failedInit(err) {
		this.channel.send("Unable to load the quiz questions: " + err + ".");
		setTimeout(() => { this.manager.stopQuiz(this.channel, false); }, 1000);
	}

	nextQuestion() {
		this.channel.send("Pourquoi les patates ont-elles des ailes ?");
		this.timer.reset(() => {
			this.giveHint();
		}, 5000);
	}

	giveHint() {
		this.channel.send("P...");
		this.timer.reset(() => {
			this.endQuestion();
		}, 5000);
	}

	endQuestion(found = false) {
		if (!found) {
			this.channel.send("Ahalala, la réponse était: Parce que.");			
		}
		this.channel.send("Prochaine question dans 10 secondes.");
		this.timer.reset(() => {
			this.nextQuestion();
		}, 10000);
	}

	checkAnswer(message) {
		if (!this.paused && message.content === "toto") {
			this.scoreboard.addPoints(message.author, 1);
			this.timer.pause();
			this.channel.send("Oui, oui ! Bravo " + message.author);
			this.endQuestion(true);
		}
	}

	pause() {
		if (this.paused) {
			this.channel.send("Quiz already paused.");
		} else {
			this.paused = true;
			this.timer.pause();
			this.channel.send("Quiz paused.");
		}
	}

	resume() {
		if (!this.paused) {
			this.channel.send("Quiz is not paused.");
		} else {
			this.paused = false;
			this.timer.resume();
			this.channel.send("Quiz resumed.");
		}
	}

	showScore(final = false) {
		this.scoreboard.showScore(this.channel, final);
	}

	stop(showScore = true) {
		this.timer.pause();
		this.channel.send("Quiz stopped.");
		if (showScore) {
			this.showScore(true);			
		}
	}
}

module.exports = Quiz;