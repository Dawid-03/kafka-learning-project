import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserService } from '../user.service';
import { User } from '@prisma/client';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    constructor(private readonly userService: UserService) { }

    async execute(command: CreateUserCommand): Promise<User> {
        return this.userService.createUser(command.dto);
    }
} 