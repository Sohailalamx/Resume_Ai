class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stacks = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.success = false;
        this.stacks = stacks;

        if(stacks) {
            this.stacks = stacks;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
