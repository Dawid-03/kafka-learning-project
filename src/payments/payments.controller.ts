import { Body, Controller, Post, Req, UseGuards, Headers, Res, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StripeService } from './stripe.service';
import { UserService } from '../users/user.service';
import { KafkaService } from '../kafka/kafka.service';
import { Response, Request } from 'express';
import { UserPremiumPurchasedEvent } from '../events/user-premium-purchased.event';
import { CommandBus, QueryBus, EventBus } from '@nestjs/cqrs';
import { CreatePremiumCheckoutCommand } from './commands/create-premium-checkout.command';
import { RetrieveSessionQuery } from './queries/retrieve-session.query';
import { FindUserQuery } from '../users/queries/find-user.query';
import { PremiumPaymentSucceededEvent } from './events/premium-payment-succeeded.event';

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly eventBus: EventBus,
        private readonly stripeService: StripeService,
        private readonly userService: UserService,
        private readonly kafkaService: KafkaService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('premium')
    async createPremiumCheckout(@Req() req: any): Promise<{ url: string }> {
        const user = await this.queryBus.execute(new FindUserQuery(req.user.username));
        if (!user) throw new Error('User not found');
        const url = await this.commandBus.execute(new CreatePremiumCheckoutCommand(user.id, user.email));
        return { url };
    }

    @Get('success')
    async paymentSuccess(
        @Query('session_id') sessionId: string
    ): Promise<{ paid: boolean; email?: string }> {
        if (!sessionId) return { paid: false };
        const session = await this.queryBus.execute(new RetrieveSessionQuery(sessionId));
        if (session && session.payment_status === 'paid') {
            const userId = session.metadata?.userId;
            if (userId) {
                this.eventBus.publish(new PremiumPaymentSucceededEvent(Number(userId), new Date().toISOString()));
            }
            return { paid: true, email: session.customer_email ?? undefined };
        }
        return { paid: false };
    }

    @Get('cancel')
    async paymentCancel(): Promise<{ cancelled: boolean; message: string }> {
        return { cancelled: true, message: 'Payment was cancelled by the user.' };
    }
} 