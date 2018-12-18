export interface IRobotMessage<T> {
    eventType: string;
    data: T;
    hasError: boolean;
}