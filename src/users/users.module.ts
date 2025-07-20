import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './users.controller';
import { UserService } from './user.service';
import { UserQueryService } from './user-query.service';
import { PrismaService } from '../prisma.service';
import { KafkaModule } from '../kafka/kafka.module';
import { CreateUserHandler } from './commands/create-user.handler';
import { SetPremiumHandler } from './commands/set-premium.handler';
import { GetAllUsersHandler } from './queries/get-all-users.handler';
import { FindUserHandler } from './queries/find-user.handler';

const CommandHandlers = [CreateUserHandler, SetPremiumHandler];
const QueryHandlers = [GetAllUsersHandler, FindUserHandler];

@Module({
    imports: [CqrsModule, KafkaModule],
    controllers: [UsersController],
    providers: [UserService, UserQueryService, PrismaService, ...CommandHandlers, ...QueryHandlers],
    exports: [UserService, UserQueryService],
})
export class UsersModule { } 