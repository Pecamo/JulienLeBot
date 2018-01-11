'use strict';

var local = require('./localization');

class Scoreboard {
	constructor() {
		this.scoreboard = [];
	}

	addPoints(user, points) {
		for (let i = 0; i < this.scoreboard.length; ++i) {
			if (this.scoreboard[i].user === user) {
				this.scoreboard[i].score += points;
				return this.scoreboard[i].score;
			}
		}
		this.scoreboard.push({'user': user, 'score': points});
		return points;
	}

	getPlaceEmoji(place) {
		switch(place) {
			case 1:
				return ":first_place: ";
				break;
			case 2:
				return ":second_place: ";
				break;
			case 3:
				return ":third_place: ";
				break;
		}
		return '';
	}

	showScore(channel) {
		let content = {
			color: 4886754,
			title: local.get(local.data.quiz.scoreboardTitle),
			description: ''
		};
		if (this.scoreboard.length > 0) {
			this.scoreboard.sort(function(a, b) {
				return a.score - b.score;
			});
			let place = 1;
			let realplace = place;
			for (let i = 0; i < this.scoreboard.length; ++i) {
				content.description += this.getPlaceEmoji(place);
				content.description += "*" + this.scoreboard[i].user.username + "*\t\t\t\t\t" + this.scoreboard[i].score + "\n";
				realplace++;
				if (i < this.scoreboard.length - 1 && this.scoreboard[i].score > this.scoreboard[i + 1].score) {
					place = realplace;
				}
			}
		} else {
			content.description = local.get(local.data.quiz.noPoint);
		}
		channel.send({embed: content});
	}
}

module.exports = Scoreboard;