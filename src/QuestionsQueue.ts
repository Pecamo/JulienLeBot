import QuizParser from './QuizParser';

/** Returns a random integer between min (inclusive) and max (inclusive) */
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class QuestionsQueue {
  private questions: Array<any>;
  private qid: number;

  constructor(callback: Function) {
    const parser = new QuizParser();
    this.questions = [];
    this.qid = 0;
    const ret = parser.parse((err: any, questions: any) => {
      if (err) {
        callback(err);
        return;
      }
      this.questions = questions;
      this.qid = getRandomInt(0, this.questions.length - 1);
      callback();
    });
  }

  getCurrentCategory() {
    return ((this.questions[this.qid].hasOwnProperty('category') && this.questions[this.qid].category) ? this.questions[this.qid].category : null);
  }

  getCurrentQuestion() {
    return (this.questions[this.qid].question);
  }

  getHint() {
    return (this.questions[this.qid].hint);
  }

  getFinalAnswer() {
    return (this.questions[this.qid].finalAnswer);
  }

  checkAnswer(answer: string) {
    return (this.questions[this.qid].answer.test(answer));
  }

  nextQuestion() {
    if (this.questions.length === 1) {
      return false;
    }
    this.questions.splice(this.qid, 1);
    this.qid = getRandomInt(0, this.questions.length - 1);
    return true;
  }

  count() {
    return this.questions.length;
  }
}

export default QuestionsQueue;
