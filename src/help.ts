import * as Discord from 'discord.js';
import Dispatcher from './Dispatcher';
import * as local from './localization';

const helpDispatcher = new Dispatcher({quiz: quizHelp}, errorHandling);

function quizHelp(message: Discord.Message, cmd: any) {
  message.channel.send('Help Quiz');
}

function helpCommand(message: Discord.Message, cmd: any) {
  cmd.shift();
  if (cmd.length) {
    helpDispatcher.dispatch(cmd)(message, cmd);
    return;
  }
  message.channel.send('Help');
}

function errorHandling(message: Discord.Message, cmd: any) {
  message.channel.send(local.info(local.translations.commands.info));
}

export default helpCommand;
