import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

import { Listener, OrderCreatedEvent, Subjects } from '@bniki-tickets/common';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket - throw error
    if (!ticket) throw new Error('Ticket not found');

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket and publish an event
    await ticket.save();

    const { id, version, title, price, userId, orderId } = ticket;
    await new TicketUpdatedPublisher(this.client).publish({
      id,
      version,
      title,
      price,
      userId,
      orderId
    });

    // Ack the message
    msg.ack();
  }
}
