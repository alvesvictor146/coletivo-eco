import React, { useState, useEffect } from 'react';
import { subscribePackages } from '../services/packagesService';
import './Packages.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribePackages((list) => {
      setPackages(list);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="pacotes" className="packages-section section-padding">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <h2>Pacotes Exclusivos</h2>
          <p>Roteiros completos para viver o melhor do Mato Grosso, com conforto, segurança e experiências cuidadosamente selecionadas.</p>
        </div>
        
        <div className="packages-grid">
          {packages.map((pkg, index) => {
            const whatsappLink = pkg.link || `https://wa.me/5511961781661?text=${encodeURIComponent(`Olá! Gostaria de saber mais sobre o pacote para ${pkg.title}.`)}`;
            return (
              <div key={pkg.id || index} className={`package-card reveal-up delay-${(index % 3 + 1) * 100}`}>
                <div className={`package-image ${index % 2 === 0 ? 'organic-shape-1' : 'organic-shape-2'}`}>
                  <img src={pkg.image} alt={pkg.title} />
                </div>
                <div className="package-content">
                  <h3>{pkg.title}</h3>
                  <p>{pkg.desc}</p>
                  <div className="package-footer">
                    <span className="price">A partir de <strong>{pkg.price}</strong></span>
                    <a 
                      href={whatsappLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-primary" 
                      style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                      Quero receber o roteiro
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Packages;
