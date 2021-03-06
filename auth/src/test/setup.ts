import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signup(): Promise<request.Response>;
      getCookie(): Promise<string[]>;
      testEmail: string;
      testPassword: string;
    }
  }
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.testEmail = 'test@test.com';
global.testPassword = 'password';

global.signup = async () => {
  const email = global.testEmail;
  const password = global.testPassword;

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  return response;
};

// global.signup() returns response and get('Set-Cookie') retrieves a cookie header out of it
global.getCookie = async () => (await global.signup()).get('Set-Cookie');
