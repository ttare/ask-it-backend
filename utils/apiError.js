class APIError {
  constructor(message, code, args) {
    this.message = APIError.formating(message, args) || '';
    this.code = code || 1000;
    this.args = args || [];
  }

  static formating() {
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
      const reg = new RegExp("\\{" + i + "\\}", "gm");
      s = s.replace(reg, arguments[i + 1]);
    }
    return s;
  }

  static catchError(action) {
    return (req, res, next) => action(req, res, next).catch(ex => console.error(ex).then(x => res.status(500).json(x)))
  }
}

module.exports = APIError;
