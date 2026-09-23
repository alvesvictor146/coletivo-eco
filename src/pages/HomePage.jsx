import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Testimonials from '../components/Testimonials';
import WhyUs from '../components/WhyUs';
import Gallery from '../components/Gallery';
import Experiences from '../components/Experiences';
import UpcomingDepartures from '../components/UpcomingDepartures';
import Packages from '../components/Packages';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const HomePage = ({ onOpenAdmin }) => {
  return (
    <div>
      <Header onOpenAdmin={onOpenAdmin} />
      <main>
        <Hero />
        <Testimonials />
        <WhyUs />
        <Gallery />
        <Experiences />
        <UpcomingDepartures />
        <Packages />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
