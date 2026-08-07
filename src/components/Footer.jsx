import React from 'react';
import { FaInstagram, FaFacebookF, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import './Footer.css';

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
          <a href="https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20receber%20os%20roteiros%20da%20Coletivo%20Eco." target="_blank" rel="noopener noreferrer" className="btn-green" style={{display: "inline-block", padding: "15px 30px"}}>Quero receber o roteiro</a>
        </div>
      </section>

      <footer className="footer-section">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col brand">
              <img src="images/logo.png" alt="Coletivo Eco" className="footer-logo" />
              <p>Experiências inesquecíveis em cachoeiras, rios cristalinos, trilhas e destinos exclusivos no Mato Grosso.</p>
              <div className="social-links">
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaWhatsapp /></a>
                <a href="#"><FaEnvelope /></a>
              </div>
            </div>
            
            <div className="footer-col">
              <h4>Destinos</h4>
              <ul>
                <li><a href="#pacotes">Chapada dos Guimarães</a></li>
                <li><a href="#pacotes">Nobres</a></li>
                <li><a href="#pacotes">Pantanal</a></li>
                <li><a href="#pacotes">Barra do Garças</a></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h4>Institucional</h4>
              <p><strong>CNPJ:</strong> 00.000.000/0001-00</p>
              <p><strong>Cadastur:</strong> 00.000000.00.0000-0</p>
              <p><strong>Telefone:</strong> +55 65 9999-9999</p>
              <p><strong>Email:</strong> contato@coletivoeco.com.br</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Coletivo Eco. Todos os direitos reservados. (Dados ilustrativos)</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
