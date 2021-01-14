import { Publisher, Subjects, TicketCreatedEvent } from '@bniki-tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
