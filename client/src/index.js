import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './Login';
import SignUp from './SignUp';
import AugStepForm from './AugStepForm';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
      <AugStepForm />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
