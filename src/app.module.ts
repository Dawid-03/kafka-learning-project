import { Module } from '@nestjs/common';
import { KafkaModule } from './kafka/kafka.module';
import { AuthModule } from './auth/auth.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { KafkaService } from './kafka/kafka.service';
import { StripeService } from './payments/stripe.service';

@Module({
  controllers: [AppController],
  providers: [AppService, PrismaService, KafkaService, StripeService],
  imports: [KafkaModule, AuthModule, PaymentsModule, UsersModule],
})
export class AppModule { }
