import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserQuery } from './find-user.query';
import { UserQueryService } from '../user-query.service';
import { User } from '@prisma/client';

@QueryHandler(FindUserQuery)
export class FindUserHandler implements IQueryHandler<FindUserQuery> {
    constructor(private readonly userQueryService: UserQueryService) { }

    async execute(query: FindUserQuery): Promise<User | null> {
        return this.userQueryService.findUser(query.identifier);
    }
} 