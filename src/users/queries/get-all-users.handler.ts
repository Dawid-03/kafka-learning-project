import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUsersQuery } from './get-all-users.query';
import { UserQueryService } from '../user-query.service';
import { User } from '@prisma/client';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
    constructor(private readonly userQueryService: UserQueryService) { }

    async execute(query: GetAllUsersQuery): Promise<Omit<User, 'password'>[]> {
        return this.userQueryService.getAllUsers();
    }
} 