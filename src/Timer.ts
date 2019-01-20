class Timer {

	id: number;
	callback: Function;
	delay: number;
	remaining: number;
	start: Date;

	constructor() {
		this.id = null;
	}

	reset(callback: Function, delay: number) {
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
			this.remaining = (new Date() as any as number) - (this.start as any as number);
		}
	}

	resume() {
		if (!this.id) {
			this.start = new Date();
			this.id = setTimeout(this.callback, this.remaining);
		}
	}
}

export default Timer;
