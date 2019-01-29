import Dispatcher from './Dispatcher';
import helpCommand from './help';
import * as local from './localization';
import QuizManager from './QuizManager';

const cmdDispatcher = new Dispatcher({
  quiz: quizCommand,
  help: helpCommand,
}, errorHandling, {
  score: ['quiz', 'score'],
  start: ['quiz', 'start'],
  stop: ['quiz', 'stop'],
  pause: ['quiz', 'pause'],
  resume: ['quiz', 'resume'],
  list: ['quiz', 'list'],
  left: ['quiz', 'left'],
});

const qManager = new QuizManager();

function quizCommand(message: any, cmd: any) {
  cmd.shift();
  qManager.execute(message, cmd);
}

function errorHandling(message: any, cmd: any) {
  message.channel.send(local.info(local.translations.commands.general.info));
}

function executeCommand(message: any) {
  const cmd = message.content.toLowerCase().substring(1).split(' ');
  if (cmd.length === 0) return;

  cmdDispatcher.dispatch(cmd)(message, cmd);
}

const interact = (message: any) => {
  const cleaned = message.content.replace(/\s+/g, ' ').trim();
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

export default interact;
