import {
  Publisher,
  OrderCancelledEvent,
  Subjects
} from '@bniki-tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
