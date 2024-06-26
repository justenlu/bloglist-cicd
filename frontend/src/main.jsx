import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
)
