'use strict';

const local = require('./localization');
const Dispatcher = require('./Dispatcher');
const helpDispatcher = new Dispatcher({
	'quiz': quizHelp
}, errorHandling);

function quizHelp(message, cmd) {
	message.channel.send("Help Quiz");
}

function helpCommand(message, cmd) {
	cmd.shift();
	if (cmd.length) {
		helpDispatcher.dispatch(cmd)(message, cmd);
		return;
	}
	message.channel.send("Help");
}

function errorHandling(message, cmd) {
	message.channel.send(local.info(local.data.commands.info));
}

module.exports = helpCommand;