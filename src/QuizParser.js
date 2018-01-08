'use strict';

var fs = require('fs');

class QuizParser {
	constructor() {
		this.testQuestions =  [
			{ 'question': "Quel animal?", 'answer': new RegExp("^(un )?chien$|^(un )?chat$", "gi"), 'hint': "C...", 'finalAnswer': 'Un chat' },
			{ 'question': "Quelle nourriture?", 'answer': new RegExp("^(le (petit )?)?poulet$|^cassoulet$", "gi"), 'hint': "P...", 'finalAnswer': 'Du poulet' }
		];
	}

	parse(callback) {
		fs.readdir('./quizzes', (err, items) => {
			if (err) {
				console.log("Readdir error: " + err);
				callback("Unable to read quizzes directory.", []);
				return;
			}
			for (let i = 0; i < items.length; ++i) {
				if (items != 'README') {
					callback(null, this.testQuestions);
					return ;
				}
			}
			callback("No quiz available.", []);
		});
	}
}

module.exports = QuizParser;

/// <summary>
/// Format:
/// 
/// - Questions are separated by at least two blank lines.
/// - The first lines of a question contains the question paragraphs, where ___ (three underscores) denote holes.
/// - Next lines contain hole values (for all paragraphs) separated by commas, 
///   followed by -> then the possible answers, also separated by commas.
/// - If there are no holes, the answers must be preceded by -> anyway.
/// - Answers may contain parenthesized portions, which are optional.
/// 
/// Who ran against Jimmy Carter in 1976?
/// -> (Gerald (R.)) Ford
/// 
/// Who was elected President of ___ in ___?
/// the United States, 2008 -> (Barack) Obama
/// France, 2012 -> (François) Hollande
/// 
/// In which year was ___ elected President of the United States?
/// Franklin D. Roosevelt -> 1932, 1936, 1940, 1944
/// Harry S Truman -> 1948
/// 
/// This country was ruled by George W. Bush from 2000 to 2008.
/// It led the First World during the Cold War.
/// -> (The) United States, US(A), U.S.(A.)
/// </summary>

///((?:.+\n{1})+[^\n]+)


/*function escapeRegExp(text) {
  return text.replace(/[-[\]{}*+?.,\\^$|#\s]/g, '\\$&');
}

var test = escapeRegExp('(Gerald (R.)) Ford'.replace(/(\)+) /g, ' $1')).replace(/\)/g, ')?');
test = '^' + test + '$';

var reg = new RegExp(test, 'gi');

console.log(reg.test('gerald r. ford'));
console.log(reg.test('gerald r.ford'));
console.log(/^(Gerald (R\. )?)?Ford$/gi.test('gerald r. ford'));
console.log(/^(Gerald (R\. )?)?Ford$/gi.test('gerald r.ford'));*/
