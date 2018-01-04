'use strict';

var Dispatcher = require('./Dispatcher');
var cmdDispatcher = new Dispatcher({
	'quiz': quizCommand,
	'help': helpCommand
}, errorHandling);

var QuizManager = require('./QuizManager');
var qManager = new QuizManager();

function quizCommand(message, cmd) {
	cmd.shift();
	qManager.execute(message, cmd);
}

function helpCommand(message, cmd) {
	message.channel.send({embed: {
	  color: 3447003,
	  description: "A very simple Embed!"
	}});
}

function errorHandling(message, cmd) {
	message.channel.send("Type `!help` to access the commands list.");
}

function executeCommand(message) {
	let cmd = message.content.toLowerCase().substring(1).split(" ");
	if (cmd.length === 0) return;

	cmdDispatcher.dispatch(cmd[0])(message, cmd);
}

module.exports.interact = function(message) {
	message.content = message.content.replace(/\s+/g, ' ').trim();
	if (message.content.charAt(0) === '!') {
		executeCommand(message);
		return;
	}
	qManager.check(message);
	if (message.content === 'ping') {
	    message.channel.send('Qui se permet de pinger le grand Julien LeBot ?');
  	}
}