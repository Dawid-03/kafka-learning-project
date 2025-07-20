export class LoginCommand {
    constructor(public readonly user: { username: string; id: number; premium: boolean }) { }
} 