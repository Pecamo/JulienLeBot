'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

var AI = require('./src/interactions.js');

client.on('ready', () => {
	console.log('Bot started.');
});

client.on('message', message => {
	if (message.author.id != client.user.id) {
		AI.interact(message);
	}
});

client.login(require('./token').token);