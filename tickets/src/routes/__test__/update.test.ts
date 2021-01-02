import request from 'supertest';
import { app } from '../../app';

const title = global.testTitle;
const price = global.testPrice;
const getCookie = global.getCookie;
const generateId = global.generateId;

it('returns a 404 if the provided id does not exists', async () => {
  const id = generateId();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', getCookie())
    .send({ title, price })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const ticketId = generateId();

  await request(app)
    .put(`/api/tickets/${ticketId}`)
    .send({ title, price })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', getCookie())
    .send({ title: 'New Title', price: 9999 })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = getCookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 9999 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ price: 9999 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'New Title', price: -10 })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'New Title' })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = getCookie();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title, price })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'New Title', price: 9999 })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('New Title');
  expect(ticketResponse.body.price).toEqual(9999);
});
