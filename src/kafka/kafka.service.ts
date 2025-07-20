import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { UserService } from '../users/user.service';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { UserPremiumPurchasedEvent } from '../events/user-premium-purchased.event';

@Injectable()
export class KafkaService implements OnModuleInit {
    private kafka: Kafka = new Kafka({
        clientId: 'nest-kafka-app',
        brokers: ['localhost:9092'],
    });

    private producer: Producer = this.kafka.producer();
    private consumer: Consumer = this.kafka.consumer({ groupId: 'nest-consumer' });
    private readonly logger = new Logger(KafkaService.name);
    private eventCounts: Record<string, number> = {};

    constructor(private readonly userService: UserService) { }

    async onModuleInit(): Promise<void> {
        await this.connect();
        await this.listenForMessages();
    }

    async connect(): Promise<void> {
        await this.producer.connect();
        await this.consumer.connect();
    }

    async sendMessage(topic: string, message: string): Promise<void> {
        await this.producer.send({
            topic,
            messages: [{ value: message }],
        });
    }

    async listenForMessages(): Promise<void> {
        await this.consumer.subscribe({ topic: 'user.registered', fromBeginning: true });
        await this.consumer.subscribe({ topic: 'user.premiumPurchased', fromBeginning: true });

        await this.consumer.run({
            eachMessage: async ({ topic, message }): Promise<void> => {
                const start = Date.now();
                this.eventCounts[topic] = (this.eventCounts[topic] || 0) + 1;
                try {
                    if (topic === 'user.registered') {
                        const value = message.value ? message.value.toString() : '{}';
                        const user: UserRegisteredEvent = JSON.parse(value);
                        this.logger.log(
                            `✉️ [user.registered] User ${user.username} <${user.email}> registered`
                        );
                    } else if (topic === 'user.premiumPurchased') {
                        const value = message.value ? message.value.toString() : '{}';
                        const event: UserPremiumPurchasedEvent = JSON.parse(value);
                        await this.userService.setPremium(event.userId, true);
                        this.logger.log(
                            `🟢 [user.premiumPurchased] User ${event.userId} upgraded to premium at ${event.purchasedAt}`
                        );
                    } else {
                        this.logger.log(`[${topic}] Received message: ${message.value}`);
                    }
                } catch (err) {
                    this.logger.error(`[${topic}] Error: ${(err as Error).message}`);
                    await this.producer.send({
                        topic: 'user.deadletter',
                        messages: [
                            {
                                value: JSON.stringify({
                                    originalTopic: topic,
                                    error: (err as Error).message,
                                    payload: message.value?.toString(),
                                    timestamp: new Date().toISOString(),
                                }),
                            },
                        ],
                    });
                } finally {
                    const duration = Date.now() - start;
                    this.logger.log(
                        `📊 [${topic}] Processed event #${this.eventCounts[topic]} in ${duration}ms`
                    );
                }
            },
        });
    }
} 