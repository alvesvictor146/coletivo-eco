import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero = () => {
  const [offsetY, setOffsetY] = useState(0);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroImage = `${import.meta.env.BASE_URL}images/hero-photo.jpeg`;

  return (
    <section className="hero-section">
      <div 
        className="hero-background"
        style={{ transform: `translateY(${offsetY * 0.4}px)` }}
      >
        <img 
          src={heroImage} 
          alt="Onça-pintada na beira do rio" 
          className="hero-image"
        />
        <div className="hero-overlay"></div>
      </div>
      
      {/* Particles effect simulated via CSS */}
      <div className="particles"></div>

      <div className="container hero-content">
        <h1 className="reveal-up delay-100">
          A magia do <span className="highlight">Mato Grosso</span>
        </h1>
        <p className="reveal-up delay-200">
          Descubra experiências únicas em meio à natureza, com conforto, segurança e tudo planejado para você.
        </p>

        <div className="social-proof-hero reveal-up delay-300">
          <div className="proof-item">
            <span>🏆</span>
            <strong>Traveller's Choice 2025</strong>
          </div>
          <div className="proof-item flex-col">
            <span className="stars">⭐⭐⭐⭐⭐</span>
            <span className="proof-text"><strong>5.0</strong> (71 avaliações Google)</span>
          </div>
          <div className="proof-item">
            <span>👥</span>
            Mais de <strong>2.000</strong> viajantes atendidos
          </div>
        </div>
        <div className="hero-cta-wrapper reveal-up delay-400">
          <p className="hero-cta-context">Fale com nossa equipe e receba o roteiro completo com valores, datas e disponibilidade.</p>
          <a href="https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20receber%20os%20roteiros%20da%20Chapada%20dos%20Guimarães." target="_blank" rel="noopener noreferrer" className="btn-primary glow-effect pulse-btn">
            Quero receber o roteiro
          </a>
        </div>
      </div>

      <div className="organic-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#fcf9f2" fillOpacity="1" d="M0,128L48,149.3C96,171,192,213,288,218.7C384,224,480,192,576,181.3C672,171,768,181,864,202.7C960,224,1056,256,1152,261.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
