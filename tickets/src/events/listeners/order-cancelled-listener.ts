import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

import { Listener, OrderCancelledEvent, Subjects } from '@bniki-tickets/common';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // Find the ticket that the order is trying to cancel
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket - throw error
    if (!ticket) throw new Error('Ticket not found');

    // Mark the ticket as undefined by setting its orderId property
    ticket.set({ orderId: undefined });

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
