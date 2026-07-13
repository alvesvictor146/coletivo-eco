import React from 'react';
import './Gallery.css';

const galleryData = [
  {
    video: "/videos/gallery-video-1.mp4",
    title: "Cachoeiras de Nobres",
    desc: "Águas cristalinas ideais para relaxamento e mergulho."
  },
  {
    video: "/videos/gallery-video-2.mp4",
    title: "Chapada dos Guimarães",
    desc: "Vistas deslumbrantes para os gigantes paredões de arenito."
  },
  {
    video: "/videos/gallery-video-3.mp4",
    title: "Pantanal Norte",
    desc: "A maior planície alagada do mundo, cheia de vida silvestre."
  }
];

const Gallery = () => {
  return (
    <section id="galeria" className="gallery-section section-padding">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <h2>Belezas em Foco</h2>
          <p>Um pequeno vislumbre do que aguarda você no coração do Brasil.</p>
        </div>
        
        <div className="gallery-video-grid">
          {galleryData.map((item, index) => (
            <div key={index} className="gallery-item-wrapper reveal-up delay-100">
              <div className="gallery-video-item">
                <video 
                  src={item.video} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                />
              </div>
              <div className="gallery-video-info">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
