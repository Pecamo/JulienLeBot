'use strict';

var Dispatcher = require('./Dispatcher');
var Quiz = require('./Quiz');

class QuizManager {
	constructor() {
		this.pool = [];
		this.dispatcher = new Dispatcher({
			'start': this.startCommand,
			'stop': this.stopCommand
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
			return;
		}
		self.pool.push(new Quiz(message.channel));
	}

	stopCommand(self, message, cmd) {
		let quiz = self.getQuiz(message.channel);
		for (let i = 0; i < self.pool.length; ++i) {
			if (self.pool[i].channel === message.channel) {
				self.pool.splice(i, 1);
				message.channel.send("Quiz stopped.");
				return;
			}
		}
		message.channel.send("There is currently no running quiz to stop.");
	}

	errorHandling(self, message, cmd) {
		message.channel.send(cmd[0] + " is not a quiz command. Use `!help quiz` for a list of available commands.");
	}
}

module.exports = QuizManager;