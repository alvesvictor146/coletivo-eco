import React, { useState, useEffect } from 'react';
import { subscribePackages } from '../services/packagesService';
import './Packages.css';

const formatTotalPrice = (priceStr) => {
  if (!priceStr) return 'A partir de R$ 2.099,90 | Taxas inclusas';
  if (priceStr.toLowerCase().includes('taxas inclusas')) {
    return priceStr;
  }
  const clean = priceStr.replace(/^a partir de\s*/i, '').trim();
  const formatted = clean.startsWith('R$') ? clean : `R$ ${clean}`;
  return `A partir de ${formatted} | Taxas inclusas`;
};

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
                  <div className="package-desc">{pkg.desc}</div>
                  <div className="package-pricing-block">
                    <span className="price-lead">a partir de</span>
                    <span className="price-installment">
                      {pkg.installment || '6x de R$ 349,98'}
                    </span>
                    <span className="price-per-person">Preço por pessoa*</span>

                    <a 
                      href={whatsappLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-package-action"
                    >
                      SAIBA MAIS
                    </a>

                    <div className="price-total-note">
                      {formatTotalPrice(pkg.price)}
                    </div>
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
