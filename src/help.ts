import * as Discord from 'discord.js';
import Dispatcher from './Dispatcher';
import * as local from './localization';

const helpDispatcher = new Dispatcher({
  quiz: quizHelp,
}, errorHandling);

function quizHelp(message: Discord.Message, cmd: any) {
  message.channel.send(local.embedInfo({
    title: `**${local.get(local.translations.commands.quiz.title)}**`,
    description: `${local.get(local.translations.commands.quiz.description)}
​`,
    fields: [
      {
        name: local.get(local.translations.commands.shortcut.title),
        value: `\`!start\` -> \`!quiz start\`
\`!pause\` -> \`!quiz pause\`
\`!resume\` -> \`!quiz resume\`
\`!stop\` -> \`!quiz stop\`
\`!score\` -> \`!quiz score\`
\`!list\` -> \`!quiz list\`
\`!left\` -> \`!quiz left\``,
      },
    ],
  }));
}

function helpCommand(message: Discord.Message, cmd: any) {
  cmd.shift();
  if (cmd.length) {
    helpDispatcher.dispatch(cmd)(message, cmd);
    return;
  }
  message.channel.send(local.embedInfo({
    title: `**${local.get(local.translations.commands.general.title)}**`,
    description: local.get(local.translations.commands.general.description),
    footer: {
      text: local.get(local.translations.commands.general.footer),
    },
  }));
}

function errorHandling(message: Discord.Message, cmd: any) {
  message.channel.send(local.info(local.translations.commands.general.info));
}

export default helpCommand;
