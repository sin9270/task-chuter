'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(reg => {
      console.log('Registration succeeded. Scope is ' + reg.scope);
    })
    .catch(error => {
      console.log('Registration failed with ' + error);
    });
}

ReactDOM.render(<App />, document.getElementById('root'));
