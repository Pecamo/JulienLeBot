'use strict';

var fs = require('fs');
var Dispatcher = require('./Dispatcher');
var Quiz = require('./Quiz');

class QuizManager {
	constructor() {
		this.pool = [];
		this.dispatcher = new Dispatcher({
			'start': this.startCommand,
			'pause': this.pauseCommand,
			'resume': this.resumeCommand,
			'stop': this.stopCommand,
			'score': this.scoreCommand,
			'list': this.listCommand
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
			message.channel.send("`!quiz` has to be used with an option. Use `!help quiz` for more informations.");
			return;
		}
		this.dispatcher.dispatch(cmd[0])(this, message, cmd);
	}

	startCommand(self, message, cmd) {
		let quiz = self.getQuiz(message.channel);
		if (quiz != null) {
			message.channel.send("The quiz has already started.");
		} else {
			self.pool.push(new Quiz(message.channel, self));			
		}
	}

	pauseCommand(self, message, cmd) {
		let quiz = self.getQuiz(message.channel);
		if (quiz != null) {
			quiz.pause();
		} else {
			message.channel.send("There is currently no running quiz to pause.");			
		}
	}

	resumeCommand(self, message, cmd) {
		let quiz = self.getQuiz(message.channel);
		if (quiz != null) {
			quiz.resume();
		} else {
			message.channel.send("There is currently no running quiz to resume.");			
		}
	}

	stopCommand(self, message, cmd) {
		if (!self.stopQuiz(message.channel)) {
			message.channel.send("There is currently no running quiz to stop.");
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
			message.channel.send("There is currently no ongoing quiz.");
		}
	}

	listCommand(self, message, cmd) {
		fs.readdir('./quizzes', function(err, items) {
			if (err) {
				console.log(err.message);
				message.channel.send("Woops, something broke. I'd recommand reading the logs ¯\\_(ツ)_/¯");
				return;
			}
			if (items.length < 1) {
				message.channel.send("No quiz currently available.");
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

	errorHandling(self, message, cmd) {
		message.channel.send(cmd[0] + " is not a quiz command. Use `!help quiz` for a list of available commands.");
	}
}

module.exports = QuizManager;