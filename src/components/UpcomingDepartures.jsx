import React from 'react';
import { FaCalendarAlt, FaCheckCircle, FaCircle } from 'react-icons/fa';
import './UpcomingDepartures.css';

const departuresData = [
  {
    id: 1,
    title: "Chapada dos Guimarães",
    dates: "15 a 18 de Julho",
    spotsText: "Restam apenas 4 vagas",
    statusText: "Confirmado",
    statusColor: "var(--color-primary)",
    link: "https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20garantir%20minha%20vaga%20para%20a%20Chapada%20dos%20Guimarães%20(15%20a%2018%20de%20Julho)."
  },
  {
    id: 2,
    title: "Expedição Pantanal Selvagem",
    dates: "22 a 26 de Julho",
    spotsText: "Restam apenas 2 vagas",
    statusText: "Últimas vagas!",
    statusColor: "#e63946",
    isUrgent: true,
    link: "https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20garantir%20minha%20vaga%20para%20a%20Expedição%20Pantanal%20Selvagem%20(22%20a%2026%20de%20Julho)."
  },
  {
    id: 3,
    title: "Nobres & Bom Jardim",
    dates: "05 a 07 de Agosto",
    spotsText: "Restam 6 vagas",
    statusText: "Confirmado",
    statusColor: "var(--color-primary)",
    link: "https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20garantir%20minha%20vaga%20para%20Nobres%20&%20Bom%20Jardim%20(05%20a%2007%20de%20Agosto)."
  }
];

const UpcomingDepartures = () => {
  return (
    <section id="proximas-saidas" className="departures-section section-padding">
      <div className="container">
        <div className="section-header reveal-up text-left">
          <span className="section-subtitle">— GARANTA SUA VIAGEM</span>
          <h2>Próximas saídas com grupos confirmados</h2>
          <p>Fique atento às datas de saídas programadas e garanta seu lugar em grupos pequenos e selecionados para melhor aproveitamento técnico.</p>
        </div>
        
        <div className="departures-list reveal-up delay-100">
          {departuresData.map((dep) => (
            <div key={dep.id} className="departure-card">
              <div className="dep-icon-wrapper">
                <FaCalendarAlt className="dep-icon" />
              </div>
              
              <div className="dep-info">
                <h3>{dep.title}</h3>
                <p>{dep.dates}</p>
              </div>
              
              <div className="dep-badges">
                <div className="badge-spots">{dep.spotsText}</div>
                <div className={`badge-status ${dep.isUrgent ? 'status-urgent' : ''}`}>
                  <FaCircle className={`status-dot ${dep.isUrgent ? 'pulse-alert' : ''}`} style={{ color: dep.statusColor }} />
                  <span className={dep.isUrgent ? 'text-urgent' : ''}>{dep.statusText}</span>
                </div>
              </div>
              
              <div className="dep-action">
                <a href={dep.link} target="_blank" rel="noopener noreferrer" className="btn-green btn-full">
                  <FaCheckCircle style={{ marginRight: '8px' }} /> Garantir minha vaga
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingDepartures;
