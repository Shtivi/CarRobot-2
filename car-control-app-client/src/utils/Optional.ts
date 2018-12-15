export class Optional<T> {
    private value?: T;

    public static of<T>(value?: T): Optional<T> {
        return new Optional<T>(value);
    }

    public constructor(value?: T) {
        this.value = value;
    }

    public isPresent(): boolean {
        if (this.value) {
            return true;
        }

        return false;
    }

    public get(): T {
        if (!this.value) {
            throw new Error('Cannot return empty value');
        }

        return this.value;
    }

    public ifPresnet(callback: (value: T) => void): Optional<T> {
        if (this.isPresent()) {
            callback(this.get());
        }
        
        return this;
    }

    public ifNotPresent(callback: () => void): Optional<T> {
        if (!this.isPresent()) {
            callback();
        }

        return this;
    };

    public orElseThrow(error: Error): T {
        if (!this.isPresent()) {
            throw error;
        }

        return this.get();
    }

    public orElseReturn(alternativeValue: T): T {
        if (!this.isPresent()) {
            return alternativeValue;
        }

        return this.get();
    }
}