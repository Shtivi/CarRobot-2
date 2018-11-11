export class RobotCommand {
    public commandName: string;

    public static of(commandName: string) {
        return new RobotCommand(commandName);
    }

    public constructor(command: string) {
        this.commandName = command;
    }
}