import React, { useState, useEffect, useRef } from 'react';
import './Header.css';

const Header = ({ onOpenAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const holdTimerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStartHold = () => {
    // Inicia contagem de 5 segundos de forma silenciosa e secreta
    holdTimerRef.current = setTimeout(() => {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      if (onOpenAdmin) {
        onOpenAdmin();
      } else {
        window.location.hash = '#/admin';
      }
    }, 5000);
  };

  const handleCancelHold = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="container header-container">
        <div
          className="logo-container"
          onMouseDown={handleStartHold}
          onMouseUp={handleCancelHold}
          onMouseLeave={handleCancelHold}
          onTouchStart={handleStartHold}
          onTouchEnd={handleCancelHold}
          onTouchCancel={handleCancelHold}
          onContextMenu={(e) => e.preventDefault()}
          style={{ cursor: 'pointer' }}
        >
          <img src="images/logo.png" alt="Coletivo Eco Logo" className="logo" />
        </div>

        <nav className="nav-links">
          <a href="#depoimentos">Depoimentos</a>
          <a href="#por-que-nos">Diferenciais</a>
          <a href="#pacotes">Pacotes</a>
          <a href="#galeria">Galeria</a>
          <a href="#faq">Dúvidas</a>
        </nav>
        <div className="cta-container">
          <a
            href="https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '12px 24px', fontSize: '1rem' }}
          >
            Fale Conosco
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
