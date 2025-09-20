// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';   // use App.css instead of index.css
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
