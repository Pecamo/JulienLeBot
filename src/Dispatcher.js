'use strict';

class Dispatcher {
	constructor(paths, error, aliases = []) {
		this.paths = paths;
		this.error = error;
		this.aliases = aliases;
	}

	dispatch(cmd) {
		if (this.aliases.hasOwnProperty(cmd[0])) {
			let alias = cmd.shift();
			for (let i = this.aliases[alias].length - 1; i >= 0; --i) {
				cmd.unshift(this.aliases[alias][i]);
			}
		}
		if (this.paths == null || !this.paths.hasOwnProperty(cmd[0])) {
			return this.error;
		}
		return this.paths[cmd[0]];
	}
}

module.exports = Dispatcher;