import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetPremiumCommand } from './set-premium.command';
import { UserService } from '../user.service';
import { Logger } from '@nestjs/common';

@CommandHandler(SetPremiumCommand)
export class SetPremiumHandler implements ICommandHandler<SetPremiumCommand> {
    private readonly logger = new Logger(SetPremiumHandler.name);

    constructor(private readonly userService: UserService) { }

    async execute(command: SetPremiumCommand): Promise<void> {
        await this.userService.setPremium(command.userId, command.premium);
        this.logger.log(`User ${command.userId} upgraded to premium`);
    }
} 