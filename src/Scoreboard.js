'use strict';

class Scoreboard {
	constructor() {
		this.scoreboard = [];
	}

	addPoints(user, points) {
		for (let i = 0; i < this.scoreboard.length; ++i) {
			if (this.scoreboard[i].user === user) {
				this.scoreboard[i].score += points;
				return ;
			}
		}
		this.scoreboard.push({'user': user, 'score': points});
	}

	showScore(channel, final = false) {
		if (this.scoreboard.length > 0) {
			this.scoreboard.sort(function(a, b) {
				return a.score - b.score;
			});
			let answer = (final ? "Final score:\n" : "Score:\n");
			for (let i = 0; i < this.scoreboard.length; ++i) {
				answer += this.scoreboard[i].user + ": " + this.scoreboard[i].score + "\n";
			}
			channel.send(answer);
		} else {
			channel.send("Nobody has point for now.");
		}
	}
}

module.exports = Scoreboard;