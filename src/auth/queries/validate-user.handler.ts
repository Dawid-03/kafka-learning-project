import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ValidateUserQuery } from './validate-user.query';
import { UserQueryService } from '../../users/user-query.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@QueryHandler(ValidateUserQuery)
export class ValidateUserHandler implements IQueryHandler<ValidateUserQuery> {
    constructor(private readonly userQueryService: UserQueryService) { }

    async execute(query: ValidateUserQuery): Promise<Omit<User, 'password'> | null> {
        const user = await this.userQueryService.findUser(query.identifier);
        if (user && await bcrypt.compare(query.password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
} 