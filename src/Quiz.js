'use strict';

class Quiz {
	constructor(channel, quizManager) {
		this.channel = channel;
		this.manager = quizManager;
		this.channel.send("Quiz started!");
	}

	checkAnswer(message) {
		//message.channel.send("Ahlala, c'est pas terrible...");
	}

	pause() {

	}
}

module.exports = Quiz;