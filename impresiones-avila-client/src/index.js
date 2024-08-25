import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

console.log("PayPal SDK should be loading...");

// Verificación adicional
if (process.env.REACT_APP_PAYPAL_CLIENT_ID) {
    console.log("PayPal SDK is being loaded with client ID:", process.env.REACT_APP_PAYPAL_CLIENT_ID);
} else {
    console.error("PayPal Client ID is missing!");
}

reportWebVitals();
