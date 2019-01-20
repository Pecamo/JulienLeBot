'use strict';

const local = require('./localization');

const QuestionsQueue = require('./QuestionsQueue');
const Timer = require('./Timer');
const Scoreboard = require('./Scoreboard');

const QUIZ_TIMER = 40;

class Quiz {
	constructor(channel, quizManager) {
		this.channel = channel;
		this.manager = quizManager;
		this.scoreboard = new Scoreboard();
		this.timer = new Timer();
		this.paused = false;
		this.canAnswer = false;
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
		this.channel.send(local.error(local.data.quiz.error.chargement, {error: err}));
		setTimeout(() => { this.manager.stopQuiz(this.channel, false); }, 1000);
	}

	begin() {
		this.channel.send(local.get(local.data.quiz.begin, {seconds: 10}));
		this.timer.reset(() => {
			this.nextQuestion();
		}, 10000);		
	}

	nextQuestion() {
		this.canAnswer = true;
		let question = this.questionsQueue.getCurrentQuestion();
		let category = this.questionsQueue.getCurrentCategory();
		if (category) {
			this.channel.send(local.get(local.data.quiz.categoryQuestion, {category: category, question: question}));			
		} else {
			this.channel.send(local.get(local.data.quiz.question, {question: question}));			
		}
		this.timer.reset(() => {
			this.giveHint();
		}, QUIZ_TIMER / 2 * 1000);
	}

	giveHint() {
		this.channel.send(this.questionsQueue.getHint());
		this.timer.reset(() => {
			this.endQuestion();
		}, QUIZ_TIMER / 2 * 1000);
	}

	endQuestion(found = false) {
		this.canAnswer = false;
		if (!found) {
			this.channel.send(local.get(local.data.quiz.noAnswer, {answer: this.questionsQueue.getFinalAnswer()}));
		}
		if (this.questionsQueue.nextQuestion()) {
			this.channel.send(local.get(local.data.quiz.nextQuestion, {seconds: 10}));
			this.timer.reset(() => {
				this.nextQuestion();
			}, 10000);
		} else {
			this.manager.stopQuiz(this.channel);
		}
	}

	checkAnswer(message) {
		if (!this.paused && this.canAnswer && this.questionsQueue.checkAnswer(message.content)) {
			let score = this.scoreboard.addPoints(message.author, 1);
			this.timer.pause();
			this.scoreboard.saveScore('score.txt');
			this.channel.send(local.get(local.data.quiz.goodAnswer, {answer: message.content, username: message.author.username}) + "\n" + local.get(local.data.quiz.userScore, {username: message.author.username, score: score}));
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

	questionsLeft() {
		this.channel.send(local.info(local.data.quiz.count, {questions_count: this.questionsQueue.count()}));
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