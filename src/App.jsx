import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Experiences from './components/Experiences'
import Packages from './components/Packages'
import Gallery from './components/Gallery'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

function App() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <Experiences />
        <Packages />
        <Gallery />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

export default App
