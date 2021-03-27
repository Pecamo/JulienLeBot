class Dispatcher {
  paths: any;
  error: any;
  aliases: Array<any>;

  constructor(paths: any, error: any, aliases: any = []) {
    this.paths = paths;
    this.error = error;
    this.aliases = aliases;
  }

  dispatch(cmd: any) {
    if (this.aliases.hasOwnProperty(cmd[0])) {
      const alias = cmd.shift();
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

export default Dispatcher;
