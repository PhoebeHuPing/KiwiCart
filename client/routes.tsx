import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router'

import App from './components/App.tsx'
import ProductComparison from './components/ProductComparison.tsx'

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<ProductComparison />} />
    </Route>,
  ),
)
