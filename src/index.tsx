import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider as ReduxProvider} from "react-redux";
import reduxThunk from "./stores/reduxThunk/reduxThunk";
import {RecoilRoot} from "recoil";
import {BrowserRouter} from "react-router-dom";
import {Provider as JotaiProvider} from "jotai";
import {CookiesProvider} from "react-cookie";
import { ColorModeScript } from '@chakra-ui/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ReduxProvider store={reduxThunk}>
    <RecoilRoot>
      <CookiesProvider>
        <JotaiProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </JotaiProvider>
      </CookiesProvider>
    </RecoilRoot>
  </ReduxProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
