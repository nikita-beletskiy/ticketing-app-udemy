import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      testTitle: string;
      testPrice: number;
      getCookie(): string[];
      generateId(): string;
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

global.testTitle = 'Concert';
global.testPrice = 100;

global.generateId = () => new mongoose.Types.ObjectId().toHexString();

global.getCookie = () => {
  // Hardcode a JWT payload and create the actual JWT out of it
  const token = jwt.sign(
    { id: global.generateId(), email: 'test@test.com' },
    process.env.JWT_KEY!
  );

  // Create session Object and turn it into JSON
  const session = JSON.stringify({ jwt: token });

  // Return a string that is the cookie with the encoded session data
  return [`express:sess=${Buffer.from(session).toString('base64')}`];
};
