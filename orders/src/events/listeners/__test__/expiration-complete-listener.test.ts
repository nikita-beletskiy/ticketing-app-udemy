import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

import { OrderStatus, ExpirationCompleteEvent } from '@bniki-tickets/common';

it('updates the order status to cancelled, emits an order:cancelled event and acks the message', async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: global.generateId(),
    title: global.testTitle,
    price: global.testPrice
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'sdfsd',
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = { orderId: order.id };

  //@ts-ignore
  const msg: Message = { ack: jest.fn() };

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(eventData.id).toEqual(order.id);
  expect(msg.ack).toHaveBeenCalled();
});
