import { UserDto } from '../user.dto';

export class CreateUserCommand {
    constructor(public readonly dto: UserDto) { }
} 