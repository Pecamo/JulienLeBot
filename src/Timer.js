'use strict';

class Timer {
	constructor() {
		this.id = null;
	}

	reset(callback, delay) {
		if (this.id) {
			clearTimeout(this.id);
			this.id = null;
		}
		this.callback = callback;
		this.delay = delay;
		this.remaining = delay;
		this.resume();
	}

	pause() {
		if (this.id) {
			clearTimeout(this.id);
			this.id = null;
			this.remaining = new Date() - this.start;
		}
	}

	resume() {
		if (!this.id) {
			this.start = new Date();
			this.id = setTimeout(this.callback, this.remaining);
		}
	}
}

module.exports = Timer;