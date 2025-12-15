import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/globals.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import JS for Bootstrap components (Modal/Dropdown)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)