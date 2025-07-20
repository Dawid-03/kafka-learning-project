import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserQueryService } from '../users/user-query.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

export interface JwtPayload {
    username: string;
    sub: number;
    premium: boolean;
}

export interface LoginResponse {
    access_token: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userQueryService: UserQueryService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(identifier: string, password: string): Promise<Omit<User, 'password'> | null> {
        const user = await this.userQueryService.findUser(identifier);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: Omit<User, 'password'>): Promise<LoginResponse> {
        const payload: JwtPayload = { username: user.username, sub: user.id, premium: user.premium };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
} 