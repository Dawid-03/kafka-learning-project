import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentsController } from './payments.controller';
import { StripeService } from './stripe.service';
import { UserService } from '../users/user.service';
import { KafkaService } from '../kafka/kafka.service';
import { PrismaService } from '../prisma.service';
import { CreatePremiumCheckoutHandler } from './commands/create-premium-checkout.handler';
import { RetrieveSessionHandler } from './queries/retrieve-session.handler';
import { PremiumSaga } from './sagas/premium.saga';

const CommandHandlers = [CreatePremiumCheckoutHandler];
const QueryHandlers = [RetrieveSessionHandler];
const Sagas = [PremiumSaga];

@Module({
    imports: [CqrsModule],
    controllers: [PaymentsController],
    providers: [StripeService, UserService, KafkaService, PrismaService, ...CommandHandlers, ...QueryHandlers, ...Sagas],
})
export class PaymentsModule { } 