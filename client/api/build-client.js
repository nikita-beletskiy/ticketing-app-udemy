import axios from 'axios';

// If we are on the server we set base URL manually as route to Ingress controller and also specify headers, otherwise we entirely rely upon the browser
const buildClient = ({ req }) =>
  typeof window === 'undefined'
    ? axios.create({
        baseURL: 'http://www.ticketing-app-udemy.xyz/',
        headers: req.headers
      })
    : axios.create({ baseURL: '/' });

export default buildClient;
