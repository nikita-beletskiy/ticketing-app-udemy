import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const title = global.testTitle;
const price = global.testPrice;
const getCookie = global.getCookie;
const generateId = global.generateId;

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: generateId(),
    title,
    price
  });
  await ticket.save();

  const user = getCookie();

  // Make a request to create an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it(`returns an error if a user tries to fetch another's order`, async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: generateId(),
    title,
    price
  });
  await ticket.save();

  const user = getCookie();

  // Make a request to create an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to fetch the order, but with different cookie
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', getCookie())
    .send()
    .expect(401);
});
