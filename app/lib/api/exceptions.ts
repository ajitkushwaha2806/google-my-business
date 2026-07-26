export class AppException extends Error {
    public statusCode: number;
    public errors?: any;

    constructor(message: string, statusCode: number = 400, errors?: any) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class RedirectException extends Error {
    public url: string;

    constructor(url: string) {
        super("Redirect");
        this.url = url;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
