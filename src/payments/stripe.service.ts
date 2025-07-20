import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2025-06-30.basil',
    });

    async createPremiumCheckoutSession(userId: number, email: string): Promise<string> {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Premium Membership',
                        },
                        unit_amount: 1000, // $10.00
                    },
                    quantity: 1,
                },
            ],
            metadata: { userId: userId.toString() },
            success_url: 'http://localhost:3000/payments/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/payments/cancel',
        });
        return session.url!;
    }

    async retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
        try {
            return await this.stripe.checkout.sessions.retrieve(sessionId);
        } catch {
            return null;
        }
    }
} 