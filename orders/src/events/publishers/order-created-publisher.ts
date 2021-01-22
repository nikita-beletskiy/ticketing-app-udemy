import { Publisher, OrderCreatedEvent, Subjects } from '@bniki-tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
