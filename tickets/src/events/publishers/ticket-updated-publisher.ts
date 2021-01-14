import { Publisher, Subjects, TicketUpdatedEvent } from '@bniki-tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
