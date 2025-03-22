import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import moment from 'moment';
import 'moment/locale/es';
import { ConfigProvider } from 'antd';
import es_ES from 'antd/lib/locale/es_ES'; 
moment.locale('es');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={es_ES}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);