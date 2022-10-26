import React from 'react';
import { hydrate, render } from "react-dom";
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(<HelmetProvider><App /></HelmetProvider>, rootElement);
} else {
  render(<HelmetProvider><App /></HelmetProvider>, rootElement);
}





