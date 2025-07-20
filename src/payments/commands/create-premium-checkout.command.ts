export class CreatePremiumCheckoutCommand {
    constructor(public readonly userId: number, public readonly email: string) { }
} 