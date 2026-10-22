import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n';
import 'flag-icons/css/flag-icons.min.css';

// O painel só é baixado por quem abre /admin — o cardápio público não carrega esse código.
const AdminApp = lazy(() => import('./admin/AdminApp.tsx'));

const path = window.location.pathname.slice(import.meta.env.BASE_URL.length - 1);
const isAdminRoute = /^\/admin\/?$/.test(path);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminRoute ? (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)
