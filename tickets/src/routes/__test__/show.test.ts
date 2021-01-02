import request from 'supertest';
import { app } from '../../app';

const title = global.testTitle;
const price = global.testPrice;
const getCookie = global.getCookie;
const generateId = global.generateId;

it('returns a 404 if the ticket is not found', async () => {
  const id = generateId();

  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', getCookie())
    .send({ title, price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
