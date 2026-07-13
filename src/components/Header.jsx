import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="container header-container">
        <div className="logo-container">
          <img src="/images/logo.png" alt="Coletivo Eco Logo" className="logo" />
        </div>
        <nav className="nav-links">
          <a href="#experiencias">Experiências</a>
          <a href="#pacotes">Pacotes</a>
          <a href="#galeria">Galeria</a>
          <a href="#depoimentos">Depoimentos</a>
        </nav>
        <div className="cta-container">
          <a href="#orcamento" className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>Fale Conosco</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
