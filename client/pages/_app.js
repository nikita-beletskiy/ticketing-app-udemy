import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => (
  <div>
    <Header currentUser={currentUser} />
    <div className='container'>
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  </div>
);

AppComponent.getInitialProps = async appContext => {
  // Fetching data for AppComponent (invoked automatically when AppComponent gets rendered on the server). This data will be common for all the different pages inside of the app
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // Fetching data for each individual component that gets passed into AppComponent (defined in that component, but must be invoked manually, so we do)
  let pageProps = {};
  if (appContext.Component.getInitialProps)
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );

  // Returned object will be used as an argument to AppComponent
  return { pageProps, ...data };
};

export default AppComponent;
