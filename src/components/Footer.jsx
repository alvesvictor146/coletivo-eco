import React from 'react';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaEnvelope, FaTripadvisor } from 'react-icons/fa';
import './Footer.css';

const CadasturLogo = () => (
  <div className="cadastur-badge">
    <svg viewBox="0 0 240 55" height="46" fill="none" xmlns="http://www.w3.org/2000/svg" className="cadastur-svg">
      {/* Green Ribbon */}
      <path 
        d="M 6,36 C 22,46 45,43 60,28 C 74,13 90,13 102,20 C 90,26 77,26 64,38 C 48,52 23,48 6,36 Z" 
        fill="#78BE20" 
      />
      {/* Yellow Ribbon */}
      <path 
        d="M 10,18 C 24,6 46,8 60,22 C 73,36 90,38 102,31 C 90,25 78,24 66,14 C 51,1 25,4 10,18 Z" 
        fill="#FCD116" 
      />
      {/* Stylized Text Cadastur */}
      <text 
        x="108" 
        y="37" 
        fontFamily="'Montserrat', 'Inter', 'Segoe UI', sans-serif" 
        fontWeight="800" 
        fontSize="32" 
        fill="#FFFFFF" 
        letterSpacing="-0.5"
      >
        Cadastur
      </text>
    </svg>
  </div>
);

const Footer = () => {
  return (
    <>
      <section id="orcamento" className="cta-section">
        <div className="cta-background">
          <img src="images/hero_drone_view_1783969284798.png" alt="Call to action" />
          <div className="cta-overlay"></div>
        </div>
        <div className="container cta-content reveal-up">
          <h2>Sua próxima aventura começa agora.</h2>
          <p style={{marginBottom: "20px", fontSize: "1.1rem", textShadow: "0 2px 5px rgba(0,0,0,0.5)"}}>
            Fale com nossa equipe e receba o roteiro completo com valores, datas e disponibilidade.
          </p>
          <a 
            href="https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20receber%20os%20roteiros%20da%20Coletivo%20Eco." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-green" 
            style={{display: "inline-block", padding: "15px 30px"}}
          >
            Quero receber o roteiro
          </a>
        </div>
      </section>

      <footer className="footer-section">
        <div className="container footer-container">
          {/* Top badges: Prêmios & Cadastur */}
          <div className="footer-top-bar">
            <div className="award-badge-group">
              <div className="award-circle">
                <FaTripadvisor className="award-icon" />
              </div>
              <div className="award-text-content">
                <span className="award-title-label">Prêmios:</span>
                <span className="award-name">Travellers' Choice 2025</span>
              </div>
            </div>

            <CadasturLogo />
          </div>

          {/* Social Follow */}
          <div className="footer-center-section">
            <div className="footer-block">
              <h4 className="footer-block-title">Siga-nos:</h4>
              <div className="footer-social-icons">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn instagram"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-btn facebook"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="footer-block">
              <h4 className="footer-block-title">Fale Conosco:</h4>
              <div className="footer-contact-items">
                <a 
                  href="https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20falar%20com%20a%20equipe%20da%20Coletivo%20Eco." 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="contact-pill"
                >
                  <span className="contact-icon whatsapp">
                    <FaWhatsapp />
                  </span>
                  <span className="contact-text">+55 11 96178-1661</span>
                </a>

                <a 
                  href="mailto:atendimento@coletivo-eco.com.br" 
                  className="contact-pill"
                >
                  <span className="contact-icon email">
                    <FaEnvelope />
                  </span>
                  <span className="contact-text">atendimento@coletivo-eco.com.br</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom copyright & legal */}
          <div className="footer-bottom-info">
            <p className="legal-line">
              &copy; 2026 Coletivo Eco - Viagens | Cadastur: 41.105.193/0001-22
            </p>
            <p className="rights-line">Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
