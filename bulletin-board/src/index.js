import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board';
import './index.css';

ReactDOM.render(
  <Board count={5} />,
  document.getElementById('react-container')
);
