
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './Features/routes/AppRoutes'
import { Provider } from 'react-redux'
import { store } from "./Features/store/authStore";


createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppRoutes />
  </Provider>,
);
