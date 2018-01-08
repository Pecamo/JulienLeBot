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
				setTimeout(() => { this.begin(); }, 500);
			}
		});
	}

	failedInit(err) {
		this.channel.send("Unable to load the quiz questions: " + err);
		setTimeout(() => { this.manager.stopQuiz(this.channel, false); }, 1000);
	}

	begin() {
		this.channel.send("Le quiz commencera dans 10 secondes.");
		this.timer.reset(() => {
			this.nextQuestion();
		}, 10000);		
	}

	nextQuestion() {
		this.channel.send(this.questionsQueue.getCurrentQuestion());
		this.timer.reset(() => {
			this.giveHint();
		}, 5000);
	}

	giveHint() {
		this.channel.send(this.questionsQueue.getHint());
		this.timer.reset(() => {
			this.endQuestion();
		}, 5000);
	}

	endQuestion(found = false) {
		if (!found) {
			this.channel.send("Ahalala, la réponse était: " + this.questionsQueue.getFinalAnswer() + ".");
		}
		if (this.questionsQueue.nextQuestion()) {
			this.channel.send("Prochaine question dans 10 secondes.");
			this.timer.reset(() => {
				this.nextQuestion();
			}, 10000);
		} else {
			this.manager.stopQuiz(this.channel);
		}
	}

	checkAnswer(message) {
		if (!this.paused && this.questionsQueue.checkAnswer(message.content)) {
			this.scoreboard.addPoints(message.author, 1);
			this.timer.pause();
			this.channel.send("Oui, oui ! Bravo " + message.author + ", c'est bien **" + message.content + "**.");
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