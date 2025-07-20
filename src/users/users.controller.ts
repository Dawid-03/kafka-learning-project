import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserDto } from './user.dto';
import { KafkaService } from '../kafka/kafka.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '@prisma/client';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { CreateUserCommand } from './commands/create-user.command';
import { GetAllUsersQuery } from './queries/get-all-users.query';

@Controller('users')
export class UsersController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly kafkaService: KafkaService,
    ) { }

    @Post()
    async register(@Body() userDto: UserDto): Promise<{ status: string; user: Omit<User, 'password'> }> {
        const user = await this.commandBus.execute(new CreateUserCommand(userDto));
        const { password, ...userWithoutPassword } = user;
        const event: UserRegisteredEvent = {
            ...userWithoutPassword,
            createdAt: userWithoutPassword.createdAt.toISOString(),
        };
        await this.kafkaService.sendMessage('user.registered', JSON.stringify(event));
        return { status: 'User registered', user: userWithoutPassword };
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(): Promise<Omit<User, 'password'>[]> {
        return this.queryBus.execute(new GetAllUsersQuery());
    }
} 