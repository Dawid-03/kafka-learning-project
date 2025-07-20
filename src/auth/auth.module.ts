import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserQueryService } from '../users/user-query.service';
import { PrismaService } from 'src/prisma.service';
import { CqrsModule } from '@nestjs/cqrs';
import { LoginHandler } from './commands/login.handler';
import { ValidateUserHandler } from './queries/validate-user.handler';

const CommandHandlers = [LoginHandler];
const QueryHandlers = [ValidateUserHandler];

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'secret',
            signOptions: { expiresIn: '1h' },
        }),
        CqrsModule,
    ],
    providers: [JwtStrategy, UserQueryService, PrismaService, ...CommandHandlers, ...QueryHandlers],
    controllers: [AuthController],
})
export class AuthModule { } 