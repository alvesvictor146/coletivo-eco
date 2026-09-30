import React from 'react';
import './Footer.css';

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
          <div className="footer-institutional-box">
            <h3 className="footer-institutional-title">Institucional</h3>
            <div className="footer-yellow-line"></div>

            <div className="footer-info-list">
              <div className="footer-info-item brand-name-item">
                <span className="footer-text font-bold">Coletivo Eco – Viagens 🌿</span>
              </div>

              <div className="footer-info-item">
                <span className="footer-text">🏆 Travellers’ Choice 2025 – TripAdvisor</span>
              </div>

              <div className="footer-info-item">
                <span className="footer-text">
                  <strong className="footer-label">📋 Cadastur:</strong> 41.105.193/0001-22
                </span>
              </div>

              <div className="footer-info-item">
                <span className="footer-text">
                  <strong className="footer-label">📱 WhatsApp:</strong>{' '}
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
                  <strong className="footer-label">📧 Email:</strong>{' '}
                  <a 
                    href="mailto:atendimento@coletivo-eco.com.br"
                    className="footer-link"
                  >
                    atendimento@coletivo-eco.com.br
                  </a>
                </span>
              </div>

              <div className="footer-info-item">
                <span className="footer-text">
                  <strong className="footer-label">📲 Instagram:</strong>{' '}
                  <a 
                    href="https://www.instagram.com/coletivoeco" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    @coletivoeco
                  </a>
                </span>
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
