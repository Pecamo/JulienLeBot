'use strict';

import * as local from './localization';
import QuestionsQueue from './QuestionsQueue';
import QuizManagerInterface from './QuizManager';
import Scoreboard from './Scoreboard';
import Timer from './Timer';

const QUIZ_TIMER = 40;

class Quiz {
  private readonly channel: any;
  private manager: QuizManagerInterface;
  private scoreboard: Scoreboard;
  private timer: Timer;
  private paused: boolean;
  private canAnswer: boolean;
  private questionsQueue: QuestionsQueue;

  constructor(channel: any, quizManager: QuizManagerInterface) {
    this.channel = channel;
    this.manager = quizManager;
    this.scoreboard = new Scoreboard();
    this.timer = new Timer();
    this.paused = false;
    this.canAnswer = false;
    this.channel.send(local.get(local.translations.quiz.start));
    this.questionsQueue = new QuestionsQueue((err = '') => {
      if (err) {
        this.failedInit(err);
      } else {
        setTimeout(() => { this.begin(); }, 500);
      }
    });
  }

  failedInit(err: any) {
    this.channel.send(local.error(local.translations.quiz.error.chargement, {error: err}));
    setTimeout(() => { this.manager.stopQuiz(this.channel, false); }, 1000);
  }

  begin() {
    this.channel.send(local.get(local.translations.quiz.begin, {seconds: 10}));
    this.timer.reset(() => {
      this.nextQuestion();
    }, 10000);
  }

  nextQuestion() {
    this.canAnswer = true;
    const question = this.questionsQueue.getCurrentQuestion();
    const category = this.questionsQueue.getCurrentCategory();
    if (category) {
      this.channel.send(local.get(local.translations.quiz.categoryQuestion, {category, question}));
    } else {
      this.channel.send(local.get(local.translations.quiz.question, {question}));
    }
    this.timer.reset(() => {
      this.giveHint();
    }, QUIZ_TIMER / 2 * 1000);
  }

  giveHint() {
    this.channel.send(this.questionsQueue.getHint());
    this.timer.reset(() => {
      this.endQuestion();
    }, QUIZ_TIMER / 2 * 1000);
  }

  endQuestion(found = false) {
    this.canAnswer = false;
    if (!found) {
      this.channel.send(local.get(local.translations.quiz.noAnswer, {answer: this.questionsQueue.getFinalAnswer()}));
    }
    if (this.questionsQueue.nextQuestion()) {
      this.channel.send(local.get(local.translations.quiz.nextQuestion, {seconds: 10}));
      this.timer.reset(() => {
        this.nextQuestion();
      }, 10000);
    } else {
      this.manager.stopQuiz(this.channel);
    }
  }

  checkAnswer(message: any) {
    if (!this.paused && this.canAnswer && this.questionsQueue.checkAnswer(message.content)) {
      const score = this.scoreboard.addPoints(message.author, 1);
      this.timer.pause();
      this.scoreboard.saveScore('score.txt');
      this.channel.send(`${local.get(local.translations.quiz.goodAnswer, {answer: message.content, username: message.author.username})}
${local.get(local.translations.quiz.userScore, {score, username: message.author.username})}`);
      this.endQuestion(true);
    }
  }

  pause() {
    if (this.paused) {
      this.channel.send(local.error(local.translations.quiz.error.alreadyPaused));
    } else {
      this.paused = true;
      this.timer.pause();
      this.channel.send(local.get(local.translations.quiz.pause));
    }
  }

  resume() {
    if (!this.paused) {
      this.channel.send(local.error(local.translations.quiz.error.notPaused));
    } else {
      this.paused = false;
      this.timer.resume();
      this.channel.send(local.get(local.translations.quiz.resume));
    }
  }

  showScore() {
    this.scoreboard.showScore(this.channel);
  }

  questionsLeft() {
    this.channel.send(local.info(local.translations.quiz.count, {questions_count: this.questionsQueue.count()}));
  }

  stop(showScore = true) {
    this.timer.pause();
    if (showScore) {
      this.channel.send(local.get(local.translations.quiz.end));
    }
    this.channel.send(local.get(local.translations.quiz.stop));
    if (showScore) {
      this.showScore();
    }
  }
}

export default Quiz;
