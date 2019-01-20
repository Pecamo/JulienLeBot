'use strict';

const local = 'FR';

function getLocal(data, args = {}) {
	let line = data[local] || data['EN'] || data[Object.keys(data)[0]];
	if (line.constructor === Array) {
		line = line[Math.floor(Math.random() * line.length)];
	}
	if (!line) {
		return '';
	}
	for (let key in args) {
		line = line.replace(new RegExp("\{" + key + "\}", "g"), args[key]);
	}
	return line;
}

module.exports = {
	get: getLocal,
	error: function(data, args = {}) {
		return {embed: {
			color: 11278626,
			description: getLocal(data, args)
		}};
	},
	info: function(data, args = {}) {
		return {embed: {
			color: 4886754,
			description: getLocal(data, args)
		}};
	},
	embedInfo: function(embedData, args = {}) {
		embedData.color = 4886754;
		return {embed: embedData};
	},
	data: {
		commands: {
			general: {
				info: {
					FR: "`!help` pour accéder à la liste des commandes."
				},
				description: {
					FR: "Liste des commandes disponibles.\n\n`!help` - Affiche l'aide\n`!quiz <option>` - Utilise une commande de quiz."
				},
				title: {
					FR: "Commandes"
				},
				footer: {
					FR: "`!help <commande>` pour plus d'informations sur une commande."
				},
			},
			shortcut: {
				title: {
					FR: "Raccourcis"
				}
			},
			quiz: {
				title: {
					FR: "Commande quiz"
				},
				description: {
					FR: "Liste des commandes de quiz.\n\n`!quiz start` - Lance un quiz dans le channel\n`!quiz pause` - Met en pause le quiz\n`!quiz resume` - Reprend le quiz mis en pause\n`!quiz stop` - Arrête le quiz\n`!quiz score` - Affiche le score du quiz en cours\n`!quiz list` - Liste les quiz disponibles\n`!quiz left` - Affiche le nombre de questions restantes"
				},
				error: {
					noDM: {
						FR: "Cette commande est uniquement disponible sur un channel public."
					},
					noOption: {
						FR: "La commande `!quiz` nécessite une option. `!help quiz` pour plus d'informations."
					},
					wrongOption: {
						FR: "`{option}` n'est pas une option valide. `!help quiz` pour plus d'informations."
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
					EN: "Readdir error: {directory}: {error}."
				},
				readfile: {
					EN: "Readfile error: {file}: {error}."
				},
				writefile: {
					EN: "Writefile error: {file}: {error}."
				},
				missingQA: {
					EN: "Warning: Missing question or answer for the block:\n{question}\nQuestion ignored."
				},
				tooManyAnswer: {
					EN: "Warning: The following question has multiple answers but no hole. Only the first answer will be used.\n{question}"
				},
				multipleArrows: {
					EN: "Error: The answer '{answer}' must only contain one arrow for the following question block.\n{question}"
				},
				noHole: {
					EN: "Error: The following question block has no hole, but the answer '{answer}' contains fillers.\n{question}"
				},
				mismatchHoles: {
					EN: "Error: Holes number do not match for the answer '{answer}'. {question_holes} hole(s) in the question but {answer_opt} possibilities given in the answer for the following question block.\n{question}"
				},
				mismatchRightParenthesis: {
					EN: "Error: Mismatch ')' in answer '{answer}' for the following question block.\n{question}"
				},
				mismatchLeftParenthesis: {
					EN:  "Error: Mismatch '(' in answer '{answer}' for the following question block.\n{question}"
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
					FR: "Impossible de charger les questions du quiz: {error}"
				}
			},
			start: {
				FR: "**Chargement du quiz**"
			},
			stop: {
				FR: "**Quiz terminé**"
			},
			begin: {
				FR: "Bienvenue à tous pour cette nouvelle session de *Question pour du fnu* !\n*(Le quiz commencera dans {seconds} secondes)*"
			},
			pause: {
				FR: "On se retrouve après une courte page de pub!\n**Quiz mis en pause**"
			},
			resume: {
				FR: "**Quiz repris**\nEt c'est reparti !"
			},
			question: {
				FR: [
					"Top... **{question}**",
					"**{question}**"
				]
			},
			categoryQuestion: {
				FR: [
					"Dans la catégorie *{category}*, **{question}**",
					"En *{category}*, **{question}**",
					"Nous avons *{category}*... Top ! **{question}**"
				]
			},
			nextQuestion: {
				FR: "*(Prochaine question dans {seconds} secondes.)*"
			},
			goodAnswer: {
				FR: [
					"Oui bien sûr, **{answer}**.",
					"Ah oui oui oui oui ! **{answer}** !",
					"Oui oui oui oui oui, **{answer}**.",
					"C'est oui ! **{answer}** !",
					"Oui, **{answer}**, d'accord.",
					"**{answer}**, voilà...",
					"**{answer}**, voilà, d'accord.",
					"Voilà, **{answer}**.",
					"Mais bien sûr, **{answer}** !",
					"Mais oui, d'accord, **{answer}**.",
					"**{answer}**, d'accord.",
					"**{answer}**, bien sûr !",
					"Exactement, **{answer}**, d'accord.",
					"**{answer}**, oui !",
					"**{answer}**, ça c'est bon.",
					"Bien sûr ! **{answer}**.",
					"Exactement, **{answer}**.",
					"Oh oui ! **{answer}** !",
					"C'est bien **{answer}** !",
					"**{answer}**, très bien.",
					"**{answer}**, ah oui, bien joué *{username}*.",
					"**{answer}**, *{username}* a raison.",
					"**{answer}**, très bonne réponse de *{username}* qui s'en sort bien.",
					"**{answer}**, bien joué *{username}*.",
					"Oui oui **{answer}**, *{username}*."
				]
			},
			noAnswer: {
				FR: [
					"Non non... **{answer}**.",
					"Non, ça c'est non... **{answer}**.",
					"C'est pas ça du tout... c'est **{answer}**.",
					"... **{answer}**.",
					"... **{answer}**, {answer}.",
					"Réponse, **{answer}**."
				]
			},
			end: {
				FR: [
					"C'était *Questions pour du Fnu*, merci d'avoir joué.",
					"C'était *Question pour du Fnu* ! Très bonne soirée à tous, à demain !"
				]
			},
			userScore: {
				FR: "*({username}, {score} points)*"
			},
			scoreboardTitle: {
				FR: ":trophy: Tableau des scores"
			},
			noPoint: {
				FR: "Personne n'a de point ¯\\_(ツ)_/¯"
			},
			count: {
				FR: "Il reste encore {questions_count} question(s)."
			}
		}
	}
};