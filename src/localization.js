'use strict';

var local = 'FR';

function getLocal(data, ...args) {
	let line = data[local] || data['EN'] || data[Object.keys(data)[0]];
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
}

module.exports = {
	get: getLocal,
	error: function(data, ...args) {
		return {embed: {
			color: 11278626,
			description: getLocal(data, ...args)
		}};
	},
	info: function(data, ...args) {
		return {embed: {
			color: 4886754,
			description: getLocal(data, ...args)
		}};
	},
	data: {
		commands: {
			info: {
				FR: "`!help` pour accéder à la liste des commandes."
			},
			quiz: {
				error: {
					noDM: {
						FR: "Cette commande est uniquement disponible sur un channel public."
					},
					noOption: {
						FR: "La commande `!quiz` nécessite une option. `!help quiz` pour plus d'informations."
					},
					wrongOption: {
						FR: "`$1` n'est pas une option valide. `!help quiz` pour plus d'informations."
					},
					alreadyStarted: {
						FR: "Un quiz est déjà lancé sur ce channel."
					},
					noQuizRunning: {
						FR: "Aucun quiz d'actif sur ce channel."
					}
				},
				noCategory: {
					FR: "Aucun quiz à disposition."
				}
			}
		},
		parser: {
			log: {
				readdir: {
					EN: "Readdir error: $1: $2."
				},
				readfile: {
					EN: "Readfile error: $1: $2."
				},
				missingQA: {
					EN: "Warning: Missing question or answer for the block:\n$1\nQuestion ignored."
				},
				tooManyAnswer: {
					EN: "Warning: The following question has multiple answers but no hole. Only the first answer will be used.\n$1"
				},
				multipleArrows: {
					EN: "Error: The answer '$1' must only contain one arrow for the following question block.\n$2"
				},
				noHole: {
					EN: "Error: The following question block has no hole, but the answer '$1' contains fillers.\n$2"
				},
				mismatchHoles: {
					EN: "Error: Holes number do not match for the answer '$1'. $2 hole(s) in the question but $3 possibilities given in the answer for the following question block.\n$4"
				},
				mismatchRightParenthesis: {
					EN: "Error: Mismatch ')' in answer '$1' for the following question block.\n$2"
				},
				mismatchLeftParenthesis: {
					EN:  "Error: Mismatch '(' in answer '$1' for the following question block.\n$2"
				}
			},
			user: {
				readdir: {
					FR: "Impossible d'accéder au dossier contenant les quiz."
				},
				noQuiz: {
					FR: "Aucun fichier de quiz trouvé."
				},
				noQuestion: {
					FR: "Aucune question valide n'a été trouvée."
				},
				readfile: {
					FR: "Une erreur est survenue lors de la lecture des quiz."
				}
			}
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
					"C'est oui ! **$1** !",
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
			userScore: {
				FR: "*($1, $2 points)*"
			},
			scoreboardTitle: {
				FR: ":trophy: Tableau des scores"
			},
			noPoint: {
				FR: "Personne n'a de point ¯\\_(ツ)_/¯"
			}
		}
	}
};