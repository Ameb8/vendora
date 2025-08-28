import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { ProductProvider} from "./contexts/ProductContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { CartUIProvider } from "./contexts/CartUIContext.jsx";
import { TenantProvider } from "./contexts/TenantContext.jsx";
import { UserProvider } from './contexts/UserContext';

import App from './App.jsx'
import AdminRoot from './admin/src/AdminRoot.jsx'
import HomePage from './components/HomePage.jsx';
import TenantSignup from './tenant_signup/TenantSignup.jsx';
import './index.css'


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
              <Elements stripe={stripePromise}>
                  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_PUBLIC}>
                      <UserProvider>
                          <CartProvider>
                              <CartUIProvider>
                                  <Toaster />

                                  <Routes>
                                      <Route path="/" element={<HomePage />} />
                                      <Route path="/admin/*" element={<AdminRoot />} />
                                      <Route path="/signup" element={<TenantSignup />} />
                                      <Route path="/:slug/*" element={
                                          <TenantProvider>
                                              <ProductProvider>
                                                  <App />
                                              </ProductProvider>
                                          </TenantProvider>
                                      } />
                                  </Routes>
                              </CartUIProvider>
                          </CartProvider>
                      </UserProvider>
                  </GoogleOAuthProvider>
              </Elements>
      </BrowserRouter>
  </StrictMode>,
)
