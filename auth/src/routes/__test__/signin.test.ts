import request from 'supertest';
import { app } from '../../app';

it('returns a 200 on successful signin and also sets a cookie', async () => {
  await global.signup();

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: global.testEmail,
      password: global.testPassword
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns a 400 with invalid credentials', async () => {
  await global.signup();

  // Invalid password
  await request(app)
    .post('/api/users/signin')
    .send({
      email: global.testEmail,
      password: 'sdbkjhdfb'
    })
    .expect(400);

  // User doesn't exist
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'supertest@test.com',
      password: global.testPassword
    })
    .expect(400);

  // Empty password
  await request(app)
    .post('/api/users/signin')
    .send({
      email: global.testEmail,
      password: ''
    })
    .expect(400);

  // Empty email
  await request(app)
    .post('/api/users/signin')
    .send({
      email: '',
      password: global.testPassword
    })
    .expect(400);

  // No credentials supplied
  await request(app)
    .post('/api/users/signin')
    .send({
      email: '',
      password: ''
    })
    .expect(400);
});
