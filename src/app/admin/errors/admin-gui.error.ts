export class AdminGuiError extends Error {

    innerError: Error;

    constructor(message?: string, innerError?: Error) {
        super(message);
        this.name = AdminGuiError.name;
        this.innerError = innerError;
        Object.setPrototypeOf(this, AdminGuiError.prototype);
    }

}