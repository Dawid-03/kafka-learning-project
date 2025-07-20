import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePremiumCheckoutCommand } from './create-premium-checkout.command';
import { StripeService } from '../stripe.service';

@CommandHandler(CreatePremiumCheckoutCommand)
export class CreatePremiumCheckoutHandler implements ICommandHandler<CreatePremiumCheckoutCommand> {
    constructor(private readonly stripeService: StripeService) { }

    async execute(command: CreatePremiumCheckoutCommand): Promise<string> {
        return this.stripeService.createPremiumCheckoutSession(command.userId, command.email);
    }
} 