import React from 'react';
import App from './App';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { hydrate, render } from "react-dom";
const rootElement = document.getElementById("root");

if (rootElement.hasChildNodes()) {
    hydrate(<HelmetProvider><App /></HelmetProvider>, rootElement);
} else {
    render(<HelmetProvider><App /></HelmetProvider>, rootElement);
}