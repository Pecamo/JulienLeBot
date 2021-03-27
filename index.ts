import { Client } from 'discord.js';
import fs from 'fs';
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

const { token } = JSON.parse(fs.readFileSync('./config/token.json', 'utf-8'));

client.login(token);
