import { Client } from 'discord.js';
import { token } from './config/token.json';
import interact from './src/interactions';

const client = new Client();

client.on('ready', () => {
  console.log('Bot started.');
});

client.on('message', (message: any) => {
  if (message.author.id !== client.user.id) {
    interact(message);
  }
});

client.login(token);
