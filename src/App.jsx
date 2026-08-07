import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Testimonials from './components/Testimonials'
import WhyUs from './components/WhyUs'
import Experiences from './components/Experiences'
import UpcomingDepartures from './components/UpcomingDepartures'
import Packages from './components/Packages'
import Gallery from './components/Gallery'
import FAQ from './components/FAQ'
import Footer from './components/Footer'

function App() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <Testimonials />
        <WhyUs />
        <Experiences />
        <UpcomingDepartures />
        <Packages />
        <Gallery />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}

export default App
