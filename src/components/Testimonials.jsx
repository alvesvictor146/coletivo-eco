import React, { useRef } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Testimonials.css';

const testimonialsData = [
  {
    name: "Mais Verde Mais Vida",
    date: "uma semana atrás",
    stars: 5,
    text: "Fiz o roteiro Chapada dos Guimarães e Nobres. Foi tudo perfeito, muito bem organizado e conduzido."
  },
  {
    name: "Joice Correa",
    date: "um ano atrás",
    stars: 5,
    text: "Contratamos o serviço para conhecer a Chapada dos Guimarães e ficamos muito felizes com o atendimento do início ao fim! A Rose foi a nossa guia e ela é uma querida! Recomendamos a todos!"
  },
  {
    name: "Luiza Vivan",
    date: "4 meses atrás",
    stars: 5,
    text: "Viajem para a Chapada dos Guimarães foi excelente, guias muito prestativo e atenciosos, roteiro incrível! Recomendo!"
  },
  {
    name: "Jaqueline Marques",
    date: "7 meses atrás",
    stars: 5,
    text: "Incrível! Experiência excelente no Mato Grosso, equipe muito prestativa e capacitada! Tudo bem organizado.. Recomendo"
  },
  {
    name: "Raphaela Barros",
    date: "2 anos atrás",
    stars: 5,
    text: "Já fechei três pacotes de viagem com a empresa (Saco do Mamanguá, Chapada dos Veadeiros e Barra do Garças) e super recomendo. A equipe é muito profissional, organizada, atenciosa e receptiva."
  }
];

const Testimonials = () => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -380, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 380, behavior: 'smooth' });
  };

  return (
    <section id="depoimentos" className="testimonials-section section-padding">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <h2>O que dizem nossos viajantes</h2>
          <p>Experiências reais de quem já viveu a magia do Mato Grosso conosco.</p>
        </div>

        <div className="carousel-container reveal-up delay-100">
          <button className="carousel-btn prev" onClick={scrollLeft}><FaChevronLeft /></button>
          
          <div className="carousel-track" ref={carouselRef}>
            {testimonialsData.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card google-print">
                <div className="google-header">
                  <div className="google-avatar">{testimonial.name.charAt(0)}</div>
                  <div className="google-info">
                    <span className="google-name">{testimonial.name}</span>
                    <span className="google-date">{testimonial.date}</span>
                  </div>
                  <div className="google-logo">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" width="20" />
                  </div>
                </div>
                <div className="google-stars">
                  {[...Array(testimonial.stars)].map((_, i) => <FaStar key={i} color="#fbbc04" />)}
                </div>
                <p className="google-text">{testimonial.text}</p>
              </div>
            ))}
          </div>

          <button className="carousel-btn next" onClick={scrollRight}><FaChevronRight /></button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
