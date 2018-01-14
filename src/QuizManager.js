'use strict';

const fs = require('fs');

const local = require('./localization');
const Dispatcher = require('./Dispatcher');
const Quiz = require('./Quiz');

class QuizManager {
	constructor() {
		this.pool = [];
		this.dispatcher = new Dispatcher({
			'start': this.startCommand,
			'pause': this.pauseCommand,
			'resume': this.resumeCommand,
			'stop': this.stopCommand,
			'score': this.scoreCommand,
			'list': this.listCommand,
			'left': this.leftCommand
		}, this.errorHandling);
	}

	getQuiz(channel) {
		for (let i = 0; i < this.pool.length; ++i) {
			if (this.pool[i].channel === channel) {
				return this.pool[i];
			}
		}
		return null;
	}

	check(message) {
		let quiz = this.getQuiz(message.channel);
		if (quiz != null) {
			quiz.checkAnswer(message);
		}
	}

	execute(message, cmd) {
		if (cmd.length == 0) {
			message.channel.send(local.error(local.data.commands.quiz.error.noOption));
			return;
		}
		this.dispatcher.dispatch(cmd)(this, message, cmd);
	}

	startCommand(self, message, cmd) {
		if (message.channel.type == 'dm') {
			message.channel.send(local.error(local.data.commands.quiz.error.noDM));
			return;
		}
		let quiz = self.getQuiz(message.channel);
		if (quiz != null) {
			message.channel.send(local.error(local.data.commands.quiz.error.alreadyStarted));
		} else {
			self.pool.push(new Quiz(message.channel, self));			
		}
	}

	pauseCommand(self, message, cmd) {
		let quiz = self.getQuiz(message.channel);
		if (quiz != null) {
			quiz.pause();
		} else {
			message.channel.send(local.error(local.data.commands.quiz.error.noQuizRunning));
		}
	}

	resumeCommand(self, message, cmd) {
		let quiz = self.getQuiz(message.channel);
		if (quiz != null) {
			quiz.resume();
		} else {
			message.channel.send(local.error(local.data.commands.quiz.error.noQuizRunning));
		}
	}

	stopCommand(self, message, cmd) {
		if (!self.stopQuiz(message.channel)) {
			message.channel.send(local.error(local.data.commands.quiz.error.noQuizRunning));
		}
	}

	stopQuiz(channel, showScore = true) {
		for (let i = 0; i < this.pool.length; ++i) {
			if (this.pool[i].channel === channel) {
				this.pool[i].stop(showScore);
				this.pool.splice(i, 1);
				return true;
			}
		}
		return false;
	}

	scoreCommand(self, message, cmd) {
		let quiz = self.getQuiz(message.channel);
		if (quiz != null) {
			quiz.showScore();
		} else {
			message.channel.send(local.error(local.data.commands.quiz.error.noQuizRunning));
		}
	}

	listCommand(self, message, cmd) {
		fs.readdir('./quizzes', function(err, items) {
			if (err) {
				console.log(local.error(local.data.parser.log.readdir, {directory: './quizzes', error: err}));
				callback(local.get(local.data.parser.user.readdir), []);
				return;
			}
			if (items.length < 1) {
				message.channel.send(local.get(local.data.commands.quiz.noCategory));
			} else {
				let answer = 'Quizzes:';
				for (let i = 0; i < items.length; ++i) {
					let sp = items[i].split('.');
					if (sp.length > 1 && sp[sp.length - 1] === 'txt') {
						answer += ' ' + sp[0];
					}
				}
				message.channel.send(answer);
			}
		});
	}

	leftCommand(self, message, cmd) {
		let quiz = self.getQuiz(message.channel);
		if (quiz != null) {
			quiz.questionsLeft();
		} else {
			message.channel.send(local.error(local.data.commands.quiz.error.noQuizRunning));
		}
	}

	errorHandling(self, message, cmd) {
		message.channel.send(local.error(local.data.commands.quiz.error.wrongOption, {option: cmd[0]}));
	}
}

module.exports = QuizManager;