import React, { useEffect, useState, useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './Hero.css';

const videos = [
  '/videos/hero-video-1.mp4',
  '/videos/hero-video-2.mp4',
  '/videos/hero-video-3.mp4'
];

const Hero = () => {
  const [offsetY, setOffsetY] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRefs = useRef([]);

  const handleScroll = () => {
    setOffsetY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const activeVideo = videoRefs.current[currentVideo];
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(e => console.log("Autoplay prevented", e));
    }
  }, [currentVideo]);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  return (
    <section className="hero-section">
      <div 
        className="hero-background"
        style={{ transform: `translateY(${offsetY * 0.5}px)` }}
      >
        {videos.map((vid, idx) => (
          <video 
            key={idx}
            ref={el => videoRefs.current[idx] = el}
            className={`hero-video ${idx === currentVideo ? 'active' : ''}`}
            src={vid} 
            muted 
            playsInline 
            onEnded={handleVideoEnd}
          />
        ))}
        <div className="hero-overlay"></div>
      </div>
      
      {/* Particles effect simulated via CSS */}
      <div className="particles"></div>

      <div className="container hero-content">
        <h1 className="reveal-up delay-100">
          Descubra as Maravilhas<br />
          Naturais do <span className="highlight">Mato Grosso</span>
        </h1>
        <p className="reveal-up delay-200">
          Experiências inesquecíveis em cachoeiras, rios cristalinos, trilhas e destinos 
          exclusivos preparados para quem deseja viver a natureza em sua melhor versão.
        </p>
        <div className="hero-buttons reveal-up delay-300">
          <a href="#pacotes" className="btn-primary glow-effect">
            Explorar Pacotes <FaArrowRight />
          </a>
          <a href="#orcamento" className="btn-green">
            Solicitar Orçamento
          </a>
        </div>
      </div>

      <div className="organic-divider">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#fcf9f2" fillOpacity="1" d="M0,128L48,149.3C96,171,192,213,288,218.7C384,224,480,192,576,181.3C672,171,768,181,864,202.7C960,224,1056,256,1152,261.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
