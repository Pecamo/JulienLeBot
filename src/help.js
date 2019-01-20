'use strict';

const local = require('./localization');
const Dispatcher = require('./Dispatcher');
const helpDispatcher = new Dispatcher({
	'quiz': quizHelp
}, errorHandling);

function quizHelp(message, cmd) {
	message.channel.send(local.embedInfo({
		title: "**" + local.get(local.data.commands.quiz.title) + "**",
		description: local.get(local.data.commands.quiz.description) + "\n\u200b",
		fields: [
			{
				name: local.get(local.data.commands.shortcut.title),
				value: "`!start` -> `!quiz start`\n`!pause` -> `!quiz pause`\n`!resume` -> `!quiz resume`\n`!stop` -> `!quiz stop`\n`!score` -> `!quiz score`\n`!list` -> `!quiz list`\n`!left` -> `!quiz left`"
			}
		]
	}));	
}

function helpCommand(message, cmd) {
	cmd.shift();
	if (cmd.length) {
		helpDispatcher.dispatch(cmd)(message, cmd);
		return;
	}
	message.channel.send(local.embedInfo({
		title: "**" + local.get(local.data.commands.general.title) + "**",
		description: local.get(local.data.commands.general.description),
		footer: {
			text: local.get(local.data.commands.general.footer)
		}
	}));
}

function errorHandling(message, cmd) {
	message.channel.send(local.info(local.data.commands.general.info));
}

module.exports = helpCommand;