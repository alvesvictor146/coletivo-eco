import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCheckCircle, FaCircle } from 'react-icons/fa';
import { subscribeDepartures, INITIAL_DEPARTURES } from '../services/departuresService';
import './UpcomingDepartures.css';

const UpcomingDepartures = () => {
  const [departures, setDepartures] = useState(INITIAL_DEPARTURES);

  useEffect(() => {
    const unsubscribe = subscribeDepartures((list) => {
      if (Array.isArray(list) && list.length > 0) {
        setDepartures(list);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="proximas-saidas" className="departures-section section-padding">
      <div className="container">
        <div className="section-header reveal-up text-left">
          <span className="section-subtitle">— GARANTA SUA VIAGEM</span>
          <h2>Próximas saídas com grupos confirmados</h2>
          <p>Fique atento às datas de saídas programadas e garanta seu lugar em grupos pequenos e selecionados para melhor aproveitamento técnico.</p>
        </div>
        
        <div className="departures-list reveal-up delay-100">
          {departures.map((dep) => (
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
                  <FaCircle className={`status-dot ${dep.isUrgent ? 'pulse-alert' : ''}`} style={{ color: dep.statusColor || '#10B981' }} />
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
