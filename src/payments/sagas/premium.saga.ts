import { Saga, ICommand } from '@nestjs/cqrs';
import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { PremiumPaymentSucceededEvent } from '../events/premium-payment-succeeded.event';
import { SetPremiumCommand } from '../../users/commands/set-premium.command';

export class PremiumSaga {
    @Saga()
    premiumProcess = (events$: Observable<any>): Observable<ICommand> => {
        return events$.pipe(
            filter((event): event is PremiumPaymentSucceededEvent => event instanceof PremiumPaymentSucceededEvent),
            map(event => new SetPremiumCommand(event.userId, true))
        );
    };
} 