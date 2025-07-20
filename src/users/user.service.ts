import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(userDto: UserDto): Promise<User> {
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { username: userDto.username },
                    { email: userDto.email },
                ],
            },
        });
        if (existing) {
            throw new BadRequestException('Username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(userDto.password, 10);
        return this.prisma.user.create({
            data: {
                username: userDto.username,
                email: userDto.email,
                password: hashedPassword,
                premium: false,
            },
        });
    }

    async setPremium(userId: number | string, premium: boolean): Promise<void> {
        await this.prisma.user.update({
            where: { id: Number(userId) },
            data: { premium },
        });
    }
} 