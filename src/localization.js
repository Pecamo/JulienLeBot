'use strict';

var local = 'FR';

module.exports = {
	get: function(data) {
		let line = data[local];
		if (line.constructor === Array) {
			line = line[Math.floor(Math.random() * line.length)];
		}
		if (!line) {
			return '';
		}
		for (let i = 1; i < arguments.length; ++i) {
			line = line.replace(new RegExp("\\$" + i, "g"), arguments[i]);
		}
		return line;
	},
	data: {
		commands: {

		},
		quiz: {
			error: {
				alreadyPaused: {
					FR: "Le quiz est déjà en pause."
				},
				notPaused: {
					FR: "Le quiz n'est pas en pause."
				},
				chargement: {
					FR: "Impossible de charger les questions du quiz: $1"
				}
			},
			start: {
				FR: "**Chargement du quiz**"
			},
			stop: {
				FR: "**Quiz terminé**"
			},
			begin: {
				FR: "Bienvenue à tous pour cette nouvelle session de *Question pour du fnu* !\n*(Le quiz commencera dans $1 secondes)*"
			},
			pause: {
				FR: "On se retrouve après une courte page de pub!\n**Quiz mis en pause**"
			},
			resume: {
				FR: "**Quiz repris**\nEt c'est reparti !"
			},
			question: {
				FR: [
					"Top... **$1**",
					"**$1**"
				]
			},
			categoryQuestion: {
				FR: [
					"Dans la catégorie *$2*, **$1**",
					"En *$2*, **$1**",
					"Nous avons *$2*... Top ! **$1**",
					"*$2*... Top ! **$1**"
				]
			},
			nextQuestion: {
				FR: "*(Prochaine question dans $1 secondes.)*"
			},
			goodAnswer: {
				FR: [
					"Oui bien sûr, **$1**.",
					"Ah oui oui oui oui ! **$1** !",
					"Oui oui oui oui oui, **$1**.",
					"C'est oui ! $1 !",
					"Oui, **$1**, d'accord.",
					"**$1**, voilà...",
					"**$1**, voilà, d'accord.",
					"Voilà, **$1**.",
					"Mais bien sûr, **$1** !",
					"Mais oui, d'accord, **$1**.",
					"**$1**, d'accord.",
					"**$1**, bien sûr !",
					"Exactement, **$1**, d'accord.",
					"**$1**, oui !",
					"**$1**, ça c'est bon.",
					"Bien sûr ! **$1**.",
					"Exactement, **$1**.",
					"Oh oui ! **$1** !",
					"C'est bien **$1** !",
					"**$1**, très bien.",
					"**$1**, ah oui, bien joué *$2*.",
					"**$1**, *$2* a raison.",
					"**$1**, très bonne réponse de *$2* qui s'en sort bien.",
					"**$1**, bien joué *$2*.",
					"Oui oui **$1**, *$2*."
				]
			},
			noAnswer: {
				FR: [
					"Non non... **$1**.",
					"Non, ça c'est non... **$1**.",
					"C'est pas ça du tout... c'est **$1**.",
					"... **$1**.",
					"... **$1**, $1.",
					"Réponse, **$1**."
				]
			},
			end: {
				FR: [
					"C'était *Questions pour du Fnu*, merci d'avoir joué.",
					"C'était *Question pour du Fnu* ! Très bonne soirée à tous, à demain !"
				]
			},
			scoreboardTitle: {
				FR: "Scores"
			},
			noPoint: {
				FR: "Personne n'a de point ¯\\_(ツ)_/¯"
			}
		}
	}
};