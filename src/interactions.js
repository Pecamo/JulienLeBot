'use strict';

const helpCommand = require('./help');
const local = require('./localization');
const Dispatcher = require('./Dispatcher');
const cmdDispatcher = new Dispatcher({
	'quiz': quizCommand,
	'help': helpCommand
}, errorHandling, {
	'score': ['quiz', 'score'],
	'start': ['quiz', 'start'],
	'stop': ['quiz', 'stop'],
	'pause': ['quiz', 'pause'],
	'resume': ['quiz', 'resume'],
	'list': ['quiz', 'list'],
	'left': ['quiz', 'left']
});

const QuizManager = require('./QuizManager');
const qManager = new QuizManager();

function quizCommand(message, cmd) {
	cmd.shift();
	qManager.execute(message, cmd);
}

function errorHandling(message, cmd) {
	message.channel.send(local.info(local.data.commands.general.info));
}

function executeCommand(message) {
	let cmd = message.content.toLowerCase().substring(1).split(" ");
	if (cmd.length === 0) return;

	cmdDispatcher.dispatch(cmd)(message, cmd);
}

module.exports.interact = function(message) {
	let cleaned = message.content.replace(/\s+/g, ' ').trim();
	if (message.content.charAt(0) === '!') {
		message.content = cleaned;
		executeCommand(message);
		return;
	}
	qManager.check(message);
	if (message.content === 'ping') {
	    message.channel.send('Qui se permet de pinger le grand Julien LeBot ?');
  	}
};