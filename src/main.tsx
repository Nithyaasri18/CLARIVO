import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './ThemeContext.tsx';
import { EmployeeProvider } from './EmployeeContext.tsx';
import { CustomerProvider } from './CustomerContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <EmployeeProvider>
        <CustomerProvider>
          <App />
        </CustomerProvider>
      </EmployeeProvider>
    </ThemeProvider>
  </StrictMode>,
);

