export interface ActionCreator<T> {
    (whenSucceded: (data: T) => void, whenFailed: (error: any) => void): void;
}

export interface AttemptHandler<T> {
    (attemptNumber: number, data: T): void;
}

export class Retry<T> {
    private _maxAttempts: number;
    private _attemptsIntervalMs: number;
    private _actionCreator: ActionCreator<T>;
    private _attemptFailureHandler: AttemptHandler<any>;
    private _successHandler: AttemptHandler<T>;
    private _nextAttemptHandler: (attemptNo: number) => void;
    private _terminationHandler: () => void;
    private _attemptsCounter: number;
    private _currentObject: any;

    public static action<T>(actionCreator: ActionCreator<T>): Retry<T> {
        return new Retry(actionCreator);
    }

    private constructor(actionCreator: ActionCreator<T>, maxAttempts?: number, attemptsInterval?: number) {
        this._actionCreator = actionCreator;
        this._maxAttempts = -1 || maxAttempts;
        this._attemptsIntervalMs = 1 || attemptsInterval;
        this._attemptsCounter = 1;
    }

    public withMaxAttempts(maxAttempts: number): Retry<T> {
        if (maxAttempts < 1) {
            throw new Error('Max attempts cant be less than 1')
        }
        this._maxAttempts = maxAttempts;
        return this;
    }

    public withAttemptsInterval(attemptsIntervalMs: number): Retry<T> {
        this._attemptsIntervalMs = attemptsIntervalMs;
        return this;
    }

    public handleSuccess(handler: AttemptHandler<T>): Retry<T> {
        this._successHandler = handler;
        return this;
    }

    public handleTermination(handler: () => void): Retry<T> {
        this._terminationHandler = handler;
        return this;
    }

    public handleAttemptFailure(handler: AttemptHandler<any>): Retry<T> {
        this._attemptFailureHandler = handler;
        return this;
    }

    public handleNextAttempt(handler: (attemptNo: number) => void): Retry<T> {
        this._nextAttemptHandler = handler;
        return this;
    }

    public withThis(current: any): Retry<T> {
        this._currentObject = current;
        return this;
    }

    public run(): void {
        // this._actionCreator;
        // this._nextAttemptHandler.bind(this._currentObject);
        // this._successHandler.bind(this._currentObject);
        // this._terminationHandler.bind(this._currentObject);

        if (this._attemptsCounter <= this._maxAttempts) {
            this._nextAttemptHandler.bind(this._currentObject)(this._attemptsCounter++);
            this._actionCreator.bind(this._currentObject)((data: T) => this._successHandler.bind(this._currentObject)(this._attemptsCounter, data), (err: any) => {
                this._attemptFailureHandler.bind(this._currentObject)(this._attemptsCounter, err);
                setTimeout(this.run.bind(this), this._attemptsIntervalMs);
            });
        } else {
            this._terminationHandler.bind(this._currentObject)();
        }
    }
}