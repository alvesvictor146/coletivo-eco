import React from 'react';
import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import './Footer.css';

const TripAdvisorAwardBadge = () => (
  <svg viewBox="0 0 100 100" width="66" height="66" className="tripadvisor-svg-badge" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="#00EB7B" />
    <text x="50" y="24" textAnchor="middle" fill="#000000" fontSize="7.5" fontWeight="800" fontFamily="'Montserrat', 'Inter', sans-serif">
      Tripadvisor
    </text>
    <text x="50" y="32" textAnchor="middle" fill="#000000" fontSize="6.5" fontWeight="700" fontFamily="'Montserrat', 'Inter', sans-serif">
      Travelers'
    </text>
    <text x="50" y="39" textAnchor="middle" fill="#000000" fontSize="6" fontWeight="600" fontFamily="'Montserrat', 'Inter', sans-serif">
      Choice Awards
    </text>
    <g transform="translate(32, 43) scale(0.36)">
      <circle cx="24" cy="24" r="18" fill="none" stroke="#000000" strokeWidth="4.5" />
      <circle cx="76" cy="24" r="18" fill="none" stroke="#000000" strokeWidth="4.5" />
      <circle cx="24" cy="24" r="7" fill="#000000" />
      <circle cx="76" cy="24" r="7" fill="#000000" />
      <path d="M 42,24 L 58,24" stroke="#000000" strokeWidth="4.5" />
      <polygon points="50,28 44,38 56,38" fill="#000000" />
      <path d="M 4,14 C -2,28 6,42 14,50" fill="none" stroke="#000000" strokeWidth="3.5" />
      <path d="M 96,14 C 102,28 94,42 86,50" fill="none" stroke="#000000" strokeWidth="3.5" />
    </g>
    <text x="50" y="78" textAnchor="middle" fill="#000000" fontSize="8.5" fontWeight="800" fontFamily="'Montserrat', 'Inter', sans-serif">
      2025
    </text>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <section id="orcamento" className="cta-section">
        <div className="cta-background">
          <img src={`${import.meta.env.BASE_URL}images/cta-bg.jpeg`} alt="Sua próxima aventura começa agora" />
          <div className="cta-overlay"></div>
        </div>
        <div className="container cta-content reveal-up">
          <h2>Sua próxima aventura começa agora.</h2>
          <p style={{ marginBottom: "20px", fontSize: "1.1rem", textShadow: "0 2px 5px rgba(0,0,0,0.5)" }}>
            Fale com nossa equipe e receba o roteiro completo com valores, datas e disponibilidade.
          </p>
          <a 
            href="https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20receber%20os%20roteiros%20da%20Coletivo%20Eco." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-green" 
            style={{ display: "inline-block", padding: "15px 30px" }}
          >
            Quero receber o roteiro
          </a>
        </div>
      </section>

      <footer className="footer-section">
        <div className="container footer-container">
          <div className="footer-main-content">
            {/* Lado Esquerdo: Prêmios, Cadastur e Redes Sociais */}
            <div className="footer-left-col">
              <div className="footer-badges-row">
                <div className="award-badge-group">
                  <TripAdvisorAwardBadge />
                  <div className="award-text-content">
                    <span className="award-title-label">Prêmios:</span>
                    <span className="award-name">Travellers' Choice 2025</span>
                  </div>
                </div>

                <a 
                  href="https://cadastur.turismo.gov.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="footer-cadastur-link"
                  title="Cadastur - Ministério do Turismo"
                >
                  <img 
                    src={`${import.meta.env.BASE_URL}images/cadastur-white.png`} 
                    alt="Cadastur Ministério do Turismo" 
                    className="footer-cadastur-logo-white"
                  />
                </a>
              </div>

              <div className="footer-social-group">
                <span className="footer-social-label">Siga-nos:</span>
                <div className="footer-social-icons">
                  <a 
                    href="https://www.instagram.com/coletivoeco" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn instagram"
                    aria-label="Instagram @coletivoeco"
                  >
                    <FaInstagram />
                  </a>
                  <a 
                    href="https://www.facebook.com/coletivo.ecotur" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-btn facebook"
                    aria-label="Facebook @coletivo.ecotur"
                  >
                    <FaFacebookF />
                  </a>
                </div>
              </div>
            </div>

            {/* Lado Direito: Institucional */}
            <div className="footer-right-col">
              <div className="footer-institutional-box">
                <h3 className="footer-institutional-title">Institucional</h3>
                <div className="footer-yellow-line"></div>

                <div className="footer-info-list">
                  <div className="footer-info-item">
                    <span className="footer-text">
                      <strong className="footer-label">CNPJ:</strong> 41.105.193/0001-22
                    </span>
                  </div>

                  <div className="footer-info-item">
                    <span className="footer-text">
                      <strong className="footer-label">Cadastur:</strong> 41.105.193/0001-22
                    </span>
                  </div>

                  <div className="footer-info-item">
                    <span className="footer-text">
                      <strong className="footer-label">Telefone:</strong>{' '}
                      <a 
                        href="https://wa.me/5511961781661?text=Olá!%20Gostaria%20de%20falar%20com%20a%20equipe%20da%20Coletivo%20Eco." 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="footer-link"
                      >
                        +55 11 96178-1661
                      </a>
                    </span>
                  </div>

                  <div className="footer-info-item">
                    <span className="footer-text">
                      <strong className="footer-label">Email:</strong>{' '}
                      <a 
                        href="mailto:atendimento@coletivo-eco.com.br"
                        className="footer-link"
                      >
                        atendimento@coletivo-eco.com.br
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom-info">
            <p className="rights-line">
              © {currentYear} Coletivo Eco – Viagens. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
