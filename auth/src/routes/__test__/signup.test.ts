import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/user';

it('creates a user and sets a cookie on successful signup', async () => {
  let users = await User.find({});
  expect(users.length).toEqual(0);

  const response = await global.signup();

  expect(response.get('Set-Cookie')).toBeDefined();

  users = await User.find({});
  expect(users.length).toEqual(1);
  expect(users[0].email).toEqual(global.testEmail);
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: global.testPassword
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: global.testEmail,
      password: 'p'
    })
    .expect(400);
});

it('returns a 400 with missing email or password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: global.testEmail,
      password: ''
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      password: global.testPassword
    })
    .expect(400);
});

it('returns a 400 when duplicate emails', async () => {
  await global.signup();

  await request(app)
    .post('/api/users/signup')
    .send({
      email: global.testEmail,
      password: global.testPassword
    })
    .expect(400);
});
