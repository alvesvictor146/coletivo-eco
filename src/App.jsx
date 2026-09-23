import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

function App() {
  const [currentRoute, setCurrentRoute] = useState('home'); // 'home' | 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Checar se já existe sessão salva no sessionStorage
  useEffect(() => {
    const auth = sessionStorage.getItem('coletivo_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }

    const checkHashRoute = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#/admin' || hash === '#admin' || path.endsWith('/admin')) {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('home');
      }
    };

    checkHashRoute();
    window.addEventListener('hashchange', checkHashRoute);
    window.addEventListener('popstate', checkHashRoute);
    return () => {
      window.removeEventListener('hashchange', checkHashRoute);
      window.removeEventListener('popstate', checkHashRoute);
    };
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = '#/admin';
    setCurrentRoute('admin');
  };

  const navigateToHome = () => {
    window.location.hash = '#/';
    setCurrentRoute('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('coletivo_admin_auth');
    setIsAuthenticated(false);
  };

  // Se a rota for admin:
  if (currentRoute === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToHome={navigateToHome}
        />
      );
    }
    return (
      <AdminPanel
        onLogout={handleLogout}
        onGoToSite={navigateToHome}
      />
    );
  }

  // Rota padrão (Home)
  return <HomePage onOpenAdmin={navigateToAdmin} />;
}

export default App;
