import mongoose from 'mongoose';
import { Password } from '../services/password';

// describes the properties that are required to create a new user
interface userAttrs {
  email: string;
  password: string;
}

// describes the properties of a User Document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// describes the properties of a User Model
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: userAttrs): UserDoc;
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: userAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
