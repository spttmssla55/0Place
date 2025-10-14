// src/App.js

import React from 'react';
import Headerr from './Headerr'; // Headerr.js로 파일명이 되어 있어 맞춥니다.
import Middle from './Middle';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <Headerr />
      <div className="App">
        <div className="App-content">
          <Middle />
        </div>
      </div>
    </>
  );
}

export default App;