export class PremiumPaymentSucceededEvent {
    constructor(public readonly userId: number, public readonly purchasedAt: string) { }
} 