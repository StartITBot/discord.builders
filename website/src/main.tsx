import ReactDOM from 'react-dom'
import 'emoji-mart/css/emoji-mart.css'
import 'components-sdk/components-sdk.css'
import './index.css'
import './slider.css'
import App from './App'
import {store} from './state'
import {Provider} from 'react-redux'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
