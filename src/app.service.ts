import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { KafkaService } from './kafka/kafka.service';
import { StripeService } from './payments/stripe.service';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafka: KafkaService,
    private readonly stripe: StripeService,
  ) { }

  async healthCheck(): Promise<any> {
    const timestamp = new Date().toISOString();
    let db = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      db = 'error';
    }
    let kafka = 'ok';
    try {
      await this.kafka.connect();
    } catch {
      kafka = 'error';
    }
    let stripe = 'ok';
    try {
      await this.stripe.retrieveSession('fake');
    } catch (e: any) {
      if (e?.type === 'StripeInvalidRequestError' || e?.statusCode === 404) {
        stripe = 'ok';
      } else {
        stripe = 'error';
      }
    }
    const status = db === 'ok' && kafka === 'ok' && stripe === 'ok' ? 'ok' : 'error';
    return { status, db, kafka, stripe, timestamp };
  }
}
