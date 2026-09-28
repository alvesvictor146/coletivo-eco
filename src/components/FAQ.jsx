import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './FAQ.css';

const faqData = [
  {
    question: "Viajo sozinho(a). Posso viajar com a Coletivo Eco?",
    answer: "Com certeza! Viajar sozinho(a) com a Coletivo Eco é super comum. Nossos roteiros são pensados para proporcionar experiências em grupo, reunindo pessoas que compartilham o mesmo interesse por natureza, viagens e novas experiências. É também uma ótima oportunidade para conhecer novos lugares e fazer novas amizades pelo caminho."
  },
  {
    question: "Quem costuma participar das viagens?",
    answer: "A Coletivo Eco está preparada para receber diferentes públicos e perfis de viajantes. Temos diversos formatos de roteiros, pensados para atender diferentes estilos, interesses e níveis de experiência.\n\nNossos roteiros podem ser ajustados de acordo com o perfil do viajante, sempre buscando equilibrar natureza, conforto, segurança e uma experiência bem planejada."
  },
  {
    question: "Como funciona o transporte durante a viagem?",
    answer: "O transporte dos passeios é organizado pela Coletivo Eco e varia de acordo com cada destino e roteiro. Contamos com transporte adequado para os deslocamentos previstos, buscando proporcionar conforto, segurança e praticidade durante toda a experiência.\n\nAs informações sobre pontos de encontro, deslocamentos e transporte estão detalhadas em cada roteiro."
  },
  {
    question: "O que está incluso no pacote?",
    answer: "Cada roteiro possui uma composição própria, mas os pacotes podem incluir hospedagem selecionada, café da manhã, transporte durante os passeios, ingressos dos atrativos, acompanhamento de guias locais e outros serviços necessários para a experiência.\n\nTudo o que está incluído — e também o que não está — é apresentado de forma clara na descrição de cada roteiro antes da reserva."
  },
  {
    question: "Qual é o nível de esforço físico das viagens?",
    answer: "Cada roteiro possui um nível de dificuldade diferente. Temos experiências com caminhadas leves e de curta duração, assim como roteiros que envolvem trilhas mais longas e maior esforço físico.\n\nAntes de escolher sua viagem, você recebe as informações sobre o nível de dificuldade e as características das atividades para escolher uma experiência compatível com o seu perfil e condicionamento físico."
  },
  {
    question: "Preciso ter experiência em trilhas?",
    answer: "Não necessariamente. A necessidade de experiência depende do roteiro escolhido. Existem viagens indicadas para quem está começando e outras que exigem mais preparo físico e experiência em atividades de natureza.\n\nNossa equipe pode orientar você sobre as características de cada roteiro para encontrar uma experiência adequada ao seu perfil."
  },
  {
    question: "As viagens são em grupo?",
    answer: "Sim. A proposta da Coletivo Eco é proporcionar experiências em grupo, reunindo pessoas com interesses em comum e tornando a viagem também uma oportunidade de troca e novas conexões.\n\nO tamanho do grupo e a dinâmica podem variar de acordo com o destino e o roteiro."
  },
  {
    question: "Como faço para escolher a viagem ideal?",
    answer: "Cada destino possui características, nível de dificuldade e proposta diferentes. Por isso, nossa equipe pode ajudar você a encontrar o roteiro mais adequado aos seus interesses, disponibilidade e perfil de viagem.\n\nTambém podemos adaptar a experiência sempre que o formato do roteiro permitir, tornando a viagem mais alinhada ao que você procura."
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
                  maxHeight: activeIndex === index ? '500px' : '0',
                  padding: activeIndex === index ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem'
                }}
              >
                {faq.answer.split('\n\n').map((paragraph, pIdx) => (
                  <p key={pIdx} style={pIdx > 0 ? { marginTop: '0.75rem' } : undefined}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-cta text-center reveal-up delay-200" style={{ marginTop: '3.5rem' }}>
          <h3 className="faq-cta-title">Sua viagem, do seu jeito.</h3>
          <p className="faq-cta-desc">
            Experiências personalizadas, serviços exclusivos e cada detalhe pensado para você.
          </p>
          <a 
            href="https://wa.me/5511953823911?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista." 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary"
          >
            Falar com um especialista
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
