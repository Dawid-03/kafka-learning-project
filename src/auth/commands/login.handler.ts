import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(private readonly jwtService: JwtService) { }

    async execute(command: LoginCommand): Promise<{ access_token: string }> {
        const payload = {
            username: command.user.username,
            sub: command.user.id,
            premium: command.user.premium,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
} 