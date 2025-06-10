import React from 'react';
import ReactDOM from 'react-dom/client'; // توجه کنید: از 'react-dom/client' ایمپورت می‌کنیم
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // یک روت جدید می‌سازیم
root.render( // از متد render روی روت استفاده می‌کنیم
  <React.StrictMode>
    <App />
  </React.StrictMode>
);