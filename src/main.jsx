import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'lib-flexible' // 移动端适配
import './index.css'
import {
  BrowserRouter
} from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
