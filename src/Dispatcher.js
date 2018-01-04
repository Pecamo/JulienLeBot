'use strict';

class Dispatcher {
	constructor(paths, error) {
		this.paths = paths;
		this.error = error;
	}

	dispatch(cmd) {
		if (this.paths == null || !this.paths.hasOwnProperty(cmd)) {
			return this.error;
		}
		return this.paths[cmd];
	}
}

module.exports = Dispatcher;