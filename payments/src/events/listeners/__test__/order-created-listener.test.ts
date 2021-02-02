import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';

import { OrderCreatedEvent, OrderStatus } from '@bniki-tickets/common';

it('replicates the order info and acks the message', async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: global.generateId(),
    version: 0,
    expiresAt: 'sdfsd',
    userId: 'sfsdf',
    status: OrderStatus.Created,
    ticket: { id: 'sdfsd', price: 10 }
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
  expect(msg.ack).toHaveBeenCalled();
});
