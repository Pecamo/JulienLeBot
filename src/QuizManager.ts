'use strict';

import * as fs from 'fs';
import Dispatcher from './Dispatcher';
import * as local from './localization';
import Quiz from './Quiz';

class QuizManager {
  private pool: Array<any>;
  private dispatcher: Dispatcher;
  constructor() {
    this.pool = [];
    this.dispatcher = new Dispatcher({
      start: this.startCommand,
      pause: this.pauseCommand,
      resume: this.resumeCommand,
      stop: this.stopCommand,
      score: this.scoreCommand,
      list: this.listCommand,
      left: this.leftCommand,
    }, this.errorHandling);
  }

  getQuiz(channel: any) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.pool.length; ++i) {
      if (this.pool[i].channel === channel) {
        return this.pool[i];
      }
    }
    return null;
  }

  check(message: any) {
    const quiz = this.getQuiz(message.channel);
    if (quiz != null) {
      quiz.checkAnswer(message);
    }
  }

  execute(message: any, cmd: any) {
    if (cmd.length === 0) {
      message.channel.send(local.error(local.translations.commands.quiz.error.noOption));
      return;
    }
    this.dispatcher.dispatch(cmd)(this, message, cmd);
  }

  startCommand(self: any, message: any, cmd: any) {
    if (message.channel.type === 'dm') {
      message.channel.send(local.error(local.translations.commands.quiz.error.noDM));
      return;
    }
    const quiz = self.getQuiz(message.channel);
    if (quiz != null) {
      message.channel.send(local.error(local.translations.commands.quiz.error.alreadyStarted));
    } else {
      self.pool.push(new Quiz(message.channel, self));
    }
  }

  pauseCommand(self: any, message: any, cmd: any) {
    const quiz = self.getQuiz(message.channel);
    if (quiz != null) {
      quiz.pause();
    } else {
      message.channel.send(local.error(local.translations.commands.quiz.error.noQuizRunning));
    }
  }

  resumeCommand(self: any, message: any, cmd: any) {
    const quiz = self.getQuiz(message.channel);
    if (quiz != null) {
      quiz.resume();
    } else {
      message.channel.send(local.error(local.translations.commands.quiz.error.noQuizRunning));
    }
  }

  stopCommand(self: any, message: any, cmd: any) {
    if (!self.stopQuiz(message.channel)) {
      message.channel.send(local.error(local.translations.commands.quiz.error.noQuizRunning));
    }
  }

  stopQuiz(channel: any, showScore = true) {
    for (let i = 0; i < this.pool.length; ++i) {
      if (this.pool[i].channel === channel) {
        this.pool[i].stop(showScore);
        this.pool.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  scoreCommand(self: any, message: any, cmd: any) {
    const quiz = self.getQuiz(message.channel);
    if (quiz != null) {
      quiz.showScore();
    } else {
      message.channel.send(local.error(local.translations.commands.quiz.error.noQuizRunning));
    }
  }

  listCommand(self: any, message: any, cmd: any) {
    fs.readdir('./quizzes', (err, items) => {
      if (err) {
        console.log(local.error(local.translations.parser.log.readdir, {directory: './quizzes', error: err}));
        callback(local.get(local.translations.parser.user.readdir), []); // TODO : Figure out where does this come from
        return;
      }
      if (items.length < 1) {
        message.channel.send(local.get(local.translations.commands.quiz.noCategory));
      } else {
        let answer = 'Quizzes:';
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < items.length; ++i) {
          const sp = items[i].split('.');
          if (sp.length > 1 && sp[sp.length - 1] === 'txt') {
            answer += ` ${sp[0]}`;
          }
        }
        message.channel.send(answer);
      }
    });
  }

  leftCommand(self: any, message: any, cmd: any) {
    const quiz = self.getQuiz(message.channel);
    if (quiz != null) {
      quiz.questionsLeft();
    } else {
      message.channel.send(local.error(local.translations.commands.quiz.error.noQuizRunning));
    }
  }

  errorHandling(self: any, message: any, cmd: any) {
    message.channel.send(local.error(local.translations.commands.quiz.error.wrongOption, {option: cmd[0]}));
  }
}

export default QuizManager;
