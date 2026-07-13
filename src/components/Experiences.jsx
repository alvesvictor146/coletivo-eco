import React from 'react';
import { FaWater, FaHiking, FaSwimmer, FaShip, FaMountain, FaCampground, FaCamera } from 'react-icons/fa';
import './Experiences.css';

const experiencesData = [
  { icon: <FaWater />, title: "Cachoeiras", desc: "Quedas d'água majestosas em meio à mata nativa." },
  { icon: <FaHiking />, title: "Trilhas", desc: "Caminhadas ecológicas para todos os níveis." },
  { icon: <FaSwimmer />, title: "Flutuação", desc: "Mergulhe em rios de águas cristalinas com peixes." },
  { icon: <FaShip />, title: "Passeios de Barco", desc: "Navegação por cenários deslumbrantes do Pantanal." },
  { icon: <FaMountain />, title: "Rapel", desc: "Aventura e adrenalina nas maiores rochas." },
  { icon: <FaCampground />, title: "Camping", desc: "Conexão total com a natureza sob o céu estrelado." },
  { icon: <FaCamera />, title: "Observação", desc: "Safáris fotográficos para ver animais silvestres." },
];

const Experiences = () => {
  return (
    <section id="experiencias" className="experiences-section section-padding">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <h2>Vivencie o Inexplicável</h2>
          <p>Oferecemos um leque de aventuras para você se conectar profundamente com a natureza.</p>
        </div>
        
        <div className="experiences-grid">
          {experiencesData.map((exp, index) => (
            <div 
              key={index} 
              className={`experience-card glass-panel reveal-up delay-${(index % 3 + 1) * 100}`}
            >
              <div className="icon-wrapper">
                {exp.icon}
              </div>
              <h3>{exp.title}</h3>
              <p>{exp.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
