import request from 'supertest';
import { app } from '../../app';

const title = global.testTitle;
const price = global.testPrice;
const getCookie = global.getCookie;

it('can fetch a list of tickets', async () => {
  const requiredAmount = 100;

  for (let i = 1; i <= requiredAmount; i++)
    await request(app)
      .post('/api/tickets')
      .set('Cookie', getCookie())
      .send({ title, price });

  const response = await request(app).get('/api/tickets').send().expect(200);

  expect(response.body.length).toEqual(requiredAmount);
});
