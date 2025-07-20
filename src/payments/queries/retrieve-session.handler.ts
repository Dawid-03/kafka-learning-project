import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveSessionQuery } from './retrieve-session.query';
import { StripeService } from '../stripe.service';
import Stripe from 'stripe';

@QueryHandler(RetrieveSessionQuery)
export class RetrieveSessionHandler implements IQueryHandler<RetrieveSessionQuery> {
    constructor(private readonly stripeService: StripeService) { }

    async execute(query: RetrieveSessionQuery): Promise<Stripe.Checkout.Session | null> {
        return this.stripeService.retrieveSession(query.sessionId);
    }
} 