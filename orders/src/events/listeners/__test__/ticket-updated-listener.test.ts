import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

import { TicketUpdatedEvent } from '@bniki-tickets/common';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: global.generateId(),
    title: global.testTitle,
    price: global.testPrice
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'UPDATED',
    price: 12345,
    userId: 'hjsdvhgv'
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg };
};

it('finds, updates and saves a ticket and acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  // Call the onMessage function with the data and message objects
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was updated and saved and the ack function is called
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a future version number', async () => {
  const { listener, data, msg } = await setup();

  // Increment ticket version manually so it has a future number
  data.version = data.version + 1;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
