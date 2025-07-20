import { IsString, IsEmail, MinLength } from 'class-validator';

export class UserDto {
    @IsString()
    @MinLength(3)
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
} 