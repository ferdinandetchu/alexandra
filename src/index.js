import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
const kanbanRoute = '/kanban';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={`${window.location.origin}${kanbanRoute}`}
      audience='https://www.polish-api.com'
      scope='openid profile email'
    >
      <App />
    </Auth0Provider>
  </Router>
);
