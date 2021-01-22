import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

const title = global.testTitle;
const price = global.testPrice;
const getCookie = global.getCookie;

it('returns an error if the ticket does not exist', async () => {
  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookie())
    .send({ ticketId: global.generateId() })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({ title, price });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: 'sdjhuegdikjb',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({ title, price });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', getCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo('emits order:created event');
