import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/users/user.service';

@Module({
    providers: [KafkaService, UserService, PrismaService],
    exports: [KafkaService],
})
export class KafkaModule { } 