import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

import { Subjects, Listener, TicketUpdatedEvent } from '@bniki-tickets/common';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findCurrent(data);

    if (!ticket) throw new Error('Ticket not found');

    ticket.set({ title: data.title, price: data.price });
    await ticket.save();

    msg.ack();
  }
}
