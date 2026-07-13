import React from 'react';
import './Packages.css';

const packagesData = [
  {
    title: "Chapada dos Guimarães",
    desc: "Cachoeiras, paredões e mirantes espetaculares na savana central.",
    image: "/images/chapada_guimaraes_1783969294083.png",
    days: "4 Dias",
    price: "R$ 1.890",
  },
  {
    title: "Nobres",
    desc: "Flutuação em rios cristalinos repletos de peixes e grutas calcárias.",
    image: "/images/nobres_flutuacao_1783969302792.png",
    days: "3 Dias",
    price: "R$ 1.550",
  },
  {
    title: "Pantanal",
    desc: "Safári ecológico e vivência única com a maior fauna das Américas.",
    image: "/images/pantanal_jaguar_1783969312716.png",
    days: "5 Dias",
    price: "R$ 3.200",
  },
  {
    title: "Barra do Garças",
    desc: "Águas termais, cachoeiras místicas e mistérios na Serra do Roncador.",
    image: "/images/hero_drone_view_1783969284798.png",
    days: "3 Dias",
    price: "R$ 1.350",
  },
  {
    title: "Jaciara",
    desc: "Aventura radical com rafting no Rio Tenente Amaral e cachoeiras incríveis.",
    image: "/images/jaciara.png",
    days: "2 Dias",
    price: "R$ 890",
  },
  {
    title: "Vila Bela",
    desc: "Cânions imponentes e as mais altas cachoeiras do estado repletas de história.",
    image: "/images/vila_bela.png",
    days: "4 Dias",
    price: "R$ 1.700",
  }
];

const Packages = () => {
  return (
    <section id="pacotes" className="packages-section section-padding">
      <div className="container">
        <div className="section-header text-center reveal-up">
          <h2>Destinos Exclusivos</h2>
          <p>Pacotes elaborados para extrair o melhor de cada região, com muito luxo e conforto.</p>
        </div>
        
        <div className="packages-grid">
          {packagesData.map((pkg, index) => (
            <div key={index} className={`package-card reveal-up delay-${(index % 3 + 1) * 100}`}>
              <div className={`package-image ${index % 2 === 0 ? 'organic-shape-1' : 'organic-shape-2'}`}>
                <img src={pkg.image} alt={pkg.title} />
                <div className="package-tag">{pkg.days}</div>
              </div>
              <div className="package-content">
                <h3>{pkg.title}</h3>
                <p>{pkg.desc}</p>
                <div className="package-footer">
                  <span className="price">A partir de <strong>{pkg.price}</strong></span>
                  <a href="#orcamento" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Saiba mais</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Packages;
