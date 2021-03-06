import request from 'supertest';
import { app } from '../../app';

const getCookie = global.getCookie;
const testEmail = global.testEmail;

it('responds with details about the current user', async () => {
  const cookie = await getCookie();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual(testEmail);
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
