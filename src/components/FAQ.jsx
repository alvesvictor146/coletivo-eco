import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FAQ.css';

const faqData = [
  {
    question: "Viajo sozinho(a), posso ir com a Coletivo Eco?",
    answer: "Com certeza! A maioria dos nossos clientes viaja sozinhos e acaba fazendo grandes amizades durante os roteiros. Nossos grupos são integradores e super acolhedores."
  },
  {
    question: "Quem costuma participar das viagens?",
    answer: "Pessoas apaixonadas por natureza, entre 25 e 65 anos, que buscam experiências autênticas, sem abrir mão do conforto e da segurança."
  },
  {
    question: "Como funciona o transporte?",
    answer: "Oferecemos transporte terrestre super confortável para todos os passeios do roteiro a partir do ponto de encontro estabelecido. Você só precisa se preocupar em chegar ao destino (aeroporto)."
  },
  {
    question: "O que está incluso no pacote?",
    answer: "Geralmente incluímos: hospedagem selecionada a dedo, café da manhã, transporte para os passeios, ingressos dos atrativos, guias locais e seguro viagem. Detalhamos tudo no roteiro que te enviaremos."
  },
  {
    question: "Qual o nível de esforço físico para as trilhas?",
    answer: "Temos roteiros para todos os perfis! Desde opções com trilhas leves e curtas, até trekking para os mais aventureiros. Fale conosco para indicarmos a viagem ideal para o seu condicionamento."
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section section-padding">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <h2>Perguntas Frequentes</h2>
          <p>Tire suas dúvidas e viaje com tranquilidade.</p>
        </div>
        
        <div className="faq-container reveal-up delay-100">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
              onClick={() => toggleAccordion(index)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="faq-icon">
                  {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div 
                className="faq-answer"
                style={{ 
                  maxHeight: activeIndex === index ? '200px' : '0',
                  padding: activeIndex === index ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem'
                }}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta text-center reveal-up delay-200" style={{ marginTop: '3rem' }}>
          <p className="cta-context" style={{ marginBottom: '1rem', color: 'var(--color-text)' }}>
            Ainda tem dúvidas? Fale com nossa equipe e receba o roteiro completo com valores, datas e disponibilidade.
          </p>
          <a href="https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20receber%20os%20roteiros%20e%20tirar%20dúvidas." target="_blank" rel="noopener noreferrer" className="btn-primary">
            Quero receber o roteiro
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
