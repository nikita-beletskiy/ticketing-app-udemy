import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { createTicketRouter } from './routes/new';

import {
  errorHandler,
  NotFoundError,
  currentUser
} from '@bniki-tickets/common';

const app = express();
// Traffic to app is beeing proxied by ingress nginx, so as we require in cookieSession that cookies will only be used if a user visit the app over https, we set express to trust traffic coming from that proxy
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);

app.use(createTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
