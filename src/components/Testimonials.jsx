import React, { useRef } from 'react';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Testimonials.css';

const testimonialsData = [
  { name: "Mariana Silva", text: "A melhor viagem da minha vida! A equipe do Coletivo Eco organizou tudo perfeitamente na Chapada.", stars: 5 },
  { name: "João Pedro", text: "Flutuar em Nobres foi uma experiência mágica. Recomendo de olhos fechados, serviço super premium.", stars: 5 },
  { name: "Carla & Marcos", text: "Nosso safári no Pantanal foi inesquecível. Vimos onças e uma natureza intocada. Fantástico!", stars: 5 },
  { name: "Fernanda Costa", text: "Atendimento impecável desde o primeiro contato. Guias muito experientes e atenciosos.", stars: 5 },
  { name: "Lucas Almeida", text: "A energia de Barra do Garças é única, e a pousada que ficamos era de extremo luxo e conforto.", stars: 5 }
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
              <div key={idx} className="testimonial-card glass-panel">
                <div className="stars">
                  {[...Array(testimonial.stars)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <h4 className="testimonial-name">- {testimonial.name}</h4>
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
