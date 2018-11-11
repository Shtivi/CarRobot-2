import { RobotCommand } from "./RobotCommand";
import { Optional } from "../utils/Optional";

export class RobotCommandsMapping {
    private commandsMapping: {[commandName: string]: RobotCommand}

    public constructor(commandsList: string[]) {
        this.commandsMapping = {};
        this.fillCommandsMap(commandsList);
    }

    public parse(commandName: string): Optional<RobotCommand> {
        return Optional.of(this.commandsMapping[commandName]);
    }

    private fillCommandsMap(commandsList: string[]): void {
        commandsList.forEach((cmdName: string) => {
            this.insertCommand(RobotCommand.of(cmdName));
        }, this);
    }

    private insertCommand(command: RobotCommand): void {
        this.commandsMapping[command.commandName] = command;
    }
}