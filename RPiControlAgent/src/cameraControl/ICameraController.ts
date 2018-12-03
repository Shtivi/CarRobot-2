export interface ICameraController {
    startStreaming(url: string): Promise<void>;
    stopStreaming(): void;
}