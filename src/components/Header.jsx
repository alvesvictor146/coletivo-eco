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
        <a href="#" className="logo-container">
          <img src="images/logo.png" alt="Coletivo Eco Logo" className="logo" />
        </a>
        <nav className="nav-links">
          <a href="#depoimentos">Depoimentos</a>
          <a href="#por-que-nos">Diferenciais</a>
          <a href="#pacotes">Pacotes</a>
          <a href="#galeria">Galeria</a>
          <a href="#faq">Dúvidas</a>
        </nav>
        <div className="cta-container">
          <a href="https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista." target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>Fale Conosco</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
