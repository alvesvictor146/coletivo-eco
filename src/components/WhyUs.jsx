import React from 'react';
import { FaMapMarkedAlt, FaBus, FaUsers, FaHeadset, FaCheckCircle, FaAward } from 'react-icons/fa';
import './WhyUs.css';

const differentials = [
  {
    icon: <FaMapMarkedAlt />,
    title: "Guias Especializados",
    desc: "Profissionais locais certificados que conhecem os segredos da região, garantindo segurança e enriquecimento cultural."
  },
  {
    icon: <FaBus />,
    title: "Logística Completa",
    desc: "Não se preocupe com nada. Cuidamos do transporte, hospedagem, passeios e ingressos para você focar apenas em aproveitar."
  },
  {
    icon: <FaUsers />,
    title: "Grupos Acompanhados",
    desc: "Viaje com pessoas incríveis e sinta a energia de estar acompanhado desde o momento do embarque até o retorno."
  },
  {
    icon: <FaHeadset />,
    title: "Suporte 24h",
    desc: "Nossa equipe está disponível antes e durante toda a sua viagem para resolver qualquer eventualidade."
  },
  {
    icon: <FaCheckCircle />,
    title: "Roteiros Testados",
    desc: "Cada experiência foi cuidadosamente planejada e vivenciada por nós para garantir a máxima qualidade."
  },
  {
    icon: <FaAward />,
    title: "Experiência Premium",
    desc: "Vencedores do Traveller's Choice, reconhecidos globalmente pela excelência em experiências turísticas."
  }
];

const WhyUs = () => {
  return (
    <section id="por-que-nos" className="why-us-section section-padding">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <h2>Por que viajar com a Coletivo Eco?</h2>
          <p>Nós não vendemos apenas pacotes, nós entregamos tranquilidade, segurança e experiências inesquecíveis.</p>
        </div>
        
        <div className="differentials-grid">
          {differentials.map((item, index) => (
            <div key={index} className={`differential-card reveal-up delay-${(index % 3 + 1) * 100}`}>
              <div className="diff-icon">
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="why-us-cta reveal-up delay-400">
          <p className="cta-context">Fale com nossa equipe e receba o roteiro completo com valores, datas e disponibilidade.</p>
          <a href="https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20receber%20os%20roteiros%20da%20Coletivo%20Eco." target="_blank" rel="noopener noreferrer" className="btn-primary glow-effect pulse-btn">
            Quero receber o roteiro
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
