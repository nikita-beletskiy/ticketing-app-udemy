import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

const title = global.testTitle;
const price = global.testPrice;
const getCookie = global.getCookie;

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

it('returns a 401 if the user is not signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns a 400 if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({ title: '', price })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({ price })
    .expect(400);
});

it('returns a 400 if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({ title, price: -10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({ title, price: 'ten dollars' })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({ title })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

it('publishes an event', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({ title, price })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
