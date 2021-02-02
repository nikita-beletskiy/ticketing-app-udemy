import {
  Subjects,
  Publisher,
  PaymentCreatedEvent
} from '@bniki-tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
