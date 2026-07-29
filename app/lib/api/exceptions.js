export class AppException extends Error {
  constructor(message, statusCode = 400, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RedirectException extends Error {
  constructor(url) {
    super("Redirect");
    this.url = url;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
