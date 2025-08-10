import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ProductProvider} from "./contexts/ProductContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { CartUIProvider } from "./contexts/CartUIContext.jsx";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import App from './App.jsx'
import './index.css'
import { Toaster } from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <ProductProvider>
              <Elements stripe={stripePromise}>
                  <CartProvider>
                      <CartUIProvider>
                          <Toaster />
                          <App />
                      </CartUIProvider>
                  </CartProvider>
              </Elements>
          </ProductProvider>
      </BrowserRouter>
  </StrictMode>,
)
