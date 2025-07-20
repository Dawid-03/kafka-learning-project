import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginCommand } from './commands/login.command';
import { ValidateUserQuery } from './queries/validate-user.query';

interface LoginDto {
    identifier: string;
    password: string;
}

@Controller('auth')
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post('login')
    async login(@Body() body: LoginDto): Promise<{ access_token: string }> {
        const user = await this.queryBus.execute(new ValidateUserQuery(body.identifier, body.password));
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.commandBus.execute(new LoginCommand(user));
    }
} 