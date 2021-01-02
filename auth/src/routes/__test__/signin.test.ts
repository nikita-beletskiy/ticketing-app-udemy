import request from 'supertest';
import { app } from '../../app';

const email = global.testEmail;
const password = global.testPassword;
const signup = global.signup;

it('returns a 200 on successful signin and also sets a cookie', async () => {
  await signup();

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email, password })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns a 400 with invalid credentials', async () => {
  await signup();

  // Invalid password
  await request(app)
    .post('/api/users/signin')
    .send({ email, password: 'wrong_password' })
    .expect(400);

  // User doesn't exist
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'do@notexists.com', password })
    .expect(400);

  // Empty password
  await request(app)
    .post('/api/users/signin')
    .send({ email, password: '' })
    .expect(400);

  // Empty email
  await request(app)
    .post('/api/users/signin')
    .send({ email: '', password })
    .expect(400);

  // No credentials supplied
  await request(app)
    .post('/api/users/signin')
    .send({ email: '', password: '' })
    .expect(400);
});
