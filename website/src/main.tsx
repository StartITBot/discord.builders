import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'emoji-mart/css/emoji-mart.css'
import 'components-sdk/components-sdk.css'
import './index.css'
import './slider.css'
import './i18n'
import App from './App'
import {store} from './state'
import {Provider} from 'react-redux'

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
