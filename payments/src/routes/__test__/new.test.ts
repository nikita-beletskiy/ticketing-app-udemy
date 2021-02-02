import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Payment } from '../../models/payment';
import { stripe } from '../../stripe';

import { OrderStatus } from '@bniki-tickets/common';

// jest.mock('../../stripe'); - in case of mock implementation

const generateId = global.generateId;
const getCookie = global.getCookie;

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', getCookie())
    .send({ token: 'sdfsds', orderId: generateId() })
    .expect(404);
});

it('returns a 401 when purchasing an order that does not belong to a user', async () => {
  const order = Order.build({
    id: generateId(),
    userId: generateId(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getCookie())
    .send({ token: 'sdfsds', orderId: order.id })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = generateId();

  const order = Order.build({
    id: generateId(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getCookie(userId))
    .send({ orderId: order.id, token: 'dfsdsdf' })
    .expect(400);
});

it('returns a 201 with valid inputs', async () => {
  const userId = generateId();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: generateId(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', getCookie(userId))
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(
    charge => charge.amount === price * 100
  );

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  });
  expect(payment).not.toBeNull();

  // in case of mock implementation
  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // expect(chargeOptions.source).toEqual('tok_visa');
  // expect(chargeOptions.amount).toEqual(20 * 100);
  // expect(chargeOptions.currency).toEqual('usd');
});
