'use strict';

import * as fs from 'fs';
import * as local from './localization';

function replaceChar(str: string, idx: number, char: string) {
  const tab = str.split('');
  tab[idx] = char;
  return tab.join('');
}

function encodeEscape(str: string) {
  return (str.replace(/\\(.|\r?\n|\r)/g, (a, b) => {
    return (`%${b.charCodeAt(0)}%`);
  }));
}

function decodeEscape(str: string) {
  return (str.replace(/%(\d+)%/g, (a, b) => {
    const char = String.fromCharCode(parseInt(b, 10));
    return ((/[a-mo-zA-Z0-9]/.test(char) ? '' : '\\') + char);
  }));
}

function decodePlain(str: string) {
  return (str.replace(/%(\d+)%/g, (a, b) => {
    const char = String.fromCharCode(parseInt(b, 10));
    return (char === 'n' ? '\n' : char);
  }));
}

class QuizParser {
  private testQuestions: Array<any>;

  constructor() {
    this.testQuestions = [];
  }

  parse(callback: Function) {
    fs.readdir('./quizzes', (err, items) => {
      if (err) {
        console.log(local.get(local.translations.parser.log.readdir, {directory: './quizzes', error: err}));
        callback(local.get(local.translations.parser.user.readdir), []);
        return;
      }
      for (let i = 0; i < items.length;) {
        const sp = items[i].split('.');
        if (sp.length > 1 && sp[sp.length - 1] === 'txt') {
          ++i;
        } else {
          items.splice(i, 1);
        }
      }
      if (!items.length) {
        callback(local.get(local.translations.parser.user.noQuiz), []);
        return;
      }
      let parsed = 0;
      let error = false;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < items.length; ++i) {
        fs.readFile(`./quizzes/${items[i]}`, 'utf8', (err2, data) => {
          if (err2) {
            console.log(local.get(local.translations.parser.log.readfile, {file: items[i], error: err2}));
            error = true;
          } else if (!error) {
            this.parseFileContent(data, items[i].split('.')[0]);
          }
          parsed++;
          if (parsed >= items.length) {
            if (error) {
              callback(local.get(local.translations.parser.user.readfile), []);
            } else if (!this.testQuestions.length) {
              callback(local.get(local.translations.parser.user.noQuestion), []);
            } else {
              callback(null, this.testQuestions);
            }
          }
        });
      }
    });
  }

  parseFileContent(content: string, category: string) {
    // Remove comments
    // tslint:disable-next-line:no-parameter-reassignment
    content = content.replace(/(\/{3,}.*(?:\r?\n|\r)?)/g, '');
    const questions = content.match(/((?:.+(?:\r?\n|\r)?)+)/g);
    if (!questions) return;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < questions.length; ++i) {
      this.parseQuestion(questions[i], category);
    }
  }

  parseQuestion(question: string, category: string) {
    let sp = encodeEscape(question).split(/\r?\n|\r/g);
    // Remove last element if it does not contain characters
    if (!/\S/.test(sp[sp.length - 1])) {
      sp.pop();
    }
    if (sp.length < 2) {
      console.log(local.get(local.translations.parser.log.missingQA, {question}));
      return;
    }
    const originals = sp.slice();
    sp = this.cleanUp(sp);
    const holes = (sp[0].match(/___/g) || []).length;
    if (this.checkAnswersFormat(question, sp, holes, originals)) {
      if (holes) {
        this.parseMultipleFormat(question, sp, category);
      } else {
        this.parseSingleFormat(question, sp, category);
      }
    }
  }

  cleanEmptySlots(array: Array<any>) {
    for (let i = 0; i < array.length;) {
      if (/\S/.test(array[i])) {
        ++i;
      } else {
        array.splice(i, 1);
      }
    }
    return array;
  }

  cleanUp(sp: any) {
    sp[0] = sp[0].trim();
    for (let i = 1; i < sp.length; ++i) {
      sp[i] = this.cleanEmptySlots(sp[i].trim().split(/ ?-> ?/g));
      if (sp[i].length > 1) {
        sp[i][0] = this.cleanEmptySlots(sp[i][0].split(/ ?, ?/g));
      }
    }
    return sp;
  }

  checkArrows(question: string, answer: string, holes: any, original: any) {
    if (answer.length > 2) {
      console.log(local.get(local.translations.parser.log.multipleArrows, {question, answer: original}));
      return false;
    }
    return true;
  }

  checkHoles(question: string, answer: string, holes: any, original: any) {
    if (!holes && answer.length > 1) {
      console.log(local.get(local.translations.parser.log.noHole, {question, answer: original}));
      return false;
    }
    if (holes > 0 && answer[0].length !== holes) {
      console.log(local.get(local.translations.parser.log.mismatchHoles, {question, answer: original, question_holes: holes, answer_opt: answer[0].length}));
      return false;
    }
    return true;
  }

  checkParentheses(question: string, answer: string, original: any) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < answer.length; ++i) {
      if (answer[i].constructor === String) {
        let par = 0;
        for (const char of answer[i]) {
          if (char === '(') {
            par++;
          } else if (char === ')') {
            par--;
          }
          if (par < 0) {
            console.log(local.get(local.translations.parser.log.mismatchRightParenthesis, {question, answer: original}));
            return false;
          }
        }
        if (par > 0) {
          console.log(local.get(local.translations.parser.log.mismatchLeftParenthesis, {question, answer: original}));
          return false;
        }
      }
    }
    return true;
  }

  checkAnswersFormat(question: string, sp: any, holes: any, originals: any) {
    if (!holes && sp.length > 2) {
      console.log(local.get(local.translations.parser.log.tooManyAnswer, {question}));
    }
    for (let i = 1; i < sp.length; ++i) {
      if (!this.checkArrows(question, sp[i], holes, originals[i]) ||
        !this.checkHoles(question, sp[i], holes, originals[i]) ||
        !this.checkParentheses(question, sp[i], originals[i])) {
        sp.splice(i, 1);
        i--;
      }
    }
    return (sp.length > 1);
  }

  escapeRegExp(text: string) {
    return text.replace(/[-[\]{}*+?.,\\^$|#\s]/g, '\\$&');
  }

  swapIfFirstOption(answer: string) {
    if (answer[0] === '(') {
      let par = 0;
      for (let i = 0; i < answer.length; ++i) {
        if (answer[i] === '(') {
          par++;
        }
        if (answer[i] === ')') {
          par--;
          if (par === 0) {
            if (i < answer.length - 1 && answer[i + 1] === ' ') {
              // tslint:disable-next-line:no-parameter-reassignment
              answer = replaceChar(answer, i + 1, ')');
              while (answer[i--] === ')');
              // tslint:disable-next-line:no-parameter-reassignment
              answer = replaceChar(answer, i + 2, ' ');
              return answer;
            }
          }
        }
      }
    }
    return answer;
  }

  createRegExpAnswer(answers: string) {
    const sp = answers.split(/,/g);
    for (let i = 0; i < sp.length; ++i) {
      sp[i] = sp[i].trim();
      sp[i] = this.escapeRegExp(this.swapIfFirstOption(sp[i]).replace(/\s(\(+)/g, '$1 '));
      sp[i] = sp[i].replace(/\)/g, ')?');
      sp[i] = `^${sp[i]}$`;
    }
    return new RegExp(decodeEscape(sp.join('|')), 'i');
  }

  createFinalAnswer(answer: string) {
    return (answer.replace(/[()]/g, ''));
  }

  createHint(answer: string) {
    let start = -1;
    let par = 0;
    const answerLength = answer.length;
    const hintPercent = 10;
    for (let i = 0; i < answerLength; ++i) {
      if (answer[i] === '(') {
        par++;
        if (start < 0) {
          start = i;
        }
      }
      if (answer[i] === ')') {
        par--;
        if (par === 0) {
          if (start > -1) {
            // tslint:disable-next-line:no-parameter-reassignment
            answer = answer.replace(answer.substring(start, i + 1), '');
            i = start - 1;
          }
          start = -1;
        }
      }
    }
    // tslint:disable-next-line:prefer-template
    return decodePlain(answer).trim().slice(0, Math.ceil(answerLength / 100 * hintPercent)) + '...';
  }

  parseSingleFormat(question: string, sp: any, category: any) {
    const fAnswer = sp[1][0].split(',')[0].trim();
    this.testQuestions.push({
      category,
      question: decodePlain(sp[0]),
      answer: this.createRegExpAnswer(sp[1][0]),
      hint: this.createHint(fAnswer),
      finalAnswer: decodePlain(this.createFinalAnswer(fAnswer)),
    });
  }

  parseMultipleFormat(question: string, sp: any, category: any) {
    for (let i = 1; i < sp.length; ++i) {
      let q = sp[0];
      // tslint:disable-next-line:prefer-for-of
      for (let h = 0; h < sp[i][0].length; ++h) {
        q = q.replace(/___/, sp[i][0][h]);
      }
      const fAnswer = sp[i][1].split(',')[0].trim();
      this.testQuestions.push({
        category,
        question: decodePlain(q),
        answer: this.createRegExpAnswer(sp[i][1]),
        hint: this.createHint(fAnswer),
        finalAnswer: decodePlain(this.createFinalAnswer(fAnswer)),
      });
    }
  }
}

export default QuizParser;
