import { OrderCancelledListener } from '../order-cancelled-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { Message } from 'node-nats-streaming';

import { OrderStatus, OrderCancelledEvent } from '@bniki-tickets/common';

it('updates the status of the order and acks the message', async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: global.generateId(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'sffsd',
    version: 0
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: { id: 'sdfsd' }
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(msg.ack).toHaveBeenCalled();
});
