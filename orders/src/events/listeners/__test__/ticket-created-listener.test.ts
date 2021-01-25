import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

import { TicketCreatedEvent } from '@bniki-tickets/common';

it('creates and saves a ticket and acks the message', async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data object
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: global.generateId(),
    title: global.testTitle,
    price: global.testPrice,
    userId: global.generateId()
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  // Call the onMessage function with the data and message objects
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created and the ack function is called
  const ticket = await Ticket.findById(data.id);

  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
  expect(msg.ack).toHaveBeenCalled();
});
