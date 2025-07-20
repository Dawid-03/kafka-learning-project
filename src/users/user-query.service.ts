import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserQueryService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllUsers(): Promise<Omit<User, 'password'>[]> {
        const users = await this.prisma.user.findMany();
        return users.map(({ password, ...user }) => user);
    }

    async findUser(identifier: string): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: identifier },
                    { email: identifier },
                ],
            },
        });
    }
} 