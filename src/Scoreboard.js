'use strict';

const local = require('./localization');
const fs = require('fs');

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
			case 2:
				return ":second_place: ";
			case 3:
				return ":third_place: ";
		}
		return ":medal:";
	}

	saveScore(file) {
		this.scoreboard.sort(function(a, b) {
			return b.score - a.score;
		});
		let content = '';
		for (let i = 0; i < this.scoreboard.length; ++i) {
			content += this.scoreboard[i].user.username + ' ' + this.scoreboard[i].score + '\n';
		}
		fs.writeFile(file, content, (err) => {
			if (err) {
				console.log(local.get(local.data.parser.log.writefile, {file: file, error: err}));
			}
		});
	}

	showScore(channel) {
		let content = {
			color: 4886754,
			title: "**" + local.get(local.data.quiz.scoreboardTitle) + "**",
			description: "\u200b\n"
		};
		if (this.scoreboard.length > 0) {
			this.scoreboard.sort(function(a, b) {
				return b.score - a.score;
			});
			let place = 1;
			let realplace = place;
			for (let i = 0; i < this.scoreboard.length; ++i) {
				realplace++;
				content.description += this.getPlaceEmoji(place) + " " + this.scoreboard[i].score + " - *" + this.scoreboard[i].user.username + "*\n";
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